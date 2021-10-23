import {CommentWrapperFactory} from './comment-wrapper-factory';
import $ from 'cash-dom';
import {isNil} from '../util';

export class CommentFactory {

    private readonly commentWrapperFactory: CommentWrapperFactory = new CommentWrapperFactory(this.options, this.commentsById);

    constructor(
        private readonly options: Record<string, any>,
        private readonly commentsById: Record<string, Record<string, any>>
    ) {}

    createCommentElement(commentModel: Record<string, any>): HTMLElement {

        // Comment container element
        const commentEl: HTMLLIElement = document.createElement('li');
        commentEl.classList.add('comment');
        commentEl.setAttribute('data-id', commentModel.id);

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

        // Comment wrapper
        const commentWrapper: HTMLElement = this.commentWrapperFactory.createCommentWrapperElement(commentModel);

        commentEl.append(commentWrapper);
        if (isNil(commentModel.parent)) {
            commentEl.append(childComments);
        }
        return commentEl;
    }
}
