import {CommentModel} from './api.js';
import {CommentModelEnriched} from './comments-by-id.js';
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

    enrich(comments: CommentModel[]): CommentModelEnriched[] {
        const rootCommentsById: Record<string, CommentModelEnriched> = comments.filter(c => isNil(c.parentId))
            .reduce<Record<string, CommentModelEnriched>>((acc, c) => {
                acc[c.id] = this.enrichOne(c);
                return acc;
            }, {});

        comments.forEach(c => {
            c = this.enrichOne(c);
            if (c.parentId) rootCommentsById[c.parentId].childIds.push(c.id);
        });
        return comments as CommentModelEnriched[];
    }

    enrichOne(comment: CommentModel): CommentModelEnriched {
        const commentModel: CommentModelEnriched = Object.assign({} as CommentModelEnriched, comment);
        if (isNil(commentModel.childIds)) {
            commentModel.childIds = [];
            commentModel.hasAttachments = function () {
                return this.attachments?.length as number > 0
            };
        }

        return commentModel as CommentModelEnriched;
    }
}
