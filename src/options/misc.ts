export interface Misc {
    /**
     * An array of `CSSStyleSheet` to be applied to element's [adoptedStyleSheets]{@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets}.
     *
     * @default [STYLE_SHEET]
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     styles: [STYLE_SHEET, myMaterialStyleSheet],
     *     // ...
     * };
     * ```
     */
    styles?: CSSStyleSheet[];
    /**
     * A `css` value for the highlight color that is used for example to highlight active sorting button and comments by admin
     *
     * @default '#2793e6'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     highlightColor: 'blue',
     *     // ...
     * };
     * ```
     */
    highlightColor?: string;
    /**
     * A `css` value for the color of the delete button
     *
     * @default '#c9302c'
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     deleteButtonColor: 'red',
     *     // ...
     * };
     * ```
     */
    deleteButtonColor?: string;
    /**
     * An `enum` value determining the default sorting. For possible values see {@see SortKey}.
     *
     * @default SortKey.NEWEST
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     defaultNavigationSortKey: SortKey.POPULARITY,
     *     // ...
     * };
     * ```
     */
    defaultNavigationSortKey?: SortKey;
    /**
     * A `boolean` value determining whether profile pictures are rounded
     *
     * @default false
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     roundProfilePictures: true,
     *     // ...
     * };
     * ```
     */
    roundProfilePictures?: boolean,
    /**
     * An `integer` value determining how many rows there are in the commenting fields
     *
     * @default 2
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     textareaRows: 3,
     *     // ...
     * };
     * ```
     */
    textareaRows?: number,
    /**
     * An `integer` value determining how many rows there are in the commenting fields on focus
     *
     * @default 2
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     textareaRowsOnFocus: 4,
     *     // ...
     * };
     * ```
     */
    textareaRowsOnFocus?: number,
    /**
     * An `integer` or a `boolean` value determining the maximum amount of replies that are visibile intially under a comment.
     * The hidden replies can be shown by clicking the button with a text set in `viewAllRepliesText` option.
     * If set to false all replies will always be visible.
     *
     * @default 2
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     maxRepliesVisible: 3,
     *     // ...
     * };
     * ```
     */
    maxRepliesVisible?: number | false,
}

export enum SortKey {
    POPULARITY = 'popularity',
    OLDEST = 'oldest',
    NEWEST = 'newest',
    ATTACHMENTS = 'attachments'
}
