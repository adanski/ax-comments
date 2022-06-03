import {CommentWrapperFactory} from './comment-wrapper-factory';
import $ from 'cash-dom';
import {isNil} from '../util';
import {CommentsOptions} from '../comments-options';
import {OptionsProvider, ServiceProvider} from '../provider';

export class CommentFactory {

    private readonly options: CommentsOptions;
    private readonly commentWrapperFactory: CommentWrapperFactory;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.commentWrapperFactory = ServiceProvider.get(container, CommentWrapperFactory);
    }

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
