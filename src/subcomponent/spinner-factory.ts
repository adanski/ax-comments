import {CommentsOptions} from '../api.js';
import {OptionsProvider} from '../provider.js';

export class SpinnerFactory {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    createSpinner(inline?: boolean): HTMLElement {
        const spinner: HTMLDivElement = document.createElement('div');
        spinner.classList.add('spinner');
        if (inline) {
            spinner.classList.add('inline');
        }

        const spinnerIcon: HTMLElement = document.createElement('i');
        spinnerIcon.classList.add('fa', 'fa-spinner', 'fa-spin');
        if (this.options.spinnerIconURL?.length) {
            spinnerIcon.style.backgroundImage = `url("${this.options.spinnerIconURL}")`;
            spinnerIcon.classList.add('image');
        }
        spinner.innerHTML = '';
        spinner.appendChild(spinnerIcon);

        return spinner;
    }
}