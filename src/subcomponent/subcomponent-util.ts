import {isNil, normalizeSpaces} from '../util';
import $ from 'cash-dom';
import {SpinnerFactory} from './spinner-factory.util';

export class SubcomponentUtil {
    private readonly spinnerFactory: SpinnerFactory = new SpinnerFactory(this.options);

    constructor(
        private readonly options: Record<string, any>,
        private readonly commentsById: Record<string, Record<string, any>>
    ) {
    }

    getComments(): Record<string, any>[] {
        return Object.keys(this.commentsById).map(id => this.commentsById[id]);
    }

    getChildComments(parentId: string): Record<string, any>[] {
        return this.getComments().filter(comment => comment.parent === parentId);
    }

    getAttachments(): Record<string, any>[] {
        return this.getComments().filter(comment => comment.hasAttachments());
    }

    getOutermostParent(directParentId: string) {
        let parentId = directParentId;
        let parentComment;
        do {
            parentComment = this.commentsById[parentId];
            parentId = parentComment.parent;
        } while (!isNil(parentComment.parent));
        return parentComment;
    }

    createCommentJSON(commentingField: HTMLElement): Record<string, any> {
        const textarea: HTMLElement = commentingField.querySelector('.textarea') as HTMLElement;
        const time: string = new Date().toISOString();

        const commentJSON = {
            id: 'c' + (this.getComments().length + 1),   // Temporary id
            parent: textarea.getAttribute('data-parent') || null,
            created: time,
            modified: time,
            content: this.getTextareaContent(textarea),
            pings: this.getPings(textarea),
            fullname: this.options.textFormatter(this.options.youText),
            profilePictureURL: this.options.profilePictureURL,
            createdByCurrentUser: true,
            upvoteCount: 0,
            userHasUpvoted: false,
            attachments: this.getAttachmentsFromCommentingField(commentingField)
        };
        return commentJSON;
    }

    setToggleAllButtonText(toggleAllButton: HTMLElement, toggle?: boolean): void {
        const textContainer: HTMLElement = toggleAllButton.querySelector('span.text') as HTMLElement;
        const caret: HTMLElement = toggleAllButton.querySelector('.caret') as HTMLElement;

        const showExpandingText: () => void = () => {
            let text: string = this.options.textFormatter(this.options.viewAllRepliesText);
            const replyCount: number = toggleAllButton.parentElement!.querySelectorAll('.comment:not(.hidden)').length - 1;
            text = text.replace('__replyCount__', replyCount + '');
            textContainer.textContent = text;
        };

        const hideRepliesText: string = this.options.textFormatter(this.options.hideRepliesText);

        if (toggle) {
            // Toggle text
            if (textContainer.textContent === hideRepliesText) {
                showExpandingText();
            } else {
                textContainer.textContent = hideRepliesText;
            }
            // Toggle direction of the caret
            caret.classList.toggle('up');

        } else {
            // Update text if necessary
            if (textContainer.textContent !== hideRepliesText) {
                showExpandingText();
            }
        }
    }

    setButtonState(button: HTMLElement, enabled: boolean, loading: boolean): void {
        if (enabled) {
            !button.classList.contains('enabled') && button.classList.add('enabled');
        } else {
            button.classList.contains('enabled') && button.classList.remove('enabled');
        }

        if (loading) {
            button.innerHTML = '';
            button.append(this.spinnerFactory.createSpinner(true));
        } else {
            button.innerHTML = $(button).data('original-content');
        }
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
        textarea.dispatchEvent(new Event('input'))
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

    getAttachmentsFromCommentingField(commentingField: HTMLElement): any[] {
        const attachmentElements: NodeListOf<HTMLAnchorElement> = commentingField.querySelectorAll('.attachments .attachment');
        const attachments: any[] = [];
        for (let i = 0; i < attachmentElements.length; i++) {
            attachments[i] = $(attachmentElements[i]).data();
        }

        return attachments;
    }

    moveCursorToEnd(el: HTMLElement) {
        // Trigger input to adjust size
        el.dispatchEvent(new Event('input'));

        // Scroll to bottom
        el.scrollTop = el.scrollHeight;

        // Move cursor to end
        const range: Range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel: Selection = getSelection() as Selection;
        sel.removeAllRanges();
        sel.addRange(range);

        // Focus
        el.focus();
    }

    ensureElementStaysVisible(el: HTMLElement): void {
        const scrollContainer: HTMLElement = this.options.scrollContainer;
        const maxScrollTop: number = el.offsetTop;
        const minScrollTop: number = el.offsetTop + el.offsetHeight - scrollContainer.offsetHeight;

        if (scrollContainer.scrollTop > maxScrollTop) { // Case: element hidden above scoll area
            scrollContainer.scrollTop = maxScrollTop;
        } else if (scrollContainer.scrollTop < minScrollTop) { // Case: element hidden below scoll area
            scrollContainer.scrollTop = minScrollTop;
        }

    }
}
