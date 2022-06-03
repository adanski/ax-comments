import {WebComponent} from './web-component';
import {areArraysEqual, isMobileBrowser, isNil} from './util';
import {getDefaultOptions} from './default-options-factory';
import {CommentTransformer} from './comment-transformer';
import {EVENT_HANDLERS_MAP} from './events';
import {CommentsOptions} from './comments-options';
import {CommentsById} from './comments-by-id';
import {CommentsProvider, OptionsProvider, ServiceProvider} from './provider';
import {DefaultElementEventsHandler, ElementEventsHandler} from './element-events-handler';
import {CommentSorter} from './comment-sorter';
import {NavigationFactory} from './subcomponent/navigation-factory';
import {SpinnerFactory} from './subcomponent/spinner-factory';
import {CommentUtil} from './comment-util';

export class CommentsComponent extends HTMLElement implements WebComponent {
    readonly shadowRoot!: ShadowRoot;
    private container!: HTMLDivElement;

    private readonly _options: CommentsOptions = {};
    private readonly _commentsById: CommentsById = {};

    private readonly commentTransformer: CommentTransformer;
    private readonly commentSorter: CommentSorter;
    private readonly commentUtil: CommentUtil;
    private readonly navigationFactory: NavigationFactory;
    private readonly spinnerFactory: SpinnerFactory;

    private dataFetched: boolean = false;
    private currentSortKey: 'popularity' | 'oldest' | 'newest'| 'attachments' = 'newest';

    constructor() {
        super();
        this.initShadowDom();
        CommentsProvider.set(this.container, this._commentsById);
        this.commentTransformer = ServiceProvider.get(this.container, CommentTransformer);
        this.commentSorter = ServiceProvider.get(this.container, CommentSorter);
        this.commentUtil = ServiceProvider.get(this.container, CommentUtil);
        this.navigationFactory = ServiceProvider.get(this.container, NavigationFactory);
        this.spinnerFactory = ServiceProvider.get(this.container, SpinnerFactory);
    }

    static get observedAttributes(): string[] {
        return ['videoid', 'playlistid'];
    }

    get options(): CommentsOptions {
        return this._options;
    }

    set options(newValue: CommentsOptions) {
        if (!Object.keys(this._options).length) {
            Object.assign(this._options, getDefaultOptions(this.container), newValue);
            OptionsProvider.set(this.container, this._options);
            this.initComponent();
        } else {
            console.warn('[CommentsComponent] Options cannot be changed after initialization');
        }
    }

    private get commentsById(): CommentsById {
        return this._commentsById;
    }

    private set commentsById(newValue: CommentsById) {
        Object.keys(this.commentsById).forEach(id => {
            delete this.commentsById[id];
        });
        Object.assign(this._commentsById, newValue);
    }

    /*connectedCallback(): void {
        this.addEventListener('click', () => this.addIframe());
    }*/

    /**
     * Define our shadowDOM for the component
     */
    private initShadowDom(): void {
        this.attachShadow({mode: 'open'});
        const styles: CSSStyleSheet = new CSSStyleSheet({baseURL});
        this.shadowRoot.innerHTML = `
            <style>
                ${require('../css/jquery-comments.css')}
            </style>
            <div id="comments-container" class="jquery-comments">
            </div>
        `;
        this.shadowRoot.styleSheets.
        this.container = this.shadowRoot.querySelector<HTMLDivElement>('#comments-container')!;
    }

    private initComponent(): void {
        this.undelegateEvents();
        this.delegateEvents();

        if (isMobileBrowser()) {
            this.container.classList.add('mobile');
        }

        // Read-only mode
        if (this.options.readOnly) {
            this.container.classList.add('read-only');
        }

        // Set initial sort key
        this.currentSortKey = this.options.defaultNavigationSortKey;

        // Create CSS declarations for highlight color
        this.createCssDeclarations();

        // Fetching data and rendering
        this.fetchDataAndRender();
    }

    private delegateEvents(): void {
        this.toggleEventHandlers('addEventListener');
    }

    private undelegateEvents(): void {
        this.toggleEventHandlers('removeEventListener');
    }

    private toggleEventHandlers(bindFunction: 'addEventListener' | 'removeEventListener') {
        const elementEventsHandler: ElementEventsHandler = ServiceProvider.get(this.container, DefaultElementEventsHandler);

        EVENT_HANDLERS_MAP.forEach((handlerNames, event) => {
            handlerNames.forEach(handlerName => {
                const method: (e: Event) => void = <(e: Event) => void>elementEventsHandler[handlerName].bind(elementEventsHandler);

                if (isNil(event.selector)) {
                    this.container[bindFunction](event.type, method);
                } else {
                    this.container.querySelectorAll<HTMLElement>(event.selector!)
                        .forEach(element => {
                            element[bindFunction](event.type, method);
                        });
                }
            });
        });
    }

    private fetchDataAndRender(): void {
        this.commentsById = {};

        this.container.innerHTML = '';
        this.createHTML();

        // Comments
        // ========

        this.options.getComments((commentsArray: Record<string, any>[]) => {

            // Convert comments to custom data model
            const commentModels: Record<string, any>[] = commentsArray.map(commentsJSON => this.createCommentModel(commentsJSON));

            // Sort comments by date (oldest first so that they can be appended to the data model
            // without caring dependencies)
            this.commentSorter.sortComments(commentModels, 'oldest');

            commentModels.forEach(commentModel => {
                this.addCommentToDataModel(commentModel);
            });

            // Mark data as fetched
            this.dataFetched = true;

            // Render
            this.render();
        });
    }

    private fetchNext(): void {
        // Loading indicator
        const spinner = this.spinnerFactory.createSpinner();
        this.container.querySelector('ul#comment-list')!.append(spinner);

        const success: (commentModels: Record<string, any>[]) => void = commentModels => {
            commentModels.forEach(commentModel => {
                this.createComment(commentModel);
            });
            spinner.remove();
        };

        const error: () => void = () => {
            spinner.remove();
        };

        this.options.getComments(success, error);
    }

    private createCommentModel(commentJSON: Record<string, any>): Record<string, any> {
        const commentModel: Record<string, any> = this.commentTransformer.applyInternalMappings(commentJSON);
        commentModel.childs = [];
        commentModel.hasAttachments = () => commentModel.attachments.length > 0;
        return commentModel;
    }

    private addCommentToDataModel(commentModel: Record<string, any>): void {
        if (!(commentModel.id in this.commentsById)) {
            this.commentsById[commentModel.id] = commentModel;

            // Update child array of the parent (append childs to the array of outer most parent)
            if (commentModel.parent) {
                const outermostParent = this.commentUtil.getOutermostParent(commentModel.parent);
                outermostParent.childs.push(commentModel.id);
            }
        }
    }

    private render(): void {
        // Prevent re-rendering if data hasn't been fetched
        if (!this.dataFetched) {
            return;
        }

        // Show active container
        this.showActiveContainer();

        // Create comments and attachments
        this.createComments();
        if (this.options.enableAttachments && this.options.enableNavigation) this.createAttachments();

        // Remove spinner
        this.container.querySelectorAll('> .spinner')
            .forEach(spinner => spinner.remove());

        this.options.refresh();
    }

    private showActiveContainer(): void {
        const activeNavigationEl: HTMLElement = this.container.querySelector('.navigation li[data-container-name].active')!;
        const containerName: string = activeNavigationEl.getAttribute('data-container-name')!;
        const containerEl: HTMLElement = this.container.querySelector('[data-container="' + containerName + '"]')!;
        containerEl.siblings('[data-container]').hide();
        containerEl.show();
    }

    private createComments() {
        // Create the list element before appending to DOM in order to reach better performance
        this.container.querySelector('#comment-list')!.remove();
        const commentList: HTMLUListElement = document.createElement('ul');
        commentList.id = 'comment-list';
        commentList.classList.add('main');

        // Divide comments into main level comments and replies
        const mainLevelComments: Record<string, any>[] = [];
        const replies: Record<string, any>[] = [];
        this.commentUtil.getComments().forEach(commentModel => {
            if (commentModel.parent == null) {
                mainLevelComments.push(commentModel);
            } else {
                replies.push(commentModel);
            }
        });

        // Append main level comments
        this.commentSorter.sortComments(mainLevelComments, this.currentSortKey);
        mainLevelComments.forEach(commentModel => {
            this.addComment(commentModel, commentList);
        });

        // Append replies in chronological order
        this.commentSorter.sortComments(replies, 'oldest');
        replies.forEach(commentModel => {
            this.addComment(commentModel, commentList);
        });

        // Append list to DOM
        this.container.querySelector('[data-container="comments"]')!.prepend(commentList);
    }

    private createAttachments(): void {
        // Create the list element before appending to DOM in order to reach better performance
        this.container.querySelector('#attachment-list')!.remove();
        const attachmentList: HTMLUListElement = document.createElement('ul');
        attachmentList.id = 'attachment-list';
        attachmentList.classList.add('main');

        const attachments = this.commentUtil.getAttachments();
        this.commentSorter.sortComments(attachments, 'newest');
        attachments.forEach(commentModel => {
            this.addAttachment(commentModel, attachmentList);
        });

        // Append list to DOM
        this.container.querySelector('[data-container="attachments"]')!.prepend(attachmentList);
    }

    private addComment(commentModel: Record<string, any>, commentList: HTMLElement = this.container.querySelector('#comment-list')!, prependComment: boolean = false): void {
        const commentEl: HTMLElement = this.createCommentElement(commentModel);

        if (commentModel.parent) { // Case: reply
            const directParentEl: HTMLElement = commentList.querySelector(`.comment[data-id="${commentModel.parent}"]`)!;

            // Re-render action bar of direct parent element
            this.reRenderCommentActionBar(commentModel.parent);

            // Force replies into one level only
            let outerMostParent = directParentEl.parents('.comment').last();
            if (outerMostParent.length === 0) {
                outerMostParent = directParentEl;
            }

            // Append element to DOM
            const childCommentsEl = outerMostParent.find('.child-comments');
            const commentingField = childCommentsEl.find('.commenting-field');
            if (commentingField.length) {
                commentingField.before(commentEl);
            } else {
                childCommentsEl.append(commentEl);
            }

            // Update toggle all -button
            this.updateToggleAllButton(outerMostParent);
        } else { // Case: main level comment
            if (prependComment) {
                commentList.prepend(commentEl);
            } else {
                commentList.append(commentEl);
            }
        }
    }

    private addAttachment(commentModel: Record<string, any>, commentList: HTMLElement = this.container.querySelector('#attachment-list')!): void {
        const commentEl = this.createCommentElement(commentModel);
        commentList.prepend(commentEl);
    }

    private showActiveSort(): void {
        const activeElements: NodeListOf<HTMLElement> = this.container.querySelectorAll(`.navigation li[data-sort-key="${this.currentSortKey}"]`);

        // Indicate active sort
        this.container.find('.navigation li').removeClass('active');
        activeElements.addClass('active');

        // Update title for dropdown
        const titleEl: HTMLElement = this.container.find('.navigation .title');
        if (this.currentSortKey !== 'attachments') {
            titleEl.addClass('active');
            titleEl.find('header').html(activeElements.first().html());
        } else {
            const defaultDropdownEl = this.container.find('.navigation ul.dropdown').children().first();
            titleEl.find('header').html(defaultDropdownEl.html());
        }

        // Show active container
        this.showActiveContainer();
    }

    private toggleSaveButton(commentingField: HTMLElement): void {
        const textarea: HTMLElement = commentingField.find('.textarea');
        const saveButton = textarea.siblings('.control-row').find('.save');

        const content = this.getTextareaContent(textarea, true);
        const attachments = this.getAttachmentsFromCommentingField(commentingField);
        let enabled;

        // Case: existing comment
        const commentModel = this.commentsById[textarea.attr('data-comment')];
        if (commentModel) {

            // Case: parent changed
            const contentChanged = content != commentModel.content;
            let parentFromModel;
            if (commentModel.parent) {
                parentFromModel = commentModel.parent.toString();
            }

            // Case: parent changed
            const parentChanged = textarea.attr('data-parent') != parentFromModel;

            // Case: attachments changed
            let attachmentsChanged = false;
            if (this.options.enableAttachments) {
                const savedAttachmentIds = commentModel.attachments.map(attachment => attachment.id);
                const currentAttachmentIds = attachments.map(attachment => attachment.id);
                attachmentsChanged = !areArraysEqual(savedAttachmentIds, currentAttachmentIds);
            }

            enabled = contentChanged || parentChanged || attachmentsChanged;

            // Case: new comment
        } else {
            enabled = Boolean(content.length) || Boolean(attachments.length);
        }

        saveButton.toggleClass('enabled', enabled);
    }

    private createComment(commentJSON: Record<string, any>): void {
        const commentModel: Record<string, any> = this.createCommentModel(commentJSON);
        this.addCommentToDataModel(commentModel);

        // Add comment element
        const commentList = this.$el.find('#comment-list');
        const prependComment = this.currentSortKey == 'newest';
        this.addComment(commentModel, commentList, prependComment);

        if (this.currentSortKey === 'attachments' && commentModel.hasAttachments()) {
            this.addAttachment(commentModel);
        }
    }

    private createHTML(): void {
        // Commenting field
        const mainCommentingField = this.createMainCommentingFieldElement();
        this.container.append(mainCommentingField);

        // Hide control row and close button
        const mainControlRow: HTMLElement = mainCommentingField.querySelector('.control-row')!;
        mainControlRow.style.display = 'none';
        mainCommentingField.querySelector<HTMLElement>('.close')!.style.display = 'none';

        // Navigation bar
        if (this.options.enableNavigation) {
            this.container.append(this.navigationFactory.createNavigationElement());
            this.showActiveSort();
        }

        // Loading spinner
        const spinner = this.spinnerFactory.createSpinner();
        this.container.append(spinner);

        // Comments container
        const commentsContainer = document.createElement('div');
        commentsContainer.classList.add('data-container');
        commentsContainer.setAttribute('data-container', 'comments');
        this.container.append(commentsContainer);

        // "No comments" placeholder
        const noComments = document.createElement('div');
        noComments.classList.add('no-comments', 'no-data');
        noComments.textContent = this.options.textFormatter(this.options.noCommentsText);
        const noCommentsIcon = document.createElement('i');
        noCommentsIcon.classList.add('fa', 'fa-comments', 'fa-2x');
        if (this.options.noCommentsIconURL.length) {
            noCommentsIcon.style.backgroundImage = `url("${this.options.noCommentsIconURL}")`;
            noCommentsIcon.classList.add('image');
        }
        noComments.prepend(document.createElement('br'), noCommentsIcon);
        commentsContainer.append(noComments);

        // Attachments
        if (this.options.enableAttachments) {
            // Attachments container
            const attachmentsContainer = document.createElement('div');
            attachmentsContainer.classList.add('data-container');
            attachmentsContainer.setAttribute('data-container', 'attachments');
            this.container.append(attachmentsContainer);

            // "No attachments" placeholder
            const noAttachments = document.createElement('div');
            noAttachments.classList.add('no-attachments', 'no-data');
            noAttachments.textContent = this.options.textFormatter(this.options.noAttachmentsText);
            const noAttachmentsIcon: HTMLElement = document.createElement('i');
            noAttachmentsIcon.classList.add('fa', 'fa-paperclip', 'fa-2x');
            if (this.options.attachmentIconURL.length) {
                noAttachmentsIcon.style.backgroundImage = `url("${this.options.attachmentIconURL}")`;
                noAttachmentsIcon.classList.add('image');
            }
            noAttachments.prepend(document.createElement('br'), noAttachmentsIcon);
            attachmentsContainer.append(noAttachments);

            // Drag & dropping attachments
            const droppableOverlay: HTMLDivElement = document.createElement('div');
            droppableOverlay.classList.add('droppable-overlay');

            const droppableContainer: HTMLDivElement = document.createElement('div');
            droppableContainer.classList.add('droppable-container');

            const droppable: HTMLDivElement = document.createElement('div');
            droppable.classList.add('droppable');

            const uploadIcon: HTMLElement = document.createElement('i');
            uploadIcon.classList.add('fa', 'fa-paperclip', 'fa-4x');

            if (this.options.uploadIconURL.length) {
                uploadIcon.style.backgroundImage = `url("${this.options.uploadIconURL}")`;
                uploadIcon.classList.add('image');
            }

            const dropAttachmentText: HTMLDivElement = document.createElement('div');
            dropAttachmentText.textContent = this.options.textFormatter(this.options.attachmentDropText);
            droppable.append(uploadIcon);
            droppable.append(dropAttachmentText);
            droppableContainer.append(droppable);

            droppableOverlay.append(droppableContainer);
            droppableOverlay.style.display = 'none';
            this.container.append(droppableOverlay);
        }
    }

    private createMainCommentingFieldElement(): HTMLElement {
        return this.createCommentingFieldElement(undefined, undefined, true);
    }

}

// register custom element
customElements.define('ax-comments', CommentsComponent);

declare global {
    interface HTMLElementTagNameMap {
        'ax-comments': CommentsComponent;
    }
}
