export function isNil(value: any): value is undefined | null {
    return value === undefined || value === null;
}

export function isStringEmpty(value: string | undefined | null): boolean {
    return isNil(value) || value!.trim().length === 0;
}

// compares references only
export function areArraysEqual(first: any[], second: any[]): boolean {
    if (first.length !== second.length) { // Case: arrays have different size
        return false;
    } else { // Case: arrays have equal size
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

/**
 * Converts non-standard spaces to regular spaces and trims any spaces at both ends
 */
export function normalizeSpaces(inputText: string): string {
    return inputText.replace(/\s+/g, ' ')
        .trim();
}
