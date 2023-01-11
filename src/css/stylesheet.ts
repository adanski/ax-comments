const mainStyle: string = `
#comments-container * {
    box-sizing: border-box;
    text-shadow: none;
}

#comments-container a[href]:not(.tag) {
    color: #2793e6;
    text-decoration: none;
}

#comments-container a[href]:not(.tag):hover {
    text-decoration: underline;
}

#comments-container .textarea,
#comments-container input,
#comments-container button {
    appearance: none;

    vertical-align: top;
    border-radius: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: rgba(0, 0, 0, 0);
}

#comments-container button {
    vertical-align: inherit;
}

#comments-container .tag {
    color: inherit;
    font-size: 0.9em;
    line-height: 1.2em;
    background: #ddd;
    border: 1px solid #ccc;
    padding: 0.05em 0.4em;
    cursor: pointer;
    font-weight: normal;
    border-radius: 1em;
    transition: all 0.2s linear;
    white-space: nowrap;
    display: inline-block;
    text-decoration: none;
}

#comments-container .attachments .tag {
    white-space: normal;
    word-break: break-all;

    padding: 0.05em 0.5em;
    line-height: 1.3em;

    margin-top: 0.3em;
    margin-right: 0.5em;
}

#comments-container .attachments .tag > i:first-child {
    margin-right: 0.4em;
}

#comments-container .attachments .tag .delete {
    display: inline;
    font-size: 14px;
    color: #888;

    position: relative;
    padding: 2px;
    padding-right: 4px;
    right: -4px;
}

#comments-container .attachments .tag:hover .delete {
    color: black;
}

#comments-container .tag:hover {
    text-decoration: none;
}

#comments-container .tag:not(.deletable):hover {
    background-color: #d8edf8;
    border-color: #2793e6;
}

#comments-container textarea.textarea:focus::placeholder {
    color: transparent;
    resize: vertical;
}

#comments-container textarea.textarea:not(:focus)::placeholder {
    color: #CCC;
    resize: vertical;
}

#comments-container i.fa {
    width: 1em;
    height: 1em;
    background-size: cover;
    text-align: center;
}

#comments-container i.fa.image:before {
    content: "";
}

#comments-container .spinner {
    font-size: 2em;
    text-align: center;
    padding: 0.5em;
    margin: 0;
    color: #666;
}

#comments-container .spinner.inline {
    font-size: inherit;
    padding: 0;
    color: #fff;
}

#comments-container .spinner.inline:not(.hidden) ~ * {
    margin-left: 0.4em;
}

#comments-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

#comments-container .profile-picture {
    float: left;
    width: 3.6rem;
    height: 3.6rem;
    max-width: 50px;
    max-height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

#comments-container i.profile-picture {
    font-size: 3.4em;
    text-align: center;
}

#comments-container .profile-picture.round {
    border-radius: 50%;
}

#comments-container .commenting-field.main .textarea-wrapper {
    margin-bottom: 0.75em;
}

#comments-container .commenting-field.main .profile-picture {
    margin-bottom: 1rem;
}

#comments-container .textarea-wrapper {
    overflow: hidden;
    padding-left: 15px;
    position: relative;
}

#comments-container .textarea-wrapper:before {
    content: " ";
    position: absolute;
    border: 5px solid #D5D5D5;
    left: 5px;
    top: 0;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
}

#comments-container .textarea-wrapper:after {
    content: " ";
    position: absolute;
    border: 7px solid #FFF;
    left: 7px;
    top: 1px;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
}

#comments-container .textarea-wrapper .inline-button {
    cursor: pointer;
    right: 0;
    z-index: 10;
    position: absolute;
    border: .5em solid rgba(0,0,0,0);
    box-sizing: content-box;
    font-size: inherit;
    overflow: hidden;
    opacity: 0.5;

    user-select: none;
}

#comments-container .textarea-wrapper .inline-button:hover {
    opacity: 1;
}

#comments-container:not(.mobile) .textarea-wrapper.textarea-scrollable .inline-button {
    /* Because of scrollbar */
    margin-right: 15px;
}

#comments-container .textarea-wrapper .inline-button i {
    font-size: 1.2em;
}

#comments-container .textarea-wrapper .upload input {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
}

#comments-container .textarea-wrapper .close {
    width: 1em;
    height: 1em;
}

#comments-container .textarea-wrapper .textarea {
    width: 100%;
    margin: 0;
    outline: 0;
    overflow-y: auto;
    overflow-x: hidden;
    resize: vertical;
    cursor: text;

    border: 1px solid #CCC;
    background: #FFF;
    font-family: inherit;
    font-size: 1em;
    line-height: 1.45em;
    padding: .25em .8em;
    padding-right: 2em;
}

#comments-container:not(.mobile) .textarea-wrapper.textarea-scrollable .textarea {
    /* Because of scrollbar */
    padding-right: calc(2em + 15px);
}

#comments-container .textarea-wrapper .control-row > .attachments {
    padding-top: .3em;
}

#comments-container .textarea-wrapper .control-row > button {
    float: right;
    line-height: 1.6em;
    margin-top: .4em;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #FFF;
    padding: 0 1em;
    font-size: 1em;
    opacity: .5;
}

#comments-container button .hidden {
    display: none !important;
}

#comments-container .textarea-wrapper .control-row > button:not(:first-child) {
    margin-right: .5em;
}

#comments-container .textarea-wrapper .control-row > button.enabled {
    opacity: 1;
    cursor: pointer;
}

#comments-container .textarea-wrapper .control-row > button:not(.enabled) {
    pointer-events: none;
}

#comments-container .textarea-wrapper .control-row > button.enabled:hover {
    opacity: .9;
}

#comments-container .textarea-wrapper .control-row > button.upload {
    position: relative;
    overflow: hidden;
    background-color: #999;
}

#comments-container ul.navigation {
    clear: both;

    color: #999;
    border-bottom: 2px solid #CCC;
    line-height: 2em;
    font-size: 1em;
    margin-bottom: 0.5em;
}

#comments-container ul.navigation .navigation-wrapper {
    position: relative;
}

#comments-container ul.navigation li {
    display: inline-block;
    position: relative;
    padding: 0 1em;
    cursor: pointer;
    text-align: center;

    user-select: none;
}

#comments-container ul.navigation li.active,
#comments-container ul.navigation li:hover {
    color: #000;
}

#comments-container ul.navigation li.active:after {
    content: " ";
    display: block;
    right: 0;
    height: 2px;
    background: #000;
    position: absolute;
    bottom: -2px;
    left: 0;
}

#comments-container ul.navigation li[data-sort-key="attachments"] {
    float: right;
}

#comments-container ul.navigation li[data-sort-key="attachments"] i {
    margin-right: 0.25em;
}

#comments-container ul.navigation .navigation-wrapper.responsive {
    display: none;
}

@media screen and (max-width: 600px) {
    #comments-container ul.navigation .navigation-wrapper {
        display: none;
    }
    #comments-container ul.navigation .navigation-wrapper.responsive {
        display: inline;
    }
}

#comments-container.responsive ul.navigation .navigation-wrapper {
    display: none;
}
#comments-container.responsive ul.navigation .navigation-wrapper.responsive {
    display: inline;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title {
    padding: 0 1.5em;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title header:after {
    display: inline-block;
    content: "";
    border-left: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-right: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-top: 0.4em solid #CCC;
    margin-left: 0.5em;
    position: relative;
    top: -0.1em;
}

#comments-container ul.navigation .navigation-wrapper.responsive li.title.active header:after,
#comments-container ul.navigation .navigation-wrapper.responsive li.title:hover header:after {
    border-top-color: #000;
}

#comments-container ul.dropdown {
    display: none;
    position: absolute;
    background: #FFF;
    z-index: 99;
    line-height: 1.2em;

    border: 1px solid #CCC;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

#comments-container ul.dropdown.autocomplete {
    margin-top: 0.25em;
}

#comments-container ul.dropdown li {
    display: block;
    white-space: nowrap;
    clear: both;
    padding: 0.6em;
    font-weight: normal;
    cursor: pointer;
}

#comments-container ul.dropdown li.active {
    background: #EEE;
}

#comments-container ul.dropdown li .result {
    display: block;
    margin: 0;
    text-decoration: none;
    color: inherit;
}

#comments-container ul.dropdown li .profile-picture {
    float: left;
    width: 2.4em;
    height: 2.4em;
    margin-right: 0.5em;
}

#comments-container ul.dropdown li .hashtag {
    float: left;
    font-size: 2.4em;
    margin-left: 0.1em;
    margin-right: 0.25em;
}

#comments-container ul.dropdown li .info {
    display: inline-block;
}

#comments-container ul.dropdown li .info > span {
    display: block;
}

#comments-container ul.dropdown li .info.no-details {
    line-height: 2.4em;
}

#comments-container ul.dropdown li .name {
    font-weight: bold;
}

#comments-container ul.dropdown li .details {
    color: #999;
    font-size: 0.95em;
    margin-top: 0.1em;
}

#comments-container ul.dropdown .textcomplete-header {
    display: none;
}

#comments-container ul.dropdown .textcomplete-footer {
    display: none;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown {
    left: 0;
    width: 100%;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li {
    color: #000;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li.active {
    color: #FFF;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li:hover:not(.active) {
    background: #F5F5F5;
}

#comments-container ul.navigation .navigation-wrapper.responsive ul.dropdown li:after {
    display: none;
}

#comments-container .no-data {
    display: none;
    margin: 1em;
    text-align: center;
    font-size: 1.5em;
    color: #CCC;
}

#comments-container ul.main:empty ~ .no-comments {
    display: inherit;
}

#comments-container ul#attachment-list:empty ~ .no-attachments {
    display: inherit;
}

#comments-container ul.main li.comment {
    clear: both;
}

#comments-container ul.main li.comment .comment-wrapper,
#comments-container ul.main button.toggle-all,
#comments-container ul.main li.comment .commenting-field > .commenting-field-container {
    padding: .5em;
}

#comments-container ul.main li.comment .comment-wrapper {
    border-top: 1px solid #DDD;
    overflow: hidden;
}

#comments-container ul.main > li.comment:first-child > ax-comment-container > .comment-wrapper {
    border-top: none;
}

#comments-container ul.main li.comment .comment-wrapper > .profile-picture {
    margin-right: 1rem;
}

#comments-container ul.main li.comment time {
    float: right;
    line-height: 1.4em;
    margin-left: .5em;
    font-size: 0.8em;
    color: #666;
}

#comments-container ul.main li.comment .comment-header {
    line-height: 1.4em;
    word-break: break-word;
}

#comments-container ul.main li.comment .comment-header > * {
    margin-right: .5rem;
}

#comments-container ul.main li.comment .comment-header .name {
    font-weight: bold;
}

#comments-container ul.main li.comment .comment-header .reply-to {
    color: #999;
    font-size: .8em;
    font-weight: normal;
    vertical-align: top;
}

#comments-container ul.main li.comment .comment-header .reply-to i {
    margin-right: .25rem;
}

#comments-container ul.main li.comment .comment-header .new {
    background: #2793e6;
    font-size: 0.8em;
    padding: 0.2em 0.6em;
    color: #fff;
    font-weight: normal;
    border-radius: 1em;
    vertical-align: bottom;
    word-break: normal;
}

#comments-container ul.main li.comment .wrapper {
    line-height: 1.4em;
    overflow: hidden;
}

#comments-container.mobile ul.main li.comment .child-comments li.comment .wrapper {
    overflow: visible;
}
`;

/* Content */
const contentStyle: string = `
#comments-container ul.main li.comment .wrapper .content {
    white-space: pre-line;
    word-break: break-word;
}

#comments-container ul.main li.comment .wrapper .content time.edited {
    float: inherit;
    margin: 0;
    font-size: .9em;
    font-style: italic;
    color: #999;
}

#comments-container ul.main li.comment .wrapper .content time.edited:before {
    content: " - ";
}
`;

/* Attachments */
const attachmentsStyle: string = `
#comments-container ul.main li.comment .wrapper .attachments .tags:not(:empty) {
    margin-bottom: 0.5em;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview {
    display: inline-block;
    margin-top: .25em;
    margin-right: .25em;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview > * {
    max-width: 100%;
    max-height: 200px;
    width: auto;
    height: auto;
}

#comments-container ul.main li.comment .wrapper .attachments .previews .preview > *:focus {
    outline: none;
}
`;

/* Actions */
const actionsStyle: string = `
#comments-container.mobile ul.main li.comment .actions {
    font-size: 1em;
}

#comments-container ul.main li.comment .actions > * {
    color: #999;
    font-weight: bold;
}

#comments-container ul.main li.comment .actions .action {
    display: inline-block;
    cursor: pointer;
    margin-left: 1em;
    margin-right: 1em;
    line-height: 1.5em;
    font-size: 0.9em;
}

#comments-container ul.main li.comment .actions .action.disabled {
    opacity: 0.5;
    pointer-events: none;
}

#comments-container ul.main li.comment .actions .action:first-child {
    margin-left: 0;
}

#comments-container ul.main li.comment .actions .action.upvote {
    cursor: inherit;
}

#comments-container ul.main li.comment .actions .action.upvote .upvote-count {
    margin-right: .5em;
}

#comments-container ul.main li.comment .actions .action.upvote .upvote-count:empty {
    display: none;
}

#comments-container ul.main li.comment .actions .action.upvote i {
    cursor: pointer;
}

#comments-container ul.main li.comment .actions .action:not(.upvote):hover,
#comments-container ul.main li.comment .actions .action.upvote:not(.highlight-font) i:hover {
    color: #666;
}

#comments-container ul#attachment-list li.comment .actions .action:not(.delete) {
    display: none;
}

#comments-container ul#attachment-list li.comment .actions .action.delete {
    margin: 0;
}

#comments-container ul#attachment-list li.comment .actions .separator {
    display: none;
}
`;

/* Child comments */
const childCommentsStyle: string = `
/* Margin for second level content */
#comments-container ul.main li.comment .child-comments > *::before,
#comments-container ul.main li.comment ax-commenting-field > *::before {
    content: "";
    height: 1px;
    float: left;

    /* Profile picture width plus margin */
    width: calc(3.6em + .5em);
    /* Profile picture max width plus margin */
    max-width: calc(50px + .5em);
}

#comments-container ul.main li.comment .child-comments .profile-picture,
#comments-container ul.main li.comment .child-comments ~ ax-commenting-field .profile-picture {
    width: 2.4rem;
    height: 2.4rem;
}

#comments-container ul.main li.comment .child-comments i.profile-picture,
#comments-container ul.main li.comment .child-comments ~ ax-commenting-field i.profile-picture {
    font-size: 2.4em;
}

#comments-container ul.main li.comment .child-comments button.toggle-all {
    padding-top: 0;
}

#comments-container ul.main li.comment .child-comments button.toggle-all span:first-child {
    vertical-align: middle;
}

#comments-container ul.main li.comment .child-comments button.toggle-all span:first-child:hover {
    cursor: pointer;
    text-decoration: underline;
}

#comments-container ul.main li.comment .child-comments button.toggle-all .caret {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;

    margin-left: .5em;
    border: .3em solid;
    margin-top: .35em;

    border-left-color: rgba(0, 0, 0, 0);
    border-bottom-color: rgba(0, 0, 0, 0);
    border-right-color: rgba(0, 0, 0, 0);
}

#comments-container ul.main li.comment .child-comments button.toggle-all .caret.up {
    border-top-color: rgba(0, 0, 0, 0);
    border-bottom-color: inherit;
    margin-top: -.2em;
}

#comments-container ul.main li.comment .child-comments .togglable-reply {
    display: none;
}

#comments-container ul.main li.comment .child-comments .visible {
    display: inherit;
}

#comments-container ul.main li.comment.hidden {
    display: none;
}
`;

/* Editing comment */
const editingCommentStyle: string = `
#comments-container ul.main li.comment.edit > .comment-wrapper > *:not(.commenting-field) {
    display: none;
}

#comments-container ul.main li.comment.edit > .comment-wrapper .commenting-field {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
`;

/* Drag & drop attachments */
const dragAndDropAttachmentsStyle: string = `
#comments-container.drag-ongoing {
    overflow-y: hidden !important;
}

#comments-container .droppable-overlay {
    display: table;
    position: fixed;
    z-index: 99;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3)
}

#comments-container .droppable-overlay .droppable-container {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

#comments-container .droppable-overlay .droppable-container .droppable {
    background: #FFF;
    color: #CCC;
    padding: 6em;
}

#comments-container .droppable-overlay .droppable-container .droppable.drag-over {
    color: #999;
}

#comments-container .droppable-overlay .droppable-container .droppable i {
    margin-bottom: 5px;
}
`;

/* Read-only mode */
const readOnlyStyle: string = `
#comments-container.read-only .commenting-field {
    display: none;
}
#comments-container.read-only .actions {
    display: none;
}
`;

export const STYLE_SHEET: CSSStyleSheet = (() => {
    const styleSheet: CSSStyleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(mainStyle
        + contentStyle
        + attachmentsStyle
        + actionsStyle
        + childCommentsStyle
        + editingCommentStyle
        + dragAndDropAttachmentsStyle
        + readOnlyStyle);
    return styleSheet;
})();
