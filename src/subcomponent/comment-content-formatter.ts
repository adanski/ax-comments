import {TagFactory} from './tag-factory';
import {isNil, normalizeSpaces} from '../util';
import {CommentsOptions} from '../comments-options';
import {OptionsProvider, ServiceProvider} from '../provider';

export class CommentContentFormatter {

    private readonly options: CommentsOptions;
    private readonly tagFactory: TagFactory;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.tagFactory = ServiceProvider.get(container, TagFactory);
    }

    getFormattedCommentContent(commentModel: Record<string, any>, replaceNewLines?: boolean): string {
        let html: string = this.escape(commentModel.content);
        html = this.linkify(html);
        html = this.highlightTags(commentModel, html);
        if (replaceNewLines) {
            html = html.replace(/(?:\n)/g, '<br>');
        }
        return html;
    }

    private escape(inputText: string): string {
        const escaped: HTMLPreElement = document.createElement('pre');
        escaped.textContent = normalizeSpaces(inputText);

        return escaped.outerHTML;
    }

    private linkify(inputText: string): string {
        let replacedText: string;

        // URLs starting with http://, https://, ftp:// or file://
        const replacePattern1: RegExp = /(\b(https?|ftp|file):\/\/[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;{}]*[-A-ZÄÖÅ0-9+&@#\/%=~_|{}])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        // URLs starting with "www." (without // before it, or it would re-link the ones done above).
        const replacePattern2: RegExp = /(^|[^\/f])(www\.[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;{}]*[-A-ZÄÖÅ0-9+&@#\/%=~_|{}])/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');

        // Change email addresses to mailto: links.
        const replacePattern3: RegExp = /(([A-ZÄÖÅ0-9\-\_\.])+@[A-ZÄÖÅ\_]+?(\.[A-ZÄÖÅ]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');

        // If there are hrefs in the original text, let's split
        // the text up and only work on the parts that don't have urls yet.
        const count: string[] = inputText.match(/<a href/g) || [];

        if (count.length > 0) {
            // Keep delimiter when splitting
            const splitInput: string[] = inputText.split(/(<\/a>)/g);
            for (let i: number = 0; i < splitInput.length; i++) {
                if (isNil(splitInput[i].match(/<a href/g))) {
                    splitInput[i] = splitInput[i]
                        .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')
                        .replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>')
                        .replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');
                }
            }
            const combinedReplacedText: string = splitInput.join('');
            return combinedReplacedText;
        } else {
            return replacedText;
        }
    }

    private highlightTags(commentModel: Record<string, any>, html: string): string {
        if (this.options.enableHashtags) {
            html = this.highlightHashtags(commentModel, html);
        }
        if (this.options.enablePinging) {
            html = this.highlightPings(commentModel, html);
        }
        return html;
    }

    private highlightHashtags(commentModel: Record<string, any>, html: string): string {
        if (html.indexOf('#') !== -1) {
            const regex: RegExp = /(^|\s)#([a-z\u00C0-\u00FF\d-_]+)/gim;
            html = html.replace(regex, ($0, $1, $2) => $1 + this.createHashTag($2));
        }
        return html;
    }

    private createHashTag(hashTagText: string): string {
        const tag: HTMLElement = this.tagFactory.createTagElement('#' + hashTagText, 'hashtag', hashTagText);
        return tag.outerHTML;
    }

    private highlightPings(commentModel: Record<string, any>, html: string): string {
        if (html.indexOf('@') !== -1) {
            for (const userId in commentModel.pings) {
                const fullName: string = commentModel.pings[userId];
                const pingText: string = '@' + fullName;
                html = html.replace(new RegExp(pingText, 'g'), this.createUserTag(pingText, userId));
            }
        }
        return html;
    }

    private createUserTag(pingText: string, userId: string): string {
        const tag: HTMLElement = this.tagFactory.createTagElement(pingText, 'ping', userId, {
            'data-user-id': userId
        });
        return tag.outerHTML;
    }
}
