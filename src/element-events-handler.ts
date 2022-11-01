import {CommentsById} from './comments-by-id.js';
import {CommentsOptions} from './api.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {TextareaService} from './subcomponent/textarea-service.js';
import {CommentUtil} from './comment-util.js';
import {
    findParentsBySelector,
    findSiblingsBySelector,
    hideElement,
    showElement,
    toggleElementVisibility
} from './html-util.js';
import {isNil} from './util.js';
import {CommentingFieldComponent} from './subcomponent/commenting-field-component.js';
import {ButtonComponent} from './subcomponent/button-component.js';
import {CommentTransformer} from './comment-transformer.js';
import {CommentComponent} from './subcomponent/comment-component.js';
import {CommentContentFormatter} from './subcomponent/comment-content-formatter.js';
import {TagFactory} from './subcomponent/tag-factory.js';
import {ToggleAllButtonElement} from './subcomponent/toggle-all-button-element.js';
import {CommentSorter, SortKey} from './comment-sorter.js';
import EventEmitter from 'EventEmitter3';

export interface ElementEventsHandler {
    currentSortKey: SortKey;

    closeDropdowns(e: UIEvent): void;
    preSavePastedAttachments(e: ClipboardEvent): void;
    saveOnKeydown(e: KeyboardEvent): void;
    saveEditableContent(e: Event): void;
    checkEditableContentForChange(e: Event): void;
    navigationElementClicked(e: MouseEvent): void;
    toggleNavigationDropdown(e: UIEvent): void;
    showMainCommentingField(e: UIEvent): void;
    hideMainCommentingField(e: UIEvent): void;
    increaseTextareaHeight(e: Event): void;
    textareaContentChanged(e: Event): void;
    removeCommentingField(e: UIEvent): void;
    postComment(e: UIEvent): void;
    putComment(e: UIEvent): void;
    deleteComment(e: UIEvent): void;
    preDeleteAttachment(e: UIEvent): void;
    fileInputChanged(e: Event): void;
    upvoteComment(e: UIEvent): void;
    hashtagClicked(e: MouseEvent): void;
    pingClicked(e: MouseEvent): void;
    toggleReplies(e: UIEvent): void;
    replyButtonClicked(e: MouseEvent): void;
    editButtonClicked(e: MouseEvent): void;
    showDroppableOverlay(e: UIEvent): void;
    handleDragEnter(e: DragEvent): void;
    handleDragLeaveForOverlay(e: DragEvent): void;
    handleDragLeaveForDroppable(e: DragEvent): void;
    handleDragOverForOverlay(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
    stopPropagation(e: Event): void;
}

export class DefaultElementEventsHandler implements ElementEventsHandler {

    currentSortKey: SortKey = SortKey.NEWEST;

    readonly #options: CommentsOptions;
    readonly #commentsById: CommentsById;
    readonly #textareaService: TextareaService;
    readonly #commentUtil: CommentUtil;
    readonly #commentTransformer: CommentTransformer;
    readonly #commentSorter: CommentSorter;
    readonly #commentContentFormatter: CommentContentFormatter;
    readonly #tagFactory: TagFactory;

    constructor(private readonly container: HTMLDivElement,
                private readonly emitter: EventEmitter<'navigationElementClicked' | 'postComment'>) {
        this.#options = OptionsProvider.get(container)!;
        this.#commentsById = CommentsProvider.get(container)!;
        this.#textareaService = ServiceProvider.get(container, TextareaService);
        this.#commentUtil = ServiceProvider.get(container, CommentUtil);
        this.#commentTransformer = ServiceProvider.get(container, CommentTransformer);
        this.#commentSorter = ServiceProvider.get(container, CommentSorter);
        this.#commentContentFormatter = ServiceProvider.get(container, CommentContentFormatter);
        this.#tagFactory = ServiceProvider.get(container, TagFactory);
    }

    closeDropdowns(): void {
        this.container.querySelectorAll<HTMLElement>('.dropdown')
            .forEach(hideElement);
    }

    preSavePastedAttachments(e: ClipboardEvent): void {
        const clipboardData = e.clipboardData!;
        const files: FileList = clipboardData.files;

        // Browsers only support pasting one file
        if (files?.length === 1) {

            // Select correct commenting field
            const parentCommentingField: CommentingFieldComponent | null = findParentsBySelector<CommentingFieldComponent>(e.target as HTMLElement, 'ax-commenting-field').first();
            if (!isNil(parentCommentingField)) {
                this.preSaveAttachments(files, parentCommentingField);
            }


            e.preventDefault();
        }
    }

    private preSaveAttachments(files: FileList, commentingField: CommentingFieldComponent = this.container.querySelector('ax-commenting-field.main')!): void {
        // Elements
        const uploadButton: ButtonComponent = commentingField.querySelector('.control-row .upload')!;
        const attachmentsContainer: HTMLElement = commentingField.querySelector('.control-row .attachments')!;

        if (files.length) {
            // Create attachment models
            let attachments: any[] = [...files].map(file => ({
                mime_type: file.type,
                file: file
            }));

            // Filter out already added attachments
            const existingAttachments: any[] = commentingField.getAttachmentsFromCommentingField();
            attachments = attachments.filter(attachment => {
                let duplicate = false;

                // Check if the attachment name and size matches with an already added attachment
                for (let i = 0; i < existingAttachments.length; i++) {
                    const existingAttachment = existingAttachments[i];
                    if (attachment.file.name === existingAttachment.file.name && attachment.file.size === existingAttachment.file.size) {
                        duplicate = true;
                        break;
                    }
                }

                return !duplicate;
            });

            // Ensure that the main commenting field is shown if attachments were added to that
            if (commentingField.classList.contains('main')) {
                commentingField.querySelector('.textarea')!.dispatchEvent(new MouseEvent('click'));
            }

            // Set button state to loading
            uploadButton.setButtonState(false, true);

            // Validate attachments
            this.#options.validateAttachments(attachments, (validatedAttachments: any[]) => {

                if (validatedAttachments.length) {
                    // Create attachment tags
                    validatedAttachments.forEach(attachment => {
                        const attachmentTag: HTMLAnchorElement = this.#tagFactory.createAttachmentTagElement(attachment, true);
                        attachmentsContainer.append(attachmentTag);
                    });

                    // Check if save button needs to be enabled
                    commentingField.toggleSaveButton();
                }

                // Reset button state
                uploadButton.setButtonState(true, false);
            });
        }

        // Clear the input field
        uploadButton.querySelector('input')!.value = '';
    }

    saveOnKeydown(e: KeyboardEvent): void {
        // Save comment on cmd/ctrl + enter
        if (e.keyCode === 13) {
            const metaKey = e.metaKey || e.ctrlKey;
            if (this.#options.postCommentOnEnter || metaKey) {
                const el: HTMLElement = e.currentTarget as HTMLElement;
                findSiblingsBySelector(el, '.control-row').querySelector('.save')!.click();
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }

    saveEditableContent(e: Event): void {
        const el: HTMLElement = e.currentTarget as HTMLElement;
        (el as any).contentBeforeChange = el.innerHTML;
    }

    checkEditableContentForChange(e: Event): void {
        const el: HTMLElement = e.currentTarget as HTMLElement;

        if ((el as any).contentBeforeChange !== el.innerHTML) {
            (el as any).contentBeforeChange = el.innerHTML;
            el.dispatchEvent(new Event('change', {bubbles: true}))
        }
    }

    navigationElementClicked(e: MouseEvent): void {
        const navigationEl: HTMLElement = e.currentTarget as HTMLElement;
        const sortKey: SortKey = navigationEl.getAttribute('data-sort-key') as SortKey;

        // Save the current sort key
        this.currentSortKey = sortKey;

        // Sort the comments if necessary
        if (this.currentSortKey !== SortKey.ATTACHMENTS) {
            this.#sortAndReArrangeComments(sortKey);
        }

        this.emitter.emit('navigationElementClicked', sortKey);
    }

    #sortAndReArrangeComments(sortKey: SortKey): void {
        const commentList: HTMLElement = this.container.querySelector('#comment-list')!;

        // Get main level comments
        const mainLevelComments: Record<string, any>[] = this.#commentUtil.getComments().filter(commentModel => !commentModel.parent);
        this.#commentSorter.sortComments(mainLevelComments, sortKey);

        // Rearrange the main level comments
        mainLevelComments.forEach(commentModel => {
            const commentEl: HTMLElement = commentList.querySelector(`> ax-comment[data-id=${commentModel.id}]`)!;
            commentList.append(commentEl);
        });
    }

    toggleNavigationDropdown(e: UIEvent): void {
        // Prevent closing immediately
        e.stopPropagation();

        const dropdown: HTMLElement = (e.currentTarget as HTMLElement).querySelector('~ .dropdown')!;
        toggleElementVisibility(dropdown);
    }

    showMainCommentingField(e: UIEvent): void {
        const mainTextarea: HTMLElement = e.currentTarget as HTMLElement;
        findSiblingsBySelector(mainTextarea, '.control-row')
            .forEach(showElement)
        showElement(mainTextarea.parentElement!.querySelector('.close')!);
        hideElement(mainTextarea.parentElement!.querySelector('.upload.inline-button')!);
        mainTextarea.focus();
    }

    hideMainCommentingField(e: UIEvent): void {
        const closeButton: HTMLElement = e.currentTarget as HTMLElement;
        const commentingField: CommentingFieldComponent = this.container.querySelector('ax-commenting-field.main')!
        const mainTextarea: HTMLElement = commentingField.querySelector('.textarea')!;
        const mainControlRow: HTMLElement = commentingField.querySelector('.control-row')!;

        // Clear text area
        this.#textareaService.clearTextarea(mainTextarea);

        // Clear attachments
        commentingField.querySelector('.attachments')!.innerHTML = '';

        // Toggle save button
        commentingField.toggleSaveButton();

        // Adjust height
        this.#textareaService.adjustTextareaHeight(mainTextarea, false);

        hideElement(mainControlRow);
        hideElement(closeButton);
        showElement(mainTextarea.parentElement!.querySelector('.upload.inline-button')!);
        mainTextarea.blur();
    }

    increaseTextareaHeight(e: Event): void {
        const textarea: HTMLElement = e.currentTarget as HTMLElement;
        this.#textareaService.adjustTextareaHeight(textarea, true);
    }

    textareaContentChanged(e: Event): void {
        const textarea: HTMLElement = e.currentTarget as HTMLElement;

        // Update parent id if reply-to tag was removed
        if (!textarea.querySelectorAll('.reply-to.tag').length) {
            const commentId = textarea.getAttribute('data-comment');

            // Case: editing comment
            if (commentId) {
                const parentComments: HTMLElement[] = findParentsBySelector(textarea, 'ax-comment');
                if (parentComments.length > 1) {
                    const parentId: string = parentComments[parentComments.length - 1].getAttribute('data-id')!;
                    textarea.setAttribute('data-parent', parentId);
                }

                // Case: new comment
            } else {
                const parentId: string = findParentsBySelector(textarea, 'ax-comment').last()!.getAttribute('data-id')!;
                textarea.setAttribute('data-parent', parentId);
            }
        }

        // Move close button if scrollbar is visible
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(textarea, 'ax-commenting-field')
            .first()!;
        if (textarea.scrollHeight > textarea.getBoundingClientRect().height) {
            commentingField.querySelector('.commenting-field')!.classList.add('commenting-field-scrollable');
        } else {
            commentingField.querySelector('.commenting-field')!.classList.remove('commenting-field-scrollable');
        }

        // Check if save button needs to be enabled
        commentingField.toggleSaveButton();
    }

    removeCommentingField(e: UIEvent): void {
        const closeButton: HTMLElement = e.currentTarget as HTMLElement;

        // Remove edit class from comment if user was editing the comment
        const textarea: HTMLElement = findSiblingsBySelector(closeButton, '.textarea').first()!;
        if (textarea.getAttribute('data-comment')) {
            findParentsBySelector(closeButton, 'li.comment').first()!.classList.remove('edit');
        }

        // Remove the field
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(closeButton, 'ax-commenting-field').first()!;
        commentingField.remove();
    }

    postComment(e: UIEvent): void {
        const sendButton: ButtonComponent = e.currentTarget as ButtonComponent;
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(sendButton, 'ax-commenting-field').first()!;

        // Set button state to loading
        sendButton.setButtonState(false, true);

        // Create comment JSON
        let commentJSON = commentingField.createCommentJSON();

        // Reverse mapping
        commentJSON = this.#commentTransformer.applyExternalMappings(commentJSON);

        const success: (commentJSON: Record<string, any>) => void = commentJSON => {
            this.emitter.emit('postComment', commentJSON);
            commentingField.querySelector<HTMLElement>('.close')!.click();

            // Reset button state
            sendButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            sendButton.setButtonState(true, false);
        };

        this.#options.postComment(commentJSON, success, error);
    }

    putComment(e: UIEvent): void {
        const saveButton: ButtonComponent = e.currentTarget as ButtonComponent;
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(saveButton, 'ax-commenting-field').first()!;
        const textarea: HTMLElement = commentingField.querySelector('.textarea')!;

        // Set button state to loading
        saveButton.setButtonState(false, true);

        // Use a clone of the existing model and update the model after succesfull update
        let commentJSON = Object.assign({}, this.#commentsById[textarea.getAttribute('data-comment')!]);
        Object.assign(commentJSON, {
            parent: textarea.getAttribute('data-parent'),
            content: this.#textareaService.getTextareaContent(textarea),
            pings: this.#textareaService.getPings(textarea),
            modified: new Date().getTime(),
            attachments: commentingField.getAttachmentsFromCommentingField()
        });

        // Reverse mapping
        commentJSON = this.#commentTransformer.applyExternalMappings(commentJSON);

        const success: (commentJSON: Record<string, any>) => void = commentJSON => {
            // The outermost parent can not be changed by editing the comment so the childs array
            // of parent does not require an update

            const commentModel = this.#commentTransformer.toCommentModel(commentJSON);

            // Delete childs array from new comment model since it doesn't need an update
            delete commentModel.childs;
            this.updateCommentModel(commentModel);

            // Close the editing field
            commentingField.querySelector<HTMLElement>('.close')!.click();

            // Re-render the comment
            this.reRenderComment(commentModel.id);

            // Reset button state
            saveButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            saveButton.setButtonState(true, false);
        };

        this.#options.putComment(commentJSON, success, error);
    }

    private updateCommentModel(commentModel: Record<string, any>): void {
        Object.assign(this.#commentsById[commentModel.id], commentModel);
    }

    private reRenderComment(id: string): void {
        const commentModel: Record<string, any> = this.#commentsById[id];
        const commentElement: CommentComponent = this.container.querySelector(`ax-comment[data-id="${commentModel.id}"]`)!;

        commentElement.reRenderCommentContainer();
    }

    deleteComment(e: UIEvent): void {
        const deleteButton: ButtonComponent = e.currentTarget as ButtonComponent;
        const commentEl: HTMLElement = findParentsBySelector(deleteButton, '.comment').first()!;
        let commentJSON: Record<string, any> = Object.assign({}, this.#commentsById[commentEl.getAttribute('data-id')!]);
        const commentId: string = commentJSON.id;
        const parentId: string = commentJSON.parent;

        // Set button state to loading
        deleteButton.setButtonState(false, true);

        // Reverse mapping
        commentJSON = this.#commentTransformer.applyExternalMappings(commentJSON);

        const success: () => void = () => {
            this.removeComment(commentId);
            if (parentId) {
                findParentsBySelector<CommentComponent>(commentEl, `ax-comment[data-id="${parentId}"]`)
                    .first()!
                    .reRenderCommentActionBar();
            }

            // Reset button state
            deleteButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            deleteButton.setButtonState(true, false);
        };

        this.#options.deleteComment(commentJSON, success, error);
    }

    private removeComment(commentId: string): void {
        this.#commentUtil.removeComment(commentId, parentEl => {
            // Update the toggle all button
            ToggleAllButtonElement.updateToggleAllButton(parentEl, this.#options);
        });
    }

    preDeleteAttachment(e: UIEvent) {
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(e.currentTarget as HTMLElement, 'ax-commenting-field')
            .first()!;
        const attachmentEl: HTMLElement = findParentsBySelector(e.currentTarget as HTMLElement, '.attachment').first()!;
        attachmentEl.remove();

        // Check if save button needs to be enabled
        commentingField.toggleSaveButton();
    }

    fileInputChanged(e: Event): void {
        const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
        const files = input.files!;
        const commentingField: CommentingFieldComponent = findParentsBySelector<CommentingFieldComponent>(input, 'ax-commenting-field').first()!;
        this.preSaveAttachments(files, commentingField);
    }

    upvoteComment(e: UIEvent): void {
        const commentEl: CommentComponent = findParentsBySelector<CommentComponent>(e.currentTarget as HTMLElement, 'ax-comment').first()!;
        const commentModel = commentEl.commentModel;

        // Check whether user upvoted the comment or revoked the upvote
        const previousUpvoteCount = commentModel.upvoteCount;
        let newUpvoteCount;
        if (commentModel.userHasUpvoted) {
            newUpvoteCount = previousUpvoteCount - 1;
        } else {
            newUpvoteCount = previousUpvoteCount + 1;
        }

        // Show changes immediately
        commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
        commentModel.upvoteCount = newUpvoteCount;
        this.reRenderUpvotes(commentModel.id);

        // Reverse mapping
        let commentJSON = Object.assign({}, commentModel);
        commentJSON = this.#commentTransformer.applyExternalMappings(commentJSON);

        const success: (commentJSON: Record<string, any>) => void = commentJSON => {
            const commentModel = this.#commentTransformer.toCommentModel(commentJSON);
            this.updateCommentModel(commentModel);
            this.reRenderUpvotes(commentModel.id);
        };

        const error: () => void = () => {
            // Revert changes
            commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
            commentModel.upvoteCount = previousUpvoteCount;
            this.reRenderUpvotes(commentModel.id);
        };

        this.#options.upvoteComment(commentJSON, success, error);
    }

    private reRenderUpvotes(id: string): void {
        const commentModel: Record<string, any> = this.#commentsById[id];
        const commentElement: CommentComponent = this.container.querySelector(`ax-comment[data-id="${commentModel.id}"]`)!;

        commentElement.reRenderUpvotes();
    }

    hashtagClicked(e: MouseEvent): void {
        const el: HTMLElement = e.currentTarget as HTMLElement;
        const value: string = el.getAttribute('data-value')!;
        this.#options.hashtagClicked(value);
    }

    pingClicked(e: MouseEvent): void {
        const el: HTMLElement = e.currentTarget as HTMLElement;
        const value: string = el.getAttribute('data-value')!;
        this.#options.pingClicked(value);
    }

    toggleReplies(e: UIEvent): void {
        const toggleAllButton: ToggleAllButtonElement = e.currentTarget as ToggleAllButtonElement;
        findSiblingsBySelector(toggleAllButton, '.togglable-reply')
            .forEach((togglableReply: HTMLElement) => togglableReply.classList.toggle('visible'));
        toggleAllButton.setToggleAllButtonText(true);
    }

    replyButtonClicked(e: MouseEvent): void {
        const replyButton: HTMLElement = e.currentTarget as HTMLElement;
        const outermostParent: HTMLElement = findParentsBySelector(replyButton, 'ax-comment').last()!;
        const parentId: string | null = findParentsBySelector(replyButton, '.comment').first()!.getAttribute('data-id');

        // Remove existing field
        let replyField: CommentingFieldComponent | null = outermostParent.querySelector('.child-comments > .commenting-field');
        let previousParentId: string | null = null;
        if (replyField) {
            previousParentId = replyField.querySelector('.textarea')!.getAttribute('data-parent');
            replyField.remove();
        }

        // Create the reply field (do not re-create)
        if (previousParentId !== parentId) {
            replyField = document.createElement('ax-commenting-field') as CommentingFieldComponent;
            replyField.parentId = parentId;
            outermostParent.querySelector('.child-comments')!.append(replyField);

            // Move cursor to end
            const textarea: HTMLElement = replyField.querySelector('.textarea')!;
            this.moveCursorToEnd(textarea);

            // Ensure element stays visible
            this.ensureElementStaysVisible(replyField);
        }
    }

    private moveCursorToEnd(element: HTMLElement): void {
        // Trigger input to adjust size
        element.dispatchEvent(new InputEvent('input'));

        // Scroll to bottom
        element.scrollTop = element.scrollHeight;

        // Move cursor to end
        const range: Range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const sel: Selection = getSelection() as Selection;
        sel.removeAllRanges();
        sel.addRange(range);

        // Focus
        element.focus();
    }

    private ensureElementStaysVisible(el: HTMLElement): void {
        const scrollContainer: HTMLElement = this.#options.scrollContainer;
        const maxScrollTop: number = el.offsetTop;
        const minScrollTop: number = el.offsetTop + el.offsetHeight - scrollContainer.offsetHeight;

        if (scrollContainer.scrollTop > maxScrollTop) { // Case: element hidden above scoll area
            scrollContainer.scrollTop = maxScrollTop;
        } else if (scrollContainer.scrollTop < minScrollTop) { // Case: element hidden below scoll area
            scrollContainer.scrollTop = minScrollTop;
        }

    }

    editButtonClicked(e: MouseEvent): void {
        const editButton: HTMLElement = e.currentTarget as HTMLElement;
        const commentEl: CommentComponent = findParentsBySelector<CommentComponent>(editButton, 'ax-comment').first()!;
        const commentModel: Record<string, any> = commentEl.commentModel;
        commentEl.classList.add('edit');

        // Create the editing field
        const editField: CommentingFieldComponent = document.createElement('ax-commenting-field') as CommentingFieldComponent;
        editField.parentId = commentModel.parent;
        editField.existingCommentId = commentModel.id;
        commentEl.querySelector('.comment-wrapper')!.append(editField);

        // Append original content
        const textarea: HTMLElement = editField.querySelector('.textarea')!;
        textarea.setAttribute('data-comment', commentModel.id);

        // Escaping HTML
        textarea.append(this.#commentContentFormatter.getFormattedCommentContent(commentModel, true));

        // Move cursor to end
        this.moveCursorToEnd(textarea);

        // Ensure element stays visible
        this.ensureElementStaysVisible(editField);
    }

    showDroppableOverlay(e: UIEvent): void {
        if (this.#options.enableAttachments) {
            this.container.querySelectorAll<HTMLElement>('.droppable-overlay')
                .forEach(element => {
                    element.style.top = this.container.scrollTop + 'px';
                    showElement(element);
                });
            this.container.classList.add('drag-ongoing');
        }
    }

    handleDragEnter(e: DragEvent): void {
        const currentTarget: HTMLElement = e.currentTarget as HTMLElement;
        let count: number = Number(currentTarget.getAttribute('data-dnd-count')) || 0;
        currentTarget.setAttribute('data-dnd-count', `${++count}`);
        currentTarget.classList.add('drag-over');
    }

    handleDragLeaveForOverlay(e: DragEvent): void {
        this.handleDragLeave(e, () => {
            this.hideDroppableOverlay();
        });
    }

    private handleDragLeave(e: DragEvent, onDragLeft?: Function): void {
        const currentTarget: HTMLElement = e.currentTarget as HTMLElement;
        let count: number = Number(currentTarget.getAttribute('data-dnd-count'));
        currentTarget.setAttribute('data-dnd-count', `${--count}`);

        if (count === 0) {
            (e.currentTarget as HTMLElement).classList.remove('drag-over');
            onDragLeft?.();
        }
    }

    private hideDroppableOverlay(): void {
        this.container.querySelectorAll<HTMLElement>('.droppable-overlay')
            .forEach(hideElement);
        this.container.classList.remove('drag-ongoing');
    }

    handleDragLeaveForDroppable(e: DragEvent): void {
        this.handleDragLeave(e);
    }

    handleDragOverForOverlay(e: DragEvent): void {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'copy';
    }

    handleDrop(e: DragEvent): void {
        e.preventDefault();

        // Reset DND counts
        e.target!.dispatchEvent(new DragEvent('dragleave'));

        // Hide the overlay and upload the files
        this.hideDroppableOverlay();
        this.preSaveAttachments(e.dataTransfer!.files);
    }

    stopPropagation(e: Event) {
        e.stopPropagation();
    }
}
