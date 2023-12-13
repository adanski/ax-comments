import {AttachmentModel, CommentModel, CommentModelWithUpvotes, PingableUser, ReferenceableHashtag} from './models.js';

export interface Callbacks {
    /**
     * A callback `function` that is called after the comments have been rendered
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     refresh: () => this.refreshed = true,
     *     // ...
     * };
     * ```
     */
    refresh?(): void;
    /**
     * A callback `function` that is used to fetch the comments array from the server.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the comment array as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     getComments: (success, error) => {
     *         fetch('/api/comments/')
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    getComments(success: SuccessFct<CommentModel[]>, error: ErrorFct): void;
    /**
     * A callback `function` that is used for searching users when pinging by typing `@`.
     * See also {@see Functionalities#enablePinging} for more information.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the user array as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     searchUsers: (term, success, error) => {
     *         fetch('/api/users/?search=' + term)
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    searchUsers?(term: string, success: SuccessFct<PingableUser[]>, error: ErrorFct): void;
    /**
     * A callback `function` that is used for suggesting trending hashtags when typing `#`.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the tag array as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     searchTags: (term, success, error) => {
     *         fetch('/api/trending/?search=' + term)
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    searchTags?(term: string, success: SuccessFct<ReferenceableHashtag[]>, error: ErrorFct): void;
    /**
     * A callback `function` that is used to create a new comment to the server.
     * The first parameter of the callback is `comment` that contains the data of the new comment.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the created comment as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     postComment: (comment, success, error) => {
     *         fetch('/api/comments', {
     *             method: 'POST',
     *             body: JSON.stringify(comment),
     *             headers: {
     *                 'Content-type': 'application/json; charset=UTF-8'
     *             }
     *         })
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    postComment(comment: CommentModel, success: SuccessFct<CommentModel>, error: ErrorFct): void;
    /**
     * A callback `function` that is used to update an existing comment on the server.
     * The first parameter of the callback is `comment` that contains the data of the updated comment.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the updated comment as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     putComment: (comment, success, error) => {
     *         fetch('/api/comments', {
     *             method: 'PUT',
     *             body: JSON.stringify(comment),
     *             headers: {
     *                 'Content-type': 'application/json; charset=UTF-8'
     *             }
     *         })
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    putComment?(comment: CommentModel, success: SuccessFct<CommentModel>, error: ErrorFct): void;
    /**
     * A callback `function` that is used to delete an existing comment on the server.
     * The first parameter of the callback is `comment` that contains the data of the comment to delete.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the updated (with removal reason in `content` property) comment as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     deleteComment: (comment, success, error) => {
     *         fetch('/api/comments', {
     *             method: 'DELETE',
     *             body: JSON.stringify(comment),
     *             headers: {
     *                 'Content-type': 'application/json; charset=UTF-8'
     *             }
     *         })
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    deleteComment?(comment: CommentModel, success: SuccessFct<CommentModel>, error: ErrorFct): void;
    /**
     * A callback `function` that is used to upvote an existing comment on the server.
     * The first parameter of the callback is `comment` that contains the data of the comment to upvote.
     * The callback provides both `success` and `error` callbacks which should be called based on the result from the server.
     * The `success` callback takes the upvoted comment as a parameter.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     upvoteComment: (comment, success, error) => {
     *         fetch(`/api/comments/${comment.id}/upvote`, {
     *             method: 'PATCH',
     *             body: JSON.stringify({
     *                 userAction: comment.userHasUpvoted ? 'UPVOTED' : 'UNDID_UPVOTE'
     *             }),
     *             headers: {
     *                 'Content-type': 'application/json; charset=UTF-8'
     *             }
     *         })
     *             .then((response) => response.json())
     *             .then(success, error)
     *     },
     *     // ...
     * };
     * ```
     */
    upvoteComment?(comment: CommentModelWithUpvotes, success: SuccessFct<CommentModelWithUpvotes>, error: ErrorFct): void;
    /**
     * A callback `function` that is used to validate attachments prior uploading them to server.
     * The first parameter of the callback is `attachments` array including all the attachments to be uploaded.
     * The `accept` callback takes an array of validated attachments as a parameter.
     *
     * Please see `Working with attachments` for more information.
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     validateAttachments: (attachments, accept) => {
     *         const maxSizeInBytes = 5 * 1024 * 1024;
     *         accept(attachments.filter(a => a.file.size <= maxSizeInBytes));
     *     },
     *     // ...
     * };
     * ```
     */
    validateAttachments?(attachments: AttachmentModel<File>[], accept: AcceptFct<AttachmentModel<File>[]>): void;
    /**
     * A callback `function` that is called after user has clicked a `#` hashtag
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     hashtagClicked: (hashtag) => {
     *         location.hash = 'tags/' + hashtag
     *     },
     *     // ...
     * };
     * ```
     */
    hashtagClicked?(hashtag: string): void;
    /**
     * A callback `function` that is called after user has clicked a `@` ping
     *
     * @default noop
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     pingClicked: (userId) => {
     *         location.hash = 'users/' + userId
     *     },
     *     // ...
     * };
     * ```
     */
    pingClicked?(userId: string): void;
}

export type SuccessFct<T> = (data: T) => void;

export type AcceptFct<T> = (data: T) => void;

export type ErrorFct = (e: any) => void;
