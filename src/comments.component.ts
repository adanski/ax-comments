import {WebComponent} from './web-component.interface';

export class CommentsComponent extends HTMLElement implements WebComponent {
    readonly shadowRoot!: ShadowRoot;
    private domRefFrame!: HTMLDivElement;

    constructor() {
        super();
        this.setupDom();
    }

    static get observedAttributes(): string[] {
        return ['videoid', 'playlistid'];
    }

    connectedCallback(): void {
        this.addEventListener('click', () => this.addIframe());
    }

    get videoTitle(): string {
        return this.getAttribute('videotitle') || 'Video';
    }

    set videoTitle(title: string) {
        this.setAttribute('videotitle', title);
    }

    /**
     * Define our shadowDOM for the component
     */
    private setupDom(): void {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                ${require('../css/jquery-comments.css')}
            </style>
            <div id="frame">
       
            </div>
        `;
        this.domRefFrame = this.shadowRoot.querySelector<HTMLDivElement>('#frame')!;
        this.domRefImg = {
            fallback: this.shadowRoot.querySelector('#fallbackPlaceholder')!,
            webp: this.shadowRoot.querySelector('#webpPlaceholder')!,
            jpeg: this.shadowRoot.querySelector('#jpegPlaceholder')!,
        };
        this.domRefPlayButton = this.shadowRoot.querySelector('.lty-playbtn')!;
    }

    /**
     * Lifecycle method that we use to listen for attribute changes to period
     * @param {*} name
     * @param {*} oldVal
     * @param {*} newVal
     */
    attributeChangedCallback(name: string, oldVal: any, newVal: any): void {
        switch (name) {
            case 'videoid':
            case 'playlistid': {
                if (oldVal !== newVal) {
                    this.setupComponent();

                    // if we have a previous iframe, remove it and the activated class
                    if (this.domRefFrame.classList.contains('lyt-activated')) {
                        this.domRefFrame.classList.remove('lyt-activated');
                        this.shadowRoot.querySelector('iframe')!.remove();
                        this.isIframeLoaded = false;
                    }
                }
                break;
            }
            default:
                break;
        }
    }

    /**
     * Add a <link rel={preload | preconnect} ...> to the head
     * @param {string} kind
     * @param {string} url
     * @param {string} as
     */
    private static addPrefetch(kind: string, url: string, as?: string): void {
        const linkElem = document.createElement('link');
        linkElem.rel = kind;
        linkElem.href = url;
        if (as) {
            linkElem.as = as;
        }
        linkElem.crossOrigin = 'true';
        document.head.append(linkElem);
    }
}

// register custom element
customElements.define('ax-comments', CommentsComponent);

declare global {
    interface HTMLElementTagNameMap {
        'ax-comments': CommentsComponent;
    }
}