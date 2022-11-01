import {CommentsOptions} from '../api.js';
import {ServiceProvider} from '../provider.js';
import {SpinnerFactory} from './spinner-factory.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {findParentsBySelector} from '../html-util.js';

@RegisterCustomElement('ax-button')
export class ButtonComponent extends HTMLSpanElement implements WebComponent {

    originalContent: string | HTMLElement | HTMLCollection = '';
    #spinnerFactory!: SpinnerFactory;

    connectedCallback(): void {
        this.initServices();
    }

    private initServices(): void {
        const container: HTMLDivElement | null = findParentsBySelector<HTMLDivElement>(this, '#comments-container').first();
        if (!container) {
            throw new Error(`[ax-button] Button will not work outside ax-comments.`);
        }
        this.#spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
    }

    static createCloseButton(options: CommentsOptions, className?: string): ButtonComponent {
        const closeButton: ButtonComponent = document.createElement('ax-button') as ButtonComponent;
        closeButton.classList.add(className || 'close');

        const icon: HTMLElement = document.createElement('i');
        icon.classList.add('fa', 'fa-times');
        if (options.closeIconURL.length) {
            icon.style.backgroundImage = `url("${options.closeIconURL}")`;
            icon.classList.add('image');
        }

        closeButton.innerHTML = '';
        closeButton.appendChild(icon);

        return closeButton;
    }

    static createSaveButton(options: CommentsOptions, existingCommentId: string | null): ButtonComponent {
        const saveButtonClass: string = existingCommentId ? 'update' : 'send';
        const saveButtonText: string = existingCommentId ? options.textFormatter(options.saveText) : options.textFormatter(options.sendText);
        const saveButton: ButtonComponent = document.createElement('ax-button') as ButtonComponent;
        saveButton.classList.add(saveButtonClass, 'save', 'highlight-background');
        saveButton.textContent = saveButtonText;
        saveButton.originalContent = saveButtonText;

        return saveButton;
    }

    static createDeleteButton(options: CommentsOptions): ButtonComponent {
        const deleteButtonText: string = options.textFormatter(options.deleteText);
        const deleteButton: ButtonComponent = document.createElement('ax-button') as ButtonComponent;
        deleteButton.classList.add('delete', 'enabled');
        deleteButton.textContent = deleteButtonText;
        deleteButton.style.backgroundColor = options.deleteButtonColor;
        deleteButton.originalContent = deleteButtonText;

        return deleteButton;
    }

    static createUploadButton(options: CommentsOptions): ButtonComponent {
        const uploadButton: ButtonComponent = document.createElement('ax-button') as ButtonComponent;
        uploadButton.classList.add('upload', 'enabled');
        const uploadIcon: HTMLElement = document.createElement('i');
        uploadIcon.classList.add('fa', 'fa-paperclip');
        const fileInput: HTMLInputElement = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.setAttribute('data-role', 'none'); // Prevent jquery-mobile for adding classes

        if (options.uploadIconURL.length) {
            uploadIcon.style.backgroundImage = `url("${options.uploadIconURL}")`;
            uploadIcon.classList.add('image');
        }
        uploadButton.append(uploadIcon, fileInput);

        return uploadButton;
    }

    setButtonState(enabled: boolean, loading: boolean): void {
        if (enabled) {
            !this.classList.contains('enabled') && this.classList.add('enabled');
        } else {
            this.classList.contains('enabled') && this.classList.remove('enabled');
        }

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
