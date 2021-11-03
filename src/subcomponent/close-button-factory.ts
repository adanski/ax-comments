import {CommentsOptions} from '../comments-options';
import {OptionsProvider} from '../provider';

export class CloseButtonFactory {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    createCloseButton(className?: string): HTMLElement {
        const closeButton: HTMLSpanElement = document.createElement('span');
        closeButton.classList.add(className || 'close');

        const icon: HTMLElement = document.createElement('i');
        icon.classList.add('fa', 'fa-times');
        if (this.options.closeIconURL.length) {
            icon.style.backgroundImage = `url("${this.options.closeIconURL}")`;
            icon.classList.add('image');
        }

        closeButton.innerHTML = '';
        closeButton.appendChild(icon);

        return closeButton;
    }

}
