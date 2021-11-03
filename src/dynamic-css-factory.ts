import {CommentsOptions} from './comments-options';

export function createCssDeclarations(options: CommentsOptions): HTMLStyleElement {
    let css: string = '';

    // Remove previous css-declarations
    //TODO: azi $('head style.jquery-comments-css').remove();

    // Navigation underline
    css += `.jquery-comments ul.navigation li.active:after {background: ${options.highlightColor} !important;}`;

    // Dropdown active element
    css += `.jquery-comments ul.navigation ul.dropdown li.active {background: ${options.highlightColor} !important;}`;

    // Background highlight
    css += `.jquery-comments .highlight-background {background: ${options.highlightColor} !important;}`;

    // Font highlight
    css += `.jquery-comments .highlight-font {color: ${options.highlightColor} !important;}`;
    css += `.jquery-comments .highlight-font-bold {color: ${options.highlightColor} !important;font-weight: bold;}`;

    return createStyle(css);
}

function createStyle(css: string): HTMLStyleElement {
    const styleEl: HTMLStyleElement = document.createElement('style'/*, {
        type: 'text/css',
        'class': 'jquery-comments-css',
        text: css
    }*/);

    styleEl.innerText = css;

    return styleEl;
}
