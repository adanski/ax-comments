export interface CommentModel {
    id: CommentId;
    // Required if replying is enabled
    parentId?: CommentId;
    createdAt: Date;
    // Required if editing is enabled
    modifiedAt?: Date;
    content: string;
    // Required if attachments are enabled
    attachments?: AttachmentModel[];
    // Required if pinging is enabled
    pings?: UserDisplayNamesById;
    creatorUserId: UserId;
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

export interface CommentModelWithUpvotes extends CommentModel {
    upvoteCount: number;
    upvotedByCurrentUser: boolean;
}

export type CommentId = string;

export type UserId = string;

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
    [userId: UserId]: string;
}

export interface PingableUser {
    id: UserId;
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

export interface AttachmentModel<F extends File | string = File | string> {
    id: AttachmentId;
    file: F;
    mimeType: string;
}

export type AttachmentId = string;
