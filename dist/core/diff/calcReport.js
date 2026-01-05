import { diffMap } from './diffMap.js';
import { diffList } from './diffList.js';
import { safeRecord } from '../../adapters/json.js';
/**
 * Calculate a diff report from two snapshots
 */
export function calcReport(before, after, meta) {
    const depDiff = diffMap(safeRecord(before.dependencies), safeRecord(after.dependencies));
    const devDepDiff = diffMap(safeRecord(before.devDependencies), safeRecord(after.devDependencies));
    const envFilesDiff = diffList(before?.env?.envFiles ?? [], after?.env?.envFiles ?? []);
    const envKeysDiff = diffList(before?.env?.envKeys ?? [], after?.env?.envKeys ?? []);
    return {
        meta: {
            tool: "infradiff",
            version: "0.1.0",
            createdAt: new Date().toISOString(),
            before: meta.beforePath,
            after: meta.afterPath,
        },
        env: {
            envFiles: envFilesDiff,
            envKeys: envKeysDiff,
        },
        dependencies: depDiff,
        devDependencies: devDepDiff,
        summary: {
            envFiles: {
                added: envFilesDiff.added.length,
                removed: envFilesDiff.removed.length,
            },
            envKeys: {
                added: envKeysDiff.added.length,
                removed: envKeysDiff.removed.length,
            },
            dependencies: {
                added: Object.keys(depDiff.added).length,
                removed: Object.keys(depDiff.removed).length,
                changed: Object.keys(depDiff.changed).length,
            },
            devDependencies: {
                added: Object.keys(devDepDiff.added).length,
                removed: Object.keys(devDepDiff.removed).length,
                changed: Object.keys(devDepDiff.changed).length,
            },
        },
    };
}
//# sourceMappingURL=calcReport.js.map