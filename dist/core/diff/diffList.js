/**
 * List diffing utilities
 */
/**
 * Compare arrays of strings and return added/removed.
 */
export function diffList(before, after) {
    const b = new Set(before);
    const a = new Set(after);
    const added = [];
    const removed = [];
    for (const x of a)
        if (!b.has(x))
            added.push(x);
    for (const x of b)
        if (!a.has(x))
            removed.push(x);
    added.sort();
    removed.sort();
    return { added, removed };
}
//# sourceMappingURL=diffList.js.map