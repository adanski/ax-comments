import {describe, beforeEach, afterEach, it, mock, before} from 'node:test';
import {expect} from './util/expectation.js';
import {CommentsElement} from '../src/comments-element.js';
import {CommentModel, PingableUser} from '../src/options/models.js';
import {SortKey} from '../src/options/misc.js';
import {commentsArray, usersArray} from './data/comments-data.js';
import {CommentViewModelProvider} from '../src/common/provider.js';
import {CommentViewModel} from '../src/view-model/comment-view-model.js';
import {CommentElement} from '../src/thread/comment/comment-element.js';
import {isNil} from '../src/common/util.js';
import {ButtonElement} from '../src/thread/basic/button-element.js';
import {CommentingFieldElement} from '../src/thread/commenting-field/commenting-field-element.js';
import {TextareaElement} from '../src/thread/commenting-field/textarea-element.js';
import {findParentsBySelector, getElementStyle} from '../src/common/html-util.js';
import {CommentModelEnriched} from '../src/view-model/comment-model-enriched.js';
import {bootstrap} from './env/bootstrap.js';
import {CommentContentElement} from '../src/thread/comment/comment-content-element.js';

describe('CommentsElement', () => {

    const multilineText: string = 'This\nis\na\nmultiline\ntext\nexample';

    let commentsElement: CommentsElement;
    let commentContainer: HTMLElement;
    let commentViewModel: CommentViewModel;

    let createCommentsElement: typeof CommentsElement['create'];

    before(async () => {
        bootstrap();
        mock.timers.enable();

        // classes need to be imported and evaluated after the context bootstrapping
        const {CommentsElement} = await import('../src/comments-element.js');
        createCommentsElement = CommentsElement.create;
    });

    beforeEach(() => {
        commentsElement = createCommentsElement({
            options: {
                profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
                currentUserId: 'current-user',
                currentUserIsAdmin: false,
                roundProfilePictures: true,
                enableAttachments: true,
                enableHashtags: true,
                enablePinging: true,
                enableDeletingCommentWithReplies: true,
                textareaRows: 1,
                textareaRowsOnFocus: 4,
                searchUsers: (term, success, error) => {
                    setTimeout(() => {
                        success(usersArray.filter((user: PingableUser) => {
                            const containsSearchTerm = user.displayName!.toLowerCase().indexOf(term.toLowerCase()) !== -1;
                            const isNotSelf = user.id !== 'current-user';
                            return containsSearchTerm && isNotSelf;
                        }));
                    }, 188);
                },
                getComments: (success, error) => {
                    success(commentsArray as CommentModel[]);
                },
                postComment: (comment, success, error) => {
                    setTimeout(() => {
                        success(comment);
                    }, 12);
                },
                putComment: (comment, success, error) => {
                    setTimeout(() => {
                        success(comment);
                    }, 11);
                },
                deleteComment: (comment, success, error) => {
                    setTimeout(() => {
                        success({
                            ...comment,
                            content: 'Deleted'
                        });
                    }, 10);
                },
                upvoteComment: (comment, success, error) => {
                    setTimeout(() => {
                        success(comment);
                    }, 8);
                },
                timeFormatter: (timestamp) =>
                    timestamp.toLocaleDateString(undefined, {dateStyle: 'short'})
                    + ' '
                    + timestamp.toLocaleTimeString(undefined, {timeStyle: 'short'})
            }
        });

        document.body.append(commentsElement);
        commentContainer = commentsElement.shadowRoot!.querySelector<HTMLElement>('#comments-container')!;
        commentViewModel = CommentViewModelProvider.get(commentContainer);
    });

    it('Should render the comments', () => {
        const commentElements: NodeListOf<CommentElement> = queryCommentsAll('#comment-list li.comment');
        expect(commentElements.length).toEqual(10);
        commentElements.forEach((commentEl) => {
            checkCommentElementData(commentEl);
        });
        checkOrder(queryCommentsAll('ul#comment-list > li.comment'), ['3', '2', '1']);

        // Check reply to -fields
        expect(queryComments('#comment-list li.comment[data-id="8"] .comment-header .reply-to')!.textContent)
            .toBe('Jack Hemsworth');
        expect(queryComments('#comment-list li.comment[data-id="9"] .comment-header .reply-to')!.textContent)
            .toBe('You');
        expect(queryComments('#comment-list li.comment[data-id="5"] .comment-header .reply-to')!.textContent)
            .toBe('Todd Brown');
        expect(queryComments('#comment-list li.comment[data-id="10"] .comment-header .reply-to')!.textContent)
            .toBe('Bryan Connery');

        // Check that other comments do not have the field
        queryCommentsAll<CommentElement>('#comment-list li.comment').forEach((el) => {
            if (['8', '9', '5', '10'].indexOf(el.getAttribute('data-id')!) === -1) {
                expect(el.querySelector('.name .reply-to')).toBe(null);
            }
        });

        // Check edited timestamps
        const editedDate = new Date(queryComments('#comment-list li.comment[data-id="4"] > ax-comment-content time.edited')!.getAttribute('datetime')!);
        compareDates(editedDate, new Date('2016-03-04 11:29'));

        // Check that other comments do not have the field
        queryCommentsAll<CommentElement>('#comment-list li.comment:not([data-id="4"]) > ax-comment-content')
            .forEach((el) => {
                expect(el.querySelector('time.edited')).toBe(null);
            });
    });

    it('Should append the child comments under their outermost parent', () => {
        expect(queryCommentsAll<CommentElement>('#comment-list > li.comment').length).toBe(3);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] .child-comments > li.comment'), ['6', '7', '8', '9', '10']);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="2"] .child-comments > li.comment'), []);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="3"] .child-comments > li.comment'), ['4', '5']);
    });

    it('Should sort the main level comments without affecting the order of child comments', () => {
        queryComments(`li[data-sort-key="${SortKey.POPULARITY}"]`)!.click();
        checkOrder(queryCommentsAll<CommentElement>('#comment-list > li.comment'), ['1', '3', '2']);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] .child-comments > li.comment'), ['6', '7', '8', '9', '10']);

        queryComments(`li[data-sort-key="${SortKey.NEWEST}"]`)!.click();
        checkOrder(queryCommentsAll<CommentElement>('#comment-list > li.comment'), ['3', '2', '1']);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] .child-comments > li.comment'), ['6', '7', '8', '9', '10']);

        queryComments(`li[data-sort-key="${SortKey.OLDEST}"]`)!.click();
        checkOrder(queryCommentsAll<CommentElement>('#comment-list > li.comment'), ['1', '2', '3']);
        checkOrder(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] .child-comments > li.comment'), ['6', '7', '8', '9', '10']);
    });

    it('Should be possible to toggle all replies', () => {
        const toggleAll = queryComments('#comment-list li.comment[data-id="1"]')!.querySelector<HTMLElement>('.child-comments button.toggle-all .text')!;
        expect(isNil(toggleAll)).toBe(false);
        expect(toggleAll.textContent).toBe('View all 5 replies');
        expect(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] li.comment.visible').length)
            .toBe(2);

        // Show all replies
        toggleAll.click();
        expect(toggleAll.textContent).toBe('Hide replies');
        expect(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] li.comment.visible').length)
            .toBe(5);

        // Hide replies
        toggleAll.click();
        expect(toggleAll.textContent).toBe('View all 5 replies');
        expect(queryCommentsAll<CommentElement>('#comment-list li.comment[data-id="1"] li.comment.visible').length)
            .toBe(2);
    });

    describe('Commenting', () => {

        let mainCommentingField: CommentingFieldElement;
        let mainTextarea: TextareaElement;

        beforeEach(() => {
            mainCommentingField = queryComments('.commenting-field.main')!;
            mainTextarea = mainCommentingField.querySelector('.textarea')!;
        });

        it('Should adjust the height of commenting field dynamically', () => {

            // Should have 1 row
            expect(mainTextarea.rows).toBe(1);

            // Should have 4 rows
            mainTextarea.click();
            expect(mainTextarea.rows).toBe(4);

            // Should have 4 rows as it's the max value
            mainTextarea.value = multilineText;
            mainTextarea.dispatchEvent(new InputEvent('input'));
            expect(mainTextarea.rows).toBe(4);

            // Should have 1 row
            mainCommentingField.querySelector<HTMLElement>('.close')!.click();
            expect(mainTextarea.rows).toBe(1);
        });

        it('Should enable control row on click', () => {
            const controlRow: HTMLElement = mainCommentingField.querySelector('.control-row')!;

            // Show on click
            expect(isElementHidden(controlRow)).toBe(true);
            mainTextarea.click();
            expect(isElementShowed(controlRow)).toBe(true);

            // Hide when clicking close icon
            mainCommentingField.querySelector<HTMLElement>('.close')!.click();
            expect(isElementHidden(controlRow)).toBe(true);
        });

        it('Should enable send button when textarea is not empty', () => {
            const sendButton: HTMLElement = mainCommentingField.querySelector('.send')!;

            expect(sendButton.classList.contains('enabled')).toBe(false);

            // Show on click
            mainTextarea.click();
            expect(sendButton.classList.contains('enabled')).toBe(false);

            // Enable when content
            mainTextarea.value = multilineText;
            mainTextarea.dispatchEvent(new InputEvent('input'));
            expect(sendButton.classList.contains('enabled')).toBe(true);

            // Disable when no content
            mainTextarea.value = '';
            mainTextarea.dispatchEvent(new InputEvent('input'));
            expect(sendButton.classList.contains('enabled')).toBe(false);

            // Hide when clicking close icon
            mainCommentingField.querySelector<HTMLElement>('.close')!.click();
            expect(sendButton.classList.contains('enabled')).toBe(false);
        });

        it('Should be possible to add a new main level comment', () => {
            mainTextarea.value = multilineText;
            mainTextarea.dispatchEvent(new InputEvent('input'));

            mainCommentingField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            // New comment should always be placed first initially
            const commentEl = queryComments<CommentElement>('#comment-list li.comment')!;
            const idOfNewComment = commentEl.commentModel.id;

            expect(commentEl.querySelector('.content')!.textContent).toBe(multilineText);
            expect(commentEl.classList.contains('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            // Check that sorting works also with the new comment
            queryComments(`li[data-sort-key="${SortKey.POPULARITY}"]`)!.click();
            checkOrder(queryCommentsAll('#comment-list > li.comment'), ['1', '3', '2', idOfNewComment]);
            queryComments(`li[data-sort-key="${SortKey.OLDEST}"]`)!.click();
            checkOrder(queryCommentsAll('#comment-list > li.comment'), ['1', '2', '3', idOfNewComment]);
            queryComments(`li[data-sort-key="${SortKey.NEWEST}"]`)!.click();
            checkOrder(queryCommentsAll('#comment-list > li.comment'), [idOfNewComment, '3', '2', '1']);
        });

        it('Should be possible to add a new main level comment with attachments', () => {
            mainTextarea.value = multilineText;
            mainTextarea.dispatchEvent(new InputEvent('input'));

            // Add attachments
            const files = [new File([], 'test.txt'), new File([], 'test2.png')];
            mainCommentingField.preSaveAttachments(files);

            // Verify pre saved attachments
            const attachmentTags = mainCommentingField.querySelector('.attachments')!
                .querySelectorAll<HTMLAnchorElement>('.attachment');
            expect(attachmentTags.length).toBe(2);
            expect(getAttachmentName(attachmentTags[0])).toBe('test.txt');
            expect(getAttachmentName(attachmentTags[1])).toBe('test2.png');

            mainCommentingField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            const commentEl: CommentElement = queryComments('#comment-list li.comment')!;
            checkCommentElementData(commentEl);
        });
    });

    describe('Replying', () => {

        let mostPopularComment: CommentElement;

        beforeEach(() => {
            mostPopularComment = queryComments('#comment-list li.comment[data-id="1"]')!;
        });

        it('Should not show the reply field by default', () => {
            const replyField = mostPopularComment.querySelector('.commenting-field');
            expect(replyField).toBe(null);
        });

        it('Should be possible to reply', () => {
            mostPopularComment.querySelector<HTMLElement>('.reply')!.click();
            const replyField: CommentingFieldElement = mostPopularComment.querySelector('.commenting-field')!;
            expect(isNil(replyField)).toBe(false);
            expect(replyField.querySelector('.reply-to.tag')).toBe(null);

            // Check that the field is last child
            const lastChild: HTMLElement = mostPopularComment.querySelector('.child-comments ~ .commenting-field')!;
            expect(lastChild).toBe(replyField);

            const replyText = 'This is a reply\nwith a new line';
            const replyFieldTextarea: TextareaElement = replyField.querySelector('.textarea')!;
            replyFieldTextarea.value = replyText;
            replyFieldTextarea.dispatchEvent(new InputEvent('input'));

            replyField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            // New reply should always be placed last
            const commentEl: CommentElement = mostPopularComment.querySelector('li.comment:last-of-type')!;
            const idOfNewComment = commentEl.commentModel.id;

            expect(commentEl.querySelector('.content')!.textContent).toBe(replyText);
            expect(commentEl.classList.contains('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            // Check position
            checkOrder(mostPopularComment.querySelectorAll('li.comment')!, ['6', '7', '8', '9', '10', idOfNewComment]);

            const toggleAllText = mostPopularComment.querySelector('button.toggle-all .text')!.textContent;
            expect(toggleAllText).toBe('View all 6 replies');
            expect(mostPopularComment.querySelectorAll('li.comment.visible').length).toBe(3);
        });

        it('Should be possible to reply with attachments', () => {
            mostPopularComment.querySelector<HTMLElement>('.reply')!.click();
            const replyField: CommentingFieldElement = mostPopularComment.querySelector('.commenting-field')!;

            const replyText = 'This is a reply with attachments';
            const replyFieldTextarea: TextareaElement = replyField.querySelector('.textarea')!;
            replyFieldTextarea.value = replyText;
            replyFieldTextarea.dispatchEvent(new InputEvent('input'));

            // Add attachments
            const files = [new File([], 'test.txt'), new File([], 'test2.png')];
            replyField.preSaveAttachments(files);

            // Verify pre saved attachments
            const attachmentTags = replyField.querySelector('.attachments')!
                .querySelectorAll<HTMLAnchorElement>('.attachment');
            expect(attachmentTags.length).toBe(2);
            expect(getAttachmentName(attachmentTags[0])).toBe('test.txt');
            expect(getAttachmentName(attachmentTags[1])).toBe('test2.png');

            replyField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            const commentEl: CommentElement = mostPopularComment.querySelector('li.comment:last-of-type')!;
            checkCommentElementData(commentEl);
        });

        it('Should close the reply field when clicking the close icon', () => {
            mostPopularComment.querySelector<HTMLElement>('.reply')!.click();
            let replyField: CommentingFieldElement = mostPopularComment.querySelector('.commenting-field')!;
            expect(isNil(replyField)).toBe(false);
            replyField.querySelector<HTMLElement>('.close')!.click();

            replyField = mostPopularComment.querySelector('.commenting-field')!;
            expect(isNil(replyField)).toBe(true);
        });

        it('Should be possible to re-reply', () => {
            const childComment: CommentElement = mostPopularComment.querySelector('.child-comments li.comment[data-id="9"]')!;
            childComment.querySelector<HTMLElement>('.reply')!.click();
            const replyField: CommentingFieldElement = mostPopularComment.querySelector('.commenting-field')!;
            const replyFieldTextarea: TextareaElement = replyField.querySelector<TextareaElement>('.textarea')!;
            expect(replyFieldTextarea.getPings()['bryan_connery']).toBe('Bryan Connery');
            expect(replyFieldTextarea.getTextareaContent()).toBe('@bryan_connery');

            // Check that the field is last child
            const lastChild: HTMLElement = mostPopularComment.querySelector('.child-comments ~ .commenting-field')!;
            expect(lastChild).toBe(replyField);

            const replyText = 'This is a re-reply\nwith a new line';
            replyFieldTextarea.value = replyText;
            replyFieldTextarea.dispatchEvent(new InputEvent('input'));

            replyField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            // New reply should always be placed last
            const commentEl: CommentElement = mostPopularComment.querySelector('li.comment:last-of-type')!;
            const idOfNewComment = commentEl.commentModel.id;

            expect(commentEl.querySelector('.comment-header .reply-to')!.textContent!.indexOf('Bryan Connery')).notToBe(-1);
            expect(commentEl.querySelector('.content')!.textContent).toBe(replyText);
            expect(commentEl.classList.contains('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            const toggleAllText = mostPopularComment.querySelector('button.toggle-all .text')!.textContent;
            expect(toggleAllText).toBe('View all 6 replies');
            expect(mostPopularComment.querySelectorAll('li.comment.visible').length).toBe(3);
        });

        it('Should be possible to re-reply to a hidden reply', () => {
            mostPopularComment.querySelector<HTMLElement>('.toggle-all')!.click();
            const childComment = mostPopularComment.querySelector('.child-comments li.comment')!;
            childComment.querySelector<HTMLElement>('.reply')!.click();

            const replyField: CommentingFieldElement = mostPopularComment.querySelector('.commenting-field')!;
            const replyFieldTextarea: TextareaElement = replyField.querySelector('.textarea')!;
            expect(replyFieldTextarea.getPings()['jack_hemsworth']).toBe('Jack Hemsworth');
            expect(replyFieldTextarea.getTextareaContent()).toBe('@jack_hemsworth');

            const replyText = 'This is a re-reply\nwith a new line';
            replyFieldTextarea.value = replyText;
            replyFieldTextarea.dispatchEvent(new InputEvent('input'));

            replyField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            // New reply should always be placed last
            const commentEl: CommentElement = mostPopularComment.querySelector('li.comment:last-of-type')!;
            const idOfNewComment = commentEl.commentModel.id;

            expect(commentEl.querySelector('.comment-header .reply-to')!.textContent!.indexOf('Jack Hemsworth')).notToBe(-1);
            expect(commentEl.querySelector('.content')!.textContent).toBe(replyText);
            expect(commentEl.classList.contains('by-current-user')).toBe(true);
            checkCommentElementData(commentEl);

            const toggleAllText = mostPopularComment.querySelector('button.toggle-all .text')!.textContent;
            expect(toggleAllText).toBe('Hide replies');
            expect(mostPopularComment.querySelectorAll('li.comment.visible').length).toBe(6);
        });
    });

    describe('Editing', () => {
        let ownComment: CommentElement;
        let editButton: ButtonElement;

        beforeEach(() => {
            ownComment = queryComments('#comment-list li.comment[data-id="3"]')!;
            editButton = ownComment.querySelector('.edit')!;
        });

        it('Should show the edit button only for own comments', () => {
            expect(isNil(editButton)).toBe(false);
            expect(queryCommentsAll('[data-container="comments"] .edit').length).toBe(3);
        });

        it('Should be possible to open and close the edit field', () => {
            const cloneOfOwnComment = ownComment.outerHTML;

            editButton.click();
            expect(ownComment.classList.contains('edit')).toBe(true);

            // Check that the edit field exists
            const editField: CommentingFieldElement = ownComment.querySelector('.commenting-field')!;
            const textarea: TextareaElement = editField.querySelector('.textarea')!;
            expect(isNil(editField)).toBe(false);

            // Check that other content is hidden
            let renderedComment: NodeListOf<HTMLElement> = ownComment.querySelectorAll<HTMLElement>(':scope > ax-comment-content > .comment-wrapper > *:not(.commenting-field)');
            expect(renderedComment.length).toBeGreaterThan(0);
            renderedComment.forEach((el) => {
                expect(isElementHidden(el, true)).toBe(true);
            });

            // Check the content
            const contentFromModel = ownComment.commentModel.content;
            const contentFromUI = textarea.getTextareaContent();
            expect(contentFromModel).toBe(contentFromUI);

            // Closing the field
            editField.querySelector<HTMLElement>('.close')!.click();
            expect(ownComment.classList.contains('edit')).toBe(false);
            expect(isNil(ownComment.querySelector('.commenting-field'))).toBe(true);

            // Check that other content is visible
            renderedComment = ownComment.querySelectorAll<HTMLElement>(':scope > ax-comment-content > .comment-wrapper > *:not(.commenting-field)');
            expect(renderedComment.length).toBeGreaterThan(0);
            renderedComment.forEach(el => {
                expect(isElementShowed(el, true)).toBe(true);
            });

            // Check that the comment has not changed
            expect(ownComment.outerHTML).toBe(cloneOfOwnComment);
        });

        it('Should be possible to edit a main level comment', () => {
            testEditingComment(ownComment.commentModel.id);
        });

        it('Should be possible to edit a reply', () => {
            [...ownComment.querySelectorAll<HTMLElement>('.reply')].at(-1)!.click();
            const replyText = 'This is a re-reply';

            const replyField: CommentingFieldElement = ownComment.querySelector('.commenting-field')!;
            const replyFieldTextarea: TextareaElement = replyField.querySelector('.textarea')!;
            replyFieldTextarea.value = replyText;
            replyFieldTextarea.dispatchEvent(new InputEvent('input'));

            // Create reply
            replyField.querySelector<HTMLElement>('.send')!.click();
            mock.timers.runAll();

            // Test editing the reply
            let reply: CommentElement = [...ownComment.querySelector('.child-comments')!.children].at(-1) as CommentElement;
            let replyId = reply.commentModel.id;
            testEditingComment(replyId);
        });

        it(`Should not let the user save the comment if it hasn't changed`, () => {
            editButton.click();
            const editField: CommentingFieldElement = ownComment.querySelector('.commenting-field')!;
            const saveButton: ButtonElement = editField.querySelector('.save')!;
            expect(saveButton.classList.contains('enabled')).toBe(false);

            const textarea: TextareaElement = editField.querySelector('.textarea')!;
            const originalText = textarea.value;

            // Append text
            textarea.value += '   test';
            textarea.dispatchEvent(new InputEvent('input'));
            expect(saveButton.classList.contains('enabled')).toBe(true);

            // Revert changes
            textarea.value = originalText;
            textarea.dispatchEvent(new InputEvent('input'));
            expect(saveButton.classList.contains('enabled')).toBe(false);

            // Append spaces
            textarea.value += '   ';
            textarea.dispatchEvent(new InputEvent('input'));
            expect(saveButton.classList.contains('enabled')).toBe(false);
        });
    });

    describe('Deleting', () => {

        it('Should show the delete button for own comments', () => {
            const ownComment: CommentElement = queryComments('#comment-list li.comment[data-id="3"]')!;

            const deleteButton: ButtonElement = ownComment.querySelector('.delete')!;
            expect(isNil(deleteButton)).toBe(false);
            expect(deleteButton.classList.contains('enabled')).toBe(true);
        });

        it('Should be possible to delete a main level comment', () => {
            const commentId = '3';
            const ownComment: CommentElement = queryComments(`#comment-list li.comment[data-id="${commentId}"]`)!;

            const childComments = commentViewModel.getChildComments(commentId).slice();
            expect(childComments.length).toBe(2);

            const deleteButton: ButtonElement = ownComment.querySelector('.delete')!;
            deleteButton.click();
            mock.timers.runAll();

            // Except the main comment to be deleted
            expect(commentViewModel.getComment(commentId)!.content).toBe('Deleted');
        });

        it('Should be possible to delete a reply', () => {
            const commentId = '10';
            const ownComment: CommentElement = queryComments(`#comment-list li.comment[data-id="${commentId}"]`)!;
            const outermostParent: CommentElement = findParentsBySelector<CommentElement>(ownComment, 'li.comment').last()!;
            const toggleAllButton = outermostParent.querySelector('.toggle-all .text')!;

            // Check the child count
            expect(toggleAllButton.textContent).toBe('View all 5 replies');
            expect(commentViewModel.getChildComments(outermostParent.commentModel.id).length).toBe(5);

            const deleteButton: ButtonElement = ownComment.querySelector('.delete')!;
            deleteButton.click();
            mock.timers.runAll();

            expect(commentViewModel.getComment(commentId)!.content).toBe('Deleted');
        });

        it('Should be possible to delete a reply that has re-replies', () => {
            const commentId = '8';
            const ownComment: CommentElement = queryComments(`#comment-list li.comment[data-id="${commentId}"]`)!;
            const outermostParent: CommentElement = findParentsBySelector<CommentElement>(ownComment, 'li.comment').last()!;
            const toggleAllButton = outermostParent.querySelector('.toggle-all .text')!;

            // Check the child count
            expect(toggleAllButton.textContent).toBe('View all 5 replies');
            expect(commentViewModel.getChildComments(outermostParent.commentModel.id).length).toBe(5);

            const deleteButton: HTMLElement = ownComment.querySelector('.delete')!;
            deleteButton.click();
            mock.timers.runAll();

            // Except the main reply to be deleted
            expect(commentViewModel.getComment(commentId)!.content).toBe('Deleted');

            // Check the child count
            expect(toggleAllButton.textContent).toBe('View all 5 replies');
            expect(commentViewModel.getChildComments(outermostParent.commentModel.id).length).toBe(5);
        });

        it('Should be possible to delete attachments', () => {
            const ownCommentModel = commentViewModel.getComment('10')!;
            const ownComment: CommentElement = queryComments('#comment-list li.comment[data-id="10"]')!;

            const attachmentCountBefore = 1;
            expect(ownCommentModel.attachments!.length).toBe(attachmentCountBefore);
            expect(ownComment.querySelector('.attachments')!.querySelectorAll('.attachment').length).toBe(1);

            // Open edit mode
            const editButton: HTMLElement = ownComment.querySelector('.edit')!;
            editButton.click();

            // Delete attachment
            const attachmentTag = ownComment.querySelector('.commenting-field')!.querySelector('.attachment')!;
            attachmentTag.querySelector<HTMLElement>('.delete')!.click();

            // Save comment
            const saveButton: HTMLElement = ownComment.querySelector('.save')!;
            expect(saveButton.classList.contains('enabled')).toBe(true);
            saveButton.click();
            mock.timers.runAll();

            expect(ownCommentModel.attachments!.length).toBe(0);
            expect(ownComment.querySelector('.attachments')!.querySelectorAll('.attachment').length).toBe(0);
        });
    });

    describe('Upvoting', () => {

        it('Should be possible to upvote a comment', () => {
            const commentId = '4';
            const commentEl: CommentElement = queryComments(`#comment-list li.comment[data-id="${commentId}"]`)!;
            const commentModel = commentViewModel.getComment(commentId)!;

            // Check the status before upvoting
            let upvoteEl: HTMLElement = commentEl.querySelector('.upvote')!;
            expect(commentModel.upvotedByCurrentUser).toBe(false);
            expect(upvoteEl.classList.contains('highlight-font')).toBe(false);

            expect(commentModel.upvoteCount).toBe(2);
            expect(upvoteEl.querySelector('.upvote-count')!.textContent).toBe('2');

            upvoteEl.click();
            mock.timers.runAll();

            // Check status after upvoting
            upvoteEl = commentEl.querySelector('.upvote')!;
            expect(commentModel.upvotedByCurrentUser).toBe(true);
            expect(upvoteEl.classList.contains('highlight-font')).toBe(true);

            expect(commentModel.upvoteCount).toBe(3);
            expect(upvoteEl.querySelector('.upvote-count')!.textContent).toBe('3');
        });

        it('Should be possible to revoke an upvote', () => {
            const commentId = '1';
            const commentEl: CommentElement = queryComments(`#comment-list li.comment[data-id="${commentId}"]`)!;
            const commentModel = commentViewModel.getComment(commentId)!;

            // Check the status before upvoting
            let upvoteEl: HTMLElement = commentEl.querySelector('.upvote')!;
            expect(commentModel?.upvotedByCurrentUser).toBe(true);
            expect(upvoteEl.classList.contains('highlight-font')).toBe(true);

            expect(commentModel.upvoteCount).toBe(3);
            expect(upvoteEl.querySelector('.upvote-count')!.textContent).toBe('3');

            upvoteEl.click();
            mock.timers.runAll();

            // Check status after upvoting
            upvoteEl = commentEl.querySelector('.upvote')!;
            expect(commentModel.upvotedByCurrentUser).toBe(false);
            expect(upvoteEl.classList.contains('highlight-font')).toBe(false);

            expect(commentModel.upvoteCount).toBe(2);
            expect(upvoteEl.querySelector('.upvote-count')!.textContent).toBe('2');
        });
    });

    afterEach(() => {
        commentsElement.remove();
    });

    function queryComments<T extends HTMLElement = HTMLElement>(selectors: string): T | null {
        return commentContainer.querySelector<T>(selectors);
    }

    function queryCommentsAll<T extends HTMLElement = HTMLElement>(selectors: string): NodeListOf<T> {
        return commentContainer.querySelectorAll<T>(selectors);
    }

    /**
     * @param dummy turns it into a dummy method, see https://github.com/jsdom/jsdom/issues/2986
     */
    function isElementHidden(element: HTMLElement, dummy: boolean = false): boolean {
        return getElementStyle(element, 'display') === 'none' || getElementStyle(element, 'visibility') === 'hidden' || dummy;
    }

    /**
     * @param dummy turns it into a dummy method, see https://github.com/jsdom/jsdom/issues/2986
     */
    function isElementShowed(element: HTMLElement, dummy: boolean = false): boolean {
        return !isElementHidden(element) || dummy;
    }

    function checkCommentElementData(commentEl: CommentElement): void {
        const header = commentEl.querySelector('.comment-header')!;

        // Fields to be tested
        const profilePictureURL = commentEl.querySelector<HTMLElement>('.profile-picture')!.style.backgroundImage.slice(4, -1);
        const displayName = header.querySelector('.name')!.textContent;

        // Model that we are testing against
        const commentModel = commentEl.commentModel;

        // Check basic fields
        expect(profilePictureURL).toBe(commentModel.creatorProfilePictureURL!!);
        expect(displayName).toBe(commentModel.creatorDisplayName!!);

        // Check content
        const content = getEscapedTextContentFromCommentElement(commentEl);
        expect(content).toBe(commentModel.content);

        // Check time
        const dateUI = new Date(commentEl.querySelector('time')!.getAttribute('datetime')!);
        const modelCreatedDate = commentModel.createdAt;
        compareDates(dateUI, modelCreatedDate);

        // Check attachments
        const attachmentTags = commentEl.querySelector('.attachments')!.querySelectorAll('.attachment');
        expect(commentModel.attachments!.length).toBe(attachmentTags.length);
        commentModel.attachments!.forEach((attachment, index) => {
            const file = (attachment as any).file;

            // Find out attachment name
            let attachmentName = '';
            if (file instanceof File) {
                attachmentName = file.name;
            } else {
                const urlParts = file.split('/');
                attachmentName = urlParts[urlParts.length - 1];
            }

            const tagText = commentEl.querySelectorAll('.attachment')[index].textContent!;
            expect(attachmentName).toBe(tagText);
        });
    }

    function getEscapedTextContentFromCommentElement(commentEl: CommentElement): string {
        const content = commentEl.querySelector('.content')!.cloneNode(true) as HTMLElement;

        // Remove edited timestamp
        content.querySelectorAll('time')
            .forEach(t => t.remove());

        // Replace inputs with respective values
        content.querySelectorAll<HTMLInputElement>('.tag')
            .forEach(t => t.replaceWith(parseTagValue(t)));
        return content.textContent!;
    }

    function parseTagValue(tag: HTMLInputElement): string {
        return tag.getAttribute('data-type')! + tag.getAttribute('data-value')!;
    }

    function compareDates(dateA: Date, dateB: Date): void {
        expect(dateA.getFullYear()).toBe(dateB.getFullYear());
        expect(dateA.getMonth()).toBe(dateB.getMonth());
        expect(dateA.getDate()).toBe(dateB.getDate());
        expect(dateA.getHours()).toBe(dateB.getHours());
        expect(dateA.getMinutes()).toBe(dateB.getMinutes());
        expect(dateA.getSeconds()).toBe(dateB.getSeconds());
    }

    function checkOrder(elements: NodeListOf<HTMLElement>, expectedOrder: string[]): void {
        const order: string[] = getOrder(elements);
        expect(order).toEqual(expectedOrder);
    }

    function getOrder(elements: NodeListOf<HTMLElement>): string[] {
        return [...elements].map((commentEl) => commentEl.getAttribute('data-id')!);
    }

    function getAttachmentName(attachmentTag: HTMLAnchorElement): string | undefined {
        return attachmentTag.textContent?.trim()
    }

    function testEditingComment(id: string): void {
        let ownComment: CommentElement = queryComments(`#comment-list li.comment[data-id="${id}"]`)!;
        const editButton: HTMLElement = ownComment.querySelector('.edit')!;

        const ownCommentContentBefore: CommentContentElement = ownComment.querySelector('ax-comment-content')!
            .cloneNode(true) as CommentContentElement;
        const ownCommentModelBefore = Object.assign({}, commentViewModel.getComment(id));

        editButton.click();
        const editField: CommentingFieldElement = ownComment.querySelector('.commenting-field')!;
        const textarea: TextareaElement = editField.querySelector('.textarea')!;

        // Edit the comment
        const modifiedContent = '<br>appended content with new line';
        textarea.value += modifiedContent;
        textarea.dispatchEvent(new InputEvent('input'));

        // Add attachments
        const files = [new File([], 'test.txt'), new File([], 'test2.png')];
        editField.preSaveAttachments(files);

        // Verify pre saved attachments
        const attachmentTags = editField.querySelector('.attachments')!
            .querySelectorAll<HTMLAnchorElement>('.attachment');
        expect(attachmentTags.length).toBe(2);
        expect(getAttachmentName(attachmentTags[0])).toBe('test.txt');
        expect(getAttachmentName(attachmentTags[1])).toBe('test2.png');

        // Save the comment
        editField.querySelector<HTMLElement>('.save')!.click();
        mock.timers.runAll();

        expect(isNil(ownComment.querySelector('.commenting-field'))).toBe(true);

        // Check the edited comment
        ownComment = queryComments(`#comment-list li.comment[data-id="${id}"]`)!;
        checkCommentElementData(ownComment);
        expect(ownComment.querySelector('.content .edited')!.textContent!.length).notToBe(0);

        // Check that only fields content and modified have changed in comment model
        const ownCommentModel = commentViewModel.getComment(id)!;
        Object.keys(ownCommentModel).forEach((key) => {
            let currentComparisonValue: any;
            let oldComparisonValue: any;

            // Comparison value type
            const arrayComparison = key === 'pings' || key === 'attachments';
            const functionComparison = key === 'hasAttachments';

            // Get comparison values based on comparison type
            if (arrayComparison) {
                currentComparisonValue = JSON.stringify(ownCommentModel[key]);
                oldComparisonValue = JSON.stringify(ownCommentModelBefore[key]);
            } else if (functionComparison) {
                currentComparisonValue = ownCommentModel[key]()
                oldComparisonValue = ownCommentModelBefore[key]();
            } else {
                currentComparisonValue = ownCommentModel[key as keyof CommentModelEnriched];
                oldComparisonValue = ownCommentModelBefore[key as keyof CommentModelEnriched];
            }

            if (key === 'content' || key === 'modifiedAt' || key === 'attachments' || key === 'hasAttachments') {
                expect(currentComparisonValue).notToBe(oldComparisonValue);
            } else {
                expect(currentComparisonValue).toBe(oldComparisonValue);
            }
        });

        // Check that only content has changed in comment element
        const ownCommentContent: CommentContentElement = ownComment.querySelector('ax-comment-content')!
            .cloneNode(true) as CommentContentElement;

        ownCommentContent.querySelector('.content')!.remove();
        ownCommentContentBefore.querySelector('.content')!.remove();

        ownCommentContent.querySelector('.attachments')!.remove();
        ownCommentContentBefore.querySelector('.attachments')!.remove();

        expect(ownCommentContent.outerHTML).toBe(ownCommentContentBefore.outerHTML);
    }

});
