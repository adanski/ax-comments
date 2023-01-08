import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import {currentUser, icons, labels, functionalities, models, callbacks, formatters, misc} from './options-fetcher.js';

// Highlight code blocks
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.configure({
    languages: ['bash', 'javascript', 'typescript']
});

document.querySelector('code.current-user').textContent = await currentUser.content;
document.querySelector('code.icons').textContent = await icons.content;
document.querySelector('code.labels').textContent = await labels.content;
document.querySelector('code.functionalities').textContent = await functionalities.content;
document.querySelector('code.models').textContent = await models.content;
document.querySelector('code.callbacks').textContent = await callbacks.content;
document.querySelector('code.formatters').textContent = await formatters.content;
document.querySelector('code.misc').textContent = await misc.content;

hljs.highlightAll();
