const mainStyle: string = `
.jquery-comments * {
	box-sizing: border-box;
	text-shadow: none;
}

.jquery-comments a[href]:not(.tag) {
	color: #2793e6;
	text-decoration: none;
}

.jquery-comments a[href]:not(.tag):hover {
	text-decoration: underline;
}

.jquery-comments .textarea, .jquery-comments input, .jquery-comments button {
	-webkit-appearance: none;
	-moz-appearance: none;
	-ms-appearance: none;
	appearance: none;

	vertical-align: top;
	border-radius: 0;
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	background: rgba(0, 0, 0, 0);
}

.jquery-comments button {
	vertical-align: inherit;
}

.jquery-comments .tag {
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

.jquery-comments .attachments .tag {
	white-space: normal;
	word-break: break-all;

	padding: 0.05em 0.5em;
	line-height: 1.3em;

	margin-top: 0.3em;
	margin-right: 0.5em;
}

.jquery-comments .attachments .tag > i:first-child {
	margin-right: 0.4em;
}

.jquery-comments .attachments .tag .delete {
	display: inline;
	font-size: 14px;
	color: #888;
	
	position: relative;
	padding: 2px;
	padding-right: 4px;
	right: -4px;
}

.jquery-comments .attachments .tag:hover .delete {
	color: black;
}

.jquery-comments .tag:hover {
	text-decoration: none;
}

.jquery-comments .tag:not(.deletable):hover {
	background-color: #d8edf8;
	border-color: #2793e6;
}

.jquery-comments [contentEditable=true]:empty:not(:focus):before{
    content:attr(data-placeholder);
    color: #CCC;
    position: inherit;
    pointer-events: none;
}

.jquery-comments i.fa {
	width: 1em;
	height: 1em;
	background-size: cover;
	text-align: center;
}

.jquery-comments i.fa.image:before {
	content: "";
}

.jquery-comments .spinner {
	font-size: 2em;
	text-align: center;
	padding: 0.5em;
	margin: 0;
	color: #666;
}

.jquery-comments .spinner.inline {
	font-size: inherit;
	padding: 0;
	color: #fff;
}

.jquery-comments ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.jquery-comments .profile-picture {
	float: left;
	width: 3.6rem;
	height: 3.6rem;
	max-width: 50px;
	max-height: 50px;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
}

.jquery-comments i.profile-picture {
	font-size: 3.4em;
	text-align: center;
}

.jquery-comments .profile-picture.round {
	border-radius: 50%;
}

.jquery-comments .commenting-field.main{
	margin-bottom: 0.75em;
}

.jquery-comments .commenting-field.main .profile-picture {
	margin-bottom: 1rem;
}

.jquery-comments .textarea-wrapper {
	overflow: hidden;
	padding-left: 15px;
	position: relative;
}

.jquery-comments .textarea-wrapper:before {
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

.jquery-comments .textarea-wrapper:after {
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

.jquery-comments .textarea-wrapper .inline-button {
	cursor: pointer;
	right: 0;
	z-index: 10;
	position: absolute;
	border: .5em solid rgba(0,0,0,0);
	box-sizing: content-box;
	font-size: inherit;
	overflow: hidden;
	opacity: 0.5;

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.jquery-comments .textarea-wrapper .inline-button:hover {
	opacity: 1;
}

.jquery-comments:not(.mobile) .commenting-field-scrollable .textarea-wrapper .inline-button {
	margin-right: 15px;	/* Because of scrollbar */
}

.jquery-comments .textarea-wrapper .inline-button i {
	font-size: 1.2em;
}

.jquery-comments .textarea-wrapper .upload input {
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

.jquery-comments .textarea-wrapper .close {
	width: 1em;
	height: 1em;
}

.jquery-comments .textarea-wrapper .textarea {
	margin: 0;
	outline: 0;
	overflow-y: auto;
	overflow-x: hidden;
	cursor: text;

	border: 1px solid #CCC;;
	background: #FFF;
	font-size: 1em;
	line-height: 1.45em;
	padding: .25em .8em;
	padding-right: 2em;
}

.jquery-comments:not(.mobile) .commenting-field-scrollable .textarea-wrapper .textarea {
	padding-right: calc(2em + 15px);	/* Because of scrollbar */
}

.jquery-comments .textarea-wrapper .control-row > .attachments {
	padding-top: .3em;
}

.jquery-comments .textarea-wrapper .control-row > span {
	float: right;
	line-height: 1.6em;
	margin-top: .4em;
	border: 1px solid rgba(0, 0, 0, 0);
	color: #FFF;
	padding: 0 1em;
	font-size: 1em;
	opacity: .5;
}

.jquery-comments .textarea-wrapper .control-row > span:not(:first-child) {
	margin-right: .5em;
}

.jquery-comments .textarea-wrapper .control-row > span.enabled {
	opacity: 1;
	cursor: pointer;
}

.jquery-comments .textarea-wrapper .control-row > span:not(.enabled) {
	pointer-events: none;
}

.jquery-comments .textarea-wrapper .control-row > span.enabled:hover {
	opacity: .9;
}

.jquery-comments .textarea-wrapper .control-row > span.upload {
	position: relative;
	overflow: hidden;
	background-color: #999;
}

.jquery-comments ul.navigation {
	clear: both;

	color: #999;
	border-bottom: 2px solid #CCC;
	line-height: 2em;
	font-size: 1em;
	margin-bottom: 0.5em;
}

.jquery-comments ul.navigation .navigation-wrapper {
	position: relative;
}

.jquery-comments ul.navigation li {
	display: inline-block;
	position: relative;
	padding: 0 1em;
	cursor: pointer;
	text-align: center;

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.jquery-comments ul.navigation li.active,
.jquery-comments ul.navigation li:hover {
	color: #000;
}

.jquery-comments ul.navigation li.active:after {
	content: " ";
	display: block;
	right: 0;
	height: 2px;
	background: #000;
	position: absolute;
	bottom: -2px;
	left: 0;
}

.jquery-comments ul.navigation li[data-sort-key="attachments"] {
	float: right;
}

.jquery-comments ul.navigation li[data-sort-key="attachments"] i {
	margin-right: 0.25em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive {
	display: none;
}

@media screen and (max-width: 600px) {
	.jquery-comments ul.navigation .navigation-wrapper {
		display: none;
	}
	.jquery-comments ul.navigation .navigation-wrapper.responsive {
		display: inline;
	}
}

.jquery-comments.responsive ul.navigation .navigation-wrapper {
	display: none;
}
.jquery-comments.responsive ul.navigation .navigation-wrapper.responsive {
	display: inline;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title {
	padding: 0 1.5em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title header:after {
    display: inline-block;
    content: "";
    border-left: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-right: 0.3em solid rgba(0, 0, 0, 0) !important;
    border-top: 0.4em solid #CCC;
    margin-left: 0.5em;
    position: relative;
    top: -0.1em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive li.title.active header:after,
.jquery-comments ul.navigation .navigation-wrapper.responsive li.title:hover header:after {
	border-top-color: #000;
}

.jquery-comments ul.dropdown {
	display: none;
	position: absolute;
	background: #FFF;
	z-index: 99;
	line-height: 1.2em;

	border: 1px solid #CCC;
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
	-webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
	-moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
	-ms-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

.jquery-comments ul.dropdown.autocomplete {
	margin-top: 0.25em;
}

.jquery-comments ul.dropdown li {
	display: block;
	white-space: nowrap;
	clear: both;
	padding: 0.6em;
	font-weight: normal;
	cursor: pointer;
}

.jquery-comments ul.dropdown li.active {
	background: #EEE;
}

.jquery-comments ul.dropdown li a {
	display: block;
	text-decoration: none;
	color: inherit;
}

.jquery-comments ul.dropdown li .profile-picture {
	float: left;
	width: 2.4em;
	height: 2.4em;
	margin-right: 0.5em;
}

.jquery-comments ul.dropdown li .details {
	display: inline-block;
}

.jquery-comments ul.dropdown li .name {
	font-weight: bold;
}

.jquery-comments ul.dropdown li .details.no-email {
	line-height: 2.4em;
}

.jquery-comments ul.dropdown li .email {
	color: #999;
	font-size: 0.95em;
	margin-top: 0.1em;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown {
	left: 0;
	width: 100%;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li {
	color: #000;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li.active {
	color: #FFF;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li:hover:not(.active) {
	background: #F5F5F5;
}

.jquery-comments ul.navigation .navigation-wrapper.responsive ul.dropdown li:after {
	display: none;
}

.jquery-comments .no-data {
	display: none;
	margin: 1em;
	text-align: center;
	font-size: 1.5em;
	color: #CCC;
}

.jquery-comments ul.main:empty ~ .no-comments {
	display: inherit;
}

.jquery-comments ul#attachment-list:empty ~ .no-attachments {
	display: inherit;
}

.jquery-comments ul.main li.comment {
	clear: both;
}

.jquery-comments ul.main li.comment .comment-wrapper,
.jquery-comments ul.main button.toggle-all,
.jquery-comments ul.main li.comment .commenting-field {
	padding: .5em;
}

.jquery-comments ul.main li.comment .comment-wrapper {
	border-top: 1px solid #DDD;
	overflow: hidden;
}

.jquery-comments ul.main > li.comment:first-child > .comment-wrapper {
	border-top: none;
}

.jquery-comments ul.main li.comment .comment-wrapper > .profile-picture {
	margin-right: 1rem;
}

.jquery-comments ul.main li.comment time {
	float: right;
	line-height: 1.4em;
	margin-left: .5em;
	font-size: 0.8em;
	color: #666;
}

.jquery-comments ul.main li.comment .comment-header {
	line-height: 1.4em;
	word-break: break-word;
}

.jquery-comments ul.main li.comment .comment-header > * {
	margin-right: .5rem;
}

.jquery-comments ul.main li.comment .comment-header .name {
	font-weight: bold;
}

.jquery-comments ul.main li.comment .comment-header .reply-to {
	color: #999;
	font-size: .8em;
	font-weight: normal;
	vertical-align: top;
}

.jquery-comments ul.main li.comment .comment-header .reply-to i {
	margin-right: .25rem;
}

.jquery-comments ul.main li.comment .comment-header .new {
	background: #2793e6;
	font-size: 0.8em;
	padding: 0.2em 0.6em;
	color: #fff;
	font-weight: normal;
	border-radius: 1em;
	vertical-align: bottom;
	word-break: normal;
}

.jquery-comments ul.main li.comment .wrapper{
	line-height: 1.4em;
	overflow: hidden;
}

.jquery-comments.mobile ul.main li.comment .child-comments li.comment .wrapper{
	overflow: visible;
}
`;

/* Content */
const contentStyle: string = `
.jquery-comments ul.main li.comment .wrapper .content {
	white-space: pre-line;
	word-break: break-word;
}

.jquery-comments ul.main li.comment .wrapper .content time.edited {
	float: inherit;
	margin: 0;
	font-size: .9em;
	font-style: italic;
	color: #999;
}

.jquery-comments ul.main li.comment .wrapper .content time.edited:before {
	content: " - ";
}
`;

/* Attachments */
const attachmentsStyle: string = `
.jquery-comments ul.main li.comment .wrapper .attachments .tags:not(:empty) {
	margin-bottom: 0.5em;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview {
	display: inline-block;
	margin-top: .25em;
	margin-right: .25em;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview > * {
	max-width: 100%;
	max-height: 200px;
	width: auto;
	height: auto;
}

.jquery-comments ul.main li.comment .wrapper .attachments .previews .preview > *:focus {
	outline: none;
}
`;

/* Actions */
const actionsStyle: string = `
.jquery-comments.mobile ul.main li.comment .actions {
	font-size: 1em;
}

.jquery-comments ul.main li.comment .actions > * {
	color: #999;
	font-weight: bold;
}

.jquery-comments ul.main li.comment .actions .action {
	display: inline-block;
	cursor: pointer;
	margin-left: 1em;
	margin-right: 1em;
	line-height: 1.5em;
	font-size: 0.9em;
}

.jquery-comments ul.main li.comment .actions .action:first-child {
	margin-left: 0;
}

.jquery-comments ul.main li.comment .actions .action.upvote {
	cursor: inherit;
}

.jquery-comments ul.main li.comment .actions .action.upvote .upvote-count {
	margin-right: .5em;
}

.jquery-comments ul.main li.comment .actions .action.upvote .upvote-count:empty {
	display: none;
}

.jquery-comments ul.main li.comment .actions .action.upvote i {
	cursor: pointer;
}

.jquery-comments ul.main li.comment .actions .action:not(.upvote):hover,
.jquery-comments ul.main li.comment .actions .action.upvote:not(.highlight-font) i:hover {
	color: #666;
}

.jquery-comments ul.main li.comment .actions .action.delete {
	opacity: 0.5;
	pointer-events: none;
}

.jquery-comments ul.main li.comment .actions .action.delete.enabled {
	opacity: 1;
	pointer-events: auto;
}

.jquery-comments ul#attachment-list li.comment .actions .action:not(.delete) {
	display: none;
}

.jquery-comments ul#attachment-list li.comment .actions .action.delete {
	margin: 0;
}

.jquery-comments ul#attachment-list li.comment .actions .separator {
	display: none;
}
`;

/* Child comments */
const childCommentsStyle: string = `
.jquery-comments ul.main li.comment .child-comments > *:before { /* Margin for second level content */
	content: "";
	height: 1px;
	float: left;

	width: calc(3.6em + .5em);	/* Profile picture width plus margin */
	max-width: calc(50px + .5em);	/* Profile picture max width plus margin */
}

.jquery-comments ul.main li.comment .child-comments .profile-picture {
	width: 2.4rem;
	height: 2.4rem;
}

.jquery-comments ul.main li.comment .child-comments i.profile-picture {
	font-size: 2.4em;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all {
	padding-top: 0;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all span:first-child {
	vertical-align: middle;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all span:first-child:hover {
	cursor: pointer;
	text-decoration: underline;
}

.jquery-comments ul.main li.comment .child-comments button.toggle-all .caret {
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

.jquery-comments ul.main li.comment .child-comments button.toggle-all .caret.up {
	border-top-color: rgba(0, 0, 0, 0);
	border-bottom-color: inherit;
	margin-top: -.2em;
}

.jquery-comments ul.main li.comment .child-comments .togglable-reply {
	display: none;
}

.jquery-comments ul.main li.comment .child-comments .visible {
	display: inherit;
}

.jquery-comments ul.main li.comment.hidden {
	display: none;
}
`;

/* Editing comment */
const editingCommentStyle: string = `
.jquery-comments ul.main li.comment.edit > .comment-wrapper > *:not(.commenting-field) {
	display: none;
}

.jquery-comments ul.main li.comment.edit > .comment-wrapper .commenting-field {
	padding-left: 0 !important;
	padding-right: 0 !important;
}
`;

/* Drag & drop attachments */
const dragAndDropAttachmentsStyle: string = `
.jquery-comments.drag-ongoing {
	overflow-y: hidden !important;
}

.jquery-comments .droppable-overlay {
	display: table;
	position: fixed;
	z-index: 99;

	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.3)
}

.jquery-comments .droppable-overlay .droppable-container {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
}

.jquery-comments .droppable-overlay .droppable-container .droppable {
	background: #FFF;
	color: #CCC;
	padding: 6em;
}

.jquery-comments .droppable-overlay .droppable-container .droppable.drag-over {
	color: #999;
}

.jquery-comments .droppable-overlay .droppable-container .droppable i {
	margin-bottom: 5px;
}
`;

/* Read-only mode */
const readOnlyStyle: string = `
.jquery-comments.read-only .commenting-field {
	display: none;
}
.jquery-comments.read-only .actions {
	display: none;
}
`;

export const STYLE_SHEET: CSSStyleSheet = (() => {
	const styleSheet: CSSStyleSheet = new CSSStyleSheet();
	(styleSheet as any).replaceSync(mainStyle
		+ contentStyle
		+ attachmentsStyle
		+ actionsStyle
		+ childCommentsStyle
		+ editingCommentStyle
		+ dragAndDropAttachmentsStyle
		+ readOnlyStyle);
	return styleSheet;
})();
