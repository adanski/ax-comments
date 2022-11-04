const PREVIOUS_DISPLAY_VALUE: WeakMap<HTMLElement, string> = new WeakMap();

export function getHostContainer(child: HTMLElement): HTMLElement {
    const container: HTMLElement | null = findParentsBySelector<HTMLDivElement>(child, '#comments-container').first();
    if (!container) {
        throw new Error(`${child.constructor.name} will not work outside ax-comments.`);
    }
    return container;
}

export function showElement(element: HTMLElement): void {
    element.style.display = PREVIOUS_DISPLAY_VALUE.get(element) ?? 'block';
}

export function hideElement(element: HTMLElement): void {
    PREVIOUS_DISPLAY_VALUE.set(element, element.style.display);
    element.style.display = 'none';
}

export function toggleElementVisibility(element: HTMLElement): void {
    if (element.style.display !== 'none') {
        hideElement(element);
    } else {
        showElement(element);
    }
}

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
