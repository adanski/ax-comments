import {WebComponent} from './web-component.js';
import {isMobileBrowser, isNil, noop} from './util.js';
import {getDefaultOptions} from './default-options-factory.js';
import {CommentTransformer} from './comment-transformer.js';
import {EVENT_HANDLERS_MAP} from './events.js';
import {CommentModel, CommentsOptions, SortKey} from './api.js';
import {CommentModelEnriched} from './comments-by-id.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {CommentsElementEventHandler, ElementEventHandler} from './element-event-handler.js';
import {CommentSorter} from './comment-sorter.js';
import {NavigationElement} from './subcomponent/navigation-element.js';
import {SpinnerFactory} from './subcomponent/spinner-factory.js';
import {CommentViewModel, CommentViewModelEvent} from './comment-view-model.js';
import {findParentsBySelector, hideElement} from './html-util.js';
import {STYLE_SHEET} from './css/stylesheet.js';
import {RegisterCustomElement} from './register-custom-element.js';
import {createDynamicStylesheet} from './css/dynamic-stylesheet-factory.js';
import {ToggleAllButtonElement} from './subcomponent/toggle-all-button-element.js';
import {CommentingFieldElement} from './subcomponent/commenting-field-element.js';
import {CommentElement} from './subcomponent/comment-element.js';

@RegisterCustomElement('ax-comments')
export class CommentsElement extends HTMLElement implements WebComponent {
    private container!: HTMLElement;

    readonly #options: Required<CommentsOptions> = {} as Required<CommentsOptions>;

    #commentViewModel!: CommentViewModel;
    #elementEventHandler!: ElementEventHandler;

    #commentTransformer!: CommentTransformer;
    #commentSorter!: CommentSorter;
    #spinnerFactory!: SpinnerFactory;

    #currentSortKey!: SortKey;
    #connected: boolean = false;
    #dataFetched: boolean = false;

    constructor() {
        super();
        this.#initShadowDom(this.attachShadow({mode: 'open'}));
    }

    static create(options: Pick<CommentsElement, 'options'>): CommentsElement {
        const commentsElement: CommentsElement = document.createElement('ax-comments') as CommentsElement;
        Object.assign(commentsElement, options);
        return commentsElement;
    }

    connectedCallback(): void {
        this.#connected = true;
        if (Object.keys(this.#options).length) {
            this.#init();
        }
    }

    disconnectedCallback(): void {
        this.#connected = false;
        this.#commentViewModel.unsubscribeAll();
        this.#unsubscribeEvents();
        this.container.innerHTML = '';
    }

    get options(): CommentsOptions {
        return this.#options;
    }

    set options(options: CommentsOptions) {
        if (!options) return;
        if (Object.keys(this.#options).length) {
            console.warn(`<ax-comments> Options already set, component can not be reinitialized.`);
            return;
        }
        Object.assign(this.#options, getDefaultOptions(), options);
        Object.freeze(this.#options);
        if (this.#connected) this.#init();
    }

    /**
     * Define our shadowDOM for the component
     */
    #initShadowDom(shadowRoot: ShadowRoot): void {
        shadowRoot.innerHTML = `
            <section id="comments-container">
            </section>
        `;
        shadowRoot.adoptedStyleSheets = [STYLE_SHEET];
        this.container = shadowRoot.querySelector<HTMLElement>('#comments-container')!;
    }

    #init(): void {
        this.#initServices();
        this.#initElement();
        this.#initEmitterListeners();
    }

    #initServices(): void {
        OptionsProvider.set(this.container, this.#options);
        this.#commentViewModel = CommentViewModelProvider.set(this.container, {});
        this.#elementEventHandler = new CommentsElementEventHandler(this.container);
        this.#commentTransformer = ServiceProvider.get(this.container, CommentTransformer);
        this.#commentSorter = ServiceProvider.get(this.container, CommentSorter);
        this.#spinnerFactory = ServiceProvider.get(this.container, SpinnerFactory);
    }

    #initElement(): void {
        if (isMobileBrowser()) {
            this.container.classList.add('mobile');
        }

        // Read-only mode
        if (this.#options.readOnly) {
            this.container.classList.add('read-only');
        }

        // Set initial sort key
        this.#currentSortKey = this.#options.defaultNavigationSortKey;

        // Create user CSS declarations
        let allStyles: CSSStyleSheet[] = [createDynamicStylesheet(this.#options)];
        if (this.#options.styles) {
            allStyles = allStyles.concat(this.#options.styles);
        }
        this.shadowRoot!.adoptedStyleSheets = allStyles;

        // Fetching data and rendering
        this.#fetchDataAndRender();
    }

    #initEmitterListeners(): void {
        this.#commentViewModel.subscribe(CommentViewModelEvent.COMMENT_ADDED, commentId => {
            const comment: CommentModelEnriched = this.#commentViewModel.getComment(commentId)!;
            this.#createComment(comment);
            this.#getNavigation().commentCount += 1;
        });
        this.#commentViewModel.subscribe(CommentViewModelEvent.COMMENT_DELETED, commentId => {
            this.#getNavigation().commentCount -= 1;
        });
    }

    #subscribeEvents(): void {
        this.#toggleEventHandlers('addEventListener');
    }

    #unsubscribeEvents(): void {
        this.#toggleEventHandlers('removeEventListener');
    }

    #toggleEventHandlers(bindFunction: 'addEventListener' | 'removeEventListener') {
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

    #fetchDataAndRender(): void {
        this.container.innerHTML = '';
        this.#createHTML();

        // Comments
        // ========

        const success: (comments: CommentModel[]) => void = comments => {
            // Convert comments to enriched data model
            const commentModels: CommentModelEnriched[] = this.#commentTransformer.enrichMany([...comments]);

            this.#commentViewModel.initComments(commentModels);

            // Mark data as fetched
            this.#dataFetched = true;

            // Render
            this.#render(commentModels.length);
        };
        const error: () => void = noop;

        this.#options.getComments(success, error);
    }

    #fetchNext(): void {
        // Loading indicator
        const spinner = this.#spinnerFactory.createSpinner();
        this.container.querySelector('ul#comment-list')!.append(spinner);

        const success: (comments: CommentModel[]) => void = comments => {
            comments.forEach(comment => {
                const commentEnriched: CommentModelEnriched = this.#commentTransformer.enrich(comment);
                this.#commentViewModel.addComment(commentEnriched)
                this.#createComment(commentEnriched);
            });
            spinner.remove();
        };

        const error: () => void = () => {
            spinner.remove();
        };

        this.#options.getComments(success, error);
    }

    #render(commentCount: number): void {
        // Prevent re-rendering if data hasn't been fetched
        if (!this.#dataFetched) {
            return;
        }

        // Create comments and attachments
        this.#createComments();
        this.#getNavigation().commentCount = commentCount;

        this.#subscribeEvents();

        // Remove spinner
        this.container.querySelectorAll(':scope > .spinner')
            .forEach(spinner => spinner.remove());

        this.#options.refresh();
    }

    #getNavigation(): NavigationElement {
        return this.container.querySelector<NavigationElement>('ax-navigation')!
    }

    #createComments() {
        // Create the list element before appending to DOM in order to reach better performance
        this.container.querySelector('#comment-list')?.remove();
        const commentList: HTMLUListElement = document.createElement('ul');
        commentList.id = 'comment-list';
        commentList.classList.add('main');

        // Divide comments into top level comments and replies
        const rootComments: CommentModelEnriched[] = [];
        const replies: CommentModelEnriched[] = [];
        this.#commentViewModel.getComments().forEach(commentModel => {
            if (isNil(commentModel.parentId)) {
                rootComments.push(commentModel);
            } else {
                replies.push(commentModel);
            }
        });


        this.#commentSorter.sortComments(rootComments, this.#currentSortKey);
        this.#commentSorter.sortComments(replies, SortKey.OLDEST);

        // Append list to DOM
        this.container.querySelector('[data-container="comments"]')!.prepend(commentList);

        // Append sorted top level comments
        rootComments.forEach(commentModel => {
            this.#addComment(commentModel, commentList);
        });

        // Append replies in chronological order
        replies.forEach(commentModel => {
            this.#addComment(commentModel, commentList);
        });
    }

    #addComment(commentModel: CommentModelEnriched, commentList: HTMLElement = this.container.querySelector('#comment-list')!, prependComment: boolean = false): void {
        const commentEl: CommentElement = CommentElement.create({commentModel: commentModel});

        if (commentModel.parentId) { // Case: reply
            const directParentEl: CommentElement = commentList.querySelector(`li.comment[data-id="${commentModel.parentId}"]`)!;

            // Re-render action bar of direct parent element
            directParentEl.reRenderCommentActionBar();

            // Force replies into one level only
            let outerMostParent: HTMLElement | null = findParentsBySelector(directParentEl, '.comment').last();
            if (isNil(outerMostParent)) {
                outerMostParent = directParentEl;
            }

            // Append element to DOM
            const childCommentsEl: HTMLElement = outerMostParent!.querySelector('.child-comments')!;
            childCommentsEl.append(commentEl);

            // Update toggle all button
            ToggleAllButtonElement.updateToggleAllButton(outerMostParent, this.#options);
        } else { // Case: main level comment
            if (prependComment) {
                commentList.prepend(commentEl);
            } else {
                commentList.append(commentEl);
            }
        }
    }

    #createComment(comment: CommentModelEnriched): void {
        // Add comment element
        const commentList: HTMLElement = this.container.querySelector('#comment-list')!;
        const prependComment = this.#currentSortKey === SortKey.NEWEST;
        this.#addComment(comment, commentList, prependComment);
    }

    #createHTML(): void {
        // Commenting field
        const mainCommentingField: CommentingFieldElement = CommentingFieldElement.create({isMain: true});
        this.container.append(mainCommentingField);

        // Hide control row and close button
        const mainControlRow: HTMLElement = mainCommentingField.querySelector('.control-row')!;
        hideElement(mainControlRow);
        hideElement(mainCommentingField.querySelector<HTMLElement>('.close'));

        // Navigation bar
        this.container.append(NavigationElement.create({
            sortKey: this.#currentSortKey,
            onSortKeyChanged: this.#navigationSortKeyChanged
        }));

        // Loading spinner
        const spinner: HTMLElement = this.#spinnerFactory.createSpinner();
        this.container.append(spinner);

        // Comments container
        const commentsContainer: HTMLElement = document.createElement('div');
        commentsContainer.classList.add('data-container');
        commentsContainer.setAttribute('data-container', 'comments');
        this.container.append(commentsContainer);

        // "No comments" placeholder
        const noComments: HTMLElement = document.createElement('div');
        noComments.classList.add('no-comments', 'no-data');
        noComments.textContent = this.#options.noCommentsText;
        const noCommentsIcon = document.createElement('i');
        noCommentsIcon.classList.add('fa', 'fa-comments', 'fa-2x');
        if (this.#options.noCommentsIconURL.length) {
            noCommentsIcon.style.backgroundImage = `url("${this.#options.noCommentsIconURL}")`;
            noCommentsIcon.classList.add('image');
        }
        noComments.prepend(document.createElement('br'), noCommentsIcon);
        commentsContainer.append(noComments);

        // Attachments
        if (this.#options.enableAttachments) {
            // Drag & dropping attachments
            const droppableOverlay: HTMLDivElement = document.createElement('div');
            droppableOverlay.classList.add('droppable-overlay');

            const droppableContainer: HTMLDivElement = document.createElement('div');
            droppableContainer.classList.add('droppable-container');

            const droppable: HTMLDivElement = document.createElement('div');
            droppable.classList.add('droppable');

            const uploadIcon: HTMLElement = document.createElement('i');
            uploadIcon.classList.add('fa', 'fa-paperclip', 'fa-4x');

            if (this.#options.uploadIconURL.length) {
                uploadIcon.style.backgroundImage = `url("${this.#options.uploadIconURL}")`;
                uploadIcon.classList.add('image');
            }

            const dropAttachmentText: HTMLDivElement = document.createElement('div');
            dropAttachmentText.textContent = this.#options.attachmentDropText;
            droppable.append(uploadIcon);
            droppable.append(dropAttachmentText);
            droppableContainer.append(droppable);

            droppableOverlay.append(droppableContainer);
            hideElement(droppableOverlay);
            this.container.append(droppableOverlay);
        }
    }

    #navigationSortKeyChanged: (newSortKey: SortKey) => void = newSortKey => {
        this.#currentSortKey = newSortKey;
        // Sort the comments if necessary
        this.#sortAndReArrangeComments(newSortKey);
    };

    #sortAndReArrangeComments(sortKey: SortKey): void {
        const commentList: HTMLElement = this.container.querySelector('#comment-list')!;

        // Get top level comments
        const rootComments: CommentModelEnriched[] = this.#commentViewModel.getRootComments(this.#commentSorter.getSorter(sortKey));

        // Rearrange top level comments
        rootComments.forEach(commentModel => {
            const commentEl: HTMLElement = commentList.querySelector(`:scope > li.comment[data-id="${commentModel.id}"]`)!;
            commentList.append(commentEl);
        });
    }

}
