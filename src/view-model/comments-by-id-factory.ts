import {CommentId, CommentModel} from '../options/models.js';
import {CommentModelEnriched} from './comment-model-enriched.js';
import {CommentsById} from './comments-by-id.js';

export class CommentsByIdFactory {
    static empty(): CommentsById {
        return new EmptyCommentsById();
    }

    static from(root: Map<CommentId, CommentModelEnriched>, child: Map<CommentId, CommentModelEnriched>): CommentsById {
        return new MapBasedCommentsById(root, child);
    }
}

class MapBasedCommentsById implements CommentsById {

    readonly #root: Map<CommentId, CommentModelEnriched>;
    readonly #child: Map<CommentId, CommentModelEnriched>;

    constructor(root: Map<CommentId, CommentModelEnriched>, child: Map<CommentId, CommentModelEnriched>) {
        this.#root = root;
        this.#child = child;
    }

    get size(): number {
        return this.#root.size + this.#child.size;
    }

    getComment(id: CommentId): CommentModelEnriched | undefined {
        return this.#child.get(id) ?? this.#root.get(id)!;
    }

    setComment(comment: CommentModelEnriched): void {
        if (comment.parentId) {
            this.#child.set(comment.id, comment);
        } else {
            this.#root.set(comment.id, comment);
        }
    }

    deleteComment(comment: CommentModel): boolean {
        if (comment.parentId) {
            return this.#child.delete(comment.id);
        } else {
            return this.#root.delete(comment.id);
        }
    }

    getRootComments(): CommentModelEnriched[] {
        return [...this.#root.values()];
    }

    getChildComments(parentId: CommentId): CommentModelEnriched[] {
        const parent: CommentModelEnriched = this.getComment(parentId)!;
        const children: CommentModelEnriched[] = parent.allChildIds.map(childId => this.getComment(childId)!);
        return children;
    }

    merge(other: CommentsById): CommentsById {
        if (other instanceof MapBasedCommentsById) {
            return new MapBasedCommentsById(
                new Map([...this.#root, ...other.#root]),
                new Map([...this.#child, ...other.#child])
            );
        } else {
            const rootComments: CommentModelEnriched[] = other.getRootComments();
            const childComments: CommentModelEnriched[] = rootComments.flatMap(c => other.getChildComments(c.id));
            const root: Map<CommentId, CommentModelEnriched> = new Map();
            const child: Map<CommentId, CommentModelEnriched> = new Map();
            rootComments.forEach(c => root.set(c.id, c));
            childComments.forEach(c => child.set(c.id, c));

            return new MapBasedCommentsById(root, child);
        }

    }

}

class EmptyCommentsById implements CommentsById {

    readonly size: number = 0;

    getComment(): CommentModelEnriched | undefined {
        throw new Error(`'getComment' not supported by '${this.constructor.name}'`);
    }

    setComment(): void {
        throw new Error(`'setComment' not supported by '${this.constructor.name}'`);
    }

    deleteComment(): boolean {
        throw new Error(`'deleteComment' not supported by '${this.constructor.name}'`);
    }

    getChildComments(): CommentModelEnriched[] {
        throw new Error(`'getChildComments' not supported by '${this.constructor.name}'`);
    }

    getRootComments(): CommentModelEnriched[] {
        throw new Error(`'getRootComments' not supported by '${this.constructor.name}'`);
    }

    merge(other: CommentsById): CommentsById {
        return other;
    }

}
