export function findSiblingsBySelector<E extends HTMLElement = HTMLElement>(element: Element, selectors?: string): QueryableElementArray<E> {
    const siblings: E[] = [];
    for (const sibling of element.parentElement!.children) {
        if (sibling !== element)
            siblings.push(sibling as E);
    }

    if (!selectors) {
        return new QueryableElementArray(...siblings as any);
    }

    const results: E[] = [];
    for (const sibling of siblings) {
        if (sibling.matches(selectors)) {
            results.push(sibling);
        }
    }
    return new QueryableElementArray(...results as any);

}

export function findParentsBySelector<E extends HTMLElement = HTMLElement>(element: HTMLElement, selectors?: string): QueryableElementArray<E> {
    const results: E[] = [];
    for (let parent = element && element.parentElement; parent; parent = parent.parentElement) {
        if (!selectors || parent.matches(selectors)) {
            results.push(parent as E);
        }
    }
    return new QueryableElementArray(...results as any);

}

class QueryableElementArray<E extends HTMLElement> extends Array implements Pick<ParentNode, 'querySelector'> {

    querySelector(selectors: string): E | null {
        for (const element of this) {
            const foundElement: E | null = (element as E).querySelector<E>(selectors);
            if (foundElement) {
                return foundElement;
            }
        }
        return null;
    }
    querySelectorAll(selectors: string): E[] {
        const results: E[] = [];
        for (const element of this) {
            const foundElements: NodeListOf<E> = (element as E).querySelectorAll<E>(selectors);
            if (foundElements.length > 0) {
                results.push(...foundElements);
            }
        }
        return results;
    }

    first(): E | null {
        return this.length > 0 ? this[0] as E : null;
    }

    last(): E | null {
        return this.length > 0 ? this[this.length - 1] as E : null;
    }

}
