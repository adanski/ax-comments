export class CloseButtonFactory {
    constructor(
        private readonly options: Record<string, any>
    ) {}

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
