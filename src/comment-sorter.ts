import {CommentsOptions} from './api.js';
import {OptionsProvider} from './provider.js';

export class CommentSorter {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLElement) {
        this.options = OptionsProvider.get(container)!;
    }

    sortComments(comments: Record<string, any>[], sortKey: SortKey): void {
        if (sortKey === SortKey.POPULARITY) { // Sort by popularity
            comments.sort((commentA, commentB) => {
                let pointsOfA = commentA.childs.length;
                let pointsOfB = commentB.childs.length;

                if (this.options.enableUpvoting) {
                    pointsOfA += commentA.upvoteCount;
                    pointsOfB += commentB.upvoteCount;
                }

                if (pointsOfB != pointsOfA) {
                    return pointsOfB - pointsOfA;
                } else {
                    // Return newer if popularity is the same
                    const createdA = new Date(commentA.created).getTime();
                    const createdB = new Date(commentB.created).getTime();
                    return createdB - createdA;
                }
            });
        } else { // Sort by date
            comments.sort((commentA, commentB) => {
                const createdA = new Date(commentA.created).getTime();
                const createdB = new Date(commentB.created).getTime();
                if (sortKey == SortKey.OLDEST) {
                    return createdA - createdB;
                } else {
                    return createdB - createdA;
                }
            });
        }
    }
}

export enum SortKey {
    POPULARITY = 'popularity',
    OLDEST = 'oldest',
    NEWEST = 'newest',
    ATTACHMENTS = 'attachments'
}
