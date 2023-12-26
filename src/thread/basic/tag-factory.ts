import {ButtonElement} from './button-element.js';
import {CommentsOptions} from '../../options/options.js';
import {OptionsProvider} from '../../common/provider.js';
import {AttachmentModel} from '../../options/models.js';

export class TagFactory {

    readonly #options: Required<CommentsOptions>;

    constructor(private readonly container: HTMLElement) {
        this.#options = OptionsProvider.get(container)!;
    }

    createTagElement(text: string, extraClasses: string, value: string, extraAttributes?: Record<string, any>): HTMLElement {
        const tagEl: HTMLInputElement = document.createElement('input');
        tagEl.classList.add('tag');
        tagEl.type = 'button';
        if (extraClasses) {
            tagEl.classList.add(extraClasses);
        }
        tagEl.value = text;
        tagEl.setAttribute('data-value', value);
        if (extraAttributes) {
            for (const attributeName in extraAttributes) {
                tagEl.setAttribute(attributeName, extraAttributes[attributeName]);
            }
        }

        return tagEl;
    }

    createAttachmentTagElement(attachment: AttachmentModel, onDeleted?: () => void): HTMLAnchorElement {
        // Tag element
        const attachmentTag: HTMLAnchorElement = document.createElement('a');
        attachmentTag.classList.add('tag', 'attachment');
        attachmentTag.target = '_blank';

        // Bind data
        attachmentTag.setAttribute('id', attachment.id);
        (attachmentTag as any).attachmentTagData = attachment;

        // File name
        let fileName: string = '';

        if (attachment.file instanceof File) { // Case: file is file object
            fileName = attachment.file.name;
        } else { // Case: file is URL
            const parts: string[] = attachment.file.split('/');
            fileName = parts[parts.length - 1];
            fileName = fileName.split('?')[0];
            fileName = decodeURIComponent(fileName);
        }

        // Attachment icon
        const attachmentIcon: HTMLElement = document.createElement('i');
        attachmentIcon.classList.add('fa', 'fa-paperclip');
        if (this.#options.attachmentIconURL.length) {
            attachmentIcon.style.backgroundImage = `url("${this.#options.attachmentIconURL}")`;
            attachmentIcon.classList.add('image');
        }

        // Append content
        attachmentTag.append(attachmentIcon, fileName);

        // Add delete button if deletable
        if (onDeleted) {
            attachmentTag.classList.add('deletable');

            // Append close button
            const closeButton: ButtonElement = ButtonElement.createCloseButton({
                inline: false,
                onclick: e => {
                    // Delete attachment tag
                    (e.currentTarget as HTMLElement).parentElement!.remove();
                    // Execute callback
                    onDeleted();
                }
            }, 'delete');
            attachmentTag.append(closeButton);
        } else { // Set href attribute if not deletable
            attachmentTag.setAttribute('href', attachment.file as string);
        }

        return attachmentTag;
    }

}
