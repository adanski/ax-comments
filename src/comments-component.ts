import {WebComponent} from './web-component';
import {isMobileBrowser} from './util';
import {getDefaultOptions} from './default-options-factory';
import {CommentTransformer} from './comment-transformer';

export class CommentsComponent extends HTMLElement implements WebComponent {
    readonly shadowRoot!: ShadowRoot;
    private container!: HTMLDivElement;

    private readonly _options: Record<string, any> = {};

    private commentTransformer: CommentTransformer = new CommentTransformer(this._options);

    private readonly commentsById: Record<string, Record<string, any>> = {};
    dataFetched: false,
    currentSortKey: '',
    events: {
        AZI
    },

    constructor() {
        super();
        this.initShadowDom();
    }

    static get observedAttributes(): string[] {
        return ['videoid', 'playlistid'];
    }

    get options(): Record<string, any> {
        return this._options;
    }

    set options(newValue: Record<string, any>) {
        if (!Object.keys(this._options).length) {
            this.initComponent(newValue);
        } else {
            console.warn('[CommentsComponent] Options cannot be changed after initialization');
        }
    }

    /*connectedCallback(): void {
        this.addEventListener('click', () => this.addIframe());
    }*/

    /**
     * Define our shadowDOM for the component
     */
    private initShadowDom(): void {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                ${require('../css/jquery-comments.css')}
            </style>
            <div id="comments-container" class="jquery-comments">
            </div>
        `;
        this.container = this.shadowRoot.querySelector<HTMLDivElement>('#comments-container')!;
    }

    private initComponent(options: Record<string, any>): void {
        // Init options
        Object.assign(this._options, getDefaultOptions(this.container), options);

        this.undelegateEvents();
        this.delegateEvents();

        if (isMobileBrowser()) {
            this.container.classList.add('mobile');
        }

        // Read-only mode
        if (this.options.readOnly) {
            this.container.classList.add('read-only');
        }

        // Set initial sort key
        this.currentSortKey = this.options.defaultNavigationSortKey;

        // Create CSS declarations for highlight color
        this.createCssDeclarations();

        // Fetching data and rendering
        this.fetchDataAndRender();
    }

    private delegateEvents(): void {
        this.bindEvents(false);
    }

    private undelegateEvents(): void {
        this.bindEvents(true);
    }

    private bindEvents(unbind: boolean) {
        const bindFunction = unbind ? 'off' : 'on';
        for (var key in this.events) {
            const eventName = key.split(' ')[0];
            const selector = key.split(' ').slice(1).join(' ');
            const methodNames = this.events[key].split(' ');

            for (var index in methodNames) {
                if (methodNames.hasOwnProperty(index)) {
                    const method = this[methodNames[index]];

                    // Keep the context
                    method = method.bind(this);

                    if (selector == '') {
                        this.$el[bindFunction](eventName, method);
                    } else {
                        this.$el[bindFunction](eventName, selector, method);
                    }
                }
            }
        }
    }

    private fetchDataAndRender(): void {
        this.commentsById = {};

        this.container.innerHTML = '';
        this.createHTML();

        // Comments
        // ========

        this.options.getComments((commentsArray: Record<string, any>[]) => {

            // Convert comments to custom data model
            const commentModels: Record<string, any>[] = commentsArray.map(commentsJSON => this.createCommentModel(commentsJSON));

            // Sort comments by date (oldest first so that they can be appended to the data model
            // without caring dependencies)
            this.sortComments(commentModels, 'oldest');

            commentModels.forEach(commentModel => {
                this.addCommentToDataModel(commentModel);
            });

            // Mark data as fetched
            this.dataFetched = true;

            // Render
            this.render();
        });
    }

    private fetchNext(): void {
        // Loading indicator
        const spinner = this.createSpinner();
        this.container.querySelector('ul#comment-list')!.append(spinner);

        const success: (commentModels: Record<string, any>[]) => void = commentModels => {
            commentModels.forEach(commentModel => {
                this.createComment(commentModel);
            });
            spinner.remove();
        };

        const error: () => void = () => {
            spinner.remove();
        };

        this.options.getComments(success, error);
    }

    private createCommentModel(commentJSON: Record<string, any>): Record<string, any> {
        const commentModel: Record<string, any> = this.commentTransformer.applyInternalMappings(commentJSON);
        commentModel.childs = [];
        commentModel.hasAttachments = () => commentModel.attachments.length > 0;
        return commentModel;
    }

    private addCommentToDataModel(commentModel: Record<string, any>): void {
        if (!(commentModel.id in this.commentsById)) {
            this.commentsById[commentModel.id] = commentModel;

            // Update child array of the parent (append childs to the array of outer most parent)
            if (commentModel.parent) {
                const outermostParent = this.getOutermostParent(commentModel.parent);
                outermostParent.childs.push(commentModel.id);
            }
        }
    }

    private updateCommentModel(commentModel: Record<string, any>): void {
        Object.assign(this.commentsById[commentModel.id], commentModel);
    }

    private render(): void {
        // Prevent re-rendering if data hasn't been fetched
        if (!this.dataFetched) {
            return;
        }

        // Show active container
        this.showActiveContainer();

        // Create comments and attachments
        this.createComments();
        if (this.options.enableAttachments && this.options.enableNavigation) this.createAttachments();

        // Remove spinner
        this.container.querySelectorAll('> .spinner')
            .forEach(spinner => spinner.remove());

        this.options.refresh();
    }

    private showActiveContainer(): void {
        const activeNavigationEl = this.$el.find('.navigation li[data-container-name].active');
        const containerName = activeNavigationEl.data('container-name');
        const containerEl = this.$el.find('[data-container="' + containerName + '"]');
        containerEl.siblings('[data-container]').hide();
        containerEl.show();
    }

    private createComments() {
        const self = this;

        // Create the list element before appending to DOM in order to reach better performance
        this.$el.find('#comment-list').remove();
        const commentList = $('<ul/>', {
            id: 'comment-list',
            'class': 'main'
        });

        // Divide commments into main level comments and replies
        const mainLevelComments = [];
        const replies = [];
        $(this.getComments()).each(function (index, commentModel) {
            if (commentModel.parent == null) {
                mainLevelComments.push(commentModel);
            } else {
                replies.push(commentModel);
            }
        });

        // Append main level comments
        this.sortComments(mainLevelComments, this.currentSortKey);
        $(mainLevelComments).each(function (index, commentModel) {
            self.addComment(commentModel, commentList);
        });

        // Append replies in chronological order
        this.sortComments(replies, 'oldest');
        $(replies).each(function (index, commentModel) {
            self.addComment(commentModel, commentList);
        });

        // Appned list to DOM
        this.$el.find('[data-container="comments"]').prepend(commentList);
    }

    private createAttachments() {
        const self = this;

        // Create the list element before appending to DOM in order to reach better performance
        this.$el.find('#attachment-list').remove();
        const attachmentList = $('<ul/>', {
            id: 'attachment-list',
            'class': 'main'
        });

        const attachments = this.getAttachments();
        this.sortComments(attachments, 'newest');
        $(attachments).each(function (index, commentModel) {
            self.addAttachment(commentModel, attachmentList);
        });

        // Appned list to DOM
        this.$el.find('[data-container="attachments"]').prepend(attachmentList);
    }

    private addComment(commentModel, commentList, prependComment) {
        commentList = commentList || this.$el.find('#comment-list');
        const commentEl = this.createCommentElement(commentModel);

        // Case: reply
        if (commentModel.parent) {
            const directParentEl = commentList.find('.comment[data-id="' + commentModel.parent + '"]');

            // Re-render action bar of direct parent element
            this.reRenderCommentActionBar(commentModel.parent);

            // Force replies into one level only
            const outerMostParent = directParentEl.parents('.comment').last();
            if (outerMostParent.length == 0) outerMostParent = directParentEl;

            // Append element to DOM
            const childCommentsEl = outerMostParent.find('.child-comments');
            const commentingField = childCommentsEl.find('.commenting-field');
            if (commentingField.length) {
                commentingField.before(commentEl);
            } else {
                childCommentsEl.append(commentEl);
            }

// Update toggle all -button
            this.updateToggleAllButton(outerMostParent);

// Case: main level comment
        } else {
            if (prependComment) {
                commentList.prepend(commentEl);
            } else {
                commentList.append(commentEl);
            }
        }
    }

    private addAttachment(commentModel, commentList) {
        commentList = commentList || this.$el.find('#attachment-list');
        const commentEl = this.createCommentElement(commentModel);
        commentList.prepend(commentEl);
    }

    private removeComment(commentId) {
        const self = this;
        const commentModel = this.commentsById[commentId];

        // Remove child comments recursively
        const childComments = this.getChildComments(commentModel.id);
        $(childComments).each(function (index, childComment) {
            self.removeComment(childComment.id);
        });

        // Update the child array of outermost parent
        if (commentModel.parent) {
            const outermostParent = this.getOutermostParent(commentModel.parent);
            const indexToRemove = outermostParent.childs.indexOf(commentModel.id);
            outermostParent.childs.splice(indexToRemove, 1);
        }

// Remove the comment from data model
        delete this.commentsById[commentId];

        const commentElements = this.$el.find('li.comment[data-id="' + commentId + '"]');
        const parentEl = commentElements.parents('li.comment').last();

// Remove the element
        commentElements.remove();

// Update the toggle all button
        this.updateToggleAllButton(parentEl);
    }

    private preDeleteAttachment(ev) {
        const commentingField = $(ev.currentTarget).parents('.commenting-field').first();
        const attachmentEl = $(ev.currentTarget).parents('.attachment').first();
        attachmentEl.remove();

        // Check if save button needs to be enabled
        this.toggleSaveButton(commentingField);
    }

    private preSaveAttachments(files, commentingField) {
        const self = this;

        if (files.length) {

            // Elements
            if (!commentingField) commentingField = this.$el.find('.commenting-field.main');
            const uploadButton = commentingField.find('.control-row .upload');
            const isReply = !commentingField.hasClass('main');
            const attachmentsContainer = commentingField.find('.control-row .attachments');

            // Create attachment models
            const attachments = $(files).map(function (index, file) {
                return {
                    mime_type: file.type,
                    file: file
                };
            });

            // Filter out already added attachments
            const existingAttachments = this.getAttachmentsFromCommentingField(commentingField);
            attachments = attachments.filter(function (index, attachment) {
                const duplicate = false;

                // Check if the attacment name and size matches with already added attachment
                $(existingAttachments).each(function (index, existingAttachment) {
                    if (attachment.file.name == existingAttachment.file.name && attachment.file.size == existingAttachment.file.size) {
                        duplicate = true;
                    }
                });

                return !duplicate;
            });

            // Ensure that the main commenting field is shown if attachments were added to that
            if (commentingField.hasClass('main')) {
                commentingField.find('.textarea').trigger('click');
            }

// Set button state to loading
            this.setButtonState(uploadButton, false, true);

// Validate attachments
            this.options.validateAttachments(attachments, function (validatedAttachments) {

                if (validatedAttachments.length) {

                    // Create attachment tags
                    $(validatedAttachments).each(function (index, attachment) {
                        const attachmentTag = self.createAttachmentTagElement(attachment, true);
                        attachmentsContainer.append(attachmentTag);
                    });

                    // Check if save button needs to be enabled
                    self.toggleSaveButton(commentingField);
                }

                // Reset button state
                self.setButtonState(uploadButton, true, false);
            });
        }

// Clear the input field
        uploadButton.find('input').val('');
    }

    private updateToggleAllButton(parentEl) {
        // Don't hide replies if maxRepliesVisible is null or undefined
        if (this.options.maxRepliesVisible == null) return;

        const childCommentsEl = parentEl.find('.child-comments');
        const childComments = childCommentsEl.find('.comment').not('.hidden');
        const toggleAllButton = childCommentsEl.find('li.toggle-all');
        childComments.removeClass('togglable-reply');

        // Select replies to be hidden
        if (this.options.maxRepliesVisible === 0) {
            const togglableReplies = childComments;
        } else {
            const togglableReplies = childComments.slice(0, -this.options.maxRepliesVisible);
        }

// Add identifying class for hidden replies so they can be toggled
        togglableReplies.addClass('togglable-reply');

// Show all replies if replies are expanded
        if (toggleAllButton.find('span.text').text() == this.options.textFormatter(this.options.hideRepliesText)) {
            togglableReplies.addClass('visible');
        }

// Make sure that toggle all button is present
        if (childComments.length > this.options.maxRepliesVisible) {

            // Append button to toggle all replies if necessary
            if (!toggleAllButton.length) {

                toggleAllButton = $('<li/>', {
                    'class': 'toggle-all highlight-font-bold'
                });
                const toggleAllButtonText = $('<span/>', {
                    'class': 'text'
                });
                const caret = $('<span/>', {
                    'class': 'caret'
                });

                // Append toggle button to DOM
                toggleAllButton.append(toggleAllButtonText).append(caret);
                childCommentsEl.prepend(toggleAllButton);
            }

            // Update the text of toggle all -button
            this.setToggleAllButtonText(toggleAllButton, false);

            // Make sure that toggle all button is not present
        } else {
            toggleAllButton.remove();
        }
    }

    private updateToggleAllButtons() {
        const self = this;
        const commentList = this.$el.find('#comment-list');

        // Fold comments, find first level children and update toggle buttons
        commentList.find('.comment').removeClass('visible');
        commentList.children('.comment').each(function (index, el) {
            self.updateToggleAllButton($(el));
        });
    }

    private sortComments(comments: Record<string, any>[], sortKey: 'popularity' | 'oldest' | 'newest'): void {
        const self = this;

        // Sort by popularity
        if (sortKey === 'popularity') {
            comments.sort(function (commentA, commentB) {
                const pointsOfA = commentA.childs.length;
                const pointsOfB = commentB.childs.length;

                if (self.options.enableUpvoting) {
                    pointsOfA += commentA.upvoteCount;
                    pointsOfB += commentB.upvoteCount;
                }

                if (pointsOfB != pointsOfA) {
                    return pointsOfB - pointsOfA;

                } else {
                    // Return newer if popularity is the same
                    const createdA = new Date(commentA.created).getTime();
                    const createdB = new Date(commentB.created).getTime();
                    return createdB - createdA;
                }
            });

            // Sort by date
        } else {
            comments.sort(function (commentA, commentB) {
                const createdA = new Date(commentA.created).getTime();
                const createdB = new Date(commentB.created).getTime();
                if (sortKey == 'oldest') {
                    return createdA - createdB;
                } else {
                    return createdB - createdA;
                }
            });
        }
    }

    private sortAndReArrangeComments(sortKey) {
        const commentList = this.$el.find('#comment-list');

        // Get main level comments
        const mainLevelComments = this.getComments().filter(function (commentModel) {
            return !commentModel.parent;
        });
        this.sortComments(mainLevelComments, sortKey);

        // Rearrange the main level comments
        $(mainLevelComments).each(function (index, commentModel) {
            const commentEl = commentList.find('> li.comment[data-id=' + commentModel.id + ']');
            commentList.append(commentEl);
        });
    }

    private showActiveSort() {
        const activeElements = this.$el.find('.navigation li[data-sort-key="' + this.currentSortKey + '"]');

        // Indicate active sort
        this.$el.find('.navigation li').removeClass('active');
        activeElements.addClass('active');

        // Update title for dropdown
        const titleEl = this.$el.find('.navigation .title');
        if (this.currentSortKey != 'attachments') {
            titleEl.addClass('active');
            titleEl.find('header').html(activeElements.first().html());
        } else {
            const defaultDropdownEl = this.$el.find('.navigation ul.dropdown').children().first();
            titleEl.find('header').html(defaultDropdownEl.html());
        }

// Show active container
        this.showActiveContainer();
    }

    private closeDropdowns() {
        this.$el.find('.dropdown').hide();
    }

    private preSavePastedAttachments(ev) {
        const clipboardData = ev.originalEvent.clipboardData;
        const files = clipboardData.files;

        // Browsers only support pasting one file
        if (files && files.length == 1) {

            // Select correct commenting field
            const commentingField;
            const parentCommentingField = $(ev.target).parents('.commenting-field').first();
            if (parentCommentingField.length) {
                commentingField = parentCommentingField;
            }

            this.preSaveAttachments(files, commentingField);
            ev.preventDefault();
        }
    }

    private saveOnKeydown(ev) {
        // Save comment on cmd/ctrl + enter
        if (ev.keyCode == 13) {
            const metaKey = ev.metaKey || ev.ctrlKey;
            if (this.options.postCommentOnEnter || metaKey) {
                const el = $(ev.currentTarget);
                el.siblings('.control-row').find('.save').trigger('click');
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
    }

    private saveEditableContent(ev) {
        const el = $(ev.currentTarget);
        el.data('before', el.html());
    }

    private checkEditableContentForChange(ev) {
        const el = $(ev.currentTarget);

        // Fix jquery-textcomplete on IE, empty text nodes will break up the autocomplete feature
        $(el[0].childNodes).each(function () {
            if (this.nodeType == Node.TEXT_NODE && this.length == 0 && this.removeNode) this.removeNode();
        });

        if (el.data('before') != el.html()) {
            el.data('before', el.html());
            el.trigger('change');
        }
    }

    private navigationElementClicked(ev) {
        const navigationEl = $(ev.currentTarget);
        const sortKey = navigationEl.data().sortKey;

        // Sort the comments if necessary
        if (sortKey == 'attachments') {
            this.createAttachments();
        } else {
            this.sortAndReArrangeComments(sortKey);
        }

// Save the current sort key
        this.currentSortKey = sortKey;
        this.showActiveSort();
    }

    private toggleNavigationDropdown(ev) {
        // Prevent closing immediately
        ev.stopPropagation();

        const dropdown = $(ev.currentTarget).find('~ .dropdown');
        dropdown.toggle();
    }

    private showMainCommentingField(ev) {
        const mainTextarea = $(ev.currentTarget);
        mainTextarea.siblings('.control-row').show();
        mainTextarea.parent().find('.close').show();
        mainTextarea.parent().find('.upload.inline-button').hide();
        mainTextarea.focus();
    }

    private hideMainCommentingField(ev) {
        const closeButton = $(ev.currentTarget);
        const commentingField = this.$el.find('.commenting-field.main');
        const mainTextarea = commentingField.find('.textarea');
        const mainControlRow = commentingField.find('.control-row');

        // Clear text area
        this.clearTextarea(mainTextarea);

        // Clear attachments
        commentingField.find('.attachments').empty();

        // Toggle save button
        this.toggleSaveButton(commentingField);

        // Adjust height
        this.adjustTextareaHeight(mainTextarea, false);

        mainControlRow.hide();
        closeButton.hide();
        mainTextarea.parent().find('.upload.inline-button').show();
        mainTextarea.blur();
    }

    private increaseTextareaHeight(ev) {
        const textarea = $(ev.currentTarget);
        this.adjustTextareaHeight(textarea, true);
    }

    private textareaContentChanged(ev) {
        const textarea = $(ev.currentTarget);

        // Update parent id if reply-to tag was removed
        if (!textarea.find('.reply-to.tag').length) {
            const commentId = textarea.attr('data-comment');

            // Case: editing comment
            if (commentId) {
                const parentComments = textarea.parents('li.comment');
                if (parentComments.length > 1) {
                    const parentId = parentComments.last().data('id');
                    textarea.attr('data-parent', parentId);
                }

                // Case: new comment
            } else {
                const parentId = textarea.parents('li.comment').last().data('id');
                textarea.attr('data-parent', parentId);
            }
        }

// Move close button if scrollbar is visible
        const commentingField = textarea.parents('.commenting-field').first();
        if (textarea[0].scrollHeight > textarea.outerHeight()) {
            commentingField.addClass('commenting-field-scrollable');
        } else {
            commentingField.removeClass('commenting-field-scrollable');
        }

// Check if save button needs to be enabled
        this.toggleSaveButton(commentingField);
    }

    private toggleSaveButton(commentingField) {
        const textarea = commentingField.find('.textarea');
        const saveButton = textarea.siblings('.control-row').find('.save');

        const content = this.getTextareaContent(textarea, true);
        const attachments = this.getAttachmentsFromCommentingField(commentingField);
        const enabled;

        // Case: existing comment
        if (commentModel = this.commentsById[textarea.attr('data-comment')]) {

            // Case: parent changed
            const contentChanged = content != commentModel.content;
            const parentFromModel;
            if (commentModel.parent) {
                parentFromModel = commentModel.parent.toString();
            }

            // Case: parent changed
            const parentChanged = textarea.attr('data-parent') != parentFromModel;

            // Case: attachments changed
            const attachmentsChanged = false;
            if (this.options.enableAttachments) {
                const savedAttachmentIds = commentModel.attachments.map(function (attachment) {
                    return attachment.id;
                });
                const currentAttachmentIds = attachments.map(function (attachment) {
                    return attachment.id;
                });
                attachmentsChanged = !this.areArraysEqual(savedAttachmentIds, currentAttachmentIds);
            }

            enabled = contentChanged || parentChanged || attachmentsChanged;

            // Case: new comment
        } else {
            enabled = Boolean(content.length) || Boolean(attachments.length);
        }

        saveButton.toggleClass('enabled', enabled);
    }

    private removeCommentingField(ev) {
        const closeButton = $(ev.currentTarget);

        // Remove edit class from comment if user was editing the comment
        const textarea = closeButton.siblings('.textarea');
        if (textarea.attr('data-comment')) {
            closeButton.parents('li.comment').first().removeClass('edit');
        }

// Remove the field
        const commentingField = closeButton.parents('.commenting-field').first();
        commentingField.remove();
    }

    private postComment(ev) {
        const self = this;
        const sendButton = $(ev.currentTarget);
        const commentingField = sendButton.parents('.commenting-field').first();

        // Set button state to loading
        this.setButtonState(sendButton, false, true);

        // Create comment JSON
        const commentJSON = this.createCommentJSON(commentingField);

        // Reverse mapping
        commentJSON = this.applyExternalMappings(commentJSON);

        const success = function (commentJSON) {
            self.createComment(commentJSON);
            commentingField.find('.close').trigger('click');

            // Reset button state
            self.setButtonState(sendButton, false, false);
        };

        const error = function () {

            // Reset button state
            self.setButtonState(sendButton, true, false);
        };

        this.options.postComment(commentJSON, success, error);
    }

    private createComment(commentJSON) {
        const commentModel = this.createCommentModel(commentJSON);
        this.addCommentToDataModel(commentModel);

        // Add comment element
        const commentList = this.$el.find('#comment-list');
        const prependComment = this.currentSortKey == 'newest';
        this.addComment(commentModel, commentList, prependComment);

        if (this.currentSortKey == 'attachments' && commentModel.hasAttachments()) {
            this.addAttachment(commentModel);
        }
    }

    private putComment(ev) {
        const self = this;
        const saveButton = $(ev.currentTarget);
        const commentingField = saveButton.parents('.commenting-field').first();
        const textarea = commentingField.find('.textarea');

        // Set button state to loading
        this.setButtonState(saveButton, false, true);

        // Use a clone of the existing model and update the model after succesfull update
        const commentJSON = $.extend({}, this.commentsById[textarea.attr('data-comment')]);
        $.extend(commentJSON, {
            parent: textarea.attr('data-parent') || null,
            content: this.getTextareaContent(textarea),
            pings: this.getPings(textarea),
            modified: new Date().getTime(),
            attachments: this.getAttachmentsFromCommentingField(commentingField)
        });

// Reverse mapping
        commentJSON = this.applyExternalMappings(commentJSON);

        const success = function (commentJSON) {
            // The outermost parent can not be changed by editing the comment so the childs array
            // of parent does not require an update

            const commentModel = self.createCommentModel(commentJSON);

            // Delete childs array from new comment model since it doesn't need an update
            delete commentModel['childs'];
            self.updateCommentModel(commentModel);

            // Close the editing field
            commentingField.find('.close').trigger('click');

            // Re-render the comment
            self.reRenderComment(commentModel.id);

            // Reset button state
            self.setButtonState(saveButton, false, false);
        };

        const error = function () {

            // Reset button state
            self.setButtonState(saveButton, true, false);
        };

        this.options.putComment(commentJSON, success, error);
    }

    private deleteComment(ev) {
        const self = this;
        const deleteButton = $(ev.currentTarget);
        const commentEl = deleteButton.parents('.comment').first();
        const commentJSON = $.extend({}, this.commentsById[commentEl.attr('data-id')]);
        const commentId = commentJSON.id;
        const parentId = commentJSON.parent;

        // Set button state to loading
        this.setButtonState(deleteButton, false, true);

        // Reverse mapping
        commentJSON = this.applyExternalMappings(commentJSON);

        const success = function () {
            self.removeComment(commentId);
            if (parentId) self.reRenderCommentActionBar(parentId);

            // Reset button state
            self.setButtonState(deleteButton, false, false);
        };

        const error = function () {

            // Reset button state
            self.setButtonState(deleteButton, true, false);
        };

        this.options.deleteComment(commentJSON, success, error);
    }

    private hashtagClicked(ev) {
        const el = $(ev.currentTarget);
        const value = el.attr('data-value');
        this.options.hashtagClicked(value);
    }

    private pingClicked(ev) {
        const el = $(ev.currentTarget);
        const value = el.attr('data-value');
        this.options.pingClicked(value);
    }

    private fileInputChanged(ev, files) {
        const files = ev.currentTarget.files;
        const commentingField = $(ev.currentTarget).parents('.commenting-field').first();
        this.preSaveAttachments(files, commentingField);
    }

    private upvoteComment(ev) {
        const self = this;
        const commentEl = $(ev.currentTarget).parents('li.comment').first();
        const commentModel = commentEl.data().model;

        // Check whether user upvoted the comment or revoked the upvote
        const previousUpvoteCount = commentModel.upvoteCount;
        const newUpvoteCount;
        if (commentModel.userHasUpvoted) {
            newUpvoteCount = previousUpvoteCount - 1;
        } else {
            newUpvoteCount = previousUpvoteCount + 1;
        }

// Show changes immediately
        commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
        commentModel.upvoteCount = newUpvoteCount;
        this.reRenderUpvotes(commentModel.id);

// Reverse mapping
        const commentJSON = $.extend({}, commentModel);
        commentJSON = this.applyExternalMappings(commentJSON);

        const success = function (commentJSON) {
            const commentModel = self.createCommentModel(commentJSON);
            self.updateCommentModel(commentModel);
            self.reRenderUpvotes(commentModel.id);
        };

        const error = function () {

            // Revert changes
            commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
            commentModel.upvoteCount = previousUpvoteCount;
            self.reRenderUpvotes(commentModel.id);
        };

        this.options.upvoteComment(commentJSON, success, error);
    }

    private toggleReplies(ev) {
        const el = $(ev.currentTarget);
        el.siblings('.togglable-reply').toggleClass('visible');
        this.setToggleAllButtonText(el, true);
    }

    private replyButtonClicked(ev) {
        const replyButton = $(ev.currentTarget);
        const outermostParent = replyButton.parents('li.comment').last();
        const parentId = replyButton.parents('.comment').first().data().id;


        // Remove existing field
        const replyField = outermostParent.find('.child-comments > .commenting-field');
        if (replyField.length) replyField.remove();
        const previousParentId = replyField.find('.textarea').attr('data-parent');

        // Create the reply field (do not re-create)
        if (previousParentId != parentId) {
            replyField = this.createCommentingFieldElement(parentId);
            outermostParent.find('.child-comments').append(replyField);

            // Move cursor to end
            const textarea = replyField.find('.textarea');
            this.moveCursorToEnd(textarea);

            // Ensure element stays visible
            this.ensureElementStaysVisible(replyField);
        }
    }

    private editButtonClicked(ev) {
        const editButton = $(ev.currentTarget);
        const commentEl = editButton.parents('li.comment').first();
        const commentModel = commentEl.data().model;
        commentEl.addClass('edit');

        // Create the editing field
        const editField = this.createCommentingFieldElement(commentModel.parent, commentModel.id);
        commentEl.find('.comment-wrapper').first().append(editField);

        // Append original content
        const textarea = editField.find('.textarea');
        textarea.attr('data-comment', commentModel.id);

        // Escaping HTML
        textarea.append(this.getFormattedCommentContent(commentModel, true));

        // Move cursor to end
        this.moveCursorToEnd(textarea);

        // Ensure element stays visible
        this.ensureElementStaysVisible(editField);
    }

    private showDroppableOverlay(ev) {
        if (this.options.enableAttachments) {
            this.$el.find('.droppable-overlay').css('top', this.$el[0].scrollTop);
            this.$el.find('.droppable-overlay').show();
            this.$el.addClass('drag-ongoing');
        }
    }

    private handleDragEnter(ev) {
        const count = $(ev.currentTarget).data('dnd-count') || 0;
        count++;
        $(ev.currentTarget).data('dnd-count', count);
        $(ev.currentTarget).addClass('drag-over');
    }

    private handleDragLeave(ev, callback) {
        const count = $(ev.currentTarget).data('dnd-count');
        count--;
        $(ev.currentTarget).data('dnd-count', count);

        if (count == 0) {
            $(ev.currentTarget).removeClass('drag-over');
            if (callback) callback();
        }
    }

    private handleDragLeaveForOverlay(ev) {
        const self = this;
        this.handleDragLeave(ev, function () {
            self.hideDroppableOverlay();
        });
    }

    private handleDragLeaveForDroppable(ev) {
        this.handleDragLeave(ev);
    }

    private handleDragOverForOverlay(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ev.originalEvent.dataTransfer.dropEffect = 'copy';
    }

    private hideDroppableOverlay() {
        this.$el.find('.droppable-overlay').hide();
        this.$el.removeClass('drag-ongoing');
    }

    private handleDrop(ev) {
        ev.preventDefault();

        // Reset DND counts
        $(ev.target).trigger('dragleave');

        // Hide the overlay and upload the files
        this.hideDroppableOverlay();
        this.preSaveAttachments(ev.originalEvent.dataTransfer.files);
    }

    private stopPropagation(ev) {
        ev.stopPropagation();
    }

    private createHTML() {
        const self = this;

        // Commenting field
        const mainCommentingField = this.createMainCommentingFieldElement();
        this.$el.append(mainCommentingField);

        // Hide control row and close button
        const mainControlRow = mainCommentingField.find('.control-row');
        mainControlRow.hide();
        mainCommentingField.find('.close').hide();

        // Navigation bar
        if (this.options.enableNavigation) {
            this.$el.append(this.createNavigationElement());
            this.showActiveSort();
        }

// Loading spinner
        const spinner = this.createSpinner();
        this.$el.append(spinner);

// Comments container
        const commentsContainer = $('<div/>', {
            'class': 'data-container',
            'data-container': 'comments'
        });
        this.$el.append(commentsContainer);

// "No comments" placeholder
        const noComments = $('<div/>', {
            'class': 'no-comments no-data',
            text: this.options.textFormatter(this.options.noCommentsText)
        });
        const noCommentsIcon = $('<i/>', {
            'class': 'fa fa-comments fa-2x'
        });
        if (this.options.noCommentsIconURL.length) {
            noCommentsIcon.css('background-image', 'url("' + this.options.noCommentsIconURL + '")');
            noCommentsIcon.addClass('image');
        }
        noComments.prepend($('<br/>')).prepend(noCommentsIcon);
        commentsContainer.append(noComments);

// Attachments
        if (this.options.enableAttachments) {

            // Attachments container
            const attachmentsContainer = $('<div/>', {
                'class': 'data-container',
                'data-container': 'attachments'
            });
            this.$el.append(attachmentsContainer);

            // "No attachments" placeholder
            const noAttachments = $('<div/>', {
                'class': 'no-attachments no-data',
                text: this.options.textFormatter(this.options.noAttachmentsText)
            });
            const noAttachmentsIcon = $('<i/>', {
                'class': 'fa fa-paperclip fa-2x'
            });
            if (this.options.attachmentIconURL.length) {
                noAttachmentsIcon.css('background-image', 'url("' + this.options.attachmentIconURL + '")');
                noAttachmentsIcon.addClass('image');
            }
            noAttachments.prepend($('<br/>')).prepend(noAttachmentsIcon);
            attachmentsContainer.append(noAttachments);


            // Drag & dropping attachments
            const droppableOverlay = $('<div/>', {
                'class': 'droppable-overlay'
            });

            const droppableContainer = $('<div/>', {
                'class': 'droppable-container'
            });

            const droppable = $('<div/>', {
                'class': 'droppable'
            });

            const uploadIcon = $('<i/>', {
                'class': 'fa fa-paperclip fa-4x'
            });
            if (this.options.uploadIconURL.length) {
                uploadIcon.css('background-image', 'url("' + this.options.uploadIconURL + '")');
                uploadIcon.addClass('image');
            }

            const dropAttachmentText = $('<div/>', {
                text: this.options.textFormatter(this.options.attachmentDropText)
            });
            droppable.append(uploadIcon);
            droppable.append(dropAttachmentText);

            droppableOverlay.html(droppableContainer.html(droppable)).hide();
            this.$el.append(droppableOverlay);
        }
    }

    private createMainCommentingFieldElement() {
        return this.createCommentingFieldElement(undefined, undefined, true);
    }

    private reRenderComment(id) {
        const commentModel = this.commentsById[id];
        const commentElements = this.$el.find('li.comment[data-id="' + commentModel.id + '"]');

        const self = this;
        commentElements.each(function (index, commentEl) {
            const commentWrapper = self.createCommentWrapperElement(commentModel);
            $(commentEl).find('.comment-wrapper').first().replaceWith(commentWrapper);
        });
    }

    private reRenderCommentActionBar(id) {
        const commentModel = this.commentsById[id];
        const commentElements = this.$el.find('li.comment[data-id="' + commentModel.id + '"]');

        const self = this;
        commentElements.each(function (index, commentEl) {
            const commentWrapper = self.createCommentWrapperElement(commentModel);
            $(commentEl).find('.actions').first().replaceWith(commentWrapper.find('.actions'));
        });
    }

    private reRenderUpvotes(id) {
        const commentModel = this.commentsById[id];
        const commentElements = this.$el.find('li.comment[data-id="' + commentModel.id + '"]');

        const self = this;
        commentElements.each(function (index, commentEl) {
            const upvotes = self.createUpvoteElement(commentModel);
            $(commentEl).find('.upvote').first().replaceWith(upvotes);
        });
    }

}

// register custom element
customElements.define('ax-comments', CommentsComponent);

declare global {
    interface HTMLElementTagNameMap {
        'ax-comments': CommentsComponent;
    }
}
