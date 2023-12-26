import {CustomElement, defineCustomElement} from '../../common/custom-element.js';
import {WebComponent} from '../../common/web-component.js';
import {CommentContentElement} from './comment-content-element.js';
import {CommentModelEnriched} from '../../view-model/comment-model-enriched.js';

//@CustomElement('ax-comment', {extends: 'li'})
export class CommentElement extends HTMLLIElement implements WebComponent {

    #commentModel!: CommentModelEnriched;
    #initialized: boolean = false;

    get commentModel(): CommentModelEnriched {
        return this.#commentModel;
    }

    set commentModel(newValue: CommentModelEnriched) {
        this.#commentModel = newValue;
    }

    static create(options: Pick<CommentElement, 'commentModel'>): CommentElement {
        const commentEl: CommentElement = document.createElement('li', {is: 'ax-comment'}) as CommentElement;
        Object.assign(commentEl, options);
        return commentEl;
    }

    connectedCallback(): void {
        if (this.#initialized) return;

        this.#initElement();
        this.#initialized = true;
    }

    #initElement(): void {
        this.classList.add('comment', 'visible');
        this.id = `comment-${this.#commentModel.id}`;
        this.setAttribute('data-id', this.#commentModel.id);

        if (this.#commentModel.createdByCurrentUser) {
            this.classList.add('by-current-user');
        }
        if (this.#commentModel.createdByAdmin) {
            this.classList.add('by-admin');
        }

        // Comment container
        const commentContainer: CommentContentElement = CommentContentElement.create({commentModel: this.#commentModel});

        this.prepend(commentContainer);
    }

    reRenderCommentActionBar(): void {
        const commentContainer: CommentContentElement = this.querySelector('ax-comment-content')!;
        commentContainer.reRenderCommentActionBar();
    }
}

defineCustomElement(CommentElement, 'ax-comment', {extends: 'li'});
