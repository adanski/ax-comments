import {WebComponent} from './web-component.js';
import {isMobileBrowser, isNil} from './util.js';
import {getDefaultOptions} from './default-options-factory.js';
import {CommentTransformer} from './comment-transformer.js';
import {EVENT_HANDLERS_MAP} from './events.js';
import {CommentsOptions} from './api.js';
import {CommentsById} from './comments-by-id.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {CommentsElementEventHandler, ElementEventHandler} from './element-event-handler.js';
import {CommentSorter, SortKey} from './comment-sorter.js';
import {NavigationFactory} from './subcomponent/navigation-factory.js';
import {SpinnerFactory} from './subcomponent/spinner-factory.js';
import {CommentUtil} from './comment-util.js';
import {findParentsBySelector, findSiblingsBySelector, hideElement, showElement} from './html-util.js';
import {STYLE_SHEET} from './css/ax-comments.js';
import {RegisterCustomElement} from './register-custom-element.js';
import {createCssDeclarations} from './dynamic-css-factory.js';
import {ToggleAllButtonElement} from './subcomponent/toggle-all-button-element.js';
import {CommentingFieldElement} from './subcomponent/commenting-field-element.js';
import {CommentElement} from './subcomponent/comment-element.js';
import EventEmitter from 'EventEmitter3';

@RegisterCustomElement('ax-comments')
export class CommentsElement extends HTMLElement implements WebComponent {
    readonly shadowRoot!: ShadowRoot;
    private container!: HTMLDivElement;

    readonly #options: CommentsOptions = {} as CommentsOptions;
    readonly #commentsById: CommentsById = {};

    readonly #elementEventHandlerEmitter: EventEmitter<'navigationElementClicked' | 'postComment'>;
    readonly #elementEventHandler: ElementEventHandler;

    private readonly commentTransformer: CommentTransformer;
    private readonly commentSorter: CommentSorter;
    private readonly commentUtil: CommentUtil;
    private readonly navigationFactory: NavigationFactory;
    private readonly spinnerFactory: SpinnerFactory;

    private dataFetched: boolean = false;

    constructor() {
        super();
        this.initShadowDom();
        CommentsProvider.set(this.container, this.#commentsById);
        this.#elementEventHandlerEmitter = new EventEmitter();
        this.#elementEventHandler = new CommentsElementEventHandler(this.container, this.#elementEventHandlerEmitter);
        this.commentTransformer = ServiceProvider.get(this.container, CommentTransformer);
        this.commentSorter = ServiceProvider.get(this.container, CommentSorter);
        this.commentUtil = ServiceProvider.get(this.container, CommentUtil);
        this.navigationFactory = ServiceProvider.get(this.container, NavigationFactory);
        this.spinnerFactory = ServiceProvider.get(this.container, SpinnerFactory);
    }

    connectedCallback(): void {
        if (!Object.keys(this.options).length) {
            console.warn('[ax-comments] Options not set, component could not be initialized.');
            return;
        }
        this.initElement();
        this.initEmitterListeners();
    }

    disconnectedCallback(): void {
        this.#elementEventHandlerEmitter.removeAllListeners();
    }

    get options(): CommentsOptions {
        return this.#options;
    }

    set options(options: CommentsOptions) {
        if (Object.keys(this.#options).length) {
            console.warn('[ax-comments] Options already set, component can not be reinitialized.');
            return;
        }
        Object.assign(this.#options, getDefaultOptions(this.container), options);
        Object.freeze(this.#options);
        OptionsProvider.set(this.container, this.#options);
    }

    private get commentsById(): CommentsById {
        return this.#commentsById;
    }

    private set commentsById(newValue: CommentsById) {
        Object.keys(this.commentsById).forEach(id => {
            delete this.commentsById[id];
        });
        Object.assign(this.#commentsById, newValue);
    }

    /**
     * Define our shadowDOM for the component
     */
    private initShadowDom(): void {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <div id="comments-container" class="jquery-comments">
            </div>
        `;
        (this as any).adoptedStyleSheets = [STYLE_SHEET];
        this.container = this.shadowRoot.querySelector<HTMLDivElement>('#comments-container')!;
    }

    private initElement(): void {
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
        this.#elementEventHandler.currentSortKey = this.options.defaultNavigationSortKey;

        // Create user CSS declarations
        const userStyle: CSSStyleSheet | undefined = this.options.styles;
        const allStyles: CSSStyleSheet[] = [createCssDeclarations(this.options)];
        if (userStyle) {
            allStyles.push(userStyle);
        }
        (this as any).adoptedStyleSheets = (this as any).adoptedStyleSheets.concat(allStyles);

        // Fetching data and rendering
        this.fetchDataAndRender();
    }

    private initEmitterListeners(): void {
        this.#elementEventHandlerEmitter.on('postComment', commentJSON => {
            this.createComment(commentJSON);
        });
        this.#elementEventHandlerEmitter.on('navigationElementClicked', (sortKey: SortKey) => {
            // Create attachments if necessary
            if (sortKey === SortKey.ATTACHMENTS) {
                this.createAttachments();
            }

            this.showActiveSort();
        });
    }

    private delegateEvents(): void {
        this.toggleEventHandlers('addEventListener');
    }

    private undelegateEvents(): void {
        this.toggleEventHandlers('removeEventListener');
    }

    private toggleEventHandlers(bindFunction: 'addEventListener' | 'removeEventListener') {
        EVENT_HANDLERS_MAP.forEach((handlerNames, event) => {
            handlerNames.forEach(handlerName => {
                const method: (e: Event) => void = <(e: Event) => void>this.#elementEventHandler[handlerName]
                    .bind(this.#elementEventHandler);

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
            const commentModels: Record<string, any>[] = commentsArray.map(commentsJSON => this.commentTransformer.toCommentModel(commentsJSON));

            // Sort comments by date (oldest first so that they can be appended to the data model
            // without caring dependencies)
            this.commentSorter.sortComments(commentModels, SortKey.OLDEST);

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
        findSiblingsBySelector(containerEl, '[data-container]')
            .forEach(hideElement);
        showElement(containerEl);
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
        this.commentSorter.sortComments(mainLevelComments, this.#elementEventHandler.currentSortKey);
        mainLevelComments.forEach(commentModel => {
            this.addComment(commentModel, commentList);
        });

        // Append replies in chronological order
        this.commentSorter.sortComments(replies, SortKey.OLDEST);
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
        this.commentSorter.sortComments(attachments, SortKey.NEWEST);
        attachments.forEach(commentModel => {
            this.addAttachment(commentModel, attachmentList);
        });

        // Append list to DOM
        this.container.querySelector('[data-container="attachments"]')!.prepend(attachmentList);
    }

    private addComment(commentModel: Record<string, any>, commentList: HTMLElement = this.container.querySelector('#comment-list')!, prependComment: boolean = false): void {
        const commentEl: CommentElement = CommentElement.create({commentModel: commentModel});

        if (commentModel.parent) { // Case: reply
            const directParentEl: HTMLElement = commentList.querySelector(`.comment[data-id="${commentModel.parent}"]`)!;
            const directParentComment: CommentElement = findParentsBySelector<CommentElement>(directParentEl, 'ax-comment').first()!;

            // Re-render action bar of direct parent element
            directParentComment.reRenderCommentActionBar();

            // Force replies into one level only
            let outerMostParent: HTMLElement | null = findParentsBySelector(directParentEl, '.comment').last();
            if (isNil(outerMostParent)) {
                outerMostParent = directParentEl;
            }

            // Append element to DOM
            const childCommentsEl: HTMLElement = outerMostParent!.querySelector('.child-comments')!;
            const commentingField: HTMLElement | null = childCommentsEl.querySelector('ax-commenting-field');
            if (!isNil(commentingField)) {
                commentingField.before(commentEl);
            } else {
                childCommentsEl.append(commentEl);
            }

            // Update toggle all -button
            ToggleAllButtonElement.updateToggleAllButton(outerMostParent, this.options);
        } else { // Case: main level comment
            if (prependComment) {
                commentList.prepend(commentEl);
            } else {
                commentList.append(commentEl);
            }
        }
    }

    private addAttachment(commentModel: Record<string, any>, commentList: HTMLElement = this.container.querySelector('#attachment-list')!): void {
        const commentEl: CommentElement = CommentElement.create({commentModel: commentModel});
        commentList.prepend(commentEl);
    }

    private showActiveSort(): void {
        const activeElements: NodeListOf<HTMLElement> = this.container
            .querySelectorAll(`.navigation li[data-sort-key="${this.#elementEventHandler.currentSortKey}"]`);

        // Indicate active sort
        this.container.querySelectorAll('.navigation li')
            .forEach(el => el.classList.remove('active'));
        activeElements.forEach(el => el.classList.add('active'));

        // Update title for dropdown
        const titleEl: HTMLElement = this.container.querySelector('.navigation .title')!;
        if (this.#elementEventHandler.currentSortKey !== SortKey.ATTACHMENTS) {
            titleEl.classList.add('active');
            titleEl.querySelector('header')!.innerHTML = activeElements.item(0).innerHTML;
        } else {
            const defaultDropdownEl: HTMLElement = this.container.querySelector('.navigation ul.dropdown')!
                .firstElementChild! as HTMLElement;
            titleEl.querySelector('header')!.innerHTML = defaultDropdownEl.innerHTML;
        }

        // Show active container
        this.showActiveContainer();
    }

    private createComment(commentJSON: Record<string, any>): void {
        const commentModel: Record<string, any> = this.commentTransformer.toCommentModel(commentJSON);
        this.addCommentToDataModel(commentModel);

        // Add comment element
        const commentList: HTMLElement = this.container.querySelector('#comment-list')!;
        const prependComment = this.#elementEventHandler.currentSortKey === SortKey.NEWEST;
        this.addComment(commentModel, commentList, prependComment);

        if (this.#elementEventHandler.currentSortKey === SortKey.ATTACHMENTS && commentModel.hasAttachments()) {
            this.addAttachment(commentModel);
        }
    }

    private createHTML(): void {
        // Commenting field
        const mainCommentingField: CommentingFieldElement = this.createMainCommentingFieldElement();
        this.container.append(mainCommentingField);

        // Hide control row and close button
        const mainControlRow: HTMLElement = mainCommentingField.querySelector('.control-row')!;
        hideElement(mainControlRow);
        hideElement(mainCommentingField.querySelector<HTMLElement>('.close')!);

        // Navigation bar
        if (this.options.enableNavigation) {
            this.container.append(this.navigationFactory.createNavigationElement());
            this.showActiveSort();
        }

        // Loading spinner
        const spinner: HTMLElement = this.spinnerFactory.createSpinner();
        this.container.append(spinner);

        // Comments container
        const commentsContainer: HTMLElement = document.createElement('div');
        commentsContainer.classList.add('data-container');
        commentsContainer.setAttribute('data-container', 'comments');
        this.container.append(commentsContainer);

        // "No comments" placeholder
        const noComments: HTMLElement = document.createElement('div');
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
            hideElement(droppableOverlay);
            this.container.append(droppableOverlay);
        }
    }

    private createMainCommentingFieldElement(): CommentingFieldElement {
        return CommentingFieldElement.create({isMain: true});
    }

}