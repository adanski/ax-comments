import {ProfilePictureFactory} from './profile-picture-factory.js';
import {CommentContentFormatter} from './comment-content-formatter.js';
import {TagFactory} from './tag-factory.js';
import {CommentsOptions} from '../api.js';
import {CommentsById} from '../comments-by-id.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {getHostContainer} from '../html-util.js';
import sanitize from 'sanitize-html';

@RegisterCustomElement('ax-comment-container')
export class CommentContainerElement extends HTMLElement implements WebComponent {

    commentModel!: Record<string, any>;

    private container!: HTMLElement
    private options!: CommentsOptions;
    private commentsById!: CommentsById;
    private profilePictureFactory!: ProfilePictureFactory;
    private tagFactory!: TagFactory;
    private commentContentFormatter!: CommentContentFormatter;

    static create(options: Pick<CommentContainerElement, 'commentModel'>): CommentContainerElement {
        const commentContainerEl: CommentContainerElement = document.createElement('ax-comment-container') as CommentContainerElement;
        Object.assign(commentContainerEl, options);
        return commentContainerEl;
    }

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    #initServices(): void {
        this.container = getHostContainer(this);
        this.options = OptionsProvider.get(this.container)!;
        this.commentsById = CommentsProvider.get(this.container)!;
        this.profilePictureFactory = ServiceProvider.get(this.container, ProfilePictureFactory);
        this.tagFactory = ServiceProvider.get(this.container, TagFactory);
        this.commentContentFormatter = ServiceProvider.get(this.container, CommentContentFormatter);
    }

    #initElement(commentModel: Record<string, any> = this.commentModel): void {
        const commentWrapper: HTMLDivElement = document.createElement('div');
        commentWrapper.classList.add('comment-wrapper');

        // Profile picture
        const profilePicture: HTMLElement = this.profilePictureFactory.createProfilePictureElement(commentModel.profilePictureURL, commentModel.creator);

        // Time
        const time: HTMLTimeElement = document.createElement('time');
        time.textContent = this.options.timeFormatter(commentModel.created);
        time.setAttribute('data-original', commentModel.created);

        // Comment header element
        const commentHeaderEl: HTMLDivElement = document.createElement('div');
        commentHeaderEl.classList.add('comment-header');

        // Name element
        const nameEl: HTMLSpanElement = document.createElement('span');
        nameEl.textContent = commentModel.createdByCurrentUser ? this.options.textFormatter(this.options.youText) : commentModel.fullname;
        nameEl.classList.add('name');
        nameEl.setAttribute('data-user-id', commentModel.creator);
        commentHeaderEl.append(nameEl);


        // Highlight admin names
        if (commentModel.createdByAdmin) {
            nameEl.classList.add('highlight-font-bold');
        }

        // Show reply-to name if parent of parent exists
        if (commentModel.parent) {
            const parent = this.commentsById[commentModel.parent];
            if (parent.parent) {
                const replyTo: HTMLSpanElement = document.createElement('span');
                replyTo.textContent = parent.fullname;
                replyTo.classList.add('reply-to');
                replyTo.setAttribute('data-user-id', parent.creator);

                // reply icon
                const replyIcon: HTMLElement = document.createElement('i');
                replyIcon.classList.add('fa', 'fa-share');

                if (this.options.replyIconURL.length) {
                    replyIcon.style.backgroundImage = `url("${this.options.replyIconURL}")`;
                    replyIcon.classList.add('image');
                }

                replyTo.prepend(replyIcon);
                commentHeaderEl.append(replyTo);
            }
        }

        // New tag
        if (commentModel.isNew) {
            const newTag: HTMLSpanElement = document.createElement('span');
            newTag.classList.add('new', 'highlight-background');
            newTag.textContent = this.options.textFormatter(this.options.newText);
            commentHeaderEl.append(newTag);
        }

        // Wrapper
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.classList.add('wrapper');

        // Content
        // =======
        const content: HTMLDivElement = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = sanitize(this.commentContentFormatter.getFormattedCommentContent(commentModel));

        // Edited timestamp
        if (commentModel.modified && commentModel.modified !== commentModel.created) {
            const editedTime: string = this.options.timeFormatter(commentModel.modified);
            const edited: HTMLTimeElement = document.createElement('time');
            edited.classList.add('edited');
            edited.textContent = `${this.options.textFormatter(this.options.editedText)} ${editedTime}`;
            edited.setAttribute('data-original', commentModel.modified);

            content.append(edited);
        }

        // Attachments
        // ===========
        const attachments: HTMLDivElement = document.createElement('div');
        attachments.classList.add('attachments');
        const attachmentPreviews: HTMLDivElement = document.createElement('div');
        attachmentPreviews.classList.add('previews');
        const attachmentTags: HTMLDivElement = document.createElement('div');
        attachmentTags.classList.add('tags');
        attachments.append(attachmentPreviews, attachmentTags);

        if (this.options.enableAttachments && commentModel.hasAttachments()) {
            commentModel.attachments.forEach((attachment: any) => {
                let format = undefined;
                let type = undefined;

                // Type and format
                if (attachment.mime_type) {
                    const mimeTypeParts = attachment.mime_type.split('/');
                    if (mimeTypeParts.length === 2) {
                        format = mimeTypeParts[1];
                        type = mimeTypeParts[0];
                    }
                }

                // Preview
                if (type === 'image' || type === 'video') {
                    const previewRow = document.createElement('div');

                    // Preview element
                    const preview: HTMLAnchorElement = document.createElement('a');
                    preview.classList.add('preview');
                    preview.href = attachment.file;
                    preview.target = '_blank';
                    previewRow.append(preview);

                    if (type === 'image') { // Case: image preview
                        const image: HTMLImageElement = document.createElement('img');
                        image.src = attachment.file;
                        preview.append(image);
                    } else { // Case: video preview
                        const video: HTMLVideoElement = document.createElement('video');
                        video.controls = true;
                        const videoSource: HTMLSourceElement = document.createElement('source');
                        videoSource.src = attachment.file;
                        videoSource.type = attachment.mime_type;
                        video.append(videoSource);
                        preview.append(video);
                    }
                    attachmentPreviews.append(previewRow);
                }

                // Tag element
                const attachmentTag: HTMLElement = this.tagFactory.createAttachmentTagElement(attachment, false);
                attachmentTags.append(attachmentTag);
            });
        }

        // Actions
        // =======
        const actions: HTMLSpanElement = this.#createActions(commentModel);

        wrapper.append(content, attachments, actions);
        commentWrapper.append(profilePicture, time, commentHeaderEl, wrapper);
        this.appendChild(commentWrapper);
    }

    #createActions(commentModel: Record<string, any>): HTMLSpanElement {
        const actions: HTMLSpanElement = document.createElement('span');
        actions.classList.add('actions');

        // Separator
        const separator: HTMLSpanElement = document.createElement('span');
        separator.classList.add('separator');
        separator.textContent = '·';

        // Append buttons for actions that are enabled
        // Reply
        if (this.options.enableReplying) {
            const reply: HTMLButtonElement = document.createElement('button');
            reply.type = 'button';
            reply.classList.add('action', 'reply');
            reply.textContent = this.options.textFormatter(this.options.replyText);
            actions.append(reply);
        }

        // Upvotes
        if (this.options.enableUpvoting) {
            const upvotes: HTMLElement = this.#createUpvoteElement(commentModel);
            actions.append(upvotes);
        }

        if (commentModel.createdByCurrentUser || this.options.currentUserIsAdmin) {
            const editButton: HTMLButtonElement = document.createElement('button');
            editButton.classList.add('action', 'edit');
            editButton.textContent = this.options.textFormatter(this.options.editText);
            actions.append(editButton);
        }

        // Append separators between the actions
        const actionsChildren: HTMLElement[] = [...actions.children] as HTMLElement[];
        for (let i: number = 0; i < actionsChildren.length; i++) {
            const action: HTMLElement = actionsChildren[i];
            if (action.nextSibling) {
                action.after(separator.cloneNode(true))
            }
        }

        return actions;
    }

    #createUpvoteElement(commentModel: Record<string, any>): HTMLElement {
        // Upvote icon
        const upvoteIcon: HTMLElement = document.createElement('i');
        upvoteIcon.classList.add('fa', 'fa-thumbs-up');
        if (this.options.upvoteIconURL.length) {
            upvoteIcon.style.backgroundImage = `url("${this.options.upvoteIconURL}")`;
            upvoteIcon.classList.add('image');
        }

        // Upvotes
        const upvoteEl: HTMLButtonElement = document.createElement('button');
        upvoteEl.classList.add('action', 'upvote', commentModel.userHasUpvoted ? 'highlight-font' : 'not-upvoted');
        const upvoteCount: HTMLSpanElement = document.createElement('span');
        upvoteCount.classList.add('upvote-count')
        upvoteCount.textContent = commentModel.upvoteCount;
        upvoteEl.append(upvoteCount, upvoteIcon);

        return upvoteEl;
    }

    reRenderUpvotes(): void {
        const commentModel: Record<string, any> = this.commentModel;
        const upvotes: HTMLElement = this.#createUpvoteElement(commentModel);

        this.querySelector('.upvote')!.replaceWith(upvotes);
    }

    reRenderCommentActionBar(): void {
        const commentModel: Record<string, any> = this.commentModel;
        const actions: HTMLSpanElement = this.#createActions(commentModel);

        this.querySelector('.actions')!.replaceWith(actions);
    }
}
