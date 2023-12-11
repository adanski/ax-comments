import {describe, it} from 'node:test';
import {tagNoop} from '../../src/css/tag-noop.js';
import {expect} from '../util/expectation.js';

describe('tagNoop', () => {
    it('Should return unchanged string', () => {
        const four: string = '4';
        expect(tagNoop`${1}23${four}`).toBe('1234');
    });
});
