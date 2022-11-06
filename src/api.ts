import {CurrentUser} from './options/current-user.js';
import {Icons} from './options/icons.js';
import {Labels} from './options/labels.js';
import {Functionalities} from './options/functionalities.js';
import {CommentPropsMappings} from './options/comment-props-mappings.js';
import {Callbacks} from './options/callbacks.js';
import {Formatters} from './options/formatters.js';
import {Misc} from './options/misc.js';

export interface CommentsOptions extends CurrentUser, Icons, Labels, Functionalities, Callbacks, Formatters, Misc {
    fieldMappings: CommentPropsMappings;
}

export {SortKey} from './options/misc.js';
