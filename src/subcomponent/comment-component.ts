import $ from 'cash-dom';
import {isNil} from '../util';
import {RegisterCustomElement} from '../register-custom-element';
import {WebComponent} from '../web-component';
import {CommentContainerComponent} from './comment-container-component';

@RegisterCustomElement('ax-comment')
export class CommentComponent extends HTMLElement implements WebComponent {

    #commentModel!: Record<string, any>;
    #initialized: boolean = false;

    get commentModel(): Record<string, any> {
        return this.#commentModel;
    }

    set commentModel(newValue: Record<string, any>) {
        this.#commentModel = newValue;
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

        $(commentEl).data('model', commentModel);

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
        const commentContainer: CommentContainerComponent = document.createElement('ax-comment-container') as CommentContainerComponent;
        commentContainer.commentModel = commentModel;

        commentEl.append(commentContainer);
        if (isNil(commentModel.parent)) {
            commentEl.append(childComments);
        }
        this.appendChild(commentEl);
    }

    reRenderUpvotes(): void {
        const commentContainer: CommentContainerComponent = this.querySelector('ax-comment-container')!;
        commentContainer.reRenderUpvotes();
    }

    reRenderCommentActionBar(): void {
        const commentContainer: CommentContainerComponent = this.querySelector('ax-comment-container')!;
        commentContainer.reRenderCommentActionBar();
    }

    reRenderCommentContainer(): void {
        // Comment container
        const commentContainer: CommentContainerComponent = document.createElement('ax-comment-container') as CommentContainerComponent;
        commentContainer.commentModel = this.#commentModel;

        this.querySelector('ax-comment-container')!.replaceWith(commentContainer);
    }
}
