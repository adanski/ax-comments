import {ProfilePictureFactory} from './profile-picture-factory.js';
import {ButtonElement} from './button-element.js';
import {Textcomplete} from '@textcomplete/core';
import {TagFactory} from './tag-factory.js';
import {TextareaElement} from './textarea-element.js';
import {CommentsOptions} from '../api.js';
import {areArraysEqual, isStringEmpty} from '../util.js';
import {CommentsById} from '../comments-by-id.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from '../provider.js';
import {CommentUtil} from '../comment-util.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {findSiblingsBySelector, getHostContainer} from '../html-util.js';
import {TextcompleteFactory} from './textcomplete-factory.js';

@RegisterCustomElement('ax-commenting-field', {extends: 'li'})
export class CommentingFieldElement extends HTMLLIElement implements WebComponent {

    parentId: string | null = null;
    existingCommentId: string | null = null;
    isMain: boolean = false;

    #textcomplete: Textcomplete | undefined;

    private container!: HTMLElement;
    private options!: CommentsOptions;
    private commentsById!: CommentsById;
    private profilePictureFactory!: ProfilePictureFactory;
    private textcompleteFactory!: TextcompleteFactory;
    private tagFactory!: TagFactory;
    private commentUtil!: CommentUtil;

    static create(options: Partial<Pick<CommentingFieldElement, 'parentId' | 'existingCommentId' | 'isMain'>>): CommentingFieldElement {
        const commentingFieldEl: CommentingFieldElement = document.createElement('li', {is: 'ax-commenting-field'}) as CommentingFieldElement;
        Object.assign(commentingFieldEl, options);
        return commentingFieldEl;
    }

    connectedCallback(): void {
        this.#initServices();
        this.#initElement();
    }

    disconnectedCallback(): void {
        this.#textcomplete?.destroy(true);
    }

    #initServices(): void {
        this.container = getHostContainer(this);
        this.options = OptionsProvider.get(this.container)!;
        this.commentsById = CommentsProvider.get(this.container)!;
        this.profilePictureFactory = ServiceProvider.get(this.container, ProfilePictureFactory);
        this.textcompleteFactory = ServiceProvider.get(this.container, TextcompleteFactory);
        this.tagFactory = ServiceProvider.get(this.container, TagFactory);
        this.commentUtil = ServiceProvider.get(this.container, CommentUtil);
    }

    #initElement(): void {
        let profilePictureURL: string;
        let userId: string;
        let attachments: Record<string, any>[];

        this.classList.add('commenting-field');
        if (this.isMain) {
            this.classList.add('main');
        }

        // Comment was modified, use existing data
        if (this.existingCommentId) {
            profilePictureURL = this.commentsById[this.existingCommentId].profilePictureURL;
            userId = this.commentsById[this.existingCommentId].creator;
            attachments = this.commentsById[this.existingCommentId].attachments;

            // New comment was created
        } else {
            profilePictureURL = this.options.profilePictureURL;
            userId = this.options.creator;
            attachments = [];
        }

        const profilePicture: HTMLElement = this.profilePictureFactory.createProfilePictureElement(profilePictureURL, userId);

        // New comment
        const textareaWrapper: HTMLDivElement = document.createElement('div');
        textareaWrapper.classList.add('textarea-wrapper');

        // Control row
        const controlRow: HTMLDivElement = document.createElement('div');
        controlRow.classList.add('control-row');

        // Textarea
        const textarea: TextareaElement = TextareaElement.create();

        // Close button
        const closeButton: ButtonElement = ButtonElement.createCloseButton(this.options);
        closeButton.classList.add('inline-button');

        // Save button
        const saveButton: ButtonElement = ButtonElement.createSaveButton(this.options, this.existingCommentId);
        controlRow.append(saveButton);

        // Delete button
        if (this.existingCommentId && this.isAllowedToDelete(this.existingCommentId)) {
            // Delete button
            const deleteButton: HTMLSpanElement = ButtonElement.createDeleteButton(this.options);
            controlRow.append(deleteButton);
        }

        if (this.options.enableAttachments) {

            // Upload buttons
            // ==============

            const uploadButton: ButtonElement = ButtonElement.createUploadButton(this.options);

            // Main upload button
            const mainUploadButton: ButtonElement = uploadButton.cloneNode(true) as ButtonElement;
            mainUploadButton.originalContent = mainUploadButton.children;
            controlRow.append(mainUploadButton);

            // Inline upload button for main commenting field
            if (this.isMain) {
                const inlineUploadButton: ButtonElement = uploadButton.cloneNode(true) as ButtonElement;
                inlineUploadButton.classList.add('inline-button');
                textareaWrapper.append(inlineUploadButton);
            }

            // Attachments container
            // =====================

            const attachmentsContainer: HTMLDivElement = document.createElement('div');
            attachmentsContainer.classList.add('attachments');
            attachments.forEach((attachment) => {
                const attachmentTag = this.tagFactory.createAttachmentTagElement(attachment, true);
                attachmentsContainer.append(attachmentTag);
            });
            controlRow.append(attachmentsContainer);
        }


        // Populate the element
        textareaWrapper.append(closeButton, textarea, controlRow);
        this.append(profilePicture, textareaWrapper);

        if (this.parentId) {
            // Set the parent id to the field if necessary
            textarea.setAttribute('data-parent', this.parentId);

            // Append reply-to tag if necessary
            const parentModel = this.commentsById[this.parentId];
            if (parentModel.parent) {

                // Creating the reply-to tag
                textarea.value = '@' + parentModel.fullname + ' ';
                textarea.pingedUsers.push({
                    id: this.parentId,
                    fullname: parentModel.fullname
                });
            }
        }

        // Pinging users
        if (this.options.enablePinging) {
            this.#textcomplete = this.textcompleteFactory.createTextcomplete(textarea);
        }
    }

    private isAllowedToDelete(commentId: string): boolean {
        if (!this.options.enableDeleting) {
            return false;
        }

        let isAllowedToDelete = true;
        if (!this.options.enableDeletingCommentWithReplies) {
            const comments: Record<string, any>[] = this.commentUtil.getComments();
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].parent === commentId) {
                    isAllowedToDelete = false;
                    break;
                }
            }
        }
        return isAllowedToDelete;
    }

    createCommentJSON(): Record<string, any> {
        const textarea: TextareaElement = this.querySelector('.textarea') as TextareaElement;
        const time: string = new Date().toISOString();

        const commentJSON = {
            id: 'c' + (this.commentUtil.getComments().length + 1),   // Temporary id
            parent: textarea.getAttribute('data-parent') || null,
            created: time,
            modified: time,
            content: textarea.getTextareaContent(),
            pings: textarea.getPings(),
            fullname: this.options.textFormatter(this.options.youText),
            profilePictureURL: this.options.profilePictureURL,
            createdByCurrentUser: true,
            upvoteCount: 0,
            userHasUpvoted: false,
            attachments: this.getAttachmentsFromCommentingField()
        };
        return commentJSON;
    }

    getAttachmentsFromCommentingField(): any[] {
        const attachmentElements: NodeListOf<HTMLAnchorElement> = this.querySelectorAll('.attachments .attachment');
        const attachments: any[] = [];
        for (let i = 0; i < attachmentElements.length; i++) {
            attachments[i] = (attachmentElements[i] as any).attachmentTagData;
        }

        return attachments;
    }

    toggleSaveButton(): void {
        const textarea: TextareaElement = this.querySelector('.textarea')!;
        const saveButton: ButtonElement = findSiblingsBySelector<ButtonElement>(textarea, '.control-row')
            .querySelector('.save')!;

        const content = textarea.getTextareaContent();
        const attachments = this.getAttachmentsFromCommentingField();
        let enabled: boolean;

        // Case: existing comment
        const commentModel = this.commentsById[textarea.getAttribute('data-comment')!];
        if (commentModel) {

            // Case: parent changed
            const contentChanged = content !== commentModel.content;
            let parentFromModel: string = '';
            if (commentModel.parent) {
                parentFromModel = commentModel.parent.toString();
            }

            // Case: parent changed
            const parentFromTextarea: string | null = textarea.getAttribute('data-parent');
            const parentChanged: boolean = !isStringEmpty(parentFromTextarea) && parentFromTextarea !== parentFromModel;

            // Case: attachments changed
            let attachmentsChanged = false;
            if (this.options.enableAttachments) {
                const savedAttachmentIds = commentModel.attachments.map((attachment: any) => attachment.id);
                const currentAttachmentIds = attachments.map((attachment: any) => attachment.id);
                attachmentsChanged = !areArraysEqual(savedAttachmentIds, currentAttachmentIds);
            }

            enabled = contentChanged || parentChanged || attachmentsChanged;

            // Case: new comment
        } else {
            enabled = !!content.length || !!attachments.length;
        }

        saveButton.classList.toggle('enabled', enabled);
    }
}
