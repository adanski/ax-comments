import {CommentsOptions} from '../api.js';
import {OptionsProvider, ServiceProvider} from '../provider.js';
import {TextareaElement} from './textarea-element.js';
import {StrategyProps, Textcomplete} from '@textcomplete/core';
import {TextareaEditor} from '@textcomplete/textarea';
import {isStringEmpty, normalizeSpaces} from '../util.js';
import {TextcompleteOption} from '@textcomplete/core/src/Textcomplete';
import {ProfilePictureFactory} from './profile-picture-factory.js';

export class TextcompleteFactory {

    readonly #options: CommentsOptions;
    readonly #profilePictureFactory!: ProfilePictureFactory;

    constructor(private readonly container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
        this.#profilePictureFactory = ServiceProvider.get(this.container, ProfilePictureFactory);
    }

    createTextcomplete(textarea: TextareaElement): Textcomplete {
        const textcompleteEditor: TextareaEditor = new TextareaEditor(textarea);
        const textcompleteStrategy: StrategyProps<Record<string, any>> = {
            match: /(^|\s)([@#][^\W_]{3,})$/i,
            index: 2,
            search: (term, callback) => {
                term = normalizeSpaces(term);
                const prefix: string = term[0];
                term = term.substring(1);

                // Return empty array on error
                const error: () => void = () => callback([]);

                if (isStringEmpty(term)) error();

                if (prefix === '@') {
                    this.#options.searchUsers(term, callback, error);
                } else if (prefix === '#') {
                    this.#options.searchTags(term, callback, error);
                } else {
                    error();
                }
            },
            template: user => {
                const wrapper: HTMLDivElement = document.createElement('div');

                const profilePictureEl: HTMLElement = this.#profilePictureFactory.createProfilePictureElement(user[this.#options.fieldMappings.profilePictureURL as string], user.id);

                const detailsEl: HTMLDivElement = document.createElement('div');
                detailsEl.classList.add('details');
                const nameEl: HTMLDivElement = document.createElement('div');
                nameEl.classList.add('name');
                nameEl.textContent = user.fullname;

                if (user.email) {
                    const emailEl: HTMLDivElement = document.createElement('div');
                    emailEl.classList.add('email');
                    emailEl.textContent = user.email;
                    detailsEl.append(nameEl, emailEl);
                } else {
                    detailsEl.classList.add('no-email');
                    detailsEl.append(nameEl);
                }

                wrapper.append(profilePictureEl, detailsEl);
                return wrapper.outerHTML;
            },
            replace: user => {
                textarea.pingedUsers.push({
                    id: user.id,
                    fullname: user.fullname
                })
                return `@${user.fullname} `;
            },
            cache: true
        };
        const textcompleteOptions: TextcompleteOption = {
            dropdown: {
                parent: this.container,
                className: 'dropdown autocomplete',
                maxCount: 8,
                rotate: true
            }
        };
        return new Textcomplete(textcompleteEditor, [textcompleteStrategy], textcompleteOptions);
    }
}
