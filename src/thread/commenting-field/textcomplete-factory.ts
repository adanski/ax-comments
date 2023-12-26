import {CommentsOptions} from '../../options/options.js';
import {OptionsProvider, ServiceProvider} from '../../common/provider.js';
import {TextareaElement} from './textarea-element.js';
import {StrategyProps, Textcomplete, TextcompleteOption} from '@textcomplete/core';
import {TextareaEditor} from '@textcomplete/textarea';
import {isStringEmpty, normalizeSpaces} from '../../common/util.js';
import {ProfilePictureFactory} from '../basic/profile-picture-factory.js';
import {PingableUser, ReferenceableHashtag} from '../../options/models.js';

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
        const profilePic: HTMLElement = this.#profilePictureFactory.createProfilePictureElement(user.id, user.profilePictureURL);

        return this.#createResult(profilePic, user.displayName || user.id, user.email || user.displayName && user.id);
    }

    #createHashtagItem(hashtag: ReferenceableHashtag): HTMLElement {
        const hash: HTMLElement = document.createElement('i');
        hash.classList.add('fas', 'fa-hashtag', 'hashtag');

        return this.#createResult(hash, hashtag.tag, hashtag.description);
    }

    #createResult(pic: HTMLElement, nameContent: string, detailsContent?: string): HTMLParagraphElement {
        const info: HTMLSpanElement = document.createElement('span');
        info.classList.add('info');
        const name: HTMLSpanElement = document.createElement('span');
        name.classList.add('name');
        name.textContent = nameContent;

        if (detailsContent) {
            const details: HTMLSpanElement = document.createElement('span');
            details.classList.add('details');
            details.textContent = detailsContent;
            info.append(name, details);
        } else {
            info.classList.add('no-details');
            info.append(name);
        }

        const result: HTMLParagraphElement = document.createElement('p');
        result.classList.add('result');
        result.append(pic, info);
        return result;
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
