import {CommentId, CommentModel} from '../options/models.js';
import {CommentModelEnriched} from './comment-model-enriched.js';

export interface CommentsById {

    readonly size: number;

    getComment(id: CommentId): CommentModelEnriched | undefined;

    setComment(comment: CommentModelEnriched): void;

    deleteComment(comment: CommentModel): boolean;

    getRootComments(): CommentModelEnriched[];

    getChildComments(parentId: CommentId): CommentModelEnriched[];

    merge(other: CommentsById): CommentsById;

}
