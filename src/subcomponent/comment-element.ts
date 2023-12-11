import {isNil} from '../util.js';
import {CustomElement, defineCustomElement} from '../custom-element.js';
import {WebComponent} from '../web-component.js';
import {CommentContainerElement} from './comment-container-element.js';
import {CommentModelEnriched} from '../comments-by-id.js';

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
        this.classList.add('comment');
        this.id = `comment-${this.#commentModel.id}`;
        this.setAttribute('data-id', this.#commentModel.id);

        if (this.#commentModel.createdByCurrentUser) {
            this.classList.add('by-current-user');
        }
        if (this.#commentModel.createdByAdmin) {
            this.classList.add('by-admin');
        }

        // Child comments
        const childComments: HTMLUListElement = document.createElement('ul');
        childComments.classList.add('child-comments');

        // Comment container
        const commentContainer: CommentContainerElement = CommentContainerElement.create({commentModel: this.#commentModel});

        this.append(commentContainer);
        if (isNil(this.#commentModel.parentId)) {
            this.append(childComments);
        }
    }

    reRenderCommentActionBar(): void {
        const commentContainer: CommentContainerElement = this.querySelector('ax-comment-container')!;
        commentContainer.reRenderCommentActionBar();
    }
}

defineCustomElement(CommentElement, 'ax-comment', {extends: 'li'});
