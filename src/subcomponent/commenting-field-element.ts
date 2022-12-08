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
    findSiblingsBySelector,
    getHostContainer,
    hideElement,
    showElement
} from '../html-util.js';
import {TextcompleteFactory} from './textcomplete-factory.js';
import {ErrorFct, SuccessFct} from '../options/callbacks.js';
import {CommentTransformer} from '../comment-transformer.js';

@RegisterCustomElement('ax-commenting-field', {extends: 'li'})
export class CommentingFieldElement extends HTMLLIElement implements WebComponent {

    parentId: string | null = null;
    existingCommentId: string | null = null;
    isMain: boolean = false;
    onClosed: () => void = () => {};

    #textcomplete: Textcomplete | undefined;

    #options!: Required<CommentsOptions>;
    #commentViewModel!: CommentViewModel;
    #commentTransformer!: CommentTransformer;
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
        this.#commentTransformer = ServiceProvider.get(container, CommentTransformer);
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
        const saveButton: ButtonElement = ButtonElement.createSaveButton({
            onclick: this.existingCommentId ? this.#updateComment : this.#addComment
        }, this.existingCommentId);
        controlRow.append(saveButton);

        if (this.#options.enableAttachments) {

            // Upload buttons
            // ==============

            // Main upload button
            const mainUploadButton: ButtonElement = ButtonElement.createUploadButton({
                inline: false,
                onclick: this.#fileInputChanged
            });
            mainUploadButton.originalContent = mainUploadButton.children;
            controlRow.append(mainUploadButton);

            // Inline upload button for main commenting field
            if (this.isMain) {
                const inlineUploadButton: ButtonElement = ButtonElement.createUploadButton({
                    inline: true,
                    onclick: this.#fileInputChanged
                });
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

    #addComment: (e: UIEvent) => void = e => {
        const addButton: ButtonElement = e.currentTarget as ButtonElement;
        if (!addButton.classList.contains('enabled')) {
            return;
        }

        // Set button state to loading
        addButton.setButtonState(false, true);

        // Get comment
        const comment: CommentModel = this.getCommentModel();

        const success: (postedComment: CommentModel) => void = postedComment => {
            this.#commentViewModel.addComment(this.#commentTransformer.enrichOne(postedComment));

            // Close the editing field
            this.querySelector<HTMLElement>('.close')!.click();

            // Reset button state
            addButton.setButtonState(false, false);
        };

        const error: () => void = () => {
            // Reset button state
            addButton.setButtonState(true, false);
        };

        this.#options.postComment(comment, success, error);
    };

    #updateComment: (e: UIEvent) => void = e => {
        const updateButton: ButtonElement = e.currentTarget as ButtonElement;
        if (!updateButton.classList.contains('enabled')) {
            return;
        }
        const textarea: TextareaElement = this.querySelector('.textarea')!;

        // Set button state to loading
        updateButton.setButtonState(false, true);

        // Use a clone of the existing model and update the model after successful update
        const commentEnriched: CommentModelEnriched = Object.assign<object, CommentModelEnriched, Partial<CommentModel>>(
            {},
            this.#commentViewModel.getComment(this.existingCommentId!)!,
            {
                parentId: textarea.parentId as string,
                content: textarea.getTextareaContent(),
                pings: textarea.getPings(),
                modifiedAt: new Date(),
                attachments: this.getAttachments()
            }
        );

        const success: SuccessFct<CommentModel> = updatedComment => {
            this.#commentViewModel.updateComment(updatedComment);

            // Close the editing field
            this.querySelector<HTMLElement>('.close')!.click();

            // Reset button state
            updateButton.setButtonState(false, false);
        };

        const error: ErrorFct = () => {
            // Reset button state
            updateButton.setButtonState(true, false);
        };

        this.#options.putComment(this.#commentTransformer.deplete(commentEnriched), success, error);
    };

    #fileInputChanged: (e: Event) => void = e => {
        const uploadButton: ButtonElement = e.currentTarget as ButtonElement;
        if (!uploadButton.classList.contains('enabled')) {
            return;
        }
        const input: HTMLInputElement = uploadButton.querySelector('input[type="file"]')!;
        this.preSaveAttachments(input.files!);
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

    preSaveAttachments(files: FileList): void {
        // Elements
        const uploadButton: ButtonElement = this.querySelector('.control-row .upload')!;
        const attachmentsContainer: HTMLElement = this.querySelector('.control-row .attachments')!;

        if (files.length) {
            // Create attachment models
            let attachments: any[] = [...files].map(file => ({
                mime_type: file.type,
                file: file
            }));

            // Filter out already added attachments
            const existingAttachments: any[] = this.getAttachments();
            attachments = attachments.filter(attachment => {
                let duplicate = false;

                // Check if the attachment name and size matches with an already added attachment
                for (let i = 0; i < existingAttachments.length; i++) {
                    const existingAttachment = existingAttachments[i];
                    if (attachment.file.name === existingAttachment.file.name && attachment.file.size === existingAttachment.file.size) {
                        duplicate = true;
                        break;
                    }
                }

                return !duplicate;
            });

            // Ensure that the main commenting field is shown if attachments were added to that
            if (this.classList.contains('main')) {
                this.querySelector('.textarea')!.dispatchEvent(new MouseEvent('click'));
            }

            // Set button state to loading
            uploadButton.setButtonState(false, true);

            // Validate attachments
            this.#options.validateAttachments(attachments, (validatedAttachments: any[]) => {

                if (validatedAttachments.length) {
                    // Create attachment tags
                    validatedAttachments.forEach(attachment => {
                        const attachmentTag: HTMLAnchorElement = this.#tagFactory.createAttachmentTagElement(attachment, () => {
                            // Check if save button needs to be enabled
                            this.toggleSaveButton();
                        });
                        attachmentsContainer.append(attachmentTag);
                    });

                    // Check if save button needs to be enabled
                    this.toggleSaveButton();
                }

                // Reset button state
                uploadButton.setButtonState(true, false);
            });
        }

        // Clear the input field
        uploadButton.querySelector('input')!.value = '';
    }
}
