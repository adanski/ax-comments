import {CommentModel, CommentsOptions} from '../api.js';
import {OptionsProvider, ServiceProvider} from '../provider.js';
import {SpinnerFactory} from './spinner-factory.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {getHostContainer} from '../html-util.js';
import {CommentTransformer} from '../comment-transformer.js';
import {CommentModelEnriched} from '../comments-by-id.js';
import {ErrorFct, SuccessFct} from '../options/callbacks.js';
import {isNil} from '../util.js';

@RegisterCustomElement('ax-button', {extends: 'button'})
export class ButtonElement extends HTMLButtonElement implements WebComponent {

    originalContent: string | HTMLElement | HTMLCollection = '';
    set inline(value: boolean) {
        if (value) this.classList.add('inline-button');
    }
    onInitialized: (button: ButtonElement) => void = () => {};

    #options!: Required<CommentsOptions>;
    #spinnerFactory!: SpinnerFactory;

    connectedCallback(): void {
        this.#initServices();
        this.type = 'button';
        this.onInitialized(this);
    }

    #initServices(): void {
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
            saveButton.originalContent = saveButtonText;
            saveButton.textContent = saveButtonText;
        };

        return saveButton;
    }

    static createDeleteButton(options: Pick<ButtonElement, 'onclick'>): ButtonElement {
        const deleteButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        Object.assign(deleteButton, options);
        deleteButton.classList.add('delete', 'enabled');

        deleteButton.onInitialized = button => {
            const deleteButtonText: string = button.#options.deleteText;
            button.style.backgroundColor = button.#options.deleteButtonColor;
            button.originalContent = deleteButtonText;
            button.textContent = deleteButtonText;
        };

        return deleteButton;
    }

    static createUploadButton(options: Pick<ButtonElement, 'inline' | 'onclick'>): ButtonElement {
        const uploadButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        Object.assign(uploadButton, options);
        uploadButton.classList.add('upload', 'enabled');

        uploadButton.onInitialized = button => {
            const uploadIcon: HTMLElement = document.createElement('i');
            uploadIcon.classList.add('fa', 'fa-paperclip');
            const fileInput: HTMLInputElement = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;

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
        actionButton.classList.add('action', className);
        actionButton.textContent = label;

        return actionButton;
    }

    static createUpvoteButton(commentModel: CommentModelEnriched): ButtonElement {
        const upvoteButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        upvoteButton.classList.add('action', 'upvote');
        const upvoteCount: HTMLSpanElement = document.createElement('span');
        upvoteCount.classList.add('upvote-count');

        const reRenderUpvotes: () => void = () => {
            if (commentModel.upvotedByCurrentUser) upvoteButton.classList.add('highlight-font');
            else upvoteButton.classList.remove('highlight-font');

            upvoteCount.textContent = isNil(commentModel.upvoteCount) ? '' : `${commentModel.upvoteCount}`;
        };
        reRenderUpvotes();

        upvoteButton.onInitialized = button => {
            const upvoteIcon: HTMLElement = document.createElement('i');
            upvoteIcon.classList.add('fa', 'fa-thumbs-up');
            if (button.#options.upvoteIconURL.length) {
                upvoteIcon.style.backgroundImage = `url("${button.#options.upvoteIconURL}")`;
                upvoteIcon.classList.add('image');
            }

            button.append(upvoteCount, upvoteIcon);
        };

        const upvoteComment: (e: UIEvent) => void = e => {
            // Check whether user upvoted the comment or revoked the upvote
            const previousUpvoteCount = commentModel.upvoteCount ?? 0;
            let newUpvoteCount;
            if (commentModel.upvotedByCurrentUser) {
                newUpvoteCount = previousUpvoteCount - 1;
            } else {
                newUpvoteCount = previousUpvoteCount + 1;
            }

            // Show changes immediately
            commentModel.upvotedByCurrentUser = !commentModel.upvotedByCurrentUser;
            commentModel.upvoteCount = newUpvoteCount;
            reRenderUpvotes();

            // Reverse mapping
            const commentTransformer = ServiceProvider.get(getHostContainer(upvoteButton), CommentTransformer);

            const success: SuccessFct<CommentModel> = updatedComment => {
                const commentModel = commentTransformer.enrichOne(updatedComment);
                Object.assign(commentModel, commentModel);
                reRenderUpvotes();
            };

            const error: ErrorFct = () => {
                // Revert changes
                commentModel.upvotedByCurrentUser = !commentModel.upvotedByCurrentUser;
                commentModel.upvoteCount = previousUpvoteCount;
                reRenderUpvotes();
            };

            upvoteButton.#options.upvoteComment(commentTransformer.deplete(commentModel), success, error);
        };

        upvoteButton.onclick = upvoteComment;

        return upvoteButton;
    }

    setButtonState(enabled: boolean, loading: boolean): void {
        this.classList.toggle('enabled', enabled);

        if (loading) {
            this.innerHTML = '';
            this.append(this.#spinnerFactory.createSpinner(true));
        } else if (typeof this.originalContent === 'string') {
            this.innerHTML = this.originalContent;
        } else if ((this.originalContent as HTMLCollection).length) {
            this.innerHTML = '';
            this.append(...this.originalContent as HTMLCollection);
        } else {
            this.append(this.originalContent as HTMLElement);
        }
    }

}
