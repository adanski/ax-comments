import {ElementEventHandler} from './element-event-handler.js';

export const EVENT_HANDLERS_MAP: Map<ElementEvent, ElementEventHandlerNames> = new Map([
    // Close dropdowns
    of(eventOf('click'), 'closeDropdowns'),

    // Paste attachments
    of(eventOf('paste'), 'preSavePastedAttachments'),

    // Save comment on keydown
    of(eventOf('keydown', 'textarea.textarea'), 'saveOnKeydown'),

    // Listening changes in textarea fields
    of(eventOf('input', 'textarea.textarea'), 'saveEditableContent'),
    of(eventOf('input', 'textarea.textarea'), 'checkEditableContentForChange'),

    // Navigation
    of(eventOf('click', '.navigation li[data-sort-key]'), 'navigationElementClicked'),
    of(eventOf('click', '.navigation li.title'), 'toggleNavigationDropdown'),

    // All commenting fields
    of(eventOf('click', '.commenting-field .textarea'), 'increaseTextareaHeight'),
    of(eventOf('change', '.commenting-field .textarea'), 'increaseTextareaHeight', 'textareaContentChanged'),

    // Edit mode actions
    of(eventOf('click', '.commenting-field .send.enabled'), 'postComment'),
    of(eventOf('click', '.commenting-field .update.enabled'), 'putComment'),
    of(eventOf('click', '.commenting-field .delete.enabled'), 'deleteComment'),
    of(eventOf('change', '.commenting-field .upload.enabled input[type="file"]'), 'fileInputChanged'),

    // Other actions
    of(eventOf('click', 'li.comment button.delete.enabled'), 'deleteComment'),

    // Drag & dropping attachments
    of(eventOf('dragenter'), 'showDroppableOverlay'),

    of(eventOf('dragenter', '.droppable-overlay'), 'handleDragEnter'),
    of(eventOf('dragleave', '.droppable-overlay'), 'handleDragLeaveForOverlay'),
    of(eventOf('dragenter', '.droppable-overlay .droppable'), 'handleDragEnter'),
    of(eventOf('dragleave', '.droppable-overlay .droppable'), 'handleDragLeaveForDroppable'),

    of(eventOf('dragover', '.droppable-overlay'), 'handleDragOverForOverlay'),
    of(eventOf('drop', '.droppable-overlay'), 'handleDrop'),

    // Prevent propagating the click event into buttons under the autocomplete dropdown
    of(eventOf('click', '.dropdown.autocomplete'), 'stopPropagation'),
    of(eventOf('mousedown', '.dropdown.autocomplete'), 'stopPropagation'),
    of(eventOf('touchstart', '.dropdown.autocomplete'), 'stopPropagation'),
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
