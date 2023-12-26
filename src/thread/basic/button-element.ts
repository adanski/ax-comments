import {CommentModel, CommentsOptions} from '../../options/options.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from '../../common/provider.js';
import {SpinnerFactory} from './spinner-factory.js';
import {CustomElement, defineCustomElement} from '../../common/custom-element.js';
import {WebComponent} from '../../common/web-component.js';
import {getHostContainer} from '../../common/html-util.js';
import {CommentModelEnriched} from '../../view-model/comment-model-enriched.js';
import {ErrorFct, SuccessFct} from '../../options/callbacks.js';
import {isNil, noop} from '../../common/util.js';
import {CommentViewModel} from '../../view-model/comment-view-model.js';

//@CustomElement('ax-button', {extends: 'button'})
export class ButtonElement extends HTMLButtonElement implements WebComponent {

    set inline(value: boolean) {
        if (value) this.classList.add('inline-button');
    }
    onInitialized: (button: ButtonElement) => void = noop;

    #initialized: boolean = false;
    #options!: Required<CommentsOptions>;
    #spinnerFactory!: SpinnerFactory;

    connectedCallback(): void {
        this.#initServices();
        this.type = 'button';
        if (!this.#initialized) {
            const spinner: HTMLElement = this.#spinnerFactory.createSpinner(true);
            spinner.classList.add('hidden');
            this.prepend(spinner);
            this.onInitialized(this);
            this.#initialized = true;
        }
    }

    #initServices(): void {
        if (this.#options) return;
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container)!;
        this.#spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
    }

    static createCloseButton(options: Pick<ButtonElement, 'inline' | 'onclick'>, className?: string): ButtonElement {
        const closeButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        Object.assign(closeButton, options);
        closeButton.classList.add(className || 'close');

        closeButton.onInitialized = button => {
            const icon: HTMLElement = document.createElement('i');
            icon.classList.add('fa', 'fa-times');
            if (button.#options.closeIconURL.length) {
                icon.style.backgroundImage = `url("${button.#options.closeIconURL}")`;
                icon.classList.add('image');
            }

            button.append(icon);
        };

        return closeButton;
    }

    static createSaveButton(options: Pick<ButtonElement, 'onclick'>, existingCommentId: string | null): ButtonElement {
        const saveButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        Object.assign(saveButton, options);

        saveButton.onInitialized = button => {
            const saveButtonClass: string = existingCommentId ? 'update' : 'send';
            const saveButtonText: string = existingCommentId
                ? button.#options.saveText
                : button.#options.sendText;
            saveButton.classList.add(saveButtonClass, 'save', 'highlight-background');
            saveButton.append(ButtonElement.createLabel(saveButtonText));
        };

        return saveButton;
    }

    static createUploadButton(options: Pick<ButtonElement, 'inline'> & Pick<HTMLInputElement, 'onchange'>): ButtonElement {
        const uploadButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        uploadButton.inline = options.inline;
        uploadButton.classList.add('upload', 'enabled');

        uploadButton.onInitialized = button => {
            const uploadIcon: HTMLElement = document.createElement('i');
            uploadIcon.classList.add('fa', 'fa-paperclip');
            const fileInput: HTMLInputElement = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.title = button.#options.attachmentDropText;
            fileInput.onchange = options.onchange;

            if (button.#options.uploadIconURL.length) {
                uploadIcon.style.backgroundImage = `url("${button.#options.uploadIconURL}")`;
                uploadIcon.classList.add('image');
            }
            button.append(uploadIcon, fileInput);
        };

        return uploadButton;
    }

    static createActionButton(className: string, label: string, options: Pick<ButtonElement, 'onclick'>): ButtonElement {
        const actionButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        Object.assign(actionButton, options);
        actionButton.classList.add('action', className);
        actionButton.append(ButtonElement.createLabel(label));

        return actionButton;
    }

    static createDeleteButton(options: Pick<ButtonElement, 'onclick'>): ButtonElement {
        const deleteButton: ButtonElement = ButtonElement.createActionButton('delete', '', options);
        deleteButton.classList.add('enabled');

        deleteButton.onInitialized = button => {
            const deleteButtonText: string = button.#options.deleteText;
            const label: HTMLElement = button.querySelector('span.label')!;
            label.style.color = button.#options.deleteButtonColor;
            label.textContent = deleteButtonText;
        };

        return deleteButton;
    }

    static createUpvoteButton(commentModel: CommentModelEnriched): ButtonElement {
        const upvoteButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        upvoteButton.classList.add('action', 'upvote');
        upvoteButton.classList.toggle("disabled", !!commentModel.createdByCurrentUser || !!commentModel.isDeleted);
        const upvoteCounter: HTMLSpanElement = document.createElement('span');
        upvoteCounter.classList.add('upvote-count');

        const reRenderUpvotes: (
            upvoteCount?: number,
            upvotedByCurrentUser?: boolean
        ) => void = (
            upvoteCount = commentModel.upvoteCount,
            upvotedByCurrentUser = commentModel.upvotedByCurrentUser
        ) => {
            if (upvotedByCurrentUser) upvoteButton.classList.add('highlight-font');
            else upvoteButton.classList.remove('highlight-font');

            upvoteCounter.textContent = isNil(upvoteCount) ? '' : `${upvoteCount}`;
        };
        reRenderUpvotes();

        upvoteButton.onInitialized = button => {
            const upvoteIcon: HTMLElement = document.createElement('i');
            upvoteIcon.classList.add('fa', 'fa-thumbs-up');
            if (button.#options.upvoteIconURL.length) {
                upvoteIcon.style.backgroundImage = `url("${button.#options.upvoteIconURL}")`;
                upvoteIcon.classList.add('image');
            }

            button.append(upvoteCounter, upvoteIcon);
        };

        const upvoteComment: (e: UIEvent) => void = e => {
            // Check whether user upvoted the comment or revoked the upvote
            const previousUpvoteCount: number = commentModel.upvoteCount ?? 0;
            let newUpvoteCount: number;
            if (commentModel.upvotedByCurrentUser) {
                newUpvoteCount = previousUpvoteCount - 1;
            } else {
                newUpvoteCount = previousUpvoteCount + 1;
            }

            // Show changes immediately
            reRenderUpvotes(newUpvoteCount, !commentModel.upvotedByCurrentUser);

            // Reverse mapping
            const commentViewModel: CommentViewModel = CommentViewModelProvider.get(getHostContainer(upvoteButton));

            const success: SuccessFct<CommentModel> = updatedComment => {
                reRenderUpvotes(updatedComment.upvoteCount, updatedComment.upvotedByCurrentUser);
                commentViewModel.upvoteComment(updatedComment)
            };

            const error: ErrorFct = () => {
                // Revert changes
                reRenderUpvotes(previousUpvoteCount, !commentModel.upvotedByCurrentUser);
            };

            upvoteButton.#options.upvoteComment(
                commentModel.deplete({
                    upvoteCount: newUpvoteCount,
                    upvotedByCurrentUser: !commentModel.upvotedByCurrentUser
                }),
                success,
                error
            );
        };

        upvoteButton.onclick = upvoteComment;

        return upvoteButton;
    }

    private static createLabel(text: string): HTMLSpanElement {
        const label: HTMLSpanElement = document.createElement('span');
        label.classList.add('label');
        label.textContent = text;
        return label;
    }

    setButtonState(enabled: boolean, loading: boolean): void {
        this.classList.toggle('enabled', enabled);

        this.querySelector<HTMLElement>('.spinner')!.classList.toggle('hidden', !loading);
    }

}

defineCustomElement(ButtonElement, 'ax-button', {extends: 'button'});
