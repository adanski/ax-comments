import {CommentsOptions, SortKey} from '../../options/options.js';
import {OptionsProvider} from '../../common/provider.js';
import {CustomElement, defineCustomElement} from '../../common/custom-element.js';
import {WebComponent} from '../../common/web-component.js';
import {getHostContainer, hideElement, showElement} from '../../common/html-util.js';
import {noop} from '../../common/util.js';

//@CustomElement('ax-navigation')
export class NavigationElement extends HTMLElement implements WebComponent {

    sortKey: SortKey = SortKey.NEWEST;
    onSortKeyChanged: (sortKey: SortKey) => void = noop;

    get commentCount(): number {
        return this.#commentCount;
    }
    set commentCount(count: number) {
        this.#commentCount = count;
        this.#setCommentsHeaderText(count);
    }

    #commentCount: number = 0;
    #dropdownShown: boolean = false;

    #options!: Required<CommentsOptions>;

    static create(options: Pick<NavigationElement, 'sortKey' | 'onSortKeyChanged'>): NavigationElement {
        const navigationEl: NavigationElement = document.createElement('ax-navigation') as NavigationElement;
        Object.assign(navigationEl, options);
        return navigationEl;
    }

    connectedCallback() {
        this.#initServices();
        this.#initElement();
        this.querySelectorAll<HTMLElement>('.navigation [data-sort-key]')
            .forEach(nav => nav.addEventListener('click', this.#navigationElementClicked));
        this.querySelector<HTMLElement>('.dropdown-menu')!
            .addEventListener('click', this.#showMenuDropdown);
        addEventListener('click', this.#hideMenuDropdown);
    }

    disconnectedCallback(): void {
        this.querySelectorAll<HTMLElement>('.navigation [data-sort-key]')
            .forEach(nav => nav.removeEventListener('click', this.#navigationElementClicked));
        this.querySelector<HTMLElement>('.dropdown-menu')!
            .removeEventListener('click', this.#showMenuDropdown);
        removeEventListener('click', this.#hideMenuDropdown);
    }

    #initServices(): void {
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container);
    }

    #initElement(): void {
        const navigation: HTMLDivElement = document.createElement('div');
        navigation.className = 'navigation';
        const commentsHeader: HTMLSpanElement = document.createElement('span');
        commentsHeader.className = 'comments-header';
        commentsHeader.textContent = this.#options.commentsHeaderText;
        this.#setCommentsHeaderText(this.#commentCount, commentsHeader);

        const sortingMenu: HTMLMenuElement = document.createElement('menu');
        sortingMenu.className = 'bar';

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

        // Dropdown
        const sortingDropdown: HTMLDivElement = document.createElement('div');
        sortingDropdown.className = 'dropdown-menu';
        sortingDropdown.textContent = this.sortKey;
        const sortingDropdownMenu: HTMLMenuElement = document.createElement('menu');
        sortingDropdownMenu.className = 'dropdown';

        // Populate elements
        sortingMenu.append(newest, oldest);
        sortingDropdownMenu.append(newest.cloneNode(true), oldest.cloneNode(true));
        sortingDropdown.append(sortingDropdownMenu);

        hideElement(sortingDropdownMenu);

        if (this.#options.enableReplying || this.#options.enableUpvoting) {
            sortingMenu.append(popular);
            sortingDropdownMenu.append(popular.cloneNode(true));
        }

        if (this.#options.forceResponsive) {
            this.#forceResponsive();
        }

        navigation.append(commentsHeader, sortingMenu, sortingDropdown);
        this.append(navigation);
        this.#activateItem(this.sortKey);
    }

    #setCommentsHeaderText(commentCount: number, commentHeader: HTMLSpanElement = this.querySelector<HTMLElement>('.comments-header')!) {
        let text: string = this.#options.commentsHeaderText;
        text = text.replace('__commentCount__', `${commentCount}`);
        commentHeader.textContent = text;
    }

    #navigationElementClicked: (e: MouseEvent) => void = e => {
        const navigationEl: HTMLElement = e.currentTarget as HTMLElement;
        const sortKey: SortKey = navigationEl.getAttribute('data-sort-key') as SortKey;

        this.sortKey = sortKey;
        this.#activateItem(sortKey);
        this.onSortKeyChanged(sortKey);
    };

    #showMenuDropdown: (e: UIEvent) => void = e => {
        if (!this.#dropdownShown) {
            e.stopPropagation();
            showElement(this.querySelector<HTMLElement>('menu.dropdown'));
            this.#dropdownShown = true;
        }
    };

    #hideMenuDropdown: (e: UIEvent) => void = e => {
        if (this.#dropdownShown) {
            hideElement(this.querySelector<HTMLElement>('menu.dropdown'));
            this.#dropdownShown = false;
        }
    };

    #activateItem(sortKey: SortKey): void {
        const toActivate: NodeListOf<HTMLElement> = this.querySelectorAll(`.navigation [data-sort-key="${sortKey}"]`);

        // Indicate active sort
        this.querySelectorAll('.navigation [data-sort-key]')
            .forEach(el => {
                el.classList.remove('active');
            });
        toActivate.forEach(el => {
            el.classList.add('active');
        });

        // Update text node on first position
        this.querySelector<HTMLElement>('.navigation .dropdown-menu')!.childNodes[0].textContent =
            toActivate[0].textContent;
    }

    #forceResponsive(): void {
        getHostContainer(this).classList.add('responsive');
    }
}

defineCustomElement(NavigationElement, 'ax-navigation');
