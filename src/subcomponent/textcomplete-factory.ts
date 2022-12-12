import {CommentsOptions} from '../api.js';
import {OptionsProvider, ServiceProvider} from '../provider.js';
import {TextareaElement} from './textarea-element.js';
import {StrategyProps, Textcomplete} from '@textcomplete/core';
import {TextareaEditor} from '@textcomplete/textarea';
import {isStringEmpty, normalizeSpaces} from '../util.js';
import {TextcompleteOption} from '@textcomplete/core/src/Textcomplete';
import {ProfilePictureFactory} from './profile-picture-factory.js';
import {PingableUser, ReferenceableHashtag} from '../options/models.js';

export class TextcompleteFactory {

    readonly #options: Required<CommentsOptions>;
    readonly #profilePictureFactory!: ProfilePictureFactory;

    constructor(private readonly container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
        this.#profilePictureFactory = ServiceProvider.get(this.container, ProfilePictureFactory);
    }

    createTextcomplete(textarea: TextareaElement): Textcomplete {
        const textcompleteEditor: TextareaEditor = new TextareaEditor(textarea);
        let startsWithSpace: boolean = false;
        const textcompleteStrategy: StrategyProps<PingableUser | ReferenceableHashtag> = {
            // Starts with '@' or '#' and has at least 3 other characters
            match: /(?:^|\s)([@#][\w-]{3,})$/i,
            search: (term, callback, match) => {
                startsWithSpace = match[0].startsWith(' ');
                term = normalizeSpaces(term);
                const prefix: string = term[0];
                term = term.substring(1);

                // Return empty array on error
                const error: () => void = () => callback([]);

                if (isStringEmpty(term)) {
                    error();
                    return;
                }

                if (prefix === '@') {
                    this.#options.searchUsers(term, callback, error);
                } else if (prefix === '#') {
                    this.#options.searchTags(term, callback, error);
                } else {
                    error();
                }
            },
            template: userOrHashtag =>
                TextcompleteFactory.#isUser(userOrHashtag)
                    ? this.#createUserItem(userOrHashtag).outerHTML
                    : this.#createHashtagItem(userOrHashtag).outerHTML,
            replace: userOrHashtag =>
                TextcompleteFactory.#isUser(userOrHashtag)
                    ? this.#replaceUserPingText(userOrHashtag, textarea, startsWithSpace)
                    : this.#replaceHashtagReferenceText(userOrHashtag, textarea, startsWithSpace),
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

    #createUserItem(user: PingableUser): HTMLElement {
        const userItem: HTMLParagraphElement = document.createElement('p');
        userItem.classList.add('result');

        const profilePicture: HTMLElement = this.#profilePictureFactory.createProfilePictureElement(user.id, user.profilePictureURL);

        const details: HTMLSpanElement = document.createElement('span');
        details.classList.add('details');
        const name: HTMLSpanElement = document.createElement('span');
        name.classList.add('name');
        name.textContent = user.displayName || user.id;

        if (user.email || user.displayName) {
            const email: HTMLSpanElement = document.createElement('span');
            email.classList.add('email');
            email.textContent = user.email || user.id;
            details.append(name, email);
        } else {
            details.classList.add('no-email');
            details.append(name);
        }

        userItem.append(profilePicture, details);

        return userItem;
    }

    #createHashtagItem(hashtag: ReferenceableHashtag): HTMLElement {
        const hashtagItem: HTMLParagraphElement = document.createElement('p');
        hashtagItem.classList.add('result');

        const name: HTMLSpanElement = document.createElement('span');
        name.classList.add('name');
        name.textContent = `#${hashtag.tag}`;

        hashtagItem.append(name);

        return hashtagItem;
    }

    #replaceUserPingText(user: PingableUser, textarea: TextareaElement, startsWithSpace: boolean): string {
        textarea.pingedUsers.push(user);
        return `${startsWithSpace ? ' ' : ''}@${user.id} `;
    }

    #replaceHashtagReferenceText(hashtag: ReferenceableHashtag, textarea: TextareaElement, startsWithSpace: boolean): string {
        textarea.referencedHashtags.push(hashtag.tag);
        return `${startsWithSpace ? ' ' : ''}#${hashtag.tag} `;
    }

    static #isUser(obj: any): obj is PingableUser {
        return !isStringEmpty(obj.id);
    }
}
