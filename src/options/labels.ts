export interface Labels {
    /**
     * A `string` that is displayed as a placeholder in commenting fields
     *
     * @default 'Add a comment'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     textareaPlaceholderText: 'Leave a comment',
     *     // ...
     * };
     * ```
     */
    textareaPlaceholderText?: string;
    /**
     * A `string` that is displayed on sorting button for newest comments
     *
     * @default 'Newest'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     newestText: 'New',
     *     // ...
     * };
     * ```
     */
    newestText?: string;
    /**
     * A `string` that is displayed on sorting button for oldest comments
     *
     * @default 'Oldest'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     oldestText: 'Old',
     *     // ...
     * };
     * ```
     */
    oldestText?: string;
    /**
     * A `string` that is displayed on sorting button for most popular comments
     *
     * @default 'Popular'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     popularText: 'Most popular',
     *     // ...
     * };
     * ```
     */
    popularText?: string;
    /**
     * A `string` that is displayed on sorting button for attachments
     *
     * @default 'Attachments'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     attachmentsText: 'Show attachments',
     *     // ...
     * };
     * ```
     */
    attachmentsText?: string;
    /**
     * A `string` that is displayed on send button
     *
     * @default 'Send'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     sendText: 'Comment',
     *     // ...
     * };
     * ```
     */
    sendText?: string;
    /**
     * A `string` that is displayed on reply button
     *
     * @default 'Reply'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     replyText: 'Answer',
     *     // ...
     * };
     * ```
     */
    replyText?: string;
    /**
     * A `string` that is displayed on edit button
     *
     * @default 'Edit'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     editText: 'Modify',
     *     // ...
     * };
     * ```
     */
    editText?: string;
    /**
     * A `string` that is displayed on edited timestamp
     *
     * @default 'Edited'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     editedText: 'Modified',
     *     // ...
     * };
     * ```
     */
    editedText?: string;
    /**
     * A `string` that is displayed as a name of the user for new comments by default
     *
     * @default 'You'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     youText: 'Me',
     *     // ...
     * };
     * ```
     */
    youText?: string;
    /**
     * A `string` that is displayed on save button
     *
     * @default 'Save'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     saveText: 'Update',
     *     // ...
     * };
     * ```
     */
    saveText?: string;
    /**
     * A `string` that is displayed on delete button
     *
     * @default 'Delete'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     deleteText: 'Remove',
     *     // ...
     * };
     * ```
     */
    deleteText?: string;
    /**
     * A `string` that is displayed on a new comment badge
     *
     * @default 'New'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     newText: 'Unread',
     *     // ...
     * };
     * ```
     */
    newText?: string;
    /**
     * A `string` that is displayed to show all replies when there are more replies than defined in `maxRepliesVisible` option.
     * Variable `__replyCount__` is used as a placeholder for the reply count.
     *
     * @default 'View all __replyCount__ replies'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     viewAllRepliesText: 'Show all replies (__replyCount__)',
     *     // ...
     * };
     * ```
     */
    viewAllRepliesText?: string;
    /**
     * A `string` that is displayed to hide replies that weren't visible initially
     *
     * @default 'Hide replies'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     hideRepliesText: 'Collapse replies',
     *     // ...
     * };
     * ```
     */
    hideRepliesText?: string;
    /**
     * A `string` that is displayed if there are no comments to show
     *
     * @default 'No comments'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     noCommentsText: 'Be the first to leave a comment',
     *     // ...
     * };
     * ```
     */
    noCommentsText?: string;
    /**
     * A `string` that is displayed if there are no attachments to show
     *
     * @default 'No attachments'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     noAttachmentsText: 'There are no attachments',
     *     // ...
     * };
     * ```
     */
    noAttachmentsText?: string;
    /**
     * A `string` that is used to inform the user where the attachments can be dropped
     *
     * @default 'Drop files here'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     attachmentDropText: 'Drop here',
     *     // ...
     * };
     * ```
     */
    attachmentDropText?: string;
}
