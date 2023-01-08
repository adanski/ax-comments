import {OptionsProvider} from '../provider.js';
import {Icons} from '../options/icons.js';

export class SpinnerFactory {

    readonly #options: Icons;

    constructor(container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
    }

    createSpinner(inline: boolean = false): HTMLElement {
        const spinner: HTMLSpanElement = document.createElement('span');
        spinner.classList.add('spinner');
        if (inline) {
            spinner.classList.add('inline');
        }

        const spinnerIcon: HTMLElement = document.createElement('i');
        spinnerIcon.classList.add('fa', 'fa-circle-notch', 'fa-spin');
        if (this.#options.spinnerIconURL?.length) {
            spinnerIcon.style.backgroundImage = `url("${this.#options.spinnerIconURL}")`;
            spinnerIcon.classList.add('image');
        }
        spinner.appendChild(spinnerIcon);

        return spinner;
    }
}
