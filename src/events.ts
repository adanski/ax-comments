// FIXME: inspect all event handlers
import {CommentsEventHandler} from './comments-event-handler';

export const EVENTS: Record<string, string> = {
    // Close dropdowns
    'click': 'closeDropdowns',

    // Paste attachments
    'paste': 'preSavePastedAttachments',

    // Save comment on keydown
    'keydown [contenteditable]': 'saveOnKeydown',

    // Listening changes in contenteditable fields (due to input event not working with IE)
    'focus [contenteditable]': 'saveEditableContent',
    'keyup [contenteditable]': 'checkEditableContentForChange',
    'paste [contenteditable]': 'checkEditableContentForChange',
    'input [contenteditable]': 'checkEditableContentForChange',
    'blur [contenteditable]': 'checkEditableContentForChange',

    // Navigation
    'click .navigation li[data-sort-key]': 'navigationElementClicked',
    'click .navigation li.title': 'toggleNavigationDropdown',

    // Main comenting field
    'click .commenting-field.main .textarea': 'showMainCommentingField',
    'click .commenting-field.main .close': 'hideMainCommentingField',

    // All commenting fields
    'click .commenting-field .textarea': 'increaseTextareaHeight',
    'change .commenting-field .textarea': 'increaseTextareaHeight textareaContentChanged',
    'click .commenting-field:not(.main) .close': 'removeCommentingField',

    // Edit mode actions
    'click .commenting-field .send.enabled': 'postComment',
    'click .commenting-field .update.enabled': 'putComment',
    'click .commenting-field .delete.enabled': 'deleteComment',
    'click .commenting-field .attachments .attachment .delete': 'preDeleteAttachment',
    'change .commenting-field .upload.enabled input[type="file"]': 'fileInputChanged',

    // Other actions
    'click li.comment button.upvote': 'upvoteComment',
    'click li.comment button.delete.enabled': 'deleteComment',
    'click li.comment .hashtag': 'hashtagClicked',
    'click li.comment .ping': 'pingClicked',

    // Other
    'click li.comment ul.child-comments .toggle-all': 'toggleReplies',
    'click li.comment button.reply': 'replyButtonClicked',
    'click li.comment button.edit': 'editButtonClicked',

    // Drag & dropping attachments
    'dragenter': 'showDroppableOverlay',

    'dragenter .droppable-overlay': 'handleDragEnter',
    'dragleave .droppable-overlay': 'handleDragLeaveForOverlay',
    'dragenter .droppable-overlay .droppable': 'handleDragEnter',
    'dragleave .droppable-overlay .droppable': 'handleDragLeaveForDroppable',

    'dragover .droppable-overlay': 'handleDragOverForOverlay',
    'drop .droppable-overlay': 'handleDrop',

    // Prevent propagating the click event into buttons under the autocomplete dropdown
    'click .dropdown.autocomplete': 'stopPropagation',
    'mousedown .dropdown.autocomplete': 'stopPropagation',
    'touchstart .dropdown.autocomplete': 'stopPropagation',
};
