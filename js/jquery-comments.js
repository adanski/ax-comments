(function($) {

    var Comments = {

        // Instance variables
        // ==================

        $el: null,
        commentsById: {},
        currentSortKey: '',

        options: {
            profilePictureURL: '',
            textareaPlaceholder: 'Leave a comment',
            newestText: 'Newest',
            popularText: 'Popular',
            sendText: 'Send',
            likeText: 'Like',
            replyText: 'Reply',
            youText: 'You',

            viewAllRepliesText: 'View all __replyCount__ replies',
            hideRepliesText: 'Hide replies',

            highlightColor: '#1B7FCC',
            roundProfilePictures: false,
            textareaRows: 2,
            textareaRowsOnFocus: 2,
            textareaMaxRows: 5,
            maxRepliesVisible: 2,

            getComments: function() {},
            postComment: function() {},
            timeFormatter: function(time) {
                return new Date(time).toLocaleDateString(navigator.language);
            }
        },

        events: {

            // Navigation
            'click .navigation li' : 'navigationElementClicked',

            // Main comenting field
            'focus .commenting-field.main .textarea': 'showMainControlRow',
            'click' : 'hideMainControlRow',

            // All commenting fields
            'focus .commenting-field .textarea' : 'increaseTextareaHeight',
            'input .commenting-field .textarea' : 'increaseTextareaHeight textareaContentChanged',
            'click .commenting-field .send' : 'sendButtonClicked',
            'click .commenting-field .close' : 'closeButtonClicked',

            // Comment
            'click li.comment .child-comments .toggle-all': 'toggleReplies',
            'click li.comment .reply': 'replyButtonClicked',
        },

        // Initialization
        // ==============

        init: function(options, el) {
            this.$el = $(el);
            this.$el.addClass('comments')
            this.delegateEvents();

            // Init options
            var self = this;
            $(Object.keys(options)).each(function(index, key) {
                self.options[key] = options[key];
            });

            // Create CSS declarations for highlight color
            this.createCssDeclarations();

            this.updateData();
            this.render();
        },

        delegateEvents: function() {
            for (var key in this.events) {
                var eventName = key.split(' ')[0];
                var selector = key.split(' ').slice(1).join(' ');
                var methodNames = this.events[key].split(' ');

                for(var index in methodNames) {
                    var method = this[methodNames[index]];

                    // Keep the context
                    method = $.proxy(method, this);

                    if (selector == '') {
                        this.$el.on(eventName, method);
                    } else {
                        this.$el.on(eventName, selector, method);
                    }
                }
            }
        },


        // Basic functionalities
        // =====================

        updateData: function () {
            // Get comments
            var commentsArray = this.options.getComments();

            // Sort comments by date (oldest first so that they can be appended to DOM
            // without caring dependencies)
            this.sortComments(commentsArray, 'oldest');

            var self = this;
            $(commentsArray).each(function(index, commentJSON) {
                self.addCommentToDataModel(commentJSON);

                // Update child array of the parent (append childs to the array of outer most parent)
                if(commentJSON.parent != null) {
                    var parentId = commentJSON.parent;
                    do {
                        var parentComment = self.commentsById[parentId];
                        parentId = parentComment.parent;
                    } while(parentComment.parent != null)
                    parentComment.childs.push(commentJSON.id);

                }
            });
        },

        addCommentToDataModel: function(commentJSON) {
            if(!(commentJSON.id in this.commentsById)) {
                this.commentsById[commentJSON.id] = commentJSON;
                commentJSON.childs = [];
            }
        },

        render: function() {
            var self = this;

            this.$el.empty();
            this.createHTML();

            // Divide commments into main level comments and replies
            var mainLevelComments = [];
            var replies = [];
            $(this.getComments()).each(function(index, commentJSON) {
                if(commentJSON.parent == null) {
                    mainLevelComments.push(commentJSON);
                } else {
                    replies.push(commentJSON);
                }
            });

            // Sort the main level comments based on active tab
            this.currentSortKey = this.$el.find('.navigation li.active').data().sortKey;
            this.sortComments(mainLevelComments, this.currentSortKey);

            // Append main level comments
            $(mainLevelComments).each(function(index, commentJSON) {
                var commentEl = self.createCommentElement(commentJSON);
                self.$el.find('#comment-list').append(commentEl);
            });

            // Append replies in chronological order
            this.sortComments(replies, 'oldest');
            $(replies).each(function(index, commentJSON) {
                self.addComment(commentJSON);
            });
        },

        addComment: function(commentJSON) {
            this.addCommentToDataModel(commentJSON);
            var commentEl = this.createCommentElement(commentJSON);

            // Case: reply
            if(commentJSON.parent) {
                var directParentEl = this.$el.find('.comment[data-id="'+commentJSON.parent+'"]');

                // Force replies into one level only
                var outerMostParent = directParentEl.parents('.comment').last();
                if(outerMostParent.length == 0) outerMostParent = directParentEl;

                // Append element to DOM
                var childCommentsEl = outerMostParent.find('.child-comments');
                childCommentsEl.append(commentEl)

                // Update toggle all -button
                this.updateToggleAllButton(outerMostParent);

            // Case: main level comment
            } else {
                //TODO
            }
        },

        updateToggleAllButton: function(parentEl) {
            var childCommentsEl = parentEl.find('.child-comments');
            var childComments = childCommentsEl.find('.comment');
            var toggleAllButton = childCommentsEl.find('li.toggle-all')
            childComments.removeClass('hidden-reply');

            if(childComments.length > this.options.maxRepliesVisible) {
                var hiddenReplies = childComments.slice(0, -this.options.maxRepliesVisible)
                hiddenReplies.addClass('hidden-reply');

                // Show all replies if replies are expanded
                if(toggleAllButton.find('span.text').text() == this.options.hideRepliesText) {
                    hiddenReplies.show();
                }

                // Append button to toggle all replies if necessary
                if(!toggleAllButton.length) {

                    toggleAllButton = $('<li/>', {
                        class: 'toggle-all highlight-font',
                    });
                    var toggleAllButtonText = $('<span/>', {
                        class: 'text'
                    });
                    var caret = $('<span/>', {
                        class: 'caret',
                    });

                    // Append toggle button to DOM
                    toggleAllButton.append(toggleAllButtonText).append(caret)
                    childCommentsEl.prepend(toggleAllButton);
                }

                // Update the text of toggle all -button
                this.setToggleAllButtonText(toggleAllButton, false);
            }

        },

        sortComments: function (comments, sortKey) {
            var self = this;

            // Sort by popularity
            if(sortKey == 'popularity') {
                comments.sort(function(commentA, commentB) {
                    var childsOfA = self.commentsById[commentA.id].childs.length;
                    var childsOfB = self.commentsById[commentB.id].childs.length;
                    return childsOfB - childsOfA;
                });

            // Sort by date
            } else {
                comments.sort(function(commentA, commentB) {
                    var createdA = new Date(commentA.created).getTime();
                    var createdB = new Date(commentB.created).getTime();
                    if(sortKey == 'newest') {
                        return createdB - createdA;
                    } else {
                        return createdA - createdB;
                    }
                });
            }
        },

        sortAndReArrangeComments: function(sortKey) {
            if(sortKey != this.currentSortKey) {
                var commentList = this.$el.find('#comment-list');
                var mainLevelComments = [];

                var self = this;
                commentList.find('> li.comment').each(function(index, el) {
                    var commentId = $(el).data().id;
                    mainLevelComments.push(self.commentsById[commentId]);
                });
                this.sortComments(mainLevelComments, sortKey);

                // Rearrange the main level comments
                $(mainLevelComments).each(function(index, commentJSON) {
                    var commentEl = commentList.find('> li.comment[data-id='+commentJSON.id+']');
                    commentList.append(commentEl);
                });
            }
        },

        postComment: function(commentJSON) {
            var success = function() {};
            var error = function() {};

            commentJSON.fullname = this.options.youText;
            commentJSON.profile_picture_url = this.options.profilePictureURL;
            commentJSON.id = this.getComments().length + 1; //TODO: fix

            this.createCommentElement(commentJSON);

            this.options.postComment(commentJSON, success, error);
        },

        editComment: function() {
        },

        createCommentJSON: function(content, parent) {
            var comment = {
                content: content,
                parent: parent,
            }
            return comment;
        },


        // Event handlers
        // ==============

        navigationElementClicked: function(ev) {
            var navigationEl = $(ev.currentTarget);

            // Indicate active sort
            navigationEl.siblings().removeClass('active');
            navigationEl.addClass('active');

            // Sort the comments
            var sortKey = navigationEl.data().sortKey;
            this.sortAndReArrangeComments(sortKey);

            // Save the current sort key
            this.currentSortKey = sortKey;
        },

        showMainControlRow: function(ev) {
            var textarea = $(ev.currentTarget);
            textarea.siblings('.control-row').show();
            textarea.parent().find('.close').show();
        },

        hideMainControlRow: function(ev) {
            var mainTextarea = this.$el.find('.commenting-field.main .textarea');
            var mainControlRow = this.$el.find('.commenting-field.main .control-row');

            var clickSource = ev.target;
            var sourceIsMainTextarea = clickSource == mainTextarea[0];
            var sourceIsChildOfMainTextarea = $(clickSource).parents('.textarea').first()[0] == mainTextarea[0];

            // Hide the main control row if the click didn't originate from the main textarea
            if(!sourceIsMainTextarea && !sourceIsChildOfMainTextarea) {
                this.adjustTextareaHeight(mainTextarea, false);
                mainControlRow.hide();
                mainTextarea.parent().find('.close').hide();
            }
        },

        increaseTextareaHeight: function(ev) {
            var textarea = $(ev.currentTarget);
            this.adjustTextareaHeight(textarea, true);
        },

        textareaContentChanged: function(ev) {
            var textarea = $(ev.currentTarget);
            var content = textarea.text();
            var sendButton = textarea.siblings('.control-row').find('.send');

            // Check whether send button needs to be enabled
            if(content.trim().length) {
                sendButton.addClass('enabled');
            } else {
                sendButton.removeClass('enabled');
            }

            // Remove reply-to badge if necessary
            if(!content.length) {
                textarea.empty();
                textarea.attr('data-parent', textarea.parents('li.comment').data('id'));
            }

            // Move close button if scrollbar is visible
            var commentingField = textarea.parents('.commenting-field').first();
            if(textarea[0].scrollHeight > textarea.outerHeight()) {
                commentingField.addClass('scrollable');
            } else {
                commentingField.removeClass('scrollable');
            }
        },

        sendButtonClicked: function(ev) {
            var sendButton = $(ev.currentTarget);
            var commentingField = sendButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            if(sendButton.hasClass('enabled')) {
                var parent = parseInt(textarea.attr('data-parent')) || null;
                var content = this.getTextareaContent(textarea)
                var commentJSON = this.createCommentJSON(content, parent);
                this.postComment(commentJSON);
                this.addComment(commentJSON);

                // Proper handling for textarea
                if(commentingField.hasClass('main')) {
                    this.clearTextarea(textarea);
                } else {
                    commentingField.remove();
                }
            }
        },

        closeButtonClicked: function(ev) {
            var commentingField = $(ev.currentTarget).parents('.commenting-field').first();
            if(commentingField.hasClass('main')) {
                this.clearTextarea(commentingField.find('.textarea'));
            } else {
                commentingField.remove();
            }
        },

        toggleReplies: function(ev) {
            var el = $(ev.currentTarget);
            el.siblings('.hidden-reply').toggle();
            this.setToggleAllButtonText(el, true);
        },

        replyButtonClicked: function(ev) {
            var replyButton = $(ev.currentTarget);
            var wrapperOfOuterMostParent = replyButton.parents('.wrapper').last();

            // Remove existing field
            var replyField = wrapperOfOuterMostParent.find('.commenting-field');
            if(replyField.length) replyField.remove();

            // Create the reply field
            var replyField = this.createCommentingFieldElement();
            wrapperOfOuterMostParent.append(replyField);
            textarea = replyField.find('.textarea');

            // Set the correct parent id to the field
            var parentId = replyButton.parents('.comment').first().data().id;
            textarea.attr('data-parent', parentId);

            // Append reply-to badge if necessary
            var parentModel = this.commentsById[parentId];
            if(parentModel.parent) {
                textarea.html('&nbsp;');    // Needed to set the cursor to correct place

                // Creating the reply-to badge
                var replyToBadge = $('<input/>', {
                    class: 'reply-to-badge highlight-font',
                    type: 'button'
                });
                var replyToName = '@' + parentModel.fullname;
                replyToBadge.val(replyToName);
                textarea.prepend(replyToBadge);

                // Move cursor to the end
                var range = document.createRange();
                var selection = window.getSelection();
                range.setStart(textarea[0], 2);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            textarea.focus();
        },


        // HTML elements
        // =============

        createHTML: function() {
            var self = this;

            // Commenting field
            var mainCommentingField = this.createCommentingFieldElement();
            mainCommentingField.addClass('main');
            this.$el.append(mainCommentingField);

            // Hide control row and close button
            var mainControlRow = mainCommentingField.find('.control-row');
            mainControlRow.hide();
            mainCommentingField.find('.close').hide();

            // Navigation bar
            this.$el.append(this.createNavigationElement());

            // Comment list
            var commentList = $('<ul/>', {
                id: 'comment-list'
            });
            this.$el.append(commentList);
        },

        createProfilePictureElement: function(src) {
            var profilePicture = $('<img/>', {
                src: src,
                class: 'profile-picture' + (this.options.roundProfilePictures ? ' round' : '')
            });
            return profilePicture;
        },

        createCommentingFieldElement: function() {
            var self = this;

            // Commenting field
            var commentingField = $('<div/>', {
                class: 'commenting-field',
            });

            // Profile picture
            var profilePicture = this.createProfilePictureElement(this.options.profilePictureURL);
            profilePicture.addClass('own');

            // New comment
            var textareaWrapper = $('<div/>', {
                class: 'textarea-wrapper',
            });
        
            // Control row
            var controlRow = $('<div/>', {
                class: 'control-row',
            });

            // Textarea
            var textarea = $('<div/>', {
                class: 'textarea',
                placeholder: this.options.textareaPlaceholder,
                contenteditable: true,
            });

            // Setting the initial height for the textarea
            this.adjustTextareaHeight(textarea, false);
            
            // Close button
            var closeButton = $('<span/>', {
                class: 'close',
            }).append($('<span class="left"/>')).append($('<span class="right"/>'));

            // Send button
            var sendButton = $('<span/>', {
                class: 'send highlight-background',
                text: this.options.sendText,
            });

            controlRow.append(sendButton);
            textareaWrapper.append(closeButton).append(textarea).append(controlRow);
            commentingField.append(profilePicture).append(textareaWrapper);
            return commentingField;
        },

        createNavigationElement: function() {
            var navigationEl = $('<ul/>', {
                class: 'navigation'
            });

            // Popular
            var popular = $('<li/>', {
                text: this.options.popularText,
                class: 'active',
                'data-sort-key': 'popularity',
            });
            
            // Newest
            var newest = $('<li/>', {
                text: this.options.newestText,
                 'data-sort-key': 'newest',
            });

            navigationEl.append(popular).append(newest);;
            return navigationEl;
        },

        createCommentElement: function(commentJSON) {

            // Comment container element
            var commentEl = $('<li/>', {
                'data-id': commentJSON.id,
                class: 'comment'
            });

            // Profile picture
            var profilePicture = this.createProfilePictureElement(commentJSON.profile_picture_url);

            // Time
            var time = $('<time/>', {
                text: this.options.timeFormatter(commentJSON.created)
            });

            // Name
            var name = $('<div/>', {
                class: 'name',
                text: commentJSON.fullname,
            });

            // Show reply-to name if parent of parent exists
            if(commentJSON.parent) {
                var parent = this.commentsById[commentJSON.parent];
                if(parent.parent) {
                    var replyTo = $('<span/>', {
                        class: 'reply-to',
                        text: ' @' + parent.fullname,
                    });
                    name.append(replyTo);
                }
            }

            // Wrapper
            var wrapper = $('<div/>', {
                class: 'wrapper',
            });

            // Content
            var content = $('<div/>', {
                class: 'content',
                text: commentJSON.content,
            });

            // Like
            var like = $('<span/>', {
                class: 'like',
                text: this.options.likeText,
            });

            // Reply
            var reply = $('<span/>', {
                class: 'reply',
                text: this.options.replyText,
            })

            // Child comments
            var childComments = $('<ul/>', {
                class: 'child-comments'
            });
            
            wrapper.append(content);
            wrapper.append(like).append(reply)
            if(commentJSON.parent == null) wrapper.append(childComments);
            commentEl.append(profilePicture).append(time).append(name).append(wrapper);
            return commentEl;
        },


        // Styling
        // =======

        createCssDeclarations: function() {

            // Navigation underline
            this.createCss('.comments ul.navigation li.active:after {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Background highlight
            this.createCss('.comments .highlight-background {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Font highlight
            this.createCss('.comments .highlight-font {color: '
                + this.options.highlightColor + ' !important;'
                + 'font-weight: bold;'
                +'}');
        },

        createCss: function(css) {
            var styleEl = $('<style/>', {
                type: 'text/css',
                text: css,
            });
            $('head').append(styleEl);
        },


        // Utilities
        // =========

        getComments: function() {
            var self = this;
            return Object.keys(this.commentsById).map(function(id){return self.commentsById[id]});
        },

        setToggleAllButtonText: function(toggleAllButton, toggle) {
            var self = this;
            var textContainer = toggleAllButton.find('span.text');
            var caret = toggleAllButton.find('.caret');

            var showExpandingText = function() {
                var text = self.options.viewAllRepliesText;
                var replyCount = toggleAllButton.siblings('.comment').length;
                text = text.replace('__replyCount__', replyCount);
                textContainer.text(text);
            }

            if(toggle) {

                // Toggle text
                if(textContainer.text() == this.options.hideRepliesText) {
                    showExpandingText();
                } else {
                    textContainer.text(this.options.hideRepliesText);
                }
                // Toggle direction of the caret
                caret.toggleClass('up');

            } else {

                // Update text if necessary
                if(textContainer.text() != this.options.hideRepliesText) {
                    showExpandingText();
                }
            }

        },

        adjustTextareaHeight: function(textarea, focus) {
            var textareaBaseHeight = 2.2;
            var lineHeight = 1.4;

            var setRows = function(rows) {
                var height = textareaBaseHeight + (rows - 1) * lineHeight;
                textarea.css('height', height + 'em');
            }

            var textarea = $(textarea);
            var rowCount = focus == true ? this.options.textareaRowsOnFocus : this.options.textareaRows;
            do {
                setRows(rowCount);
                rowCount++;
                var isAreaScrollable = textarea[0].scrollHeight > textarea.outerHeight();
            } while(isAreaScrollable && rowCount <= this.options.textareaMaxRows);
        },

        clearTextarea: function(textarea) {
            textarea.empty().trigger('input');
        },

        getTextareaContent: function(textarea) {
            var content = '';
            var raw = textarea.html();
            var indexOfFirstElement = raw.indexOf('<');

            if(indexOfFirstElement == -1) {
                content = raw;
            } else {
                content = raw.substring(0, indexOfFirstElement);
                var childs = $(raw.substring(indexOfFirstElement));
                childs.each(function(index, child) {
                    if(content.length) content += '\n';
                    content += $(child).text();
                });
            }

            return content;
        },

    }

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            comments.init(options, this);
            $.data(this, 'comments', comments);
        });
    };

})(jQuery);
