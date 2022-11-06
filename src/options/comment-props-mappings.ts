/**
 * A `dictionary` that is used to map the fields between ax-comments and the server.
 * The keys of the dictionary represent field names used within the ax-comments whereas the values represent the field names from your API.
 * In callback functions the data is remapped to match with your API, so you can use the comment data as such.
 *
 * @default
 * ```javascript
 * fieldMappings: {
 *     id: 'id',
 *     parent: 'parent',
 *     created: 'created',
 *     modified: 'modified',
 *     content: 'content',
 *     attachments: 'attachments',
 *     pings: 'pings',
 *     creator: 'creator',
 *     fullname: 'fullname',
 *     profilePictureURL: 'profile_picture_url',
 *     isNew: 'is_new',
 *     createdByAdmin: 'created_by_admin',
 *     createdByCurrentUser: 'created_by_current_user',
 *     upvoteCount: 'upvote_count',
 *     userHasUpvoted: 'user_has_upvoted'
 * }
 * ```
 * @example
 * ```javascript
 * const commentsElement = document.createElement('ax-comments');
 * commentsElement.options = {
 *     // ...
 *     fieldMappings: {
 *         parent: 'comment_id',
 *         modified: 'edited',
 *         fullname: 'name',
 *         profilePictureURL: 'user_image',
 *         upvoteCount: 'upvotes',
 *     },
 *     // ...
 * };
 * ```
 */
export interface CommentPropsMappings {
    id: string;
    // Required if replying is enabled
    parent?: string;
    created: string;
    // Required if editing is enabled
    modified?: string;
    content: string;
    // Required if attachments are enabled
    attachments?: string;
    // Required if pinging is enabled
    pings?: string;
    // Required if pinging is enabled
    creator?: string;
    fullname: string;
    profilePictureURL?: string;
    isNew?: string;
    createdByAdmin?: string;
    // Required if editing is enabled
    createdByCurrentUser?: string;
    // Required if upvoting is enabled
    upvoteCount?: string;
    // Required if upvoting is enabled
    userHasUpvoted?: string;
}
