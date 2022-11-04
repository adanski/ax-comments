import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';

export class ProfilePictureFactory {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLElement) {
        this.options = OptionsProvider.get(container)!;
    }

    createProfilePictureElement(pictureUrl: string, userId: string): HTMLElement {
        let profilePicture: HTMLElement;
        if (pictureUrl) {
            profilePicture = document.createElement('div');
            profilePicture.style.backgroundImage = 'url(' + pictureUrl + ')';
        } else {
            profilePicture = document.createElement('i');
            profilePicture.classList.add('fa', 'fa-user');
        }
        profilePicture.classList.add('profile-picture');
        profilePicture.setAttribute('data-user-id', userId);
        if (this.options.roundProfilePictures) {
            profilePicture.classList.add('round');
        }
        return profilePicture;
    }
}
