import {CommentsOptions} from '../api.js';

export function createDynamicStylesheet(options: CommentsOptions): CSSStyleSheet {
    let css: string = '';

    // Navigation active item underline
    css += `#comments-container .navigation li.active, #comments-container .navigation .dropdown-menu {border-bottom: 2px solid ${options.highlightColor} !important;}`;

    // Dropdown active element
    css += `#comments-container .navigation .dropdown .active {border: none;background: ${options.highlightColor} !important;}`;

    // Background highlight
    css += `#comments-container .highlight-background {background: ${options.highlightColor} !important;}`;

    // Comment highlight
    if (options.highlightOwnComments) {
        css += `#comments-container .comment.by-current-user > ax-comment-container > .comment-wrapper {border-left: 2px solid ${options.highlightColor};margin-left: -2px;border-radius: 3px}`;
    }

    // Font highlight
    css += `#comments-container .highlight-font {color: ${options.highlightColor} !important;}`;
    css += `#comments-container .highlight-font-bold {color: ${options.highlightColor} !important;font-weight: bold;}`;

    return createStyle(css);
}

function createStyle(css: string): CSSStyleSheet {
    const styleSheet: CSSStyleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(css);
    return styleSheet;
}
