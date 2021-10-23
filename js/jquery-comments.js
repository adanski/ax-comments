/*!     jquery-comments.js 1.5.0
 *
 *     (c) 2017 Joona Tykkyläinen, Viima Solutions Oy
 *     jquery-comments may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     http://viima.github.io/jquery-comments/
 */

(function (factory) {
}(function($) {

    var Comments = {

        // Instance variables
        // ==================

        $el: null,
        commentsById: {},
        dataFetched: false,
        currentSortKey: '',
        options: {},
        events: {
            AZI
        },

        // Default options
        // ===============
        getDefaultOptions: function() {
            return AZI;
        },

        // Initialization
        // ==============

        init: function(options, el) {
            this.$el = $(el);
            this.$el.addClass('jquery-comments');
            this.undelegateEvents();
            this.delegateEvents();

            // Detect mobile devices
            (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
            if($.browser.mobile) this.$el.addClass('mobile');

            // Init options
            this.options = $.extend(true, {}, this.getDefaultOptions(), options);;

            // Read-only mode
            if(this.options.readOnly) this.$el.addClass('read-only');

            // Set initial sort key
            this.currentSortKey = this.options.defaultNavigationSortKey;

            // Create CSS declarations for highlight color
            this.createCssDeclarations();

            // Fetching data and rendering
            this.fetchDataAndRender();
        },

        delegateEvents: function() {
            this.bindEvents(false);
        },

        undelegateEvents: function() {
            this.bindEvents(true);
        },

        bindEvents: function(unbind) {
            var bindFunction = unbind ? 'off' : 'on';
            for (var key in this.events) {
                var eventName = key.split(' ')[0];
                var selector = key.split(' ').slice(1).join(' ');
                var methodNames = this.events[key].split(' ');

                for(var index in methodNames) {
                    if(methodNames.hasOwnProperty(index)) {
                        var method = this[methodNames[index]];

                        // Keep the context
                        method = $.proxy(method, this);

                        if (selector == '') {
                            this.$el[bindFunction](eventName, method);
                        } else {
                            this.$el[bindFunction](eventName, selector, method);
                        }
                    }
                }
            }
        },


        // Basic functionalities
        // =====================

        fetchDataAndRender: function () {
            var self = this;

            this.commentsById = {};

            this.$el.empty();
            this.createHTML();

            // Comments
            // ========

            this.options.getComments(function(commentsArray) {

                // Convert comments to custom data model
                var commentModels = commentsArray.map(function(commentsJSON){
                    return self.createCommentModel(commentsJSON)
                });

                // Sort comments by date (oldest first so that they can be appended to the data model
                // without caring dependencies)
                self.sortComments(commentModels, 'oldest');

                $(commentModels).each(function(index, commentModel) {
                    self.addCommentToDataModel(commentModel);
                });

                // Mark data as fetched
                self.dataFetched = true;

                // Render
                self.render();
            });
        },

        fetchNext: function() {
            var self = this;

            // Loading indicator
            var spinner = this.createSpinner();
            this.$el.find('ul#comment-list').append(spinner);

            var success = function (commentModels) {
                $(commentModels).each(function(index, commentModel) {
                    self.createComment(commentModel);
                });
                spinner.remove();
            }

            var error = function() {
                spinner.remove();
            }

            this.options.getComments(success, error);
        },

        createCommentModel: function(commentJSON) {
            var commentModel = this.applyInternalMappings(commentJSON);
            commentModel.childs = [];
            commentModel.hasAttachments = function() {
                return commentModel.attachments.length > 0;
            }
            return commentModel;
        },

        addCommentToDataModel: function(commentModel) {
            if(!(commentModel.id in this.commentsById)) {
                this.commentsById[commentModel.id] = commentModel;

                // Update child array of the parent (append childs to the array of outer most parent)
                if(commentModel.parent) {
                    var outermostParent = this.getOutermostParent(commentModel.parent);
                    outermostParent.childs.push(commentModel.id);
                }
            }
        },

        updateCommentModel: function(commentModel) {
            $.extend(this.commentsById[commentModel.id], commentModel);
        },

        render: function() {
            var self = this;

            // Prevent re-rendering if data hasn't been fetched
            if(!this.dataFetched) return;

            // Show active container
            this.showActiveContainer();

            // Create comments and attachments
            this.createComments();
            if(this.options.enableAttachments && this.options.enableNavigation) this.createAttachments();

            // Remove spinner
            this.$el.find('> .spinner').remove();

            this.options.refresh();
        },

        showActiveContainer: function() {
            var activeNavigationEl = this.$el.find('.navigation li[data-container-name].active');
            var containerName = activeNavigationEl.data('container-name');
            var containerEl = this.$el.find('[data-container="' + containerName + '"]');
            containerEl.siblings('[data-container]').hide();
            containerEl.show();
        },

        createComments: function() {
            var self = this;

            // Create the list element before appending to DOM in order to reach better performance
            this.$el.find('#comment-list').remove();
            var commentList = $('<ul/>', {
                id: 'comment-list',
                'class': 'main'
            });

            // Divide commments into main level comments and replies
            var mainLevelComments = [];
            var replies = [];
            $(this.getComments()).each(function(index, commentModel) {
                if(commentModel.parent == null) {
                    mainLevelComments.push(commentModel);
                } else {
                    replies.push(commentModel);
                }
            });

            // Append main level comments
            this.sortComments(mainLevelComments, this.currentSortKey);
            $(mainLevelComments).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });

            // Append replies in chronological order
            this.sortComments(replies, 'oldest');
            $(replies).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });

            // Appned list to DOM
            this.$el.find('[data-container="comments"]').prepend(commentList);
        },

        createAttachments: function() {
            var self = this;

            // Create the list element before appending to DOM in order to reach better performance
            this.$el.find('#attachment-list').remove();
            var attachmentList = $('<ul/>', {
                id: 'attachment-list',
                'class': 'main'
            });

            var attachments = this.getAttachments();
            this.sortComments(attachments, 'newest');
            $(attachments).each(function(index, commentModel) {
                self.addAttachment(commentModel, attachmentList);
            });

            // Appned list to DOM
            this.$el.find('[data-container="attachments"]').prepend(attachmentList);
        },

        addComment: function(commentModel, commentList, prependComment) {
            commentList = commentList || this.$el.find('#comment-list');
            var commentEl = this.createCommentElement(commentModel);

            // Case: reply
            if(commentModel.parent) {
                var directParentEl = commentList.find('.comment[data-id="'+commentModel.parent+'"]');

                // Re-render action bar of direct parent element
                this.reRenderCommentActionBar(commentModel.parent);

                // Force replies into one level only
                var outerMostParent = directParentEl.parents('.comment').last();
                if(outerMostParent.length == 0) outerMostParent = directParentEl;

                // Append element to DOM
                var childCommentsEl = outerMostParent.find('.child-comments');
                var commentingField = childCommentsEl.find('.commenting-field');
                if(commentingField.length) {
                    commentingField.before(commentEl)
                } else {
                    childCommentsEl.append(commentEl);
                }

                // Update toggle all -button
                this.updateToggleAllButton(outerMostParent);

            // Case: main level comment
            } else {
                if(prependComment) {
                    commentList.prepend(commentEl);
                } else {
                    commentList.append(commentEl);
                }
            }
        },

        addAttachment: function(commentModel, commentList) {
            commentList = commentList || this.$el.find('#attachment-list');
            var commentEl = this.createCommentElement(commentModel);
            commentList.prepend(commentEl);
        },

        removeComment: function(commentId) {
            var self = this;
            var commentModel = this.commentsById[commentId];

            // Remove child comments recursively
            var childComments = this.getChildComments(commentModel.id);
            $(childComments).each(function(index, childComment) {
                self.removeComment(childComment.id);
            });

            // Update the child array of outermost parent
            if(commentModel.parent) {
                var outermostParent = this.getOutermostParent(commentModel.parent);
                var indexToRemove = outermostParent.childs.indexOf(commentModel.id);
                outermostParent.childs.splice(indexToRemove, 1);
            }

            // Remove the comment from data model
            delete this.commentsById[commentId];

            var commentElements = this.$el.find('li.comment[data-id="'+commentId+'"]');
            var parentEl = commentElements.parents('li.comment').last();

            // Remove the element
            commentElements.remove();

            // Update the toggle all button
            this.updateToggleAllButton(parentEl);
        },

        preDeleteAttachment: function(ev) {
            var commentingField = $(ev.currentTarget).parents('.commenting-field').first()
            var attachmentEl = $(ev.currentTarget).parents('.attachment').first();
            attachmentEl.remove();

            // Check if save button needs to be enabled
            this.toggleSaveButton(commentingField);
        },

        preSaveAttachments: function(files, commentingField) {
            var self = this;

            if(files.length) {

                // Elements
                if(!commentingField) commentingField = this.$el.find('.commenting-field.main');
                var uploadButton = commentingField.find('.control-row .upload');
                var isReply = !commentingField.hasClass('main');
                var attachmentsContainer = commentingField.find('.control-row .attachments');

                // Create attachment models
                var attachments = $(files).map(function(index, file){
                    return {
                        mime_type: file.type,
                        file: file
                    }
                });

                // Filter out already added attachments
                var existingAttachments = this.getAttachmentsFromCommentingField(commentingField);
                attachments = attachments.filter(function(index, attachment) {
                    var duplicate = false;

                    // Check if the attacment name and size matches with already added attachment
                    $(existingAttachments).each(function(index, existingAttachment) {
                        if(attachment.file.name == existingAttachment.file.name && attachment.file.size == existingAttachment.file.size) {
                            duplicate = true;
                        }
                    });

                    return !duplicate;
                });

                // Ensure that the main commenting field is shown if attachments were added to that
                if(commentingField.hasClass('main')) {
                    commentingField.find('.textarea').trigger('click');
                }

                // Set button state to loading
                this.setButtonState(uploadButton, false, true);

                // Validate attachments
                this.options.validateAttachments(attachments, function(validatedAttachments) {

                    if(validatedAttachments.length) {

                        // Create attachment tags
                        $(validatedAttachments).each(function(index, attachment) {
                            var attachmentTag = self.createAttachmentTagElement(attachment, true);
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
        },

        updateToggleAllButton: function(parentEl) {
            // Don't hide replies if maxRepliesVisible is null or undefined
            if (this.options.maxRepliesVisible == null) return;

            var childCommentsEl = parentEl.find('.child-comments');
            var childComments = childCommentsEl.find('.comment').not('.hidden');
            var toggleAllButton = childCommentsEl.find('li.toggle-all');
            childComments.removeClass('togglable-reply');

            // Select replies to be hidden
            if (this.options.maxRepliesVisible === 0) {
                var togglableReplies = childComments;
            } else {
                var togglableReplies = childComments.slice(0, -this.options.maxRepliesVisible);
            }

            // Add identifying class for hidden replies so they can be toggled
            togglableReplies.addClass('togglable-reply');

            // Show all replies if replies are expanded
            if(toggleAllButton.find('span.text').text() == this.options.textFormatter(this.options.hideRepliesText)) {
                togglableReplies.addClass('visible');
            }

            // Make sure that toggle all button is present
            if(childComments.length > this.options.maxRepliesVisible) {

                // Append button to toggle all replies if necessary
                if(!toggleAllButton.length) {

                    toggleAllButton = $('<li/>', {
                        'class': 'toggle-all highlight-font-bold'
                    });
                    var toggleAllButtonText = $('<span/>', {
                        'class': 'text'
                    });
                    var caret = $('<span/>', {
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
        },

        updateToggleAllButtons: function() {
            var self = this;
            var commentList = this.$el.find('#comment-list');

            // Fold comments, find first level children and update toggle buttons
            commentList.find('.comment').removeClass('visible');
            commentList.children('.comment').each(function(index, el) {
                self.updateToggleAllButton($(el));
            });
        },

        sortComments: function (comments, sortKey) {
            var self = this;

            // Sort by popularity
            if(sortKey == 'popularity') {
                comments.sort(function(commentA, commentB) {
                    var pointsOfA = commentA.childs.length;
                    var pointsOfB = commentB.childs.length;

                    if(self.options.enableUpvoting) {
                        pointsOfA += commentA.upvoteCount;
                        pointsOfB += commentB.upvoteCount;
                    }

                    if(pointsOfB != pointsOfA) {
                        return pointsOfB - pointsOfA;

                    } else {
                        // Return newer if popularity is the same
                        var createdA = new Date(commentA.created).getTime();
                        var createdB = new Date(commentB.created).getTime();
                        return createdB - createdA;
                    }
                });

            // Sort by date
            } else {
                comments.sort(function(commentA, commentB) {
                    var createdA = new Date(commentA.created).getTime();
                    var createdB = new Date(commentB.created).getTime();
                    if(sortKey == 'oldest') {
                        return createdA - createdB;
                    } else {
                        return createdB - createdA;
                    }
                });
            }
        },

        sortAndReArrangeComments: function(sortKey) {
            var commentList = this.$el.find('#comment-list');

            // Get main level comments
            var mainLevelComments = this.getComments().filter(function(commentModel){return !commentModel.parent});
            this.sortComments(mainLevelComments, sortKey);

            // Rearrange the main level comments
            $(mainLevelComments).each(function(index, commentModel) {
                var commentEl = commentList.find('> li.comment[data-id='+commentModel.id+']');
                commentList.append(commentEl);
            });
        },

        showActiveSort: function() {
            var activeElements = this.$el.find('.navigation li[data-sort-key="' + this.currentSortKey + '"]');

            // Indicate active sort
            this.$el.find('.navigation li').removeClass('active');
            activeElements.addClass('active');

            // Update title for dropdown
            var titleEl = this.$el.find('.navigation .title');
            if(this.currentSortKey != 'attachments') {
                titleEl.addClass('active');
                titleEl.find('header').html(activeElements.first().html());
             } else {
                var defaultDropdownEl = this.$el.find('.navigation ul.dropdown').children().first();
                titleEl.find('header').html(defaultDropdownEl.html());
             }

            // Show active container
            this.showActiveContainer();
        },

        // Event handlers
        // ==============

        closeDropdowns: function() {
            this.$el.find('.dropdown').hide();
        },

        preSavePastedAttachments: function(ev) {
            var clipboardData = ev.originalEvent.clipboardData;
            var files = clipboardData.files;

            // Browsers only support pasting one file
            if(files && files.length == 1) {

                // Select correct commenting field
                var commentingField;
                var parentCommentingField = $(ev.target).parents('.commenting-field').first(); 
                if(parentCommentingField.length) {
                    commentingField = parentCommentingField;
                }

                this.preSaveAttachments(files, commentingField);
                ev.preventDefault();
            }
        },

        saveOnKeydown: function(ev) {
            // Save comment on cmd/ctrl + enter
            if(ev.keyCode == 13) {
                var metaKey = ev.metaKey || ev.ctrlKey;
                if(this.options.postCommentOnEnter || metaKey) {
                    var el = $(ev.currentTarget);
                    el.siblings('.control-row').find('.save').trigger('click');
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        },

        saveEditableContent: function(ev) {
            var el = $(ev.currentTarget);
            el.data('before', el.html());
        },

        checkEditableContentForChange: function(ev) {
            var el = $(ev.currentTarget);

            // Fix jquery-textcomplete on IE, empty text nodes will break up the autocomplete feature
            $(el[0].childNodes).each(function() {
                if(this.nodeType == Node.TEXT_NODE && this.length == 0 && this.removeNode) this.removeNode();
            });

            if (el.data('before') != el.html()) {
                el.data('before', el.html());
                el.trigger('change');
            }
        },

        navigationElementClicked: function(ev) {
            var navigationEl = $(ev.currentTarget);
            var sortKey = navigationEl.data().sortKey;

            // Sort the comments if necessary
            if(sortKey == 'attachments') {
                this.createAttachments();
            } else {
                this.sortAndReArrangeComments(sortKey);
            }

            // Save the current sort key
            this.currentSortKey = sortKey;
            this.showActiveSort();
        },

        toggleNavigationDropdown: function(ev) {
            // Prevent closing immediately
            ev.stopPropagation();

            var dropdown = $(ev.currentTarget).find('~ .dropdown');
            dropdown.toggle();
        },

        showMainCommentingField: function(ev) {
            var mainTextarea = $(ev.currentTarget);
            mainTextarea.siblings('.control-row').show();
            mainTextarea.parent().find('.close').show();
            mainTextarea.parent().find('.upload.inline-button').hide();
            mainTextarea.focus();
        },

        hideMainCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);
            var commentingField = this.$el.find('.commenting-field.main');
            var mainTextarea = commentingField.find('.textarea');
            var mainControlRow = commentingField.find('.control-row');

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
        },

        increaseTextareaHeight: function(ev) {
            var textarea = $(ev.currentTarget);
            this.adjustTextareaHeight(textarea, true);
        },

        textareaContentChanged: function(ev) {
            var textarea = $(ev.currentTarget);

            // Update parent id if reply-to tag was removed
            if(!textarea.find('.reply-to.tag').length) {
                var commentId = textarea.attr('data-comment');

                // Case: editing comment
                if(commentId) {
                    var parentComments = textarea.parents('li.comment');
                    if(parentComments.length > 1) {
                        var parentId = parentComments.last().data('id');
                        textarea.attr('data-parent', parentId);
                    }

                // Case: new comment
                } else {
                    var parentId = textarea.parents('li.comment').last().data('id');
                    textarea.attr('data-parent', parentId);
                }
            }

            // Move close button if scrollbar is visible
            var commentingField = textarea.parents('.commenting-field').first();
            if(textarea[0].scrollHeight > textarea.outerHeight()) {
                commentingField.addClass('commenting-field-scrollable');
            } else {
                commentingField.removeClass('commenting-field-scrollable');
            }

            // Check if save button needs to be enabled
            this.toggleSaveButton(commentingField);
        },

        toggleSaveButton: function(commentingField) {
            var textarea = commentingField.find('.textarea');
            var saveButton = textarea.siblings('.control-row').find('.save');

            var content = this.getTextareaContent(textarea, true);
            var attachments = this.getAttachmentsFromCommentingField(commentingField);
            var enabled;

            // Case: existing comment
            if(commentModel = this.commentsById[textarea.attr('data-comment')]) {

                // Case: parent changed
                var contentChanged = content != commentModel.content;
                var parentFromModel;
                if(commentModel.parent) {
                    parentFromModel = commentModel.parent.toString();
                }

                // Case: parent changed
                var parentChanged = textarea.attr('data-parent') != parentFromModel;

                // Case: attachments changed
                var attachmentsChanged = false;
                if(this.options.enableAttachments) {
                    var savedAttachmentIds = commentModel.attachments.map(function(attachment){return attachment.id});
                    var currentAttachmentIds = attachments.map(function(attachment){return attachment.id});
                    attachmentsChanged = !this.areArraysEqual(savedAttachmentIds, currentAttachmentIds);
                }

                enabled = contentChanged || parentChanged || attachmentsChanged;

            // Case: new comment
            } else {
                enabled = Boolean(content.length) || Boolean(attachments.length);
            }

            saveButton.toggleClass('enabled', enabled);
        },

        removeCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);

            // Remove edit class from comment if user was editing the comment
            var textarea = closeButton.siblings('.textarea');
            if(textarea.attr('data-comment')) {
                closeButton.parents('li.comment').first().removeClass('edit');
            }

            // Remove the field
            var commentingField = closeButton.parents('.commenting-field').first();
            commentingField.remove();
        },

        postComment: function(ev) {
            var self = this;
            var sendButton = $(ev.currentTarget);
            var commentingField = sendButton.parents('.commenting-field').first();

            // Set button state to loading
            this.setButtonState(sendButton, false, true);

            // Create comment JSON
            var commentJSON = this.createCommentJSON(commentingField);

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                self.createComment(commentJSON);
                commentingField.find('.close').trigger('click');

                // Reset button state
                self.setButtonState(sendButton, false, false);
            };

            var error = function() {

                // Reset button state
                self.setButtonState(sendButton, true, false);
            };

            this.options.postComment(commentJSON, success, error);
        },

        createComment: function(commentJSON) {
            var commentModel = this.createCommentModel(commentJSON);
            this.addCommentToDataModel(commentModel);

            // Add comment element
            var commentList = this.$el.find('#comment-list');
            var prependComment = this.currentSortKey == 'newest';
            this.addComment(commentModel, commentList, prependComment);

            if(this.currentSortKey == 'attachments' && commentModel.hasAttachments()) {
                this.addAttachment(commentModel);
            }
        },

        putComment: function(ev) {
            var self = this;
            var saveButton = $(ev.currentTarget);
            var commentingField = saveButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            // Set button state to loading
            this.setButtonState(saveButton, false, true);

            // Use a clone of the existing model and update the model after succesfull update
            var commentJSON =  $.extend({}, this.commentsById[textarea.attr('data-comment')]);
            $.extend(commentJSON, {
                parent: textarea.attr('data-parent') || null,
                content: this.getTextareaContent(textarea),
                pings: this.getPings(textarea),
                modified: new Date().getTime(),
                attachments: this.getAttachmentsFromCommentingField(commentingField)
            });

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                // The outermost parent can not be changed by editing the comment so the childs array
                // of parent does not require an update

                var commentModel = self.createCommentModel(commentJSON);

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

            var error = function() {

                // Reset button state
                self.setButtonState(saveButton, true, false);
            };

            this.options.putComment(commentJSON, success, error);
        },

        deleteComment: function(ev) {
            var self = this;
            var deleteButton = $(ev.currentTarget);
            var commentEl = deleteButton.parents('.comment').first();
            var commentJSON =  $.extend({}, this.commentsById[commentEl.attr('data-id')]);
            var commentId = commentJSON.id;
            var parentId = commentJSON.parent;

            // Set button state to loading
            this.setButtonState(deleteButton, false, true);

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function() {
                self.removeComment(commentId);
                if(parentId) self.reRenderCommentActionBar(parentId);

                // Reset button state
                self.setButtonState(deleteButton, false, false);
            };

            var error = function() {

                // Reset button state
                self.setButtonState(deleteButton, true, false);
            };

            this.options.deleteComment(commentJSON, success, error);
        },

        hashtagClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.hashtagClicked(value);
        },

        pingClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.pingClicked(value);
        },

        fileInputChanged: function(ev, files) {
            var files = ev.currentTarget.files;
            var commentingField = $(ev.currentTarget).parents('.commenting-field').first();
            this.preSaveAttachments(files, commentingField);
        },

        upvoteComment: function(ev) {
            var self = this;
            var commentEl = $(ev.currentTarget).parents('li.comment').first();
            var commentModel = commentEl.data().model;

            // Check whether user upvoted the comment or revoked the upvote
            var previousUpvoteCount = commentModel.upvoteCount;
            var newUpvoteCount;
            if(commentModel.userHasUpvoted) {
                newUpvoteCount = previousUpvoteCount - 1;
            } else {
                newUpvoteCount = previousUpvoteCount + 1;
            }

            // Show changes immediately
            commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
            commentModel.upvoteCount = newUpvoteCount;
            this.reRenderUpvotes(commentModel.id);

            // Reverse mapping
            var commentJSON = $.extend({}, commentModel);
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                var commentModel = self.createCommentModel(commentJSON);
                self.updateCommentModel(commentModel);
                self.reRenderUpvotes(commentModel.id);
            };

            var error = function() {

                // Revert changes
                commentModel.userHasUpvoted = !commentModel.userHasUpvoted;
                commentModel.upvoteCount = previousUpvoteCount;
                self.reRenderUpvotes(commentModel.id);
            };

            this.options.upvoteComment(commentJSON, success, error);
        },

        toggleReplies: function(ev) {
            var el = $(ev.currentTarget);
            el.siblings('.togglable-reply').toggleClass('visible');
            this.setToggleAllButtonText(el, true);
        },

        replyButtonClicked: function(ev) {
            var replyButton = $(ev.currentTarget);
            var outermostParent = replyButton.parents('li.comment').last();
            var parentId = replyButton.parents('.comment').first().data().id;


            // Remove existing field
            var replyField = outermostParent.find('.child-comments > .commenting-field');
            if(replyField.length) replyField.remove();
            var previousParentId = replyField.find('.textarea').attr('data-parent');

            // Create the reply field (do not re-create)
            if(previousParentId != parentId) {
                replyField = this.createCommentingFieldElement(parentId);
                outermostParent.find('.child-comments').append(replyField);

                // Move cursor to end
                var textarea = replyField.find('.textarea');
                this.moveCursorToEnd(textarea);

                // Ensure element stays visible
                this.ensureElementStaysVisible(replyField);
            }
        },

        editButtonClicked: function(ev) {
            var editButton = $(ev.currentTarget);
            var commentEl = editButton.parents('li.comment').first();
            var commentModel = commentEl.data().model;
            commentEl.addClass('edit');

            // Create the editing field
            var editField = this.createCommentingFieldElement(commentModel.parent, commentModel.id);
            commentEl.find('.comment-wrapper').first().append(editField);

            // Append original content
            var textarea = editField.find('.textarea');
            textarea.attr('data-comment', commentModel.id);

            // Escaping HTML
            textarea.append(this.getFormattedCommentContent(commentModel, true));

            // Move cursor to end
            this.moveCursorToEnd(textarea);

            // Ensure element stays visible
            this.ensureElementStaysVisible(editField);
        },

        showDroppableOverlay: function(ev) {
            if(this.options.enableAttachments) {
                this.$el.find('.droppable-overlay').css('top', this.$el[0].scrollTop);
                this.$el.find('.droppable-overlay').show();
                this.$el.addClass('drag-ongoing');
            }
        },

        handleDragEnter: function(ev) {
            var count = $(ev.currentTarget).data('dnd-count') || 0;
            count++;
            $(ev.currentTarget).data('dnd-count', count);
            $(ev.currentTarget).addClass('drag-over');
        },

        handleDragLeave: function(ev, callback) {
            var count = $(ev.currentTarget).data('dnd-count');
            count--;
            $(ev.currentTarget).data('dnd-count', count);

            if(count == 0) {
                $(ev.currentTarget).removeClass('drag-over');
                if(callback) callback();
            }
        },

        handleDragLeaveForOverlay: function(ev) {
            var self = this;
            this.handleDragLeave(ev, function() {
                self.hideDroppableOverlay();
            });
        },

        handleDragLeaveForDroppable: function(ev) {
            this.handleDragLeave(ev);
        },

        handleDragOverForOverlay: function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            ev.originalEvent.dataTransfer.dropEffect = 'copy';
        },

        hideDroppableOverlay: function() {
            this.$el.find('.droppable-overlay').hide();
            this.$el.removeClass('drag-ongoing');
        },

        handleDrop: function(ev) {
            ev.preventDefault();

            // Reset DND counts
            $(ev.target).trigger('dragleave');

            // Hide the overlay and upload the files
            this.hideDroppableOverlay();
            this.preSaveAttachments(ev.originalEvent.dataTransfer.files);
        },

        stopPropagation: function(ev) {
            ev.stopPropagation();
        },


        // HTML elements
        // =============

        createHTML: function() {
            var self = this;

            // Commenting field
            var mainCommentingField = this.createMainCommentingFieldElement();
            this.$el.append(mainCommentingField);

            // Hide control row and close button
            var mainControlRow = mainCommentingField.find('.control-row');
            mainControlRow.hide();
            mainCommentingField.find('.close').hide();

            // Navigation bar
            if (this.options.enableNavigation) {
                this.$el.append(this.createNavigationElement());
                this.showActiveSort();
            }

            // Loading spinner
            var spinner = this.createSpinner();
            this.$el.append(spinner);

            // Comments container
            var commentsContainer = $('<div/>', {
                'class': 'data-container',
                'data-container': 'comments'
            });
            this.$el.append(commentsContainer);

            // "No comments" placeholder
            var noComments = $('<div/>', {
                'class': 'no-comments no-data',
                text: this.options.textFormatter(this.options.noCommentsText)
            });
            var noCommentsIcon = $('<i/>', {
                'class': 'fa fa-comments fa-2x'
            });
            if(this.options.noCommentsIconURL.length) {
                noCommentsIcon.css('background-image', 'url("'+this.options.noCommentsIconURL+'")');
                noCommentsIcon.addClass('image');
            }
            noComments.prepend($('<br/>')).prepend(noCommentsIcon);
            commentsContainer.append(noComments);

            // Attachments
            if(this.options.enableAttachments) {

                // Attachments container
                var attachmentsContainer = $('<div/>', {
                    'class': 'data-container',
                    'data-container': 'attachments'
                });
                this.$el.append(attachmentsContainer);

                // "No attachments" placeholder
                var noAttachments = $('<div/>', {
                    'class': 'no-attachments no-data',
                    text: this.options.textFormatter(this.options.noAttachmentsText)
                });
                var noAttachmentsIcon = $('<i/>', {
                    'class': 'fa fa-paperclip fa-2x'
                });
                if(this.options.attachmentIconURL.length) {
                    noAttachmentsIcon.css('background-image', 'url("'+this.options.attachmentIconURL+'")');
                    noAttachmentsIcon.addClass('image');
                }
                noAttachments.prepend($('<br/>')).prepend(noAttachmentsIcon);
                attachmentsContainer.append(noAttachments);


                // Drag & dropping attachments
                var droppableOverlay = $('<div/>', {
                    'class': 'droppable-overlay'
                });

                var droppableContainer = $('<div/>', {
                    'class': 'droppable-container'
                });

                var droppable = $('<div/>', {
                    'class': 'droppable'
                });

                var uploadIcon = $('<i/>', {
                    'class': 'fa fa-paperclip fa-4x'
                });
                if(this.options.uploadIconURL.length) {
                    uploadIcon.css('background-image', 'url("'+this.options.uploadIconURL+'")');
                    uploadIcon.addClass('image');
                }

                var dropAttachmentText = $('<div/>', {
                    text: this.options.textFormatter(this.options.attachmentDropText)
                });
                droppable.append(uploadIcon);
                droppable.append(dropAttachmentText);

                droppableOverlay.html(droppableContainer.html(droppable)).hide();
                this.$el.append(droppableOverlay);
            }
        },

        createMainCommentingFieldElement: function() {
            return this.createCommentingFieldElement(undefined, undefined, true);
        },

        reRenderComment: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.comment-wrapper').first().replaceWith(commentWrapper);
            });
        },

        reRenderCommentActionBar: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.actions').first().replaceWith(commentWrapper.find('.actions'));
            });
        },

        reRenderUpvotes: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var upvotes = self.createUpvoteElement(commentModel);
                $(commentEl).find('.upvote').first().replaceWith(upvotes);
            });
        }

    };

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            $.data(this, 'comments', comments);
            comments.init(options || {}, this);
        });
    };
}));
