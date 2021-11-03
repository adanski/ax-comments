import $ from 'cash-dom';
import {ProfilePictureFactory} from './profile-picture-factory';
import {CloseButtonFactory} from './close-button-factory';
import {ContenteditableEditor} from '@textcomplete/contenteditable';
import {StrategyProps, Textcomplete} from '@textcomplete/core';
import {TextcompleteOption} from '@textcomplete/core/src/Textcomplete';
import {TagFactory} from './tag-factory';
import {SubcomponentUtil} from './subcomponent-util';
import {CommentsOptions} from '../comments-options';
import {normalizeSpaces} from '../util';
import {CommentsById} from '../comments-by-id';
import {CommentsProvider, OptionsProvider, ServiceProvider} from '../provider';

export class CommentingFieldFactory {

    private readonly options: CommentsOptions;
    private readonly commentsById: CommentsById;
    private readonly profilePictureFactory: ProfilePictureFactory;
    private readonly closeButtonFactory: CloseButtonFactory;
    private readonly tagFactory: TagFactory;
    private readonly subcomponentUtil: SubcomponentUtil;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.commentsById = CommentsProvider.get(container)!;
        this.profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
        this.closeButtonFactory = ServiceProvider.get(container, CloseButtonFactory);
        this.tagFactory = ServiceProvider.get(container, TagFactory);
        this.subcomponentUtil = ServiceProvider.get(container, SubcomponentUtil);
    }

    createCommentingFieldElement(parentId: string, existingCommentId: string, isMain: boolean): CommentingFieldElement {
        let profilePictureURL: string;
        let userId: string;
        let attachments: Record<string, any>[];

        // Commenting field
        const result: CommentingFieldElement = {} as CommentingFieldElement;
        const commentingField: HTMLDivElement = document.createElement('div');
        result.field = commentingField;
        result.destroy = () => {
        };
        commentingField.classList.add('commenting-field');
        if (isMain) {
            commentingField.classList.add('main');
        }

        // Comment was modified, use existing data
        if (existingCommentId) {
            profilePictureURL = this.commentsById[existingCommentId].profilePictureURL;
            userId = this.commentsById[existingCommentId].creator;
            attachments = this.commentsById[existingCommentId].attachments;

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
        const textarea: HTMLDivElement = document.createElement('div');
        textarea.classList.add('textarea');
        textarea.setAttribute('data-placeholder', this.options.textFormatter(this.options.textareaPlaceholderText));
        textarea.setAttribute('contenteditable', 'true');

        // Setting the initial height for the textarea
        this.subcomponentUtil.adjustTextareaHeight(textarea, false);

        // Close button
        const closeButton: HTMLElement = this.closeButtonFactory.createCloseButton();
        closeButton.classList.add('inline-button');

        // Save button
        const saveButtonClass: string = existingCommentId ? 'update' : 'send';
        const saveButtonText: string = existingCommentId ? this.options.textFormatter(this.options.saveText) : this.options.textFormatter(this.options.sendText);
        const saveButton: HTMLSpanElement = document.createElement('span');
        saveButton.classList.add(saveButtonClass, 'save', 'highlight-background');
        saveButton.textContent = saveButtonText;
        $(saveButton).data('original-content', saveButtonText);
        controlRow.append(saveButton);

        // Delete button
        if (existingCommentId && this.isAllowedToDelete(existingCommentId)) {
            // Delete button
            const deleteButtonText: string = this.options.textFormatter(this.options.deleteText);
            const deleteButton: HTMLSpanElement = document.createElement('span');
            deleteButton.classList.add('delete', 'enabled');
            deleteButton.textContent = deleteButtonText;
            deleteButton.style.backgroundColor = this.options.deleteButtonColor;
            $(deleteButton).data('original-content', deleteButtonText);
            controlRow.append(deleteButton);
        }

        if (this.options.enableAttachments) {

            // Upload buttons
            // ==============

            const uploadButton: HTMLSpanElement = document.createElement('span');
            uploadButton.classList.add('upload', 'enabled');
            const uploadIcon: HTMLElement = document.createElement('i');
            uploadIcon.classList.add('fa', 'fa-paperclip');
            const fileInput: HTMLInputElement = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.setAttribute('data-role', 'none'); // Prevent jquery-mobile for adding classes

            if (this.options.uploadIconURL.length) {
                uploadIcon.style.backgroundImage = `url("${this.options.uploadIconURL}")`;
                uploadIcon.classList.add('image');
            }
            uploadButton.append(uploadIcon, fileInput);

            // Main upload button
            const mainUploadButton: HTMLElement = uploadButton.cloneNode(true) as HTMLElement;
            $(mainUploadButton).data('original-content', mainUploadButton.children);
            controlRow.append(mainUploadButton);

            // Inline upload button for main commenting field
            if (isMain) {
                const inlineUploadButton: HTMLElement = uploadButton.cloneNode(true) as HTMLElement;
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
        commentingField.append(profilePicture, textareaWrapper);

        if (parentId) {
            // Set the parent id to the field if necessary
            textarea.setAttribute('data-parent', parentId);

            // Append reply-to tag if necessary
            const parentModel = this.commentsById[parentId];
            if (parentModel.parent) {
                textarea.innerHTML = '&nbsp;';    // Needed to set the cursor to correct place

                // Creating the reply-to tag
                const replyToName = '@' + parentModel.fullname;
                const replyToTag = this.tagFactory.createTagElement(replyToName, 'reply-to', parentModel.creator, {
                    'data-user-id': parentModel.creator
                });
                textarea.prepend(replyToTag);
            }
        }

        // Pinging users
        if (this.options.enablePinging) {
            const textcompleteEditor: ContenteditableEditor = new ContenteditableEditor(textarea);
            const textcompleteStrategy: StrategyProps<Record<string, any>> = {
                match: /(^|\s)@([^@]*)$/i,
                index: 2,
                search: (term, callback) => {
                    term = normalizeSpaces(term);

                    // Return empty array on error
                    const error = () => {
                        callback([]);
                    };

                    this.options.searchUsers(term, callback, error);
                },
                template: user => {
                    const wrapper: HTMLDivElement = document.createElement('div');

                    const profilePictureEl: HTMLElement = this.profilePictureFactory.createProfilePictureElement(user.profile_picture_url, user.id);

                    const detailsEl: HTMLDivElement = document.createElement('div');
                    detailsEl.classList.add('details');
                    const nameEl: HTMLDivElement = document.createElement('div');
                    nameEl.classList.add('name');
                    nameEl.textContent = user.fullname;

                    const emailEl: HTMLDivElement = document.createElement('div');
                    emailEl.classList.add('email');
                    emailEl.textContent = user.email;

                    if (user.email) {
                        detailsEl.append(nameEl, emailEl);
                    } else {
                        detailsEl.classList.add('no-email');
                        detailsEl.append(nameEl);
                    }

                    wrapper.append(profilePictureEl, detailsEl);
                    return wrapper.outerHTML;
                },
                replace: user => {
                    const tag: HTMLElement = this.tagFactory.createTagElement('@' + user.fullname, 'ping', user.id, {
                        'data-user-id': user.id
                    });
                    return ` ${tag.outerHTML} `;
                },
            };
            const textcompleteOptions: TextcompleteOption = {
                dropdown: {
                    parent: document.querySelector('.jquery-comments') as HTMLElement,
                    className: 'dropdown autocomplete',
                    maxCount: 5,
                    rotate: true
                }
            };
            const textcomplete: Textcomplete = new Textcomplete(textcompleteEditor, [textcompleteStrategy], textcompleteOptions);
            result.destroy = () => textcomplete.destroy(true);
        }

        return result;
    }

    private isAllowedToDelete(commentId: string): boolean {
        if (!this.options.enableDeleting) {
            return false;
        }

        let isAllowedToDelete = true;
        if (!this.options.enableDeletingCommentWithReplies) {
            const comments: Record<string, any>[] = this.subcomponentUtil.getComments();
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].parent === commentId) {
                    isAllowedToDelete = false;
                    break;
                }
            }
        }
        return isAllowedToDelete;
    }
}

export interface CommentingFieldElement {
    field: HTMLElement;

    destroy(): void;
}
