export interface Icons {
    /**
     * A `url` for spinner icon that is shown before comments have been fetched. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     spinnerIconURL: '/img/spinner.gif',
     *     // ...
     * };
     * ```
     */
    spinnerIconURL?: string;
    /**
     * A `url` for upvote icon that is used as a button for upvoting. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     upvoteIconURL: '/img/upvote-icon.png',
     *     // ...
     * };
     * ```
     */
    upvoteIconURL?: string;
    /**
     * A `url` for reply icon that is shown after the author of the comment if the comment is a reply. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     replyIconURL: '/img/reply-icon.png',
     *     // ...
     * };
     * ```
     */
    replyIconURL?: string;
    /**
     * A `url` for upload icon that is used as a button for uploading attachments. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     uploadIconURL: '/img/upload-icon.png',
     *     // ...
     * };
     * ```
     */
    uploadIconURL?: string;
    /**
     * A `url` for attachment icon that is used as a symbol for attachments. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     attachmentIconURL: '/img/attachment-icon.png',
     *     // ...
     * };
     * ```
     */
    attachmentIconURL?: string;
    /**
     * A `url` for no-comments icon that is shown if there are no comments to show. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     noCommentsIconURL: '/img/no-comments-icon.png',
     *     // ...
     * };
     * ```
     */
    noCommentsIconURL?: string;
    /**
     * A `url` for close icon that is used as a button to close commenting fields. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     closeIconURL: '/img/close-icon.png',
     *     // ...
     * };
     * ```
     */
    closeIconURL?: string;
}
