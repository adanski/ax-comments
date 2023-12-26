import {OptionsProvider} from '../../common/provider.js';
import {Misc} from '../../options/misc.js';
import {createElement} from '../../common/html-element-factory.js';

export class ProfilePictureFactory {

    readonly #options: Required<Misc>;

    constructor(container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
    }

    createProfilePictureElement(userId: string, pictureUrl?: string): HTMLElement {
        const classes: string = this.#options.roundProfilePictures ? 'profile-picture round' : 'profile-picture';

        if (pictureUrl) {
            return this.#withPicture(userId, classes, pictureUrl);
        } else {
            return this.#withIcon(userId, classes);
        }
    }

    #withPicture(userId: string, classes: string, pictureUrl: string): HTMLSpanElement {
        const pictureIconStyles: string = `background-image: url('${pictureUrl}')`
        return createElement(`
            <span data-user-id="${userId}" class="${classes}" style="${pictureIconStyles}">
            </span>
        `);
    }

    #withIcon(userId: string, classes: string): HTMLElement {
        return createElement(`
            <i data-user-id="${userId}" class="fa fa-duotone fa-user ${classes}">
            </i>
        `);
    }

}
