import {CommentsOptions, SortKey, STYLE_SHEET} from './api.js';

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
        attachmentsText: 'Attachments',
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
        noAttachmentsText: 'No attachments',
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
            content: 'Deleted'
        }),
        upvoteComment: (comment, success, error) => success(comment),
        validateAttachments: (attachments, accept) => accept(attachments),
        hashtagClicked: (hashtag) => {},
        pingClicked: (userId) => {},
        refresh: () => {},

        // Formatters
        timeFormatter: (time) => new Date(time).toLocaleDateString(),

        // Misc
        styles: [STYLE_SHEET],
        highlightColor: '#2793e6',
        deleteButtonColor: '#c9302c',

        roundProfilePictures: false,
        textareaRows: 2,
        textareaRowsOnFocus: 3,
        maxRepliesVisible: 2,
    };

}
