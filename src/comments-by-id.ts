import {CommentModel} from './options/models.js';

export interface CommentsById {
    [id: CommentId]: CommentModelEnriched;
}

export type CommentId = string;

export interface CommentModelEnriched extends CommentModel {
    childIds: CommentId[];
    hasAttachments(): boolean;
}
