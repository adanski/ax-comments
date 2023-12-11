import MagicString, {SourceMap} from 'magic-string';
import {readFileSync, writeFileSync} from 'node:fs';

let stylesheet: string = '';
let bundle: string = '';

try {
    stylesheet = readFileSync('./dist/css/stylesheet.js', 'utf8');
    bundle = readFileSync('./dist/bundle/comments-element-esm.js', 'utf8');
} catch (e) {
    console.error(e);
    process.exit(1);
}

const stylesheetMagicString: MagicString = compactCss(stylesheet);
const stylesheetCode: string = stylesheetMagicString.toString();
const stylesheetMap: SourceMap = stylesheetMagicString.generateMap({file: 'stylesheet.js', source: '../../src/css/stylesheet.ts'});
const bundleMagicString: MagicString = compactCss(bundle);
const bundleCode: string = bundleMagicString.toString();
const bundleMap: SourceMap = bundleMagicString.generateMap({file: 'comments-element-esm.js'});

try {
    writeFileSync('./dist/css/stylesheet.js', stylesheetCode, 'utf8');
    writeFileSync('./dist/css/stylesheet.js.map', stylesheetMap.toString(), 'utf8');
    writeFileSync('./dist/bundle/comments-element-esm.js', bundleCode, 'utf8');
    writeFileSync('./dist/bundle/comments-element-esm.js.map', bundleMap.toString(), 'utf8');
} catch (e) {
    console.error(e);
    process.exit(1);
}

function compactCss(source: string): MagicString {
    const magicString: MagicString = new MagicString(source);

    // Primitive regexp to select CSS strings to minify
    const multiLineCssString: RegExp = /tagNoop\s*`\s*[a-z*.#/][^`]+\{[^`]+\}\s*`/gm;
    return magicString.replaceAll(multiLineCssString, css => css
        .replace(/\s+/gm, ' ')
        .replace(/tagNoop\s*`/g, '`')
        .trim());
}
