import {CommentModel, CommentId} from '../options/models.js';
import {CommentModelEnriched} from './comment-model-enriched.js';
import {isNil} from '../common/util.js';
import {Writeable} from '../common/writeable.js';
import {CommentsById} from './comments-by-id.js';
import {CommentsByIdFactory} from './comments-by-id-factory.js';

export class CommentTransformer {

    enrichMany(comments: CommentModel[]): CommentsById {
        const root: Map<CommentId, CommentModelEnriched> = new Map();
        const child: Map<CommentId, CommentModelEnriched> = new Map();
        const parentGetter: (parentId: CommentId) => CommentModelEnriched = parentId => child.get(parentId) ?? root.get(parentId)!;
        comments.sort(this.#getByCreationDateAscSorter()).forEach(c => {
            const enriched: CommentModelEnriched = this.enrich(c, parentGetter);
            if (enriched.parentId) {
                child.set(enriched.id, enriched);
            } else {
                root.set(enriched.id, enriched);
            }
        });

        return CommentsByIdFactory.from(root, child);
    }

    #getByCreationDateAscSorter(): (a: CommentModel, b: CommentModel) => number {
        return (a, b) => {
            const createdA = a.createdAt.getTime();
            const createdB = b.createdAt.getTime();
            return createdA - createdB;
        }
    }

    enrich(comment: CommentModel, parentGetter: (parentId: CommentId) => CommentModelEnriched): CommentModelEnriched {
        const commentModel: Writeable<CommentModelEnriched> = Object.assign({} as CommentModelEnriched, comment);
        if (isNil(commentModel.directChildIds)) {
            commentModel.directChildIds = [];
            commentModel.allChildIds = [];
            commentModel.hasAttachments = function () {
                return this.attachments?.length as number > 0;
            };
            commentModel.deplete = function <S extends Partial<CommentModel>>(mergeSource?: S) {
                const result: Writeable<Partial<CommentModelEnriched>> = Object.assign({}, this, mergeSource);
                delete result.directChildIds;
                delete result.allChildIds;
                delete result.hasAttachments;
                delete result.deplete;
                return result as CommentModel & S;
            };
        }

        if (!isNil(commentModel.parentId)) {
            parentGetter(commentModel.parentId).directChildIds.push(commentModel.id);
            this.#visitParents(commentModel, parentGetter, parent => this.#assignChildId(parent, commentModel.id));
        }

        return commentModel as CommentModelEnriched;
    }

    #visitParents(
        comment: CommentModelEnriched,
        parentGetter: (parentId: CommentId) => CommentModelEnriched,
        parentVisitor: (parent: CommentModelEnriched) => void
    ): void {
        let parentId: CommentId | undefined = comment.parentId;
        let parentComment: CommentModelEnriched;
        do {
            parentComment = parentGetter(parentId!);
            parentVisitor(parentComment);
            parentId = parentComment.parentId;
        } while (!isNil(parentId));
    }

    #assignChildId(parent: CommentModelEnriched, childId: CommentId): void {
        parent.allChildIds.push(childId);
    }
}
