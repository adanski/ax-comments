import {OptionsProvider} from '../../common/provider.js';
import {WebComponent} from '../../common/web-component.js';
import {CustomElement, defineCustomElement} from '../../common/custom-element.js';
import {findSiblingsBySelector, getHostContainer} from '../../common/html-util.js';
import {Labels} from '../../options/labels.js';
import {Misc} from '../../options/misc.js';

//@CustomElement('ax-toggle-all-button', {extends: 'li'})
export class ToggleAllButtonElement extends HTMLLIElement implements WebComponent {

    #options!: Required<Labels & Misc>;

    constructor() {
        super();
        this.innerHTML = `
            <button class="toggle-all highlight-font-bold">
                <span class="text"></span>
                <span class="caret"></span>
            </button>
        `;
    }

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
        this.onclick = this.#toggleReplies;
        this.#setToggleAllButtonText(false);
    }

    private static create(): ToggleAllButtonElement {
        return document.createElement('li', {is: 'ax-toggle-all-button'}) as ToggleAllButtonElement;
    }

    static prependToggleAllButton(parentEl: HTMLElement, options: Required<Labels & Misc>): void {
        // Don't hide replies if maxRepliesVisible is false
        if (options.maxRepliesVisible === false) {
            return;
        }

        const childUnorderedList: HTMLUListElement = parentEl.querySelector('.child-comments')!;
        const childComments: HTMLLIElement[] = [...childUnorderedList.querySelectorAll<HTMLLIElement>('.comment:not(.hidden)')];
        let toggleAllButton: ToggleAllButtonElement | undefined = ToggleAllButtonElement.#getToggleAllButton(childUnorderedList);

        if (toggleAllButton || childComments.length <= options.maxRepliesVisible) return;

        let togglableReplies: HTMLElement[];
        // Select replies to be hidden
        if (options.maxRepliesVisible === 0) {
            togglableReplies = childComments;
        } else {
            togglableReplies = childComments.slice(0, -options.maxRepliesVisible);
        }

        if (!togglableReplies.length) return;

        // Add identifying class for hidden replies, so they can be toggled
        for (const togglableReply of togglableReplies) {
            togglableReply.classList.add('togglable-reply');
            togglableReply.classList.remove('visible');
        }

        // Make sure that toggle all button is present
        toggleAllButton = ToggleAllButtonElement.create();
        childUnorderedList.prepend(toggleAllButton);

    }

    static updateToggleAllButton(parentEl: HTMLElement): void {
        const childUnorderedList: HTMLUListElement = parentEl.querySelector('.child-comments')!;
        const toggleAllButton: ToggleAllButtonElement | undefined = ToggleAllButtonElement.#getToggleAllButton(childUnorderedList);
        if (!toggleAllButton) return;
        toggleAllButton.#setToggleAllButtonText(false);
    }

    static #getToggleAllButton(parentEl: HTMLElement): ToggleAllButtonElement | undefined {
        return parentEl.querySelector('button.toggle-all')
            ?.parentElement as ToggleAllButtonElement;
    }

    #toggleReplies: (e: UIEvent) => void = e => {
        const toggleAllButton: ToggleAllButtonElement = e.currentTarget as ToggleAllButtonElement;
        findSiblingsBySelector(toggleAllButton, '.togglable-reply')
            .forEach((togglableReply: HTMLElement) => togglableReply.classList.toggle('visible'));
        toggleAllButton.#setToggleAllButtonText(true);
    };

    #setToggleAllButtonText(toggle?: boolean): void {
        const textContainer: HTMLElement = this.querySelector('span.text')!;
        const caret: HTMLElement = this.querySelector('span.caret')!;

        const setExpandingText: () => void = () => {
            let text: string = this.#options.viewAllRepliesText;
            const replyCount: number = this.parentElement!.querySelectorAll('.comment:not(.hidden)').length;
            text = text.replace('__replyCount__', `${replyCount}`);
            textContainer.textContent = text;
        };

        const hideRepliesText: string = this.#options.hideRepliesText;

        if (toggle) {
            // Toggle text
            if (textContainer.textContent === hideRepliesText) {
                setExpandingText();
            } else {
                textContainer.textContent = hideRepliesText;
            }
            // Toggle direction of the caret
            caret.classList.toggle('up');

        } else {
            // Update text if necessary
            if (textContainer.textContent !== hideRepliesText) {
                setExpandingText();
            }
        }
    }
}

defineCustomElement(ToggleAllButtonElement, 'ax-toggle-all-button', {extends: 'li'});
