import {CommentsOptions, SortKey} from '../api.js';
import {OptionsProvider} from '../provider.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {WebComponent} from '../web-component.js';
import {getHostContainer, toggleElementVisibility} from '../html-util.js';

@RegisterCustomElement('ax-navigation')
export class NavigationElement extends HTMLElement implements WebComponent {

    sortKey: SortKey = SortKey.NEWEST;
    onSortKeyChanged: (sortKey: SortKey) => void = () => {};

    #options!: Required<CommentsOptions>;

    static create(options: Pick<NavigationElement, 'sortKey' | 'onSortKeyChanged'>): NavigationElement {
        const navigationEl: NavigationElement = document.createElement('ax-navigation') as NavigationElement;
        Object.assign(navigationEl, options);
        return navigationEl;
    }

    connectedCallback() {
        this.#initServices();
        this.#initElement();
        this.querySelectorAll<HTMLElement>('.navigation li[data-sort-key]')
            .forEach(nav => nav.addEventListener('click', this.#navigationElementClicked));
        this.querySelector<HTMLElement>('.navigation li.title')!
            .addEventListener('click', this.#toggleNavigationDropdown);
    }

    disconnectedCallback(): void {
        this.querySelectorAll<HTMLElement>('.navigation li[data-sort-key]')
            .forEach(nav => nav.removeEventListener('click', this.#navigationElementClicked));
        this.querySelector<HTMLElement>('.navigation li.title')!
            .removeEventListener('click', this.#toggleNavigationDropdown);
    }

    #initServices(): void {
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container);
    }

    #initElement(): void {
        const navigationEl: HTMLUListElement = document.createElement('ul');
        navigationEl.classList.add('navigation');
        const navigationWrapper: HTMLDivElement = document.createElement('div');
        navigationWrapper.classList.add('navigation-wrapper');
        navigationEl.append(navigationWrapper);

        // Newest
        const newest: HTMLLIElement = document.createElement('li');
        newest.textContent = this.#options.newestText;
        newest.setAttribute('data-sort-key', SortKey.NEWEST);
        newest.setAttribute('data-container-name', 'comments');

        // Oldest
        const oldest: HTMLLIElement = document.createElement('li');
        oldest.textContent = this.#options.oldestText;
        oldest.setAttribute('data-sort-key', SortKey.OLDEST);
        oldest.setAttribute('data-container-name', 'comments');

        // Popular
        const popular: HTMLLIElement = document.createElement('li');
        popular.textContent = this.#options.popularText;
        popular.setAttribute('data-sort-key', SortKey.POPULARITY);
        popular.setAttribute('data-container-name', 'comments');

        // Attachments
        const attachments: HTMLLIElement = document.createElement('li');
        attachments.textContent = this.#options.attachmentsText;
        attachments.setAttribute('data-sort-key', SortKey.ATTACHMENTS);
        attachments.setAttribute('data-container-name', 'attachments');

        // Attachments icon
        const attachmentsIcon: HTMLElement = document.createElement('i');
        attachmentsIcon.classList.add('fa', 'fa-paperclip');
        if (this.#options.attachmentIconURL.length) {
            attachmentsIcon.style.backgroundImage = `url("${this.#options.attachmentIconURL}")`;
            attachmentsIcon.classList.add('image');
        }
        attachments.prepend(attachmentsIcon);


        // Responsive navigation
        const dropdownNavigationWrapper: HTMLDivElement = document.createElement('div');
        dropdownNavigationWrapper.classList.add('navigation-wrapper', 'responsive');
        const dropdownNavigation: HTMLUListElement = document.createElement('ul');
        dropdownNavigation.classList.add('dropdown');
        const dropdownTitle: HTMLLIElement = document.createElement('li');
        dropdownTitle.classList.add('title');
        const dropdownTitleHeader: HTMLElement = document.createElement('header');

        dropdownTitle.append(dropdownTitleHeader);
        dropdownNavigationWrapper.append(dropdownTitle);
        dropdownNavigationWrapper.append(dropdownNavigation);
        navigationEl.append(dropdownNavigationWrapper);


        // Populate elements
        navigationWrapper.append(newest, oldest);
        dropdownNavigation.append(newest.cloneNode(true), oldest.cloneNode(true));

        if (this.#options.enableReplying || this.#options.enableUpvoting) {
            navigationWrapper.append(popular);
            dropdownNavigation.append(popular.cloneNode(true));
        }
        if (this.#options.enableAttachments) {
            navigationWrapper.append(attachments);
            dropdownNavigationWrapper.append(attachments.cloneNode(true));
        }

        if (this.#options.forceResponsive) {
            this.#forceResponsive();
        }

        this.append(navigationEl);
    }

    #navigationElementClicked: (e: MouseEvent) => void = e => {
        const navigationEl: HTMLElement = e.currentTarget as HTMLElement;
        const sortKey: SortKey = navigationEl.getAttribute('data-sort-key') as SortKey;

        this.sortKey = sortKey;
        this.onSortKeyChanged(sortKey);
    };

    #toggleNavigationDropdown: (e: UIEvent) => void = e => {
        // Prevent closing immediately
        e.stopPropagation();

        const dropdown: HTMLElement = (e.currentTarget as HTMLElement).querySelector('~ .dropdown')!;
        toggleElementVisibility(dropdown);
    };

    #forceResponsive(): void {
        getHostContainer(this).classList.add('responsive');
    }
}
