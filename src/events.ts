import {ElementEventHandler} from './element-event-handler.js';

export const EVENT_HANDLERS_MAP: Map<ElementEvent, ElementEventHandlerNames> = new Map([
    // Close dropdowns
    of(eventOf('click'), 'closeDropdowns'),

    // Paste attachments
    of(eventOf('paste'), 'preSavePastedAttachments'),

    // Drag & dropping attachments
    of(eventOf('dragenter'), 'showDroppableOverlay'),

    of(eventOf('dragenter', '.droppable-overlay'), 'handleDragEnter'),
    of(eventOf('dragleave', '.droppable-overlay'), 'handleDragLeaveForOverlay'),
    of(eventOf('dragenter', '.droppable-overlay .droppable'), 'handleDragEnter'),
    of(eventOf('dragleave', '.droppable-overlay .droppable'), 'handleDragLeaveForDroppable'),

    of(eventOf('dragover', '.droppable-overlay'), 'handleDragOverForOverlay'),
    of(eventOf('drop', '.droppable-overlay'), 'handleDrop')
]);

function of(event: ElementEvent, ...handlerNames: ElementEventHandlerNames): [ElementEvent, ElementEventHandlerNames] {
    return [event, handlerNames];
}

function eventOf(type: keyof HTMLElementEventMap, selector?: string): ElementEvent {
    return {
        type: type,
        selector: selector
    };
}

interface ElementEvent {
    readonly type: keyof HTMLElementEventMap;
    readonly selector?: string;
}

type ElementEventHandlerNames = FunctionProps<ElementEventHandler>[];

export type FunctionProps<T> = ({ [P in keyof T]: T[P] extends Function ? P : never })[keyof T];
