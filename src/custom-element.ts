/**
 * Decorator which registers custom HTML element.
 */
export function CustomElement(selector: string, options?: ElementDefinitionOptions): CustomElementDecorator {
    return (target, context) => {
        context.addInitializer(function () {
            customElements.define(selector, this, options);
        });
    };
}

/*declare global {
    interface HTMLElementTagNameMap {
        selector: target;
    }
}*/

/**
 * Custom element decorator. Based on {@link ClassDecorator}.
 */
type CustomElementDecorator = <E extends HTMLElement, C extends CustomElementConstructor<E>>(target: C, context: ClassDecoratorContext<C>) => C | void;

/**
 * Reference to the specific custom element's class.
 */
type CustomElementConstructor<E extends HTMLElement> = new (...args: any[]) => E;
