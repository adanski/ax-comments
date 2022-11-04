import {CommentsOptions} from './api.js';
import {CommentsById} from './comments-by-id.js';

export class OptionsProvider {
    private static readonly OPTIONS: WeakMap<HTMLElement, CommentsOptions> = new WeakMap();

    static set(container: HTMLElement, options: CommentsOptions): void {
        if (this.OPTIONS.has(container)) {
            console.warn('[OptionsProvider] Options reference cannot be changed after initialization');
        }
        this.OPTIONS.set(container, options);
    }

    static get(container: HTMLElement): CommentsOptions | undefined {
        return this.OPTIONS.get(container);
    }
}

export class CommentsProvider {

    private static readonly COMMENTS: WeakMap<HTMLElement, CommentsById> = new WeakMap();

    static set(container: HTMLElement, commentsById: CommentsById): void {
        if (this.COMMENTS.has(container)) {
            console.warn('[CommentsProvider] Comments reference cannot be changed after initialization');
        }
        this.COMMENTS.set(container, commentsById);
    }

    static get(container: HTMLElement): CommentsById | undefined {
        return this.COMMENTS.get(container);
    }
}

export class ServiceProvider {

    private static readonly SERVICES: WeakMap<HTMLElement, object[]> = new WeakMap();

    static get<T extends object>(container: HTMLElement, ctor: ServiceConstructor<T>): T {
        if (this.SERVICES.has(container)) {
            const instances: object[] = this.SERVICES.get(container)!;
            for (let i = 0; i < instances.length; i++) {
                if (instances[i] instanceof ctor) {
                    return instances[i] as T;
                }
            }
            const instance: T = this.instantiate(container, ctor);
            instances.push(instance);
            return instance;
        } else {
            const instance: T = this.instantiate(container, ctor);
            this.SERVICES.set(container, [instance]);
            return instance;
        }
    }

    private static instantiate<T extends object>(container: HTMLElement, ctor: ServiceConstructor<T>): T {
        return new ctor(container);
    }
}

type ServiceConstructor<T> = new (container: HTMLElement) => T;
