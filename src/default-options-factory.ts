export function getDefaultOptions(scrollContainer: HTMLElement): Record<string, any> {
    return {

        // User
        profilePictureURL: '',
        currentUserIsAdmin: false,
        currentUserId: null,

        // Font awesome icon overrides
        spinnerIconURL: '',
        upvoteIconURL: '',
        replyIconURL: '',
        uploadIconURL: '',
        attachmentIconURL: '',
        noCommentsIconURL: '',
        closeIconURL: '',

        // Strings to be formatted (for example localization)
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
        textFormatter: (text: string) => text,

        // Functionalities
        enableReplying: true,
        enableEditing: true,
        enableUpvoting: true,
        enableDeleting: true,
        enableAttachments: false,
        enableHashtags: false,
        enablePinging: false,
        enableDeletingCommentWithReplies: false,
        enableNavigation: true,
        postCommentOnEnter: false,
        forceResponsive: false,
        readOnly: false,
        defaultNavigationSortKey: 'newest',

        // Colors
        highlightColor: '#2793e6',
        deleteButtonColor: '#C9302C',

        scrollContainer: scrollContainer,
        roundProfilePictures: false,
        textareaRows: 2,
        textareaRowsOnFocus: 2,
        textareaMaxRows: 5,
        maxRepliesVisible: 2,

        fieldMappings: {
            id: 'id',
            parent: 'parent',
            created: 'created',
            modified: 'modified',
            content: 'content',
            attachments: 'attachments',
            pings: 'pings',
            creator: 'creator',
            fullname: 'fullname',
            profilePictureURL: 'profile_picture_url',
            isNew: 'is_new',
            createdByAdmin: 'created_by_admin',
            createdByCurrentUser: 'created_by_current_user',
            upvoteCount: 'upvote_count',
            userHasUpvoted: 'user_has_upvoted'
        },

        searchUsers: (term: string, success: Function, error: Function) => {success([])},
        getComments: (success: Function, error: Function) => {success([])},
        postComment: (commentJSON: string, success: Function, error: Function) => {success(commentJSON)},
        putComment: (commentJSON: string, success: Function, error: Function) => {success(commentJSON)},
        deleteComment: (commentJSON: string, success: Function, error: Function) => {success()},
        upvoteComment: (commentJSON: string, success: Function, error: Function) => {success(commentJSON)},
        validateAttachments: (attachments: any[], callback: Function) => callback(attachments),
        hashtagClicked: (hashtag: string) => {},
        pingClicked: (userId: string) => {},
        refresh: () => {},
        timeFormatter: (time: number | string | Date) => new Date(time).toLocaleDateString()
    };

}
