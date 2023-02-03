import {CommentsOptions, SortKey, STYLE_SHEET} from './api.js';
import {noop} from './util.js';

export function getDefaultOptions(): Required<CommentsOptions> {
    return {
        // CurrentUser
        profilePictureURL: '',
        currentUserIsAdmin: false,
        currentUserId: '',

        // Icons
        spinnerIconURL: '',
        upvoteIconURL: '',
        replyIconURL: '',
        uploadIconURL: '',
        attachmentIconURL: '',
        noCommentsIconURL: '',
        closeIconURL: '',

        // Labels
        textareaPlaceholderText: 'Add a comment',
        newestText: 'Newest',
        oldestText: 'Oldest',
        popularText: 'Popular',
        commentsHeaderText: 'Comments (__commentCount__)',
        sendText: 'Send',
        replyText: 'Reply',
        editText: 'Edit',
        editedText: 'Edited',
        youText: 'You',
        saveText: 'Save',
        deleteText: 'Delete',
        newText: 'New',
        viewAllRepliesText: 'View all __replyCount__ replies',
        hideRepliesText: 'Hide replies',
        noCommentsText: 'No comments',
        attachmentDropText: 'Drop files here',

        // Functionalities
        enableReplying: true,
        enableEditing: true,
        enableUpvoting: true,
        enableDeleting: true,
        enableAttachments: false,
        enableHashtags: false,
        enablePinging: false,
        enableDeletingCommentWithReplies: false,
        postCommentOnEnter: false,
        forceResponsive: false,
        readOnly: false,
        defaultNavigationSortKey: SortKey.NEWEST,

        // Callbacks
        searchUsers: (term, success, error) => success([]),
        searchTags: (term, success, error) => success([{tag: term}]),
        getComments: (success, error) => success([]),
        postComment: (comment, success, error) => success(comment),
        putComment: (comment, success, error) => success(comment),
        deleteComment: (comment, success, error) => success({
            ...comment,
            content: 'Deleted',
            isDeleted: true
        }),
        upvoteComment: (comment, success, error) => success(comment),
        validateAttachments: (attachments, accept) => accept(attachments),
        hashtagClicked: noop,
        pingClicked: noop,
        refresh: noop,

        // Formatters
        timeFormatter: getDefaultTimeFormatter(),

        // Misc
        styles: [STYLE_SHEET],
        highlightColor: '#2793e6',
        deleteButtonColor: '#c9302c',

        highlightOwnComments: true,
        roundProfilePictures: false,
        textareaRows: 2,
        textareaRowsOnFocus: 3,
        maxRepliesVisible: 2,
    };

}

function getDefaultTimeFormatter(): (timestamp: Date) => string {
    const rtf: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat();

    return timestamp => {
        const epochNow = Math.floor(new Date().getTime() / 1000);
        const epochTimestamp = Math.floor(timestamp.getTime() / 1000);
        // Difference in seconds
        const diff = epochTimestamp - epochNow;

        if (diff > -60) { // Less than a minute has passed
            return rtf.format(diff, 'second');
        } else if (diff > -3600) { // Less than an hour has passed
            return rtf.format(Math.floor(diff / 60), 'minute');
        } else if (diff > -86400) { // Less than a day has passed
            return rtf.format(Math.floor(diff / 3600), 'hour');
        } else if (diff > -2620800) { // Less than a month has passed
            return rtf.format(Math.floor(diff / 86400), 'day');
        } else if (diff > -7862400) { // Less than three months has passed
            return rtf.format(Math.floor(diff / 2620800), 'week');
        } else { // More time has passed
            return timestamp.toLocaleDateString(undefined, {dateStyle: 'short'})
                + ' '
                + timestamp.toLocaleTimeString(undefined, {timeStyle: 'short'});
        }
    };
}
