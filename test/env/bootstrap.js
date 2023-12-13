import {JSDOM} from 'jsdom';
import {polyfill} from './polyfill-fake.js';

const windowPropPartials = [
    'resize',
    'move',
    'scroll',
    'CSS',
    'Style',
    'EventListener',
    'Event',
    'customElements',
    'document'
];

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Event#interfaces_based_on_event
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API#html_element_interfaces_2
 */
const windowNonEnumerableProps = [
    'Range',
    'CSSStyleSheet',

    'querySelector',
    'querySelectorAll',

    'CustomEvent',
    'UIEvent',
    'FocusEvent',
    'InputEvent',
    'MouseEvent',
    'KeyboardEvent',
    'TouchEvent',
    'CompositionEvent',
    'WheelEvent',

    'HTMLElement',
    'HTMLHeadElement',
    'HTMLTitleElement',
    'HTMLBaseElement',
    'HTMLLinkElement',
    'HTMLMetaElement',
    'HTMLStyleElement',
    'HTMLBodyElement',
    'HTMLHeadingElement',
    'HTMLParagraphElement',
    'HTMLHRElement',
    'HTMLPreElement',
    'HTMLUListElement',
    'HTMLOListElement',
    'HTMLLIElement',
    'HTMLMenuElement',
    'HTMLDListElement',
    'HTMLDivElement',
    'HTMLAnchorElement',
    'HTMLAreaElement',
    'HTMLBRElement',
    'HTMLButtonElement',
    'HTMLCanvasElement',
    'HTMLDataElement',
    'HTMLDataListElement',
    'HTMLDetailsElement',
    'HTMLDialogElement',
    'HTMLDirectoryElement',
    'HTMLFieldSetElement',
    'HTMLFormElement',
    'HTMLHtmlElement',
    'HTMLImageElement',
    'HTMLInputElement',
    'HTMLLabelElement',
    'HTMLLegendElement',
    'HTMLMapElement',
    'HTMLMediaElement',
    'HTMLMeterElement',
    'HTMLModElement',
    'HTMLOptGroupElement',
    'HTMLOptionElement',
    'HTMLOutputElement',
    'HTMLPictureElement',
    'HTMLProgressElement',
    'HTMLQuoteElement',
    'HTMLScriptElement',
    'HTMLSelectElement',
    'HTMLSlotElement',
    'HTMLSourceElement',
    'HTMLSpanElement',
    'HTMLTableCaptionElement',
    'HTMLTableCellElement',
    'HTMLTableColElement',
    'HTMLTableElement',
    'HTMLTimeElement',
    'HTMLTableRowElement',
    'HTMLTableSectionElement',
    'HTMLTemplateElement',
    'HTMLTextAreaElement',
    'HTMLUnknownElement',
    'HTMLIFrameElement',
    'HTMLEmbedElement',
    'HTMLObjectElement',
    'HTMLParamElement',
    'HTMLVideoElement',
    'HTMLAudioElement',
    'HTMLTrackElement',
    'HTMLFormControlsCollection'
];

export function bootstrap() {
    const dom = new JSDOM(bootstrapHtml(), bootstrapOptions());
    Object.keys(dom.window).forEach(key => {
        if (windowPropPartials.some(p => key.includes(p) && !key.startsWith('_')))
            global[key] = dom.window[key];
    });

    windowNonEnumerableProps.forEach(key => global[key] = dom.window[key]);
    global.window = dom.window;
    return dom;
}

export function bootstrapHtml() {
    return `<!DOCTYPE html><p>Node Tests</p>`;
}

export function bootstrapOptions() {
    return {
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        beforeParse(window) {
            polyfill(window);
        }
    };
}
