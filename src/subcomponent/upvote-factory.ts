import {CommentsOptions} from '../comments-options';
import {OptionsProvider} from '../provider';

export class UpvoteFactory {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    createUpvoteElement(commentModel: Record<string, any>): HTMLElement {
        // Upvote icon
        const upvoteIcon: HTMLElement = document.createElement('i');
        upvoteIcon.classList.add('fa', 'fa-thumbs-up');
        if (this.options.upvoteIconURL.length) {
            upvoteIcon.style.backgroundImage = `url("${this.options.upvoteIconURL}")`;
            upvoteIcon.classList.add('image');
        }

        // Upvotes
        const upvoteEl: HTMLButtonElement = document.createElement('button');
        upvoteEl.classList.add('action', 'upvote', commentModel.userHasUpvoted ? 'highlight-font' : '');
        const upvoteCount: HTMLSpanElement = document.createElement('span');
        upvoteCount.classList.add('upvote-count')
        upvoteCount.textContent = commentModel.upvoteCount;
        upvoteEl.append(upvoteCount, upvoteIcon);

        return upvoteEl;
    }
}
