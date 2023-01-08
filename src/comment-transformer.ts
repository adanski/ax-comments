import {CommentModel} from './api.js';
import {CommentId, CommentModelEnriched} from './comments-by-id.js';
import {isNil} from './util.js';

export class CommentTransformer {

    constructor(container: HTMLElement) {
    }

    deplete(comment: CommentModelEnriched): CommentModel {
        const result: Partial<CommentModelEnriched> = Object.assign({}, comment);
        delete result.childIds;
        delete result.hasAttachments;
        return result as CommentModel;
    }

    enrichMany(comments: CommentModel[]): CommentModelEnriched[] {
        const commentsById: Record<CommentId, CommentModelEnriched> = {};
        const rootCommentsById: Record<CommentId, CommentModelEnriched> = {};
        const childCommentsById: Record<CommentId, CommentModelEnriched> = {};
        comments.forEach(c => {
            const enriched: CommentModelEnriched = this.enrich(c);
            commentsById[enriched.id] = enriched;
            if (enriched.parentId) {
                childCommentsById[enriched.id] = enriched;
            } else {
                rootCommentsById[enriched.id] = enriched;
            }
        });

        Object.values(childCommentsById).forEach(c => {
            this.#getOutermostParent(c.parentId!, commentsById).childIds.push(c.id);
            if (!commentsById[c.parentId!].childIds.includes(c.id)) {
                commentsById[c.parentId!].childIds.push(c.id);
            }
        });
        return Object.values(commentsById);
    }

    enrich(comment: CommentModel): CommentModelEnriched {
        const commentModel: CommentModelEnriched = Object.assign({} as CommentModelEnriched, comment);
        if (isNil(commentModel.childIds)) {
            commentModel.childIds = [];
            commentModel.hasAttachments = function () {
                return this.attachments?.length as number > 0
            };
        }

        return commentModel as CommentModelEnriched;
    }

    #getOutermostParent(directParentId: CommentId, commentsById: Record<CommentId, CommentModelEnriched>): CommentModelEnriched {
        let parentId: CommentId | undefined = directParentId;
        let parentComment: CommentModelEnriched;
        do {
            parentComment = commentsById[parentId!];
            parentId = parentComment.parentId;
        } while (!isNil(parentId));
        return parentComment;
    }
}
