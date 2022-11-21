import {ProfilePictureFactory} from './profile-picture-factory.js';
import {CommentContentFormatter} from './comment-content-formatter.js';
import {TagFactory} from './tag-factory.js';
import {CommentsOptions} from '../api.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from '../provider.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {getHostContainer} from '../html-util.js';
import sanitize from 'sanitize-html';
import {ButtonElement} from './button-element.js';
import {CommentViewModel} from '../comment-view-model.js';
import {CommentModelEnriched} from '../comments-by-id.js';

@RegisterCustomElement('ax-comment-container')
export class CommentContainerElement extends HTMLElement implements WebComponent {

    commentModel!: CommentModelEnriched;

    #options!: Required<CommentsOptions>;
    #commentViewModel!: CommentViewModel;
    #profilePictureFactory!: ProfilePictureFactory;
    #tagFactory!: TagFactory;
    #commentContentFormatter!: CommentContentFormatter;

    static create(options: Pick<CommentContainerElement, 'commentModel'>): CommentContainerElement {
        const commentContainer: CommentContainerElement = document.createElement('ax-comment-container') as CommentContainerElement;
        Object.assign(commentContainer, options);
        return commentContainer;
    }

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    disconnectedCallback(): void {
        this.innerHTML = '';
    }

    #initServices(): void {
        if (this.#options) return;
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container);
        this.#commentViewModel = CommentViewModelProvider.get(container);
        this.#profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
        this.#tagFactory = ServiceProvider.get(container, TagFactory);
        this.#commentContentFormatter = ServiceProvider.get(container, CommentContentFormatter);
    }

    #initElement(): void {
        const commentWrapper: HTMLDivElement = document.createElement('div');
        commentWrapper.classList.add('comment-wrapper');

        // Profile picture
        const profilePicture: HTMLElement = this.#profilePictureFactory.createProfilePictureElement(
            this.commentModel.creatorUserId,
            this.commentModel.creatorProfilePictureURL
        );

        // Time
        const time: HTMLTimeElement = document.createElement('time');
        time.textContent = this.#options.timeFormatter(this.commentModel.createdAt);
        time.setAttribute('data-original', this.commentModel.createdAt.toISOString());

        // Comment header element
        const commentHeaderEl: HTMLDivElement = document.createElement('div');
        commentHeaderEl.classList.add('comment-header');

        // Name element
        const nameEl: HTMLSpanElement = document.createElement('span');
        nameEl.textContent = this.commentModel.createdByCurrentUser
            ? this.#options.youText
            : (this.commentModel.creatorDisplayName || this.commentModel.creatorUserId);
        nameEl.classList.add('name');
        nameEl.setAttribute('data-user-id', this.commentModel.creatorUserId);
        commentHeaderEl.append(nameEl);


        // Highlight admin names
        if (this.commentModel.createdByAdmin) {
            nameEl.classList.add('highlight-font-bold');
        }

        // Show reply-to name if parent of parent exists
        if (this.commentModel.parentId) {
            const parent = this.#commentViewModel.getComment(this.commentModel.parentId)!;
            if (parent.parentId) {
                const replyTo: HTMLSpanElement = document.createElement('span');
                replyTo.textContent = parent.creatorDisplayName || parent.creatorUserId;
                replyTo.classList.add('reply-to');
                replyTo.setAttribute('data-user-id', parent.creatorUserId);

                // reply icon
                const replyIcon: HTMLElement = document.createElement('i');
                replyIcon.classList.add('fa', 'fa-share');

                if (this.#options.replyIconURL.length) {
                    replyIcon.style.backgroundImage = `url("${this.#options.replyIconURL}")`;
                    replyIcon.classList.add('image');
                }

                replyTo.prepend(replyIcon);
                commentHeaderEl.append(replyTo);
            }
        }

        // New tag
        if (this.commentModel.isNew) {
            const newTag: HTMLSpanElement = document.createElement('span');
            newTag.classList.add('new', 'highlight-background');
            newTag.textContent = this.#options.newText;
            commentHeaderEl.append(newTag);
        }

        // Wrapper
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.classList.add('wrapper');

        // Content
        // =======
        const content: HTMLDivElement = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = sanitize(this.#commentContentFormatter.getFormattedCommentContent(this.commentModel));

        // Edited timestamp
        if (this.commentModel.modifiedAt && this.commentModel.modifiedAt !== this.commentModel.createdAt) {
            const editedTime: string = this.#options.timeFormatter(this.commentModel.modifiedAt);
            const edited: HTMLTimeElement = document.createElement('time');
            edited.classList.add('edited');
            edited.textContent = `${this.#options.editedText} ${editedTime}`;
            edited.setAttribute('data-original', this.commentModel.modifiedAt.toISOString());

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

        if (this.#options.enableAttachments && this.commentModel.hasAttachments()) {
            this.commentModel.attachments?.forEach((attachment: any) => {
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
                const attachmentTag: HTMLElement = this.#tagFactory.createAttachmentTagElement(attachment);
                attachmentTags.append(attachmentTag);
            });
        }

        // Actions
        // =======
        const actions: HTMLSpanElement = this.#createActions(this.commentModel);

        wrapper.append(content, attachments, actions);
        commentWrapper.append(profilePicture, time, commentHeaderEl, wrapper);
        this.appendChild(commentWrapper);
    }

    #createActions(commentModel: CommentModelEnriched): HTMLSpanElement {
        const actions: HTMLSpanElement = document.createElement('span');
        actions.classList.add('actions');

        // Separator
        const separator: HTMLSpanElement = document.createElement('span');
        separator.classList.add('separator');
        separator.textContent = '·';

        // Append buttons for actions that are enabled
        // Reply
        if (this.#options.enableReplying) {
            const reply: HTMLButtonElement = document.createElement('button');
            reply.type = 'button';
            reply.classList.add('action', 'reply');
            reply.textContent = this.#options.replyText;
            actions.append(reply);
        }

        // Upvotes
        if (this.#options.enableUpvoting) {
            const upvotes: ButtonElement = ButtonElement.createUpvoteButton(commentModel);
            actions.append(upvotes);
        }

        if (commentModel.createdByCurrentUser || this.#options.currentUserIsAdmin) {
            const editButton: HTMLButtonElement = document.createElement('button');
            editButton.classList.add('action', 'edit');
            editButton.textContent = this.#options.editText;
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

    reRenderCommentActionBar(): void {
        const commentModel: CommentModelEnriched = this.commentModel;
        const actions: HTMLSpanElement = this.#createActions(commentModel);

        this.querySelector('.actions')!.replaceWith(actions);
    }
}
