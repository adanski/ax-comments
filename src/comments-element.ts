import {WebComponent} from './common/web-component.js';
import {isMobileBrowser, isNil, noop} from './common/util.js';
import {getDefaultOptions} from './options/default-options-factory.js';
import {EVENT_HANDLERS_MAP} from './events.js';
import {CommentModel, CommentsOptions, SortKey} from './options/options.js';
import {CommentModelEnriched} from './view-model/comment-model-enriched.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from './common/provider.js';
import {CommentsElementEventHandler, ElementEventHandler} from './element-event-handler.js';
import {CommentSorter} from './view-model/comment-sorter.js';
import {NavigationElement} from './thread/basic/navigation-element.js';
import {SpinnerFactory} from './thread/basic/spinner-factory.js';
import {CommentViewModel, CommentViewModelEvent} from './view-model/comment-view-model.js';
import {hideElement} from './common/html-util.js';
import {createElement} from './common/html-element-factory.js';
import {STYLE_SHEET} from './css/stylesheet.js';
import {CustomElement, defineCustomElement} from './common/custom-element.js';
import {createDynamicStylesheet} from './css/dynamic-stylesheet-factory.js';
import {CommentingFieldElement} from './thread/commenting-field/commenting-field-element.js';
import {ThreadElement} from './thread/thread-element.js';

//@CustomElement('ax-comments')
export class CommentsElement extends HTMLElement implements WebComponent {
    private container!: HTMLElement;

    readonly #options: Required<CommentsOptions> = {} as Required<CommentsOptions>;

    #commentViewModel!: CommentViewModel;
    #elementEventHandler!: ElementEventHandler;

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
        this.#commentViewModel = CommentViewModelProvider.set(this.container);
        this.#elementEventHandler = new CommentsElementEventHandler(this.container);
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
            if (!comment.parentId) this.#createThread(comment);
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
            this.#commentViewModel.initComments(comments);

            // Mark data as fetched
            this.#dataFetched = true;

            // Render
            this.#render(this.#commentViewModel.size);
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
                const commentEnriched: CommentModelEnriched = this.#commentViewModel.addComment(comment);
                this.#createThread(commentEnriched);
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
        this.#createThreads();
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

    #createThreads() {
        // Create the list element before appending to DOM in order to reach better performance
        this.container.querySelector('#comment-list')?.remove();
        const commentList: HTMLUListElement = createElement(`
            <ul id="comment-list" class="main">
            </ul>
        `);

        // Divide comments into top level comments and replies
        const rootComments: CommentModelEnriched[] = this.#commentViewModel.getRootComments(this.#commentSorter.getSorter(this.#currentSortKey));

        // Append list to DOM
        this.container.querySelector('[data-container="comments"]')!.prepend(commentList);

        // Append sorted top level comments
        rootComments.forEach(commentModel => {
            this.#addThread(commentModel, commentList);
        });
    }

    #addThread(commentModel: CommentModelEnriched, commentList: HTMLUListElement, prependThread: boolean = false): void {
        const threadEl: ThreadElement = ThreadElement.create({commentModel: commentModel});

        if (prependThread) {
            commentList.prepend(threadEl);
        } else {
            commentList.append(threadEl);
        }
    }

    #createThread(comment: CommentModelEnriched): void {
        // Add comment element
        const commentList: HTMLUListElement = this.container.querySelector('#comment-list')!;
        const prependThread = this.#currentSortKey === SortKey.NEWEST;
        this.#addThread(comment, commentList, prependThread);
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

defineCustomElement(CommentsElement, 'ax-comments');
