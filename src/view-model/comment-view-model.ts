import {CommentModelEnriched} from './comment-model-enriched.js';
import {CommentModel, CommentId} from '../options/models.js';
import {EventEmitter} from 'eventemitter3';
import {CommentsById} from './comments-by-id.js';
import {CommentsByIdFactory} from './comments-by-id-factory.js';
import {CommentTransformer} from './comment-transformer.js';

export class CommentViewModel {

    readonly #eventEmitter: EventEmitter<CommentViewModelEvent, CommentId> = new EventEmitter();
    readonly #commentTransformer: CommentTransformer = new CommentTransformer();
    #commentsById: CommentsById = CommentsByIdFactory.empty();

    initComments(comments: CommentModel[]): void {
        if (this.#commentsById?.size) {
            console.warn(`[CommentViewModel] View model already initialized`);
            return;
        }
        // Convert comments to enriched data model
        const commentsById: CommentsById = this.#commentTransformer.enrichMany(comments);
        this.#commentsById = this.#commentsById.merge(commentsById);
    }

    get size(): number {
        return this.#commentsById.size;
    }

    getComment(id: CommentId): CommentModelEnriched | undefined {
        return this.#commentsById.getComment(id);
    }

    getRootComments(sorter?: (a: CommentModelEnriched, b: CommentModelEnriched) => number): CommentModelEnriched[] {
        const comments: CommentModelEnriched[] = this.#commentsById.getRootComments();
        return sorter ? comments.sort(sorter) : comments;
    }

    getChildComments(parentId: CommentId, sorter?: (a: CommentModelEnriched, b: CommentModelEnriched) => number): CommentModelEnriched[] {
        const children: CommentModelEnriched[] = this.#commentsById.getChildComments(parentId);
        return sorter ? children.sort(sorter) : children;
    }

    subscribe(type: CommentViewModelEvent, listener: (commentId: CommentId) => void): CommentViewModelEventSubscription {
        this.#eventEmitter.addListener(type, listener);
        return {
            unsubscribe: () => this.unsubscribe(type, listener)
        };
    }

    unsubscribe(type: CommentViewModelEvent, listener: (commentId: CommentId) => void): void {
        this.#eventEmitter.removeListener(type, listener);
    }

    unsubscribeAll(type?: CommentViewModelEvent): void {
        this.#eventEmitter.removeAllListeners(type);
    }

    addComment(comment: CommentModel): CommentModelEnriched {
        if (this.getComment(comment.id)) throw new Error(`Comment with id=${comment.id} already exists`);
        const commentEnriched: CommentModelEnriched = this.#commentTransformer.enrich(comment, parentId => this.getComment(parentId)!);
        this.#commentsById.setComment(commentEnriched);
        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_ADDED, comment.id);
        return commentEnriched;
    }

    updateComment(comment: CommentModel): CommentModelEnriched {
        const existingComment: CommentModelEnriched | undefined = this.getComment(comment.id);
        if (!existingComment) throw new Error(`Comment with id=${comment.id} does not exist`);

        Object.assign<CommentModel, Partial<CommentModel>>(comment, {
            id: existingComment.id,
            parentId: existingComment.parentId,
            createdAt: existingComment.createdAt,
            creatorUserId: existingComment.creatorUserId,
            creatorDisplayName: existingComment.creatorDisplayName
        });
        Object.assign(existingComment, comment);
        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_UPDATED, comment.id);
        return existingComment;
    }

    upvoteComment(comment: CommentModel): CommentModelEnriched {
        const existingComment: CommentModelEnriched | undefined = this.getComment(comment.id);
        if (!existingComment) throw new Error(`Comment with id=${comment.id} does not exist`);

        Object.assign<CommentModelEnriched, Partial<CommentModel>>(existingComment, {
            upvoteCount: comment.upvoteCount,
            upvotedByCurrentUser: comment.upvotedByCurrentUser
        });
        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_UPVOTED, comment.id);
        return existingComment;
    }

    deleteComment(comment: CommentModel): void {
        const existingComment: CommentModelEnriched | undefined = this.getComment(comment.id);
        if (!existingComment) return;

        this.#commentsById.deleteComment(existingComment);

        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_DELETED, comment.id);
    }
}

export enum CommentViewModelEvent {
    COMMENT_ADDED = 'COMMENT_ADDED',
    COMMENT_UPDATED = 'COMMENT_UPDATED',
    COMMENT_UPVOTED = 'COMMENT_UPVOTED',
    COMMENT_DELETED = 'COMMENT_DELETED',
}

export interface CommentViewModelEventSubscription {
    unsubscribe(): void;
}
