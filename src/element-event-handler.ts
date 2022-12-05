import {CommentModelEnriched, CommentsById} from './comments-by-id.js';
import {CommentModel, CommentsOptions, SortKey} from './api.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {TextareaElement} from './subcomponent/textarea-element.js';
import {CommentViewModel} from './comment-view-model.js';
import {
    findParentsBySelector,
    findSiblingsBySelector,
    hideElement,
    showElement,
    toggleElementVisibility
} from './html-util.js';
import {isNil} from './util.js';
import {CommentingFieldElement} from './subcomponent/commenting-field-element.js';
import {ButtonElement} from './subcomponent/button-element.js';
import {CommentTransformer} from './comment-transformer.js';
import {CommentElement} from './subcomponent/comment-element.js';
import {CommentContentFormatter} from './subcomponent/comment-content-formatter.js';
import {TagFactory} from './subcomponent/tag-factory.js';
import {ToggleAllButtonElement} from './subcomponent/toggle-all-button-element.js';
import {CommentSorter} from './comment-sorter.js';
import EventEmitter from 'EventEmitter3';
import {ErrorFct, SuccessFct} from './options/callbacks.js';

export interface ElementEventHandler {
    currentSortKey: SortKey;

    closeDropdowns(e: UIEvent): void;
    preSavePastedAttachments(e: ClipboardEvent): void;
    saveOnKeydown(e: KeyboardEvent): void;
    saveEditableContent(e: Event): void;
    checkEditableContentForChange(e: Event): void;
    navigationElementClicked(e: MouseEvent): void;
    toggleNavigationDropdown(e: UIEvent): void;
    increaseTextareaHeight(e: Event): void;
    textareaContentChanged(e: Event): void;
    fileInputChanged(e: Event): void;
    showDroppableOverlay(e: UIEvent): void;
    handleDragEnter(e: DragEvent): void;
    handleDragLeaveForOverlay(e: DragEvent): void;
    handleDragLeaveForDroppable(e: DragEvent): void;
    handleDragOverForOverlay(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
    stopPropagation(e: Event): void;
}

export class CommentsElementEventHandler implements ElementEventHandler {

    currentSortKey: SortKey = SortKey.NEWEST;

    readonly #options: Required<CommentsOptions>;
    readonly #commentViewModel: CommentViewModel;
    readonly #commentTransformer: CommentTransformer;
    readonly #commentSorter: CommentSorter;
    readonly #commentContentFormatter: CommentContentFormatter;
    readonly #tagFactory: TagFactory;

    constructor(private readonly container: HTMLElement,
                private readonly emitter: EventEmitter<'navigationElementClicked' | 'postComment'>) {
        this.#options = OptionsProvider.get(container);
        this.#commentViewModel = CommentViewModelProvider.get(container);
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
            const parentCommentingField: CommentingFieldElement | null = findParentsBySelector<CommentingFieldElement>(e.target as HTMLElement, 'li.commenting-field').first();
            if (!isNil(parentCommentingField)) {
                this.preSaveAttachments(files, parentCommentingField);
            }


            e.preventDefault();
        }
    }

    private preSaveAttachments(files: FileList, commentingField: CommentingFieldElement = this.container.querySelector('li.commenting-field.main')!): void {
        // Elements
        const uploadButton: ButtonElement = commentingField.querySelector('.control-row .upload')!;
        const attachmentsContainer: HTMLElement = commentingField.querySelector('.control-row .attachments')!;

        if (files.length) {
            // Create attachment models
            let attachments: any[] = [...files].map(file => ({
                mime_type: file.type,
                file: file
            }));

            // Filter out already added attachments
            const existingAttachments: any[] = commentingField.getAttachments();
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
                        const attachmentTag: HTMLAnchorElement = this.#tagFactory.createAttachmentTagElement(attachment, () => {
                            // Check if save button needs to be enabled
                            commentingField.toggleSaveButton();
                        });
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
        const el: TextareaElement = e.currentTarget as TextareaElement;
        (el as any).contentBeforeChange = el.value;
    }

    checkEditableContentForChange(e: Event): void {
        const el: TextareaElement = e.currentTarget as TextareaElement;

        if ((el as any).contentBeforeChange !== el.value) {
            (el as any).contentBeforeChange = el.value;
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

        // Get top level comments
        const rootComments: CommentModelEnriched[] = this.#commentViewModel.getRootComments(this.#commentSorter.getSorter(sortKey));

        // Rearrange top level comments
        rootComments.forEach(commentModel => {
            const commentEl: HTMLElement = commentList.querySelector(`:scope > li.comment[data-id=${commentModel.id}]`)!;
            commentList.append(commentEl);
        });
    }

    toggleNavigationDropdown(e: UIEvent): void {
        // Prevent closing immediately
        e.stopPropagation();

        const dropdown: HTMLElement = (e.currentTarget as HTMLElement).querySelector('~ .dropdown')!;
        toggleElementVisibility(dropdown);
    }

    increaseTextareaHeight(e: Event): void {
        const textarea: TextareaElement = e.currentTarget as TextareaElement;
        textarea.adjustTextareaHeight(true);
    }

    textareaContentChanged(e: Event): void {
        const textarea: TextareaElement = e.currentTarget as TextareaElement;
        const isMain: boolean = findParentsBySelector<CommentingFieldElement>(textarea, 'li.commenting-field')
            .first()!
            .isMain;

        // Update parent id if reply-to tag was removed
        if (!(isMain || textarea.pingedUsers.length)) {
            const commentId = textarea.existingCommentId;

            // Case: new comment
            if (!commentId) {
                textarea.parentId = findParentsBySelector(textarea, 'li.comment').last()!.getAttribute('data-id');
            }
        }

        // Move close button if scrollbar is visible
        const commentingField: CommentingFieldElement = findParentsBySelector<CommentingFieldElement>(textarea, 'li.commenting-field')
            .first()!;
        if (textarea.scrollHeight > textarea.getBoundingClientRect().height) {
            commentingField.classList.add('commenting-field-scrollable');
        } else {
            commentingField.classList.remove('commenting-field-scrollable');
        }

        // Check if save button needs to be enabled
        commentingField.toggleSaveButton();
    }

    postComment(e: UIEvent): void {
        const sendButton: ButtonElement = e.currentTarget as ButtonElement;
        const commentingField: CommentingFieldElement = findParentsBySelector<CommentingFieldElement>(sendButton, 'li.commenting-field').first()!;

        // Set button state to loading
        sendButton.setButtonState(false, true);

        // Get comment
        const comment: CommentModel = commentingField.getCommentModel();

        const success: (postedComment: CommentModel) => void = postedComment => {
            this.emitter.emit('postComment', postedComment);
            commentingField.querySelector<HTMLElement>('.close')!.click();

            // Reset button state
            sendButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            sendButton.setButtonState(true, false);
        };

        this.#options.postComment(comment, success, error);
    }

    putComment(e: UIEvent): void {
        const saveButton: ButtonElement = e.currentTarget as ButtonElement;
        const commentingField: CommentingFieldElement = findParentsBySelector<CommentingFieldElement>(saveButton, 'li.commenting-field').first()!;
        const textarea: TextareaElement = commentingField.querySelector('.textarea')!;

        // Set button state to loading
        saveButton.setButtonState(false, true);

        // Use a clone of the existing model and update the model after successful update
        const commentEnriched: CommentModelEnriched = Object.assign<object, CommentModelEnriched, Partial<CommentModel>>(
            {},
            this.#commentViewModel.getComment(textarea.existingCommentId!)!,
            {
                parentId: textarea.parentId as string,
                content: textarea.getTextareaContent(),
                pings: textarea.getPings(),
                modifiedAt: new Date(),
                attachments: commentingField.getAttachments()
            }
        );

        const success: SuccessFct<CommentModel> = updatedComment => {
            this.#commentViewModel.updateComment(updatedComment);

            // Close the editing field
            commentingField.querySelector<HTMLElement>('.close')!.click();

            // Re-render the comment
            this.reRenderComment(updatedComment.id);

            // Reset button state
            saveButton.setButtonState(false, false);
        };

        const error: ErrorFct = () => {
            // Reset button state
            saveButton.setButtonState(true, false);
        };

        this.#options.putComment(this.#commentTransformer.deplete(commentEnriched), success, error);
    }

    private reRenderComment(id: string): void {
        const commentModel: CommentModelEnriched = this.#commentViewModel.getComment(id)!;
        const commentElement: CommentElement = this.container.querySelector(`li.comment[data-id="${commentModel.id}"]`)!;

        commentElement.reRenderCommentContainer();
    }

    deleteComment(e: UIEvent): void {
        const deleteButton: ButtonElement = e.currentTarget as ButtonElement;
        const commentEl: HTMLElement = findParentsBySelector(deleteButton, '.comment').first()!;
        const commentEnriched: CommentModelEnriched = Object.assign({}, this.#commentViewModel.getComment(commentEl.getAttribute('data-id')!));

        // Set button state to loading
        deleteButton.setButtonState(false, true);

        const success: SuccessFct<CommentModel> = deletedComment => {
            // Just to be sure
            deletedComment.isDeleted = true;
            this.#commentViewModel.updateComment(deletedComment);

            // Re-render the comment
            this.reRenderComment(deletedComment.id);

            // Reset button state
            deleteButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            deleteButton.setButtonState(true, false);
        };

        this.#options.deleteComment(this.#commentTransformer.deplete(commentEnriched), success, error);
    }

    fileInputChanged(e: Event): void {
        const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
        const files = input.files!;
        const commentingField: CommentingFieldElement = findParentsBySelector<CommentingFieldElement>(input, 'li.commenting-field').first()!;
        this.preSaveAttachments(files, commentingField);
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
