/**
 * List diffing utilities
 */

/**
 * Compare arrays of strings and return added/removed.
 */
export function diffList(before: string[], after: string[]) {
    const b = new Set(before);
    const a = new Set(after);

    const added: string[] = [];
    const removed: string[] = [];

    for (const x of a) if (!b.has(x)) added.push(x);
    for (const x of b) if (!a.has(x)) removed.push(x);

    added.sort();
    removed.sort();

    return { added, removed };
}
