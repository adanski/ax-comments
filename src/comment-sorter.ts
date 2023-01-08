import {SortKey} from './api.js';
import {OptionsProvider} from './provider.js';
import {Functionalities} from './options/functionalities.js';
import {CommentModelEnriched} from './comments-by-id.js';

export class CommentSorter {

    readonly #options: Required<Functionalities>;

    constructor(container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
    }

    sortComments(comments: CommentModelEnriched[], sortKey: SortKey): CommentModelEnriched[] {
        return comments.sort(this.getSorter(sortKey));
    }

    getSorter(sortKey: SortKey): (a: CommentModelEnriched, b: CommentModelEnriched) => number {
        if (sortKey === SortKey.POPULARITY) { // Sort by popularity
            return (commentA, commentB) => {
                let pointsOfA = commentA.childIds?.length ?? 0;
                let pointsOfB = commentB.childIds?.length ?? 0;

                if (this.#options.enableUpvoting) {
                    pointsOfA += commentA.upvoteCount ?? 0;
                    pointsOfB += commentB.upvoteCount ?? 0;
                }

                if (pointsOfB != pointsOfA) {
                    return pointsOfB - pointsOfA;
                } else {
                    // Return newer if popularity is the same
                    const createdA = commentA.createdAt.getTime();
                    const createdB = commentB.createdAt.getTime();
                    return createdB - createdA;
                }
            };
        } else { // Sort by date
            return (commentA, commentB) => {
                const createdA = commentA.createdAt.getTime();
                const createdB = commentB.createdAt.getTime();
                if (sortKey == SortKey.OLDEST) {
                    return createdA - createdB;
                } else {
                    return createdB - createdA;
                }
            };
        }
    }
}
