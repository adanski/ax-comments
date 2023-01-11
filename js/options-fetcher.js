const prefix = 'https://github.com/adanski/ax-comments/blob/master/';
const rawPrefix = 'https://raw.githubusercontent.com/adanski/ax-comments/master/';

function getOptions(relativePath) {
    return {
        url: prefix + relativePath,
        rawUrl: rawPrefix + relativePath,
        content: getFileContent(rawPrefix + relativePath),
    };
}

async function getFileContent(url) {
    const response = await fetch(url);
    return await response.text();
}

export const currentUser = getOptions('src/options/current-user.ts');
export const icons = getOptions('src/options/icons.ts');
export const labels = getOptions('src/options/labels.ts');
export const functionalities = getOptions('src/options/functionalities.ts');
export const models = getOptions('src/options/models.ts');
export const callbacks = getOptions('src/options/callbacks.ts');
export const formatters = getOptions('src/options/formatters.ts');
export const misc = getOptions('src/options/misc.ts');
