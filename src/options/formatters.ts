export interface Formatters {
    /**
     * A callback `function` that is called for timestamps before inserting to DOM. Can be used for relative times for instance.
     *
     * @default function returning relative time
     * @example
     * ```javascript
     * const commentsElement = document.createElement('ax-comments');
     * commentsElement.options = {
     *     // ...
     *     timeFormatter: (time) => {
     *         return moment(time).fromNow();
     *     },
     *     // ...
     * };
     * ```
     */
    timeFormatter?(timestamp: Date): string;
}
