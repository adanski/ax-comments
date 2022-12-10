import {CommentModelEnriched} from './comments-by-id.js';
import {CommentsOptions, SortKey} from './api.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {CommentViewModel} from './comment-view-model.js';
import {
    findParentsBySelector,
    hideElement,
    showElement,
    toggleElementVisibility
} from './html-util.js';
import {CommentingFieldElement} from './subcomponent/commenting-field-element.js';
import {CommentSorter} from './comment-sorter.js';
import EventEmitter from 'EventEmitter3';

export interface ElementEventHandler {
    currentSortKey: SortKey;

    closeDropdowns(e: UIEvent): void;
    preSavePastedAttachments(e: ClipboardEvent): void;
    navigationElementClicked(e: MouseEvent): void;
    toggleNavigationDropdown(e: UIEvent): void;
    showDroppableOverlay(e: UIEvent): void;
    handleDragEnter(e: DragEvent): void;
    handleDragLeaveForOverlay(e: DragEvent): void;
    handleDragLeaveForDroppable(e: DragEvent): void;
    handleDragOverForOverlay(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
}

export class CommentsElementEventHandler implements ElementEventHandler {

    currentSortKey: SortKey = SortKey.NEWEST;

    readonly #options: Required<CommentsOptions>;
    readonly #commentViewModel: CommentViewModel;
    readonly #commentSorter: CommentSorter;

    constructor(private readonly container: HTMLElement,
                private readonly emitter: EventEmitter<'navigationElementClicked'>) {
        this.#options = OptionsProvider.get(container);
        this.#commentViewModel = CommentViewModelProvider.get(container);
        this.#commentSorter = ServiceProvider.get(container, CommentSorter);
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

            parentCommentingField?.preSaveAttachments(files);

            e.preventDefault();
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
            const commentEl: HTMLElement = commentList.querySelector(`:scope > li.comment[data-id="${commentModel.id}"]`)!;
            commentList.append(commentEl);
        });
    }

    toggleNavigationDropdown(e: UIEvent): void {
        // Prevent closing immediately
        e.stopPropagation();

        const dropdown: HTMLElement = (e.currentTarget as HTMLElement).querySelector('~ .dropdown')!;
        toggleElementVisibility(dropdown);
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
        this.#handleDragLeave(e, () => {
            this.#hideDroppableOverlay();
        });
    }

    #handleDragLeave(e: DragEvent, onDragLeft?: Function): void {
        const currentTarget: HTMLElement = e.currentTarget as HTMLElement;
        let count: number = Number(currentTarget.getAttribute('data-dnd-count'));
        currentTarget.setAttribute('data-dnd-count', `${--count}`);

        if (count === 0) {
            (e.currentTarget as HTMLElement).classList.remove('drag-over');
            onDragLeft?.();
        }
    }

    #hideDroppableOverlay(): void {
        this.container.querySelectorAll<HTMLElement>('.droppable-overlay')
            .forEach(hideElement);
        this.container.classList.remove('drag-ongoing');
    }

    handleDragLeaveForDroppable(e: DragEvent): void {
        this.#handleDragLeave(e);
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
        this.#hideDroppableOverlay();
        this.container.querySelector<CommentingFieldElement>('li.commenting-field.main')!
            .preSaveAttachments(e.dataTransfer!.files);
    }
}
