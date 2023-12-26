import {CommentsOptions} from './options/options.js';
import {OptionsProvider} from './common/provider.js';
import {
    findParentsBySelector,
    hideElement,
    showElement
} from './common/html-util.js';
import {CommentingFieldElement} from './thread/commenting-field/commenting-field-element.js';

export interface ElementEventHandler {
    closeDropdowns(e: UIEvent): void;
    preSavePastedAttachments(e: ClipboardEvent): void;
    showDroppableOverlay(e: UIEvent): void;
    handleDragEnter(e: DragEvent): void;
    handleDragLeaveForOverlay(e: DragEvent): void;
    handleDragLeaveForDroppable(e: DragEvent): void;
    handleDragOverForOverlay(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
}

export class CommentsElementEventHandler implements ElementEventHandler {

    readonly #options: Required<CommentsOptions>;

    constructor(private readonly container: HTMLElement) {
        this.#options = OptionsProvider.get(container);
    }

    closeDropdowns(): void {
        const escPressEvent = new KeyboardEvent('keydown',{
            key: 'Escape',
            keyCode: 27
        });
        this.container.querySelectorAll<HTMLElement>('.textarea')
            .forEach(el => el.dispatchEvent(escPressEvent));
    }

    preSavePastedAttachments(e: ClipboardEvent): void {
        const clipboardData = e.clipboardData!;
        const files: FileList = clipboardData.files;

        // Browsers only support pasting one file
        if (files?.length === 1) {

            // Select correct commenting field
            const parentCommentingField: CommentingFieldElement =
                findParentsBySelector<CommentingFieldElement>(e.target as HTMLElement, 'ax-commenting-field.commenting-field').first()
                || this.container.querySelector('ax-commenting-field.commenting-field.main')!;

            parentCommentingField.preSaveAttachments(files);

            e.preventDefault();
        }
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
        this.container.querySelector<CommentingFieldElement>('ax-commenting-field.commenting-field.main')!
            .preSaveAttachments(e.dataTransfer!.files);
    }
}
