import {CommentsOptions, SortKey} from '../api.js';
import {OptionsProvider} from '../provider.js';

export class NavigationFactory {

    readonly #options: Required<CommentsOptions>;

    constructor(private readonly container: HTMLElement) {
        this.#options = OptionsProvider.get(container);
    }

    createNavigationElement(): HTMLElement {
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
            this.forceResponsive();
        }
        return navigationEl;
    }

    private forceResponsive(): void {
        this.container.classList.add('responsive');
    }
}
