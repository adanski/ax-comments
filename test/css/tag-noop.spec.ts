import {describe, expect, it} from '@jest/globals';
import {tagNoop} from '../../src/css/tag-noop.js';

describe('tagNoop', () => {
    it('Should return unchanged string', () => {
        const four: string = '4';
        expect(tagNoop`${1}23${four}`).toEqual('1234');
    });
});
