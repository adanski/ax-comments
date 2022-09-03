import {isNil} from '../util';
import {CommentsOptions} from '../comments-options';
import {OptionsProvider} from '../provider';

export class ToggleAllButtonService {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    updateToggleAllButton(parentEl: HTMLElement): void {
        // Don't hide replies if maxRepliesVisible is null or undefined
        if (isNil(this.options.maxRepliesVisible)) {
            return;
        }

        const childCommentsEl: HTMLElement = parentEl.querySelector('.child-comments')!;
        const childComments: HTMLElement[] = [...childCommentsEl.querySelectorAll<HTMLElement>('.comment:not(.hidden)')];
        let toggleAllButton: HTMLElement | null = childCommentsEl.querySelector('li.toggle-all');
        childComments.forEach(childComment => {
            childComment.classList.remove('togglable-reply');
        });

        let togglableReplies: HTMLElement[];
        // Select replies to be hidden
        if (this.options.maxRepliesVisible === 0) {
            togglableReplies = childComments;
        } else {
            togglableReplies = childComments.slice(0, -this.options.maxRepliesVisible);
        }

        const allRepliesExpanded: boolean = toggleAllButton?.querySelector('span.text')!.textContent === this.options.textFormatter(this.options.hideRepliesText);

        // Add identifying class for hidden replies so they can be toggled
        for (let i = 0; i < togglableReplies.length; i++) {
            togglableReplies[i].classList.add('togglable-reply');

            // Show all replies if replies are expanded
            if (allRepliesExpanded) {
                togglableReplies[i].classList.add('visible');
            }
        }

        if (childComments.length > this.options.maxRepliesVisible) { // Make sure that toggle all button is present
            // Append button to toggle all replies if necessary
            if (isNil(toggleAllButton)) {
                toggleAllButton = this.createToggleAllButton();
                childCommentsEl.prepend(toggleAllButton);
            }

            // Update the text of toggle all -button
            this.setToggleAllButtonText(toggleAllButton!, false);

        } else { // Make sure that toggle all button is not present
            toggleAllButton?.remove();
        }
    }

    createToggleAllButton(): HTMLLIElement {
        const toggleAllButton: HTMLLIElement = document.createElement('li');
        toggleAllButton.classList.add('toggle-all', 'highlight-font-bold');
        const toggleAllButtonText: HTMLSpanElement = document.createElement('span');
        toggleAllButtonText.classList.add('text');
        const caret: HTMLSpanElement = document.createElement('span');
        caret.classList.add('caret');

        // Append toggle button to DOM
        toggleAllButton.append(toggleAllButtonText, caret);

        return toggleAllButton;
    }

    setToggleAllButtonText(toggleAllButton: HTMLElement, toggle?: boolean): void {
        const textContainer: HTMLElement = toggleAllButton.querySelector('span.text') as HTMLElement;
        const caret: HTMLElement = toggleAllButton.querySelector('.caret') as HTMLElement;

        const showExpandingText: () => void = () => {
            let text: string = this.options.textFormatter(this.options.viewAllRepliesText);
            const replyCount: number = toggleAllButton.parentElement!.querySelectorAll('.comment:not(.hidden)').length - 1;
            text = text.replace('__replyCount__', replyCount + '');
            textContainer.textContent = text;
        };

        const hideRepliesText: string = this.options.textFormatter(this.options.hideRepliesText);

        if (toggle) {
            // Toggle text
            if (textContainer.textContent === hideRepliesText) {
                showExpandingText();
            } else {
                textContainer.textContent = hideRepliesText;
            }
            // Toggle direction of the caret
            caret.classList.toggle('up');

        } else {
            // Update text if necessary
            if (textContainer.textContent !== hideRepliesText) {
                showExpandingText();
            }
        }
    }
}
