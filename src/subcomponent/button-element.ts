import {CommentsOptions} from '../api.js';
import {ServiceProvider} from '../provider.js';
import {SpinnerFactory} from './spinner-factory.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {findParentsBySelector} from '../html-util.js';

@RegisterCustomElement('ax-button', {extends: 'button'})
export class ButtonElement extends HTMLButtonElement implements WebComponent {

    originalContent: string | HTMLElement | HTMLCollection = '';
    span!: HTMLSpanElement;
    #spinnerFactory!: SpinnerFactory;

    constructor() {
        super();
        this.append(this.span = document.createElement('span'))
    }

    connectedCallback(): void {
        this.#initServices();
    }

    #initServices(): void {
        const container: HTMLDivElement | null = findParentsBySelector<HTMLDivElement>(this, '#comments-container').first();
        if (!container) {
            throw new Error(`[ax-button] Button will not work outside ax-comments.`);
        }
        this.#spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
    }

    static createCloseButton(options: CommentsOptions, className?: string): ButtonElement {
        const closeButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        closeButton.classList.add(className || 'close');

        const icon: HTMLElement = document.createElement('i');
        icon.classList.add('fa', 'fa-times');
        if (options.closeIconURL.length) {
            icon.style.backgroundImage = `url("${options.closeIconURL}")`;
            icon.classList.add('image');
        }

        closeButton.span.appendChild(icon);

        return closeButton;
    }

    static createSaveButton(options: CommentsOptions, existingCommentId: string | null): ButtonElement {
        const saveButtonClass: string = existingCommentId ? 'update' : 'send';
        const saveButtonText: string = existingCommentId ? options.textFormatter(options.saveText) : options.textFormatter(options.sendText);
        const saveButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        saveButton.classList.add(saveButtonClass, 'save', 'highlight-background');
        saveButton.originalContent = saveButtonText;
        saveButton.span.textContent = saveButtonText;

        return saveButton;
    }

    static createDeleteButton(options: CommentsOptions): ButtonElement {
        const deleteButtonText: string = options.textFormatter(options.deleteText);
        const deleteButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
        deleteButton.classList.add('delete', 'enabled');
        deleteButton.style.backgroundColor = options.deleteButtonColor;
        deleteButton.originalContent = deleteButtonText;
        deleteButton.span.textContent = deleteButtonText;

        return deleteButton;
    }

    static createUploadButton(options: CommentsOptions): ButtonElement {
        const uploadButton: ButtonElement = document.createElement('button', {is: 'ax-button'}) as ButtonElement;
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
        uploadButton.span.append(uploadIcon, fileInput);

        return uploadButton;
    }

    setButtonState(enabled: boolean, loading: boolean): void {
        if (enabled) {
            !this.classList.contains('enabled') && this.classList.add('enabled');
        } else {
            this.classList.contains('enabled') && this.classList.remove('enabled');
        }

        if (loading) {
            this.span.innerHTML = '';
            this.span.append(this.#spinnerFactory.createSpinner(true));
        } else if (typeof this.originalContent === 'string') {
            this.span.innerHTML = this.originalContent;
        } else if ((this.originalContent as HTMLCollection).length) {
            this.span.innerHTML = '';
            this.span.append(...this.originalContent as HTMLCollection);
        } else {
            this.span.append(this.originalContent as HTMLElement);
        }
    }

}
