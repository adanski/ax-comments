/**
 * Noop tagger used just to tag own CSS literals.
 */
export function tagNoop(...args: [TemplateStringsArray, ...(string | number)[]]): string {
    let s: string = args[0][0];
    for (let i: number = 1, l = args.length; i < l; i++)
        s += arguments[i] + args[0][i];
    return s;
}
