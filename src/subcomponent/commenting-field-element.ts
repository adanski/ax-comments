import {ProfilePictureFactory} from './profile-picture-factory.js';
import {ButtonElement} from './button-element.js';
import {ContenteditableEditor} from '@textcomplete/contenteditable';
import {StrategyProps, Textcomplete} from '@textcomplete/core';
import {TextcompleteOption} from '@textcomplete/core/src/Textcomplete';
import {TagFactory} from './tag-factory.js';
import {TextareaService} from './textarea-service.js';
import {CommentsOptions} from '../api.js';
import {areArraysEqual, isStringEmpty, normalizeSpaces} from '../util.js';
import {CommentsById} from '../comments-by-id.js';
import {CommentsProvider, OptionsProvider, ServiceProvider} from '../provider.js';
import {CommentUtil} from '../comment-util.js';
import {WebComponent} from '../web-component.js';
import {RegisterCustomElement} from '../register-custom-element.js';
import {findParentsBySelector, findSiblingsBySelector} from '../html-util.js';

@RegisterCustomElement('ax-commenting-field')
export class CommentingFieldElement extends HTMLElement implements WebComponent {
    private textcomplete: Textcomplete | undefined;

    parentId: string | null = null;
    existingCommentId: string | null = null;
    isMain: boolean = false;

    private container!: HTMLDivElement;
    private options!: CommentsOptions;
    private commentsById!: CommentsById;
    private profilePictureFactory!: ProfilePictureFactory;
    private tagFactory!: TagFactory;
    private textareaService!: TextareaService;
    private commentUtil!: CommentUtil;

    static create(options: Partial<Pick<CommentingFieldElement, 'parentId' | 'existingCommentId' | 'isMain'>>): CommentingFieldElement {
        const commentingFieldEl: CommentingFieldElement = document.createElement('ax-commenting-field') as CommentingFieldElement;
        Object.assign(commentingFieldEl, options);
        return commentingFieldEl;
    }

    connectedCallback(): void {
        this.initServices();
        this.initElement();
    }

    disconnectedCallback(): void {
        this.textcomplete?.destroy(true);
    }

    private initServices(): void {
        const container: HTMLDivElement | null = findParentsBySelector<HTMLDivElement>(this, '#comments-container').first();
        if (!container) {
            throw new Error(`[ax-commenting-field] Commenting Field will not work outside ax-comments.`);
        }
        this.container = container;
        this.options = OptionsProvider.get(container)!;
        this.commentsById = CommentsProvider.get(container)!;
        this.profilePictureFactory = ServiceProvider.get(container, ProfilePictureFactory);
        this.tagFactory = ServiceProvider.get(container, TagFactory);
        this.textareaService = ServiceProvider.get(container, TextareaService);
        this.commentUtil = ServiceProvider.get(container, CommentUtil);
    }

    private initElement(): void {
        let profilePictureURL: string;
        let userId: string;
        let attachments: Record<string, any>[];

        // Commenting field
        const commentingField: HTMLDivElement = document.createElement('div');
        commentingField.classList.add('commenting-field');
        if (this.isMain) {
            this.classList.add('main');
            commentingField.classList.add('main');
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
        const textarea: HTMLDivElement = this.textareaService.createTextarea();

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
        commentingField.append(profilePicture, textareaWrapper);

        if (this.parentId) {
            // Set the parent id to the field if necessary
            textarea.setAttribute('data-parent', this.parentId);

            // Append reply-to tag if necessary
            const parentModel = this.commentsById[this.parentId];
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
            this.textcomplete = this.createTextcomplete(textarea);
        }

        this.appendChild(commentingField);
    }

    private createTextcomplete(textarea: HTMLDivElement): Textcomplete {
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
        return new Textcomplete(textcompleteEditor, [textcompleteStrategy], textcompleteOptions);
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
        const textarea: HTMLElement = this.querySelector('.textarea') as HTMLElement;
        const time: string = new Date().toISOString();

        const commentJSON = {
            id: 'c' + (this.commentUtil.getComments().length + 1),   // Temporary id
            parent: textarea.getAttribute('data-parent') || null,
            created: time,
            modified: time,
            content: this.textareaService.getTextareaContent(textarea),
            pings: this.textareaService.getPings(textarea),
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
        const textarea: HTMLElement = this.querySelector('.textarea')!;
        const saveButton: ButtonElement = findSiblingsBySelector<ButtonElement>(textarea, '.control-row')
            .querySelector('.save')!;

        const content = this.textareaService.getTextareaContent(textarea, true);
        const attachments = this.getAttachmentsFromCommentingField();
        let enabled: boolean;

        // Case: existing comment
        const commentModel = this.commentsById[textarea.getAttribute('data-comment')!];
        if (commentModel) {

            // Case: parent changed
            const contentChanged = content != commentModel.content;
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
