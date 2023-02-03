import {usersArray, commentsArray} from './comments-data.js';
import {STYLE_SHEET} from 'comments-element';
import 'comments-element';
import style from 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css' assert { type: 'css' };

if (document.adoptedStyleSheets) document.adoptedStyleSheets = [style];

const commentsElement = document.createElement('ax-comments');

const fontAwesomeStyleSheet = style;

commentsElement.options = {
    profilePictureURL: 'https://i.pravatar.cc/100?img=65',
    currentUserId: 'current-user',
    roundProfilePictures: true,
    textareaRows: 1,
    enableAttachments: true,
    enableHashtags: true,
    enablePinging: true,
    styles: [STYLE_SHEET, fontAwesomeStyleSheet],
    searchUsers: (term, success, error) => {
        setTimeout(() => {
            success(usersArray.filter(user => {
                const containsSearchTerm = user.displayName?.toLowerCase().includes(term.toLowerCase())
                    || user.id.toLowerCase().includes(term.toLowerCase());
                const isNotSelf = user.id !== 1;
                return containsSearchTerm && isNotSelf;
            }));
        }, 500);
    },
    searchTags: (term, success, error) => {
        setTimeout(() => {
            const tags = [{tag: term}];
            if ('velit'.startsWith(term) || term.startsWith('velit'))
                tags.unshift({tag: 'velit', description: 'Used 1 time in the current topic.'});
            if ('loremipsum'.startsWith(term) || term.startsWith('loremipsum'))
                tags.unshift({tag: 'loremipsum', description: 'Used 2 times in the current topic.'});
            success(tags);
        }, 239);
    },
    getComments: (success, error) => {
        setTimeout(() => {
            success(commentsArray);
        }, 389);
    },
    postComment: (comment, success, error) => {
        setTimeout(() => {
            success(comment);
        }, 542);
    },
    putComment: (comment, success, error) => {
        setTimeout(() => {
            success(comment);
        }, 504);
    },
    deleteComment: (comment, success, error) => {
        setTimeout(() => {
            success({
                ...comment,
                content: 'Deleted',
                attachments: []
            });
        }, 512);
    },
    upvoteComment: (comment, success, error) => {
        setTimeout(() => {
            success(comment);
        }, 380);
    },
    validateAttachments: (attachments, callback) => {
        setTimeout(() => {
            callback(attachments);
        }, 768);
    },
    hashtagClicked: (hashtag) => {
        showSnackbar(`#${hashtag} clicked.`);
    },
    pingClicked: (userId) => {
        showSnackbar(`@${userId} clicked.`);
    },
};

let snackbarId;

function showSnackbar(text) {
    const snackbar = document.getElementById('snackbar')

    snackbar.querySelector('.content').textContent = text;
    snackbar.classList.add('show');

    clearTimeout(snackbarId);
    snackbarId = setTimeout(() => { snackbar.classList.remove('show'); }, 2500);
}

document.querySelector('#demo-comments').append(commentsElement);
