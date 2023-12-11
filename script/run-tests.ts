import {tap} from 'node:test/reporters';
import {run} from 'node:test';
import {stdout} from 'node:process';
import {globSync} from 'glob';

const files: string[] = globSync('test/**/*.spec.ts', {absolute: true});
files.forEach(console.log);
run({
    files: files
})
    .compose(tap)
    .pipe(stdout);
