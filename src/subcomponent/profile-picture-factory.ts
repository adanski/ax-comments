import {OptionsProvider} from '../provider.js';
import {Misc} from '../options/misc.js';

export class ProfilePictureFactory {

    readonly #options: Required<Misc>;

    constructor(container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
    }

    createProfilePictureElement(userId: string, pictureUrl?: string): HTMLElement {
        let profilePicture: HTMLElement;
        if (pictureUrl) {
            profilePicture = document.createElement('span');
            profilePicture.style.backgroundImage = `url(${pictureUrl})`;
        } else {
            profilePicture = document.createElement('i');
            profilePicture.classList.add('fa', 'fa-duotone', 'fa-user');
        }
        profilePicture.classList.add('profile-picture');
        profilePicture.setAttribute('data-user-id', userId);
        if (this.#options.roundProfilePictures) {
            profilePicture.classList.add('round');
        }
        return profilePicture;
    }
}
