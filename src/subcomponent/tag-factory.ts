import $ from 'cash-dom';
import {ButtonService} from './button-service';
import {CommentsOptions} from '../comments-options';
import {OptionsProvider, ServiceProvider} from '../provider';

export class TagFactory {

    private readonly options: CommentsOptions;
    private readonly buttonService: ButtonService;

    constructor(private readonly container: HTMLDivElement) {
        this.options = OptionsProvider.get(container)!;
        this.buttonService = ServiceProvider.get(container, ButtonService);
    }

    createTagElement(text: string, extraClasses: string, value: string, extraAttributes?: Record<string, any>): HTMLElement {
        const tagEl: HTMLInputElement = document.createElement('input');
        tagEl.classList.add('tag');
        tagEl.type = 'button';
        tagEl.setAttribute('data-role', 'none');
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

    createAttachmentTagElement(attachment: Record<string, any>, deletable?: boolean): HTMLAnchorElement {
        // Tag element
        const attachmentTag: HTMLAnchorElement = document.createElement('a');
        attachmentTag.classList.add('tag', 'attachment');
        attachmentTag.target = '_blank';

        // Set href attribute if not deletable
        if (!deletable) {
            attachmentTag.setAttribute('href', attachment.file);
        }

        // Bind data
        $(attachmentTag).data({
            id: attachment.id,
            mime_type: attachment.mime_type,
            file: attachment.file,
        });

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
        if (this.options.attachmentIconURL.length) {
            attachmentIcon.style.backgroundImage = `url("${this.options.attachmentIconURL}")`;
            attachmentIcon.classList.add('image');
        }

        // Append content
        attachmentTag.append(attachmentIcon, fileName);

        // Add delete button if deletable
        if (deletable) {
            attachmentTag.classList.add('deletable');

            // Append close button
            const closeButton: HTMLElement = this.buttonService.createCloseButton('delete');
            attachmentTag.append(closeButton);
        }

        return attachmentTag;
    }
}
