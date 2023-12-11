/**
 * Fake polyfills for spec JSDom does not implement
 */
export function polyfill(window) {
    // https://github.com/ionic-team/stencil/issues/2277#issuecomment-680737430
    if (typeof window.CSSStyleSheet.prototype.replaceSync !== 'function'
        || typeof window.CSSStyleSheet.prototype.replace !== 'function') {
        window.CSSStyleSheet.prototype.replaceSync = noop;
        window.CSSStyleSheet.prototype.replace = () => Promise.resolve();
    }

    // https://github.com/jsdom/jsdom/issues/1695
    if (typeof window.Element.prototype.scrollIntoView !== 'function') {
        window.Element.prototype.scrollIntoView = noop;
    }

}

function noop() {
    //
}
