/**
 * Map diffing utilities
 */
/**
 * Compare two string->string maps and return added/removed/changed keys.
 */
export function diffMap(before, after) {
    const added = {};
    const removed = {};
    const changed = {};
    const beforeKeys = new Set(Object.keys(before));
    const afterKeys = new Set(Object.keys(after));
    for (const k of afterKeys) {
        if (!beforeKeys.has(k)) {
            added[k] = after[k];
        }
        else if (before[k] !== after[k]) {
            changed[k] = { from: before[k], to: after[k] };
        }
    }
    for (const k of beforeKeys) {
        if (!afterKeys.has(k)) {
            removed[k] = before[k];
        }
    }
    return { added, removed, changed };
}
//# sourceMappingURL=diffMap.js.map