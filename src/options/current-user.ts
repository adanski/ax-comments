export interface CurrentUser {
    /**
     * A `url` for a profile picture of the current user. Not required if Font Awesome is used.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     profilePictureURL: '/user_profiles/user-icon.png',
     *     // ...
     * };
     * ```
     */
    profilePictureURL?: string;
    /**
     * A `boolean` value determining whether the current user is administrator.
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     currentUserIsAdmin: true,
     *     // ...
     * };
     * ```
     */
    currentUserIsAdmin: boolean;
    /**
     * A `string` value of the current user's id.
     *
     * @default ''
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     currentUserId: '1',
     *     // ...
     * };
     * ```
     */
    currentUserId?: string;
}
