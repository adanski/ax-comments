import {normalizeSpaces} from '../util.js';
import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {getHostContainer} from '../html-util.js';
import {RegisterCustomElement} from '../register-custom-element.js';

@RegisterCustomElement('ax-textarea', {extends: 'textarea'})
export class TextareaElement extends HTMLTextAreaElement implements WebComponent {

    readonly pingedUsers: PingedUser[] = [];
    readonly usedHashtags: string[] = [];

    #container!: HTMLElement;
    #options!: CommentsOptions;

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    #initServices(): void {
        this.#container = getHostContainer(this);
        this.#options = OptionsProvider.get(this.#container)!;
    }

    #initElement(): void {
        this.classList.add('textarea');
        this.setAttribute('data-placeholder', this.#options.textFormatter(this.#options.textareaPlaceholderText));

        // Setting the initial height for the textarea
        this.adjustTextareaHeight(false);
    }

    static create(): TextareaElement {
        const textarea: TextareaElement = document.createElement('textarea', {is: 'ax-textarea'}) as TextareaElement;
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

    /**
     * Return pings in format:
     * {
     *     id1: userFullname1,
     *     id2: userFullname2,
     *     ...
     * }
     */
    getPings(): Record<string, string> {
        const pings: Record<string, any> = {};
        this.pingedUsers.forEach(user => pings[user.id] = user.fullname);

        return pings;
    }

}

export interface PingedUser {
    id: string;
    fullname: string;
}
