export function isNil(value: any): value is undefined | null {
    return value === undefined || value === null;
}

export function isStringEmpty(value: string | undefined | null): boolean {
    return !isNil(value) && value!.trim().length !== 0;
}

// compares references only
export function areArraysEqual(first: any[], second: any[]): boolean {
    if (first.length !== second.length) { // Case: arrays are different sized
        return false;
    } else { // Case: arrays are equal sized
        first.sort();
        second.sort();

        for (let i: number = 0; i < first.length; i++) {
            if (first[i] !== second[i]) {
                return false;
            }
        }

        return true;
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop
 */
export function isMobileBrowser(): boolean {
    return /Mobile/i.test(window.navigator.userAgent);
}

export function normalizeSpaces(inputText: string): string {
    return inputText.replace(new RegExp('\u00a0', 'g'), ' ');   // Convert non-breaking spaces to regular spaces
}
