import {normalizeSpaces} from '../util.js';
import {CommentsOptions} from '../api.js';
import {CommentViewModelProvider, OptionsProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {findSiblingsBySelector, getHostContainer} from '../html-util.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {PingableUser, UserDisplayNamesById} from '../options/models.js';
import {CommentViewModel} from '../comment-view-model.js';

@RegisterCustomElement('ax-textarea', {extends: 'textarea'})
export class TextareaElement extends HTMLTextAreaElement implements WebComponent {

    parentId: string | null = null;
    existingCommentId: string | null = null;
    valueBeforeChange: string = '';

    readonly pingedUsers: PingableUser[] = [];
    readonly referencedHashtags: string[] = [];

    #options!: Required<CommentsOptions>;
    #commentViewModel!: CommentViewModel;

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    disconnectedCallback(): void {
        this.removeEventListener('keydown', this.#addOnKeydown);
        this.removeEventListener('input', this.#saveEditedValue);
        this.removeEventListener('input', this.#checkEditedValueForChange);
        this.removeEventListener('focusin', this.#increaseTextareaHeight);
        this.removeEventListener('change', this.#increaseTextareaHeight);
    }

    #initServices(): void {
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container)!;
        this.#commentViewModel = CommentViewModelProvider.get(container);
    }

    #initElement(): void {
        this.classList.add('textarea');
        this.placeholder = this.#options.textareaPlaceholderText;
        if (this.existingCommentId) {
            const existingComment = this.#commentViewModel.getComment(this.existingCommentId)!;
            this.value = existingComment.content;
        }

        // Setting the initial height for the textarea
        this.adjustTextareaHeight(false);

        this.addEventListener('keydown', this.#addOnKeydown);
        this.addEventListener('input', this.#saveEditedValue);
        this.addEventListener('input', this.#checkEditedValueForChange);
        this.addEventListener('focusin', this.#increaseTextareaHeight);
        this.addEventListener('change', this.#increaseTextareaHeight);
    }

    static create(options: Pick<TextareaElement, 'existingCommentId' | 'parentId' | 'onclick'>): TextareaElement {
        const textarea: TextareaElement = document.createElement('textarea', {is: 'ax-textarea'}) as TextareaElement;
        Object.assign(textarea, options);
        return textarea;
    }

    #addOnKeydown: (e: KeyboardEvent) => void = e => {
        // Save comment on cmd/ctrl + enter
        if (e.keyCode === 13) {
            const metaKey = e.metaKey || e.ctrlKey;
            if (this.#options.postCommentOnEnter || metaKey) {
                const el: HTMLElement = e.currentTarget as HTMLElement;
                findSiblingsBySelector(el, '.control-row').querySelector('.save')!.click();
                e.stopPropagation();
                e.preventDefault();
            }
        }
    };

    #saveEditedValue: (e: Event) => void = e => {
        const el: TextareaElement = e.currentTarget as TextareaElement;
        el.valueBeforeChange = el.value;
    };

    #checkEditedValueForChange: (e: Event) => void = e => {
        const el: TextareaElement = e.currentTarget as TextareaElement;

        if (el.valueBeforeChange !== el.value) {
            el.valueBeforeChange = el.value;
            el.dispatchEvent(new Event('change', {bubbles: true}))
        }
    };

    #increaseTextareaHeight: (e: Event) => void = e => {
        const textarea: TextareaElement = e.currentTarget as TextareaElement;
        textarea.adjustTextareaHeight(true);
        textarea.parentElement!.classList.toggle('textarea-scrollable', textarea.scrollHeight > textarea.clientHeight);
    };

    adjustTextareaHeight(focus?: boolean): void {
        let rowCount = focus ? this.#options.textareaRowsOnFocus : this.#options.textareaRows;
        this.rows = rowCount;
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
