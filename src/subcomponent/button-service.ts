import {CommentsOptions} from '../comments-options';
import {OptionsProvider, ServiceProvider} from '../provider';
import $ from 'cash-dom';
import {SpinnerFactory} from './spinner-factory';

export class ButtonService {

    private readonly options: CommentsOptions;
    private readonly spinnerFactory: SpinnerFactory;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.spinnerFactory = ServiceProvider.get(container, SpinnerFactory);
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

    setButtonState(button: HTMLElement, enabled: boolean, loading: boolean): void {
        if (enabled) {
            !button.classList.contains('enabled') && button.classList.add('enabled');
        } else {
            button.classList.contains('enabled') && button.classList.remove('enabled');
        }

        if (loading) {
            button.innerHTML = '';
            button.append(this.spinnerFactory.createSpinner(true));
        } else {
            button.innerHTML = $(button).data('original-content');
        }
    }

}
