export interface CommentModel {
    id: string;
    // Required if replying is enabled
    parentId?: string;
    createdAt: Date;
    // Required if editing is enabled
    modifiedAt?: Date;
    content: string;
    // Required if attachments are enabled
    attachments?: object[];
    // Required if pinging is enabled
    pings?: UserDisplayNamesById;
    creatorUserId: string;
    creatorDisplayName?: string;
    creatorProfilePictureURL?: string;
    isNew?: boolean;
    isDeleted?: boolean;
    createdByAdmin?: boolean;
    // Required if editing is enabled
    createdByCurrentUser?: boolean;
    // Required if upvoting is enabled
    upvoteCount?: number;
    // Required if upvoting is enabled
    upvotedByCurrentUser?: boolean;
}

/**
 * User dictionary in the following format:
 * ```javascript
 * {
 *     id1: userDisplayName1,
 *     id2: userDisplayName2,
 *     // ...
 * }
 * ```
 */
export interface UserDisplayNamesById {
    [userId: string]: string;
}

export interface PingableUser {
    id: string;
    displayName?: string;
    email?: string;
    profilePictureURL?: string;
}

export interface ReferenceableHashtag {
    /**
     * Hashtag name
     */
    tag: string;
    /**
     * Description, for example recent popularity, eg. 'Used 50 times in the past hour' or 'Followed by 50 users'.
     */
    description?: string;
}
