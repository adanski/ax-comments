import assert from 'node:assert';

export function expect<T>(actual: T): Expectation<T> {
    return new Expectation(actual);
}

class Expectation<T> {

    readonly #actual: unknown;

    constructor(actual: unknown) {
        this.#actual = actual;
    }

    toBe(expected: Partial<T>, message?: string | Error): void {
        assert.strictEqual(this.#actual, expected, message);
    }

    notToBe(expected: Partial<T>, message?: string | Error): void {
        assert.notStrictEqual(this.#actual, expected, message);
    }

    toEqual(expected: Partial<T>, message?: string | Error): void {
        assert.deepStrictEqual(this.#actual, expected, message);
    }

    notToEqual(expected: Partial<T>, message?: string | Error): void {
        assert.notDeepStrictEqual(this.#actual, expected, message);
    }

    toBeGreaterThan(expected: number, message?: string | Error): void {
        assert.ok(this.#actual as number > expected, message);
    }

}
