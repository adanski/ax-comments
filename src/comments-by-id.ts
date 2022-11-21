import {CommentModel} from './options/models.js';

export interface CommentsById {
    [id: string]: CommentModelEnriched;
}

export interface CommentModelEnriched extends CommentModel {
    childIds: string[];
    hasAttachments(): boolean;
}
