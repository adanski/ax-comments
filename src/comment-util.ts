import {CommentsOptions} from './api.js';
import {CommentsById} from './comments-by-id.js';
import {SpinnerFactory} from './subcomponent/spinner-factory.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from './provider.js';
import {isNil} from './util.js';
import {findParentsBySelector} from './html-util.js';

export class CommentUtil {

    private readonly options: CommentsOptions;
    private readonly commentsById: CommentsById;
    private readonly spinnerFactory: SpinnerFactory;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.commentsById = CommentsProvider.get(container)!;
        this.spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
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

    removeComment(commentId: string, onCommentRemoved: (parentEl: HTMLElement) => void): void {
        const commentModel = this.commentsById[commentId];

        // Remove child comments recursively
        const childComments: Record<string, any>[] = this.getChildComments(commentModel.id);
        childComments.forEach(childComment => {
            this.removeComment(childComment.id, onCommentRemoved);
        });

        // Update the child array of outermost parent
        if (commentModel.parent) {
            const outermostParent = this.getOutermostParent(commentModel.parent);
            const indexToRemove = outermostParent.childs.indexOf(commentModel.id);
            outermostParent.childs.splice(indexToRemove, 1);
        }

        // Remove the comment from data model
        delete this.commentsById[commentId];

        const commentElement: HTMLElement = this.container.querySelector(`li.comment[data-id="${commentId}"]`)!;
        const commentParents = findParentsBySelector(commentElement, 'li.comment');
        const parentEl: HTMLElement = findParentsBySelector(commentElement, 'li.comment').last()!;

        // Remove the element
        commentElement.remove();

        // Execute callback
        onCommentRemoved(parentEl);
    }
}
