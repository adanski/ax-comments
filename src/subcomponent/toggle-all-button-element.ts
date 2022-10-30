import {isNil} from '../util.js';
import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {findParentsBySelector} from '../html-util.js';

@RegisterCustomElement('ax-toggle-all-button')
export class ToggleAllButtonElement extends HTMLLIElement implements WebComponent {

    #options!: CommentsOptions;

    connectedCallback(): void {
        this.#initServices();
        this.#initElement()
    }

    #initServices(): void {
        const container: HTMLDivElement | null = findParentsBySelector<HTMLDivElement>(this, '#comments-container').first();
        if (!container) {
            throw new Error(`[ax-toggle-all-button] Commenting Field will not work outside ax-comments.`);
        }
        this.#options = OptionsProvider.get(container)!;
    }

    #initElement(): void {
        this.classList.add('toggle-all', 'highlight-font-bold');
        const toggleAllButtonText: HTMLSpanElement = document.createElement('span');
        toggleAllButtonText.classList.add('text');
        const caret: HTMLSpanElement = document.createElement('span');
        caret.classList.add('caret');

        // Append toggle button to DOM
        this.append(toggleAllButtonText, caret);
    }

    static updateToggleAllButton(parentEl: HTMLElement, options: CommentsOptions): void {
        // Don't hide replies if maxRepliesVisible is null or undefined
        if (isNil(options.maxRepliesVisible)) {
            return;
        }

        const childCommentsEl: HTMLElement = parentEl.querySelector('.child-comments')!;
        const childComments: HTMLElement[] = [...childCommentsEl.querySelectorAll<HTMLElement>('.comment:not(.hidden)')];
        let toggleAllButton: ToggleAllButtonElement | null = childCommentsEl.querySelector('ax-toggle-all-button.toggle-all');
        childComments.forEach(childComment => {
            childComment.classList.remove('togglable-reply');
        });

        let togglableReplies: HTMLElement[];
        // Select replies to be hidden
        if (options.maxRepliesVisible === 0) {
            togglableReplies = childComments;
        } else {
            togglableReplies = childComments.slice(0, -options.maxRepliesVisible);
        }

        const allRepliesExpanded: boolean = toggleAllButton?.querySelector('span.text')!.textContent === options.textFormatter(options.hideRepliesText);

        // Add identifying class for hidden replies so they can be toggled
        for (let i = 0; i < togglableReplies.length; i++) {
            togglableReplies[i].classList.add('togglable-reply');

            // Show all replies if replies are expanded
            if (allRepliesExpanded) {
                togglableReplies[i].classList.add('visible');
            }
        }

        if (childComments.length > options.maxRepliesVisible) { // Make sure that toggle all button is present
            // Append button to toggle all replies if necessary
            if (isNil(toggleAllButton)) {
                toggleAllButton = document.createElement('ax-toggle-all-button') as ToggleAllButtonElement;
                childCommentsEl.prepend(toggleAllButton);
            }

            // Update the text of toggle all -button
            toggleAllButton.setToggleAllButtonText(false);

        } else { // Make sure that toggle all button is not present
            toggleAllButton?.remove();
        }
    }

    setToggleAllButtonText(toggle?: boolean): void {
        const textContainer: HTMLElement = this.querySelector('span.text') as HTMLElement;
        const caret: HTMLElement = this.querySelector('.caret') as HTMLElement;

        const showExpandingText: () => void = () => {
            let text: string = this.#options.textFormatter(this.#options.viewAllRepliesText);
            const replyCount: number = this.parentElement!.querySelectorAll('.comment:not(.hidden)').length - 1;
            text = text.replace('__replyCount__', replyCount + '');
            textContainer.textContent = text;
        };

        const hideRepliesText: string = this.#options.textFormatter(this.#options.hideRepliesText);

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
