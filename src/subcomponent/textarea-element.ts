import {normalizeSpaces} from '../util.js';
import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {getHostContainer} from '../html-util.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {PingableUser, UserDisplayNamesById} from '../options/models.js';

@RegisterCustomElement('ax-textarea', {extends: 'textarea'})
export class TextareaElement extends HTMLTextAreaElement implements WebComponent {

    parentId: string | null = null;
    existingCommentId: string | null = null;

    readonly pingedUsers: PingableUser[] = [];
    readonly referencedHashtags: string[] = [];

    #options!: Required<CommentsOptions>;

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    #initServices(): void {
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container)!;
    }

    #initElement(): void {
        this.classList.add('textarea');
        this.placeholder = this.#options.textareaPlaceholderText;

        // Setting the initial height for the textarea
        this.adjustTextareaHeight(false);
    }

    static create(options: Pick<TextareaElement, 'existingCommentId' | 'parentId'>): TextareaElement {
        const textarea: TextareaElement = document.createElement('textarea', {is: 'ax-textarea'}) as TextareaElement;
        Object.assign(textarea, options);
        return textarea;
    }

    adjustTextareaHeight(focus?: boolean): void {
        const textareaBaseHeight: number = 2.2;
        const lineHeight: number = 1.45;

        const setRows: (rows: number) => void = rows => {
            const height: number = textareaBaseHeight + (rows - 1) * lineHeight;
            this.style.height = height + 'em';
        };

        let rowCount = focus ? this.#options.textareaRowsOnFocus : this.#options.textareaRows;
        let isAreaScrollable: boolean;
        let maxRowsUsed: boolean;
        do {
            setRows(rowCount);
            rowCount++;
            isAreaScrollable = this.scrollHeight > this.offsetHeight;
            maxRowsUsed = this.#options.textareaMaxRows == false ?
                false : rowCount > this.#options.textareaMaxRows;
        } while (isAreaScrollable && !maxRowsUsed);
    }

    clearTextarea(): void {
        this.value = '';
        this.dispatchEvent(new InputEvent('input', {inputType: 'deleteContent'}))
    }

    getTextareaContent(): string {
        return normalizeSpaces(this.value ?? '');
    }

    getPings(): UserDisplayNamesById {
        return this.pingedUsers.reduce((acc, user) => {
            acc[user.id] = user.displayName!;
            return acc;
        }, {} as UserDisplayNamesById);
    }

}
