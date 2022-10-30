export interface CommentsOptions extends Record<string, any> {
    fieldMappings: CommentFieldMappings;
}

export interface CommentFieldMappings {
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
