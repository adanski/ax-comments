/**
 * Web component lifecycle which is missing in TS typings.
 * See https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
 */
export interface WebComponent {
    connectedCallback(): void;

    disconnectedCallback(): void;

    adoptedCallback(): void;

    attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
}
