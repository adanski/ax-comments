export interface Functionalities {
    /**
     * A `boolean` value determining whether replying is enabled
     *
     * @default true
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableReplying: false,
     *     // ...
     * };
     * ```
     */
    enableReplying?: boolean;
    /**
     * A `boolean` value determining whether editing is enabled
     *
     * @default true
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableEditing: false,
     *     // ...
     * };
     * ```
     */
    enableEditing?: boolean;
    /**
     * A `boolean` value determining whether upvoting is enabled
     *
     * @default true
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableUpvoting: false,
     *     // ...
     * };
     * ```
     */
    enableUpvoting?: boolean;
    /**
     * A `boolean` value determining whether deleting is enabled
     *
     * @default true
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableDeleting: false,
     *     // ...
     * };
     * ```
     */
    enableDeleting?: boolean;
    /**
     * A `boolean` value determining whether attachments are enabled
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableAttachments: true,
     *     // ...
     * };
     * ```
     */
    enableAttachments?: boolean;
    /**
     * A `boolean` value determining whether hashtags are enabled.
     * Enabling this functionality highlights the hashtags
     * and the `hashtagClicked` callback function will be executed has the user clicked a hashtag.
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableHashtags: true,
     *     // ...
     * };
     * ```
     */
    enableHashtags?: boolean;
    /**
     * A `boolean` value determining whether pinging users is enabled.
     * Enabling this functionality highlights the pings
     * and the `pingClicked` callback function will be executed has the user clicked a ping.
     *
     * - The feature depends on a library called `textcomplete`
     * - You need to implement the `searchUsers` callback function which returns a list of all users matching the ping
     * - ax-comments assumes that the pings are sent to the server in format @<user_id>, for example @coolNick
     * - ax-comments assumes that the pings are returned from the server as a dictionary of display names indexed by user ids.
     * Keep in mind `pings` array is completely optional and if it's not provided the user ids will be used as display names.
     *
     * @example
     * Example of a content and pings array returned by the server.
     * ```javascript
     * {
     *     // ...
     *     content: 'What do you think @coolNick?',
     *     pings: {'coolNick': 'Bryan Connery'},
     *     // ...
     * }
     * ```
     * Which will result in the following message: `What do you think @Bryan Connery?`
     *
     * @example
     * Configuration
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enablePinging: true,
     *     // ...
     * };
     * ```
     * @default false
     */
    enablePinging?: boolean;
    /**
     * A `boolean` value determining whether user is allowed to delete own comment that has replies (replies will be deleted as well)
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     enableDeletingCommentWithReplies: true,
     *     // ...
     * };
     * ```
     */
    enableDeletingCommentWithReplies?: boolean;
    /**
     * A `boolean` value determining whether comments will be posted by pressing enter
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     postCommentOnEnter: true,
     *     // ...
     * };
     * ```
     */
    postCommentOnEnter?: boolean;
    /**
     * A `boolean` value determining whether the main navigation elements are presented in a dropdown
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     forceResponsive: true,
     *     // ...
     * };
     * ```
     */
    forceResponsive?: boolean;
    /**
     * A `boolean` value determining whether the actions are enabled
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     readOnly: true,
     *     // ...
     * };
     * ```
     */
    readOnly?: boolean;
}
