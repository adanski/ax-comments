import {normalizeSpaces} from '../util.js';
import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';

export class TextareaService {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    createTextarea(): HTMLDivElement {
        // Textarea
        const textarea: HTMLDivElement = document.createElement('div');
        textarea.classList.add('textarea');
        textarea.setAttribute('data-placeholder', this.options.textFormatter(this.options.textareaPlaceholderText));
        textarea.setAttribute('contenteditable', 'true');

        // Setting the initial height for the textarea
        this.adjustTextareaHeight(textarea, false);
        return textarea;
    }

    adjustTextareaHeight(textarea: HTMLElement, focus?: boolean): void {
        const textareaBaseHeight: number = 2.2;
        const lineHeight: number = 1.45;

        const setRows: (rows: number) => void = rows => {
            const height: number = textareaBaseHeight + (rows - 1) * lineHeight;
            textarea.style.height = height + 'em';
        };

        var rowCount = focus ? this.options.textareaRowsOnFocus : this.options.textareaRows;
        let isAreaScrollable: boolean;
        let maxRowsUsed: boolean;
        do {
            setRows(rowCount);
            rowCount++;
            isAreaScrollable = textarea.scrollHeight > textarea.offsetHeight;
            maxRowsUsed = this.options.textareaMaxRows == false ?
                false : rowCount > this.options.textareaMaxRows;
        } while (isAreaScrollable && !maxRowsUsed);
    }

    clearTextarea(textarea: HTMLElement): void {
        textarea.innerHTML = '';
        textarea.dispatchEvent(new InputEvent('input'))
    }

    getTextareaContent(textarea: HTMLElement, humanReadable: boolean = false): string {
        const textareaClone: HTMLElement = textarea.cloneNode() as HTMLElement;

        // Remove reply-to tag
        const replyToTags: NodeListOf<HTMLElement> = textareaClone.querySelectorAll('.reply-to.tag');
        for (let i = 0; i < replyToTags.length; i++) {
            replyToTags[i].remove();
        }

        // Replace tags with text values
        const hashTags: NodeListOf<HTMLInputElement> = textareaClone.querySelectorAll('.tag.hashtag');
        for (let i = 0; i < hashTags.length; i++) {
            hashTags[i].replaceWith(humanReadable
                ? hashTags[i].value
                : '#' + hashTags[i].getAttribute('data-value'));
        }

        const pingTags: NodeListOf<HTMLInputElement> = textareaClone.querySelectorAll('.tag.ping');
        for (let i = 0; i < pingTags.length; i++) {
            pingTags[i].replaceWith(humanReadable
                ? pingTags[i].value
                : '#' + pingTags[i].getAttribute('data-value'));
        }

        const ce: HTMLPreElement = document.createElement('pre');
        ce.append(textareaClone);
        const divsOrPsOrBrs: NodeListOf<HTMLElement> = ce.querySelectorAll('div, p, br');
        for (let i = 0; i < divsOrPsOrBrs.length; i++) {
            divsOrPsOrBrs[i].replaceWith('\n' + divsOrPsOrBrs[i].innerHTML);
        }

        // Trim leading spaces
        let text: string = ce.textContent!.replace(/^\s+/g, '');

        // Normalize spaces
        text = normalizeSpaces(text);

        return text;
    }

    /**
     * Return pings in format:
     * {
     *     id1: userFullname1,
     *     id2: userFullname2,
     *     ...
     * }
     */
    getPings(textarea: HTMLElement): Record<number, any> {
        const pings: Record<number, any> = {};
        const pingElements: NodeListOf<HTMLInputElement> = textarea.querySelectorAll('.ping');
        for (let i = 0; i < pingElements.length; i++) {
            const id: number = parseInt(pingElements[i].getAttribute('data-value')!);
            const value: string = pingElements[i].value;
            pings[id] = value.slice(1);
        }

        return pings;
    }

}
