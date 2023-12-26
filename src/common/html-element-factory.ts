const createFragment: (markup: string) => DocumentFragment = (range => {
    return range.createContextualFragment.bind(range);
})(new Range());

export function createElement<T extends HTMLElement>(markup: string): T {
    return createFragment(markup).firstElementChild as T;
}
