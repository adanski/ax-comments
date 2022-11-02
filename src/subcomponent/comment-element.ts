import {isNil} from '../util.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {CommentContainerElement} from './comment-container-element.js';

@RegisterCustomElement('ax-comment', {extends: 'li'})
export class CommentElement extends HTMLLIElement implements WebComponent {

    #commentModel!: Record<string, any>;
    #initialized: boolean = false;

    get commentModel(): Record<string, any> {
        return this.#commentModel;
    }

    set commentModel(newValue: Record<string, any>) {
        this.#commentModel = newValue;
    }

    static create(options: Pick<CommentElement, 'commentModel'>): CommentElement {
        const commentEl: CommentElement = document.createElement('li', {is: 'ax-comment'}) as CommentElement;
        Object.assign(commentEl, options);
        return commentEl;
    }

    connectedCallback(): void {
        this.#initElement();
        this.#initialized = true;
    }

    #initElement(commentModel: Record<string, any> = this.#commentModel): void {
        this.classList.add('comment');
        this.setAttribute('data-id', commentModel.id);

        if (commentModel.createdByCurrentUser) {
            this.classList.add('by-current-user');
        }
        if (commentModel.createdByAdmin) {
            this.classList.add('by-admin');
        }

        // Child comments
        const childComments: HTMLUListElement = document.createElement('ul');
        childComments.classList.add('child-comments');

        // Comment container
        const commentContainer: CommentContainerElement = CommentContainerElement.create({commentModel: commentModel});

        this.append(commentContainer);
        if (isNil(commentModel.parent)) {
            this.append(childComments);
        }
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
