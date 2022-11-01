import {isNil} from '../util.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {CommentContainerElement} from './comment-container-element.js';

@RegisterCustomElement('ax-comment')
export class CommentElement extends HTMLElement implements WebComponent {

    #commentModel!: Record<string, any>;
    #initialized: boolean = false;

    get commentModel(): Record<string, any> {
        return this.#commentModel;
    }

    set commentModel(newValue: Record<string, any>) {
        this.#commentModel = newValue;
    }

    static create(options: Pick<CommentElement, 'commentModel'>): CommentElement {
        const commentEl: CommentElement = document.createElement('ax-comment') as CommentElement;
        Object.assign(commentEl, options);
        return commentEl;
    }

    connectedCallback(): void {
        this.#initElement();
        this.#initialized = true;
    }

    #initElement(commentModel: Record<string, any> = this.#commentModel): void {
        // Comment container element
        const commentEl: HTMLLIElement = document.createElement('li');
        commentEl.classList.add('comment');
        commentEl.setAttribute('data-id', commentModel.id);
        this.setAttribute('data-id', commentModel.id);

        if (commentModel.createdByCurrentUser) {
            commentEl.classList.add('by-current-user');
        }
        if (commentModel.createdByAdmin) {
            commentEl.classList.add('by-admin');
        }

        // Child comments
        const childComments: HTMLUListElement = document.createElement('ul');
        childComments.classList.add('child-comments');

        // Comment container
        const commentContainer: CommentContainerElement = CommentContainerElement.create({commentModel: commentModel});

        commentEl.append(commentContainer);
        if (isNil(commentModel.parent)) {
            commentEl.append(childComments);
        }
        this.appendChild(commentEl);
    }

    reRenderUpvotes(): void {
        const commentContainer: CommentContainerElement = this.querySelector('ax-comment-container')!;
        commentContainer.reRenderUpvotes();
    }

    reRenderCommentActionBar(): void {
        const commentContainer: CommentContainerElement = this.querySelector('ax-comment-container')!;
        commentContainer.reRenderCommentActionBar();
    }

    reRenderCommentContainer(): void {
        // Comment container
        const commentContainer: CommentContainerElement = CommentContainerElement.create({commentModel: this.#commentModel});

        this.querySelector('ax-comment-container')!.replaceWith(commentContainer);
    }
}
