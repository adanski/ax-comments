// As JSDom does not implement the whole specification we need to provide fake polyfills

// https://github.com/ionic-team/stencil/issues/2277#issuecomment-680737430
if (typeof CSSStyleSheet.prototype.replaceSync !== 'function'
    || typeof CSSStyleSheet.prototype.replace !== 'function') {
    CSSStyleSheet.prototype.replaceSync = () => {};
    CSSStyleSheet.prototype.replace = () => {};
}

// https://github.com/jsdom/jsdom/issues/1695
if (typeof Element.prototype.scrollIntoView !== 'function') {
    Element.prototype.scrollIntoView = () => {};
}
