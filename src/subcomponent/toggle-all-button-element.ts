import {isNil} from '../util.js';
import {OptionsProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {findSiblingsBySelector, getHostContainer} from '../html-util.js';
import {Labels} from '../options/labels.js';
import {Misc} from '../options/misc.js';

@RegisterCustomElement('ax-toggle-all-button', {extends: 'li'})
export class ToggleAllButtonElement extends HTMLLIElement implements WebComponent {

    #options!: Required<Labels & Misc>;

    connectedCallback(): void {
        this.#initServices();
        this.#initElement()
    }

    #initServices(): void {
        if (this.#options) return;
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container)!;
    }

    #initElement(): void {
        this.innerHTML = '';
        const button: HTMLButtonElement = document.createElement('button');
        button.classList.add('toggle-all', 'highlight-font-bold');
        const toggleAllButtonText: HTMLSpanElement = document.createElement('span');
        toggleAllButtonText.classList.add('text');
        const caret: HTMLSpanElement = document.createElement('span');
        caret.classList.add('caret');

        button.append(toggleAllButtonText, caret);
        this.onclick = this.#toggleReplies;
        this.append(button);
        this.#setToggleAllButtonText(false);
    }

    private static create(): ToggleAllButtonElement {
        return document.createElement('li', {is: 'ax-toggle-all-button'}) as ToggleAllButtonElement;
    }

    static updateToggleAllButton(parentEl: HTMLElement, options: Required<Labels & Misc>): void {
        // Don't hide replies if maxRepliesVisible is false
        if (options.maxRepliesVisible === false) {
            return;
        }

        const childCommentsEl: HTMLElement = parentEl.querySelector('.child-comments')!;
        const childComments: HTMLElement[] = [...childCommentsEl.querySelectorAll<HTMLElement>('.comment:not(.hidden)')];
        let toggleAllButton: ToggleAllButtonElement | null = childCommentsEl.querySelector('button.toggle-all')
            ?.parentElement as ToggleAllButtonElement;
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

        const allRepliesExpanded: boolean = toggleAllButton?.querySelector('span.text')!.textContent === options.hideRepliesText;

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
                toggleAllButton = ToggleAllButtonElement.create();
                childCommentsEl.prepend(toggleAllButton);
            }

            // Update the text of toggle all button
            toggleAllButton.#setToggleAllButtonText(false);

        } else { // Make sure that toggle all button is not present
            toggleAllButton?.remove();
        }
    }

    #toggleReplies: (e: UIEvent) => void = e => {
        const toggleAllButton: ToggleAllButtonElement = e.currentTarget as ToggleAllButtonElement;
        findSiblingsBySelector(toggleAllButton, '.togglable-reply')
            .forEach((togglableReply: HTMLElement) => togglableReply.classList.toggle('visible'));
        toggleAllButton.#setToggleAllButtonText(true);
    };

    #setToggleAllButtonText(toggle?: boolean): void {
        const textContainer: HTMLElement = this.querySelector('span.text') as HTMLElement;
        const caret: HTMLElement = this.querySelector('.caret') as HTMLElement;

        const showExpandingText: () => void = () => {
            let text: string = this.#options.viewAllRepliesText;
            const replyCount: number = this.parentElement!.querySelectorAll('.comment:not(.hidden)').length - 1;
            text = text.replace('__replyCount__', replyCount + '');
            textContainer.textContent = text;
        };

        const hideRepliesText: string = this.#options.hideRepliesText;

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
