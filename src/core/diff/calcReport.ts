/**
 * Report calculation logic
 */
import { Snapshot } from '../types/snapshot.js';
import { Report } from '../types/report.js';
import { diffMap } from './diffMap.js';
import { diffList } from './diffList.js';
import { diffFiles } from './diffFiles.js';
import { safeRecord } from '../../adapters/json.js';

/**
 * Calculate a diff report from two snapshots
 */
export function calcReport(
  before: Snapshot, 
  after: Snapshot, 
  meta: { beforePath: string; afterPath: string }
): Report {
  const depDiff = diffMap(safeRecord(before.dependencies), safeRecord(after.dependencies));
  const devDepDiff = diffMap(safeRecord(before.devDependencies), safeRecord(after.devDependencies));

  const envFilesDiff = diffList(
    before?.env?.envFiles ?? [],
    after?.env?.envFiles ?? []
  );

  const envKeysDiff = diffList(
    before?.env?.envKeys ?? [],
    after?.env?.envKeys ?? []
  );

  const filesDiff = diffFiles(
    before?.files ?? {},
    after?.files ?? {}
  );

  return {
    meta: {
      tool: "infradiff",
      version: "0.1.0",
      schemaVersion: "1",
      createdAt: new Date().toISOString(),
      before: meta.beforePath,
      after: meta.afterPath,
    },
    env: {
      envFiles: envFilesDiff,
      envKeys: envKeysDiff,
    },
    files: {
      changed: filesDiff,
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
      files: {
        changed: filesDiff.length,
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
