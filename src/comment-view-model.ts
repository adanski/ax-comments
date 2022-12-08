import {CommentsById, CommentModelEnriched} from './comments-by-id.js';
import {isNil} from './util.js';
import EventEmitter from 'EventEmitter3';
import {CommentModel} from './options/models.js';

export class CommentViewModel {

    readonly #commentsById: CommentsById;
    readonly #eventEmitter: EventEmitter<CommentViewModelEvent, CommentId>;

    constructor(commentsById: CommentsById) {
        this.#commentsById = commentsById;
        this.#eventEmitter = new EventEmitter();
    }

    initComments(comments: CommentModelEnriched[]): void {
        if (Object.keys(this.#commentsById).length) {
            console.warn(`[CommentViewModel] View model already initialized`);
            return;
        }
        comments.forEach(c => this.#commentsById[c.id] = c);
    }

    getComment(id: CommentId): CommentModelEnriched | undefined {
        return this.#commentsById[id];
    }

    getComments(sorter?: (a: CommentModelEnriched, b: CommentModelEnriched) => number): CommentModelEnriched[] {
        const comments: CommentModelEnriched[] = Object.keys(this.#commentsById).map(id => this.#commentsById[id]);
        return sorter ? comments.sort(sorter) : comments;
    }

    getRootComments(sorter?: (a: CommentModelEnriched, b: CommentModelEnriched) => number): CommentModelEnriched[] {
        const comments: CommentModelEnriched[] = this.getComments().filter(comment => !comment.parentId);
        return sorter ? comments.sort(sorter) : comments;
    }

    getChildComments(parentId: CommentId, sorter?: (a: CommentModelEnriched, b: CommentModelEnriched) => number): CommentModelEnriched[] {
        const parent: CommentModelEnriched = this.#commentsById[parentId];
        const children: CommentModelEnriched[] = parent.childIds.map(childId => this.#commentsById[childId]);
        return sorter ? children.sort(sorter) : children;
    }

    getAttachments(): CommentModelEnriched[] {
        return this.getComments().filter(comment => comment.hasAttachments());
    }

    getOutermostParent(directParentId: CommentId): CommentModelEnriched {
        let parentId: string | undefined = directParentId;
        let parentComment: CommentModelEnriched;
        do {
            parentComment = this.#commentsById[parentId!];
            parentId = parentComment.parentId;
        } while (!isNil(parentComment.parentId));
        return parentComment;
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

    addComment(comment: CommentModelEnriched): void {
        if (this.#commentsById[comment.id]) return;
        this.#commentsById[comment.id] = comment;
        if (comment.parentId) {
            this.#commentsById[comment.parentId].childIds.push(comment.id);
        }
        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_ADDED, comment.id);
    }

    updateComment(comment: CommentModel): void {
        const existingComment: CommentModelEnriched = this.#commentsById[comment.id];
        if (!existingComment) return;

        Object.assign<CommentModel, Partial<CommentModel>>(comment, {
            id: existingComment.id,
            parentId: existingComment.parentId,
            createdAt: existingComment.createdAt,
            creatorUserId: existingComment.creatorUserId,
            creatorDisplayName: existingComment.creatorDisplayName
        });
        Object.assign(existingComment, comment);
        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_UPDATED, comment.id);
    }

    deleteComment(commentId: CommentId): void {
        const existingComment: CommentModelEnriched = this.#commentsById[commentId];
        if (!existingComment) return;

        delete this.#commentsById[commentId];

        this.#eventEmitter.emit(CommentViewModelEvent.COMMENT_DELETED, commentId);
    }
}

export enum CommentViewModelEvent {
    COMMENT_ADDED = 'COMMENT_ADDED',
    COMMENT_UPDATED = 'COMMENT_UPDATED',
    COMMENT_DELETED = 'COMMENT_DELETED',
}

export interface CommentViewModelEventSubscription {
    unsubscribe(): void;
}

type CommentId = string;
