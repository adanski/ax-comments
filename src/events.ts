import {ElementEventsHandler} from './element-events-handler.js';

export const EVENT_HANDLERS_MAP: Map<ElementEvent, ElementEventHandlerNames> = new Map([
    // Close dropdowns
    of(eventOf('click'), 'closeDropdowns'),

    // Paste attachments
    of(eventOf('paste'), 'preSavePastedAttachments'),

    // Save comment on keydown
    of(eventOf('keydown', '[contenteditable]'), 'saveOnKeydown'),

    // Listening changes in contenteditable fields (due to input event not working with IE)
    of(eventOf('focus', '[contenteditable]'), 'saveEditableContent'),

    of(eventOf('keyup', '[contenteditable]'), 'checkEditableContentForChange'),
    of(eventOf('paste', '[contenteditable]'), 'checkEditableContentForChange'),
    of(eventOf('input', '[contenteditable]'), 'checkEditableContentForChange'),
    of(eventOf('blur', '[contenteditable]'), 'checkEditableContentForChange'),

    // Navigation
    of(eventOf('click', '.navigation li[data-sort-key]'), 'navigationElementClicked'),
    of(eventOf('click', '.navigation li.title'), 'toggleNavigationDropdown'),

    // Main comenting field
    of(eventOf('click', '.commenting-field.main .textarea'), 'showMainCommentingField'),
    of(eventOf('click', '.commenting-field.main .close'), 'hideMainCommentingField'),

    // All commenting fields
    of(eventOf('click', '.commenting-field .textarea'), 'increaseTextareaHeight'),
    of(eventOf('change', '.commenting-field .textarea'), 'increaseTextareaHeight', 'textareaContentChanged'),
    of(eventOf('click', '.commenting-field:not(.main) .close'), 'removeCommentingField'),

    // Edit mode actions
    of(eventOf('click', '.commenting-field .send.enabled'), 'postComment'),
    of(eventOf('click', '.commenting-field .update.enabled'), 'putComment'),
    of(eventOf('click', '.commenting-field .delete.enabled'), 'deleteComment'),
    of(eventOf('click', '.commenting-field .attachments .attachment .delete'), 'preDeleteAttachment'),
    of(eventOf('change', '.commenting-field .upload.enabled input[type="file"]'), 'fileInputChanged'),

    // Other actions
    of(eventOf('click', 'li.comment button.upvote'), 'upvoteComment'),
    of(eventOf('click', 'li.comment button.delete.enabled'), 'deleteComment'),
    of(eventOf('click', 'li.comment .hashtag'), 'hashtagClicked'),
    of(eventOf('click', 'li.comment .ping'), 'pingClicked'),

    // Other
    of(eventOf('click', 'li.comment ul.child-comments .toggle-all'), 'toggleReplies'),
    of(eventOf('click', 'li.comment button.reply'), 'replyButtonClicked'),
    of(eventOf('click', 'li.comment button.edit'), 'editButtonClicked'),

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

type ElementEventHandlerNames = Array<keyof ElementEventsHandler>;
