import {CommentsOptions} from './comments-options';
import {OptionsProvider} from './provider';

export class CommentTransformer {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
    }

    applyInternalMappings(commentJSON: Record<string, any>): Record<string, any> {
        // Inverting field mappings
        const invertedMappings: Record<string, string> = {};
        const mappings: Record<string, string> = this.options.fieldMappings;
        for (let prop in mappings) {
            if (mappings.hasOwnProperty(prop)) {
                invertedMappings[mappings[prop]] = prop;
            }
        }

        return CommentTransformer.applyMappings(invertedMappings, commentJSON);
    }

    applyExternalMappings(commentJSON: Record<string, any>): Record<string, any> {
        const mappings: Record<string, string> = this.options.fieldMappings;
        return CommentTransformer.applyMappings(mappings, commentJSON);
    }

    private static applyMappings(mappings: Record<string, string>, commentJSON: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};

        for (let key1 in commentJSON) {
            if (key1 in mappings) {
                const key2 = mappings[key1];
                result[key2] = commentJSON[key1];
            }
        }
        return result;
    }
}
