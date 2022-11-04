import {CommentFieldMappings, CommentsOptions} from './api.js';
import {OptionsProvider} from './provider.js';

export class CommentTransformer {

    private readonly options: CommentsOptions;

    constructor(private readonly container: HTMLElement) {
        this.options = OptionsProvider.get(container)!;
    }

    toCommentModel(commentJSON: Record<string, any>): Record<string, any> {
        const commentModel: Record<string, any> = this.applyInternalMappings(commentJSON);
        commentModel.childs = [];
        commentModel.hasAttachments = () => commentModel.attachments.length > 0;
        return commentModel;
    }

    applyInternalMappings(commentJSON: Record<string, any>): Record<string, any> {
        // Inverting field mappings
        const invertedMappings: Record<string, string> = {};
        const mappings: CommentFieldMappings = this.options.fieldMappings;
        for (const prop in mappings) {
            if (mappings.hasOwnProperty(prop)) {
                invertedMappings[mappings[prop as keyof CommentFieldMappings] as string] = prop;
            }
        }

        return CommentTransformer.applyMappings(invertedMappings, commentJSON);
    }

    applyExternalMappings(commentJSON: Record<string, any>): Record<string, any> {
        const mappings: CommentFieldMappings = this.options.fieldMappings;
        return CommentTransformer.applyMappings(mappings as any, commentJSON);
    }

    private static applyMappings(mappings: Record<string, string>, commentJSON: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};

        for (let key1 in commentJSON) {
            if (key1 in mappings) {
                const key2: string = mappings[key1];
                result[key2] = commentJSON[key1];
            }
        }
        return result;
    }
}
