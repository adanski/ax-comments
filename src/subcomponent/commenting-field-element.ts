import {ProfilePictureFactory} from './profile-picture-factory.js';
import {ButtonElement} from './button-element.js';
import {Textcomplete} from '@textcomplete/core';
import {TagFactory} from './tag-factory.js';
import {TextareaElement} from './textarea-element.js';
import {CommentModel, CommentsOptions} from '../api.js';
import {areArraysEqual, isStringEmpty} from '../util.js';
import {CommentModelEnriched} from '../comments-by-id.js';
import {CommentViewModelProvider, OptionsProvider, ServiceProvider} from '../provider.js';
import {CommentViewModel} from '../comment-view-model.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {
    findParentsBySelector,
    findSiblingsBySelector,
    getHostContainer,
    hideElement,
    showElement
} from '../html-util.js';
import {TextcompleteFactory} from './textcomplete-factory.js';

@RegisterCustomElement('ax-commenting-field', {extends: 'li'})
export class CommentingFieldElement extends HTMLLIElement implements WebComponent {

    parentId: string | null = null;
    existingCommentId: string | null = null;
    isMain: boolean = false;
    onClosed: () => void = () => {};

    #textcomplete: Textcomplete | undefined;

    #options!: Required<CommentsOptions>;
    #commentViewModel!: CommentViewModel;
    #profilePictureFactory!: ProfilePictureFactory;
    #textcompleteFactory!: TextcompleteFactory;
    #tagFactory!: TagFactory;

    static create(options: Partial<Pick<CommentingFieldElement, 'parentId' | 'existingCommentId' | 'isMain' | 'onClosed'>>): CommentingFieldElement {
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
        const container: HTMLElement = getHostContainer(this);
        this.#options = OptionsProvider.get(container)!;
        this.#commentViewModel = CommentViewModelProvider.get(container);
        this.#profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
        this.#textcompleteFactory = ServiceProvider.get(container, TextcompleteFactory);
        this.#tagFactory = ServiceProvider.get(container, TagFactory);
    }

    #initElement(): void {
        let profilePictureURL: string | undefined;
        let userId: string;
        let attachments: Record<string, any>[];

        this.classList.add('commenting-field');
        if (this.isMain) {
            this.classList.add('main');
        }

        // Comment was modified, use existing data
        if (this.existingCommentId) {
            const existingComment = this.#commentViewModel.getComment(this.existingCommentId)!;
            profilePictureURL = existingComment.creatorProfilePictureURL;
            userId = existingComment.creatorUserId;
            attachments = existingComment.attachments ?? [];

            // New comment was created
        } else {
            profilePictureURL = this.#options.profilePictureURL;
            userId = this.#options.currentUserId;
            attachments = [];
        }

        const profilePicture: HTMLElement = this.#profilePictureFactory.createProfilePictureElement(userId, profilePictureURL);

        // New comment
        const textareaWrapper: HTMLDivElement = document.createElement('div');
        textareaWrapper.classList.add('textarea-wrapper');

        // Control row
        const controlRow: HTMLDivElement = document.createElement('div');
        controlRow.classList.add('control-row');

        // Textarea
        const textarea: TextareaElement = TextareaElement.create({
            parentId: this.parentId,
            existingCommentId: this.existingCommentId,
            onclick: this.isMain ? this.#showMainField : null
        });

        // Close button
        const closeButton: ButtonElement = ButtonElement.createCloseButton({
            inline: true,
            onclick: this.isMain ? this.#hideMainField : this.#removeElement
        });

        // Save button
        const saveButton: ButtonElement = ButtonElement.createSaveButton({}, this.existingCommentId);
        controlRow.append(saveButton);

        // Delete button
        if (this.existingCommentId && this.#isAllowedToDelete(this.existingCommentId)) {
            // Delete button
            const deleteButton: HTMLSpanElement = ButtonElement.createDeleteButton({});
            controlRow.append(deleteButton);
        }

        if (this.#options.enableAttachments) {

            // Upload buttons
            // ==============

            // Main upload button
            const mainUploadButton: ButtonElement = ButtonElement.createUploadButton({inline: false});
            mainUploadButton.originalContent = mainUploadButton.children;
            controlRow.append(mainUploadButton);

            // Inline upload button for main commenting field
            if (this.isMain) {
                const inlineUploadButton: ButtonElement = ButtonElement.createUploadButton({inline: true});
                textareaWrapper.append(inlineUploadButton);
            }

            // Attachments container
            // =====================

            const attachmentsContainer: HTMLDivElement = document.createElement('div');
            attachmentsContainer.classList.add('attachments');
            attachments.forEach((attachment) => {
                const attachmentTag = this.#tagFactory.createAttachmentTagElement(attachment, this.toggleSaveButton.bind(this));
                attachmentsContainer.append(attachmentTag);
            });
            controlRow.append(attachmentsContainer);
        }

        // Populate the element
        textareaWrapper.append(closeButton, textarea, controlRow);
        this.append(profilePicture, textareaWrapper);

        if (this.parentId) {
            // Append reply-to tag if necessary
            const parentModel = this.#commentViewModel.getComment(this.parentId)!;
            if (parentModel.parentId) {
                // Creating the reply-to tag
                textarea.value = '@' + parentModel.creatorUserId + ' ';
                textarea.pingedUsers.push({
                    id: parentModel.creatorUserId,
                    displayName: parentModel.creatorDisplayName
                });
            }
        }

        // Pinging users
        if (this.#options.enablePinging) {
            this.#textcomplete = this.#textcompleteFactory.createTextcomplete(textarea);
        }
    }

    #isAllowedToDelete(commentId: string): boolean {
        if (!this.#options.enableDeleting) {
            return false;
        }

        let isAllowedToDelete = true;
        if (!this.#options.enableDeletingCommentWithReplies) {
            const comments: CommentModelEnriched[] = this.#commentViewModel.getComments();
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].parentId === commentId) {
                    isAllowedToDelete = false;
                    break;
                }
            }
        }
        return isAllowedToDelete;
    }

    #showMainField: (e: UIEvent) => void = e => {
        if (!this.isMain) return;

        const mainTextarea: HTMLElement = e.currentTarget as HTMLElement;
        findSiblingsBySelector(mainTextarea, '.control-row')
            .forEach(showElement)
        showElement(mainTextarea.parentElement!.querySelector('.close')!);
        hideElement(mainTextarea.parentElement!.querySelector('.upload.inline-button')!);
        mainTextarea.focus();
    };

    #hideMainField: (e: UIEvent) => void = e => {
        if (!this.isMain) return;

        const closeButton: ButtonElement = e.currentTarget as ButtonElement;
        const mainTextarea: TextareaElement = this.querySelector<TextareaElement>('.textarea')!;
        const mainControlRow: HTMLElement = this.querySelector('.control-row')!;

        // Clear text area
        mainTextarea.clearTextarea();

        // Clear attachments
        this.querySelector('.attachments')!.innerHTML = '';

        // Toggle save button
        this.toggleSaveButton();

        // Adjust height
        mainTextarea.adjustTextareaHeight(false);

        hideElement(mainControlRow);
        hideElement(closeButton);
        showElement(mainTextarea.parentElement!.querySelector('.upload.inline-button')!);
        mainTextarea.blur();
        this.onClosed();
    };

    #removeElement: (e: UIEvent) => void = e => {
        if (this.isMain) return;
        // Execute callback
        this.onClosed();

        // Remove the field
        this.remove();
    };

    getCommentModel(): CommentModel {
        const textarea: TextareaElement = this.querySelector('.textarea') as TextareaElement;
        const time: Date = new Date();

        const commentModel: CommentModel = {
            id: 'c' + (this.#commentViewModel.getComments().length + 1),   // Temporary id
            parentId: textarea.parentId || undefined,
            createdAt: time,
            modifiedAt: time,
            content: textarea.getTextareaContent(),
            pings: textarea.getPings(),
            creatorUserId: this.#options.currentUserId,
            createdByAdmin: this.#options.currentUserIsAdmin,
            creatorDisplayName: this.#options.youText,
            creatorProfilePictureURL: this.#options.profilePictureURL,
            createdByCurrentUser: true,
            upvoteCount: 0,
            upvotedByCurrentUser: false,
            attachments: this.getAttachments()
        };
        return commentModel;
    }

    getAttachments(): any[] {
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
        const attachments = this.getAttachments();
        let enabled: boolean;

        // Case: existing comment
        const commentModel = this.#commentViewModel.getComment(textarea.existingCommentId!);
        if (commentModel) {

            // Case: parent changed
            const contentChanged = content !== commentModel.content;
            const parentFromModel: string = commentModel.parentId || '';

            // Case: parent changed
            const parentFromTextarea: string | null = textarea.parentId;
            const parentChanged: boolean = !isStringEmpty(parentFromTextarea) && parentFromTextarea !== parentFromModel;

            // Case: attachments changed
            let attachmentsChanged = false;
            if (this.#options.enableAttachments) {
                const savedAttachmentIds = (commentModel.attachments ?? []).map((attachment: any) => attachment.id);
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
