/**
 * Main snapshot building logic
 */
import { Snapshot } from '../types/snapshot.js';
import { scanPackageInfo } from './packageScanner.js';
import { scanEnvInfo } from './envScanner.js';

/**
 * Build a complete project snapshot
 */
export function buildSnapshot(projectRoot: string): Snapshot {
    // Scan package information
    const packageInfo = scanPackageInfo(projectRoot);
    
    // Scan environment information
    const envInfo = scanEnvInfo(projectRoot);

    // Build final snapshot object
    return {
        meta: {
            tool: "infradiff",
            version: "0.1.0",
            schemaVersion: "1",
            createdAt: new Date().toISOString(),
            projectRoot,
            projectType: "generic",
            packageManager: packageInfo.packageManagerInfo.packageManager,
            lockfilePath: packageInfo.packageManagerInfo.lockfilePath,
            frameworks: [], // Will be populated by command layer
        },
        files: {},
        env: envInfo,
        dependencies: packageInfo.dependencies,
        devDependencies: packageInfo.devDependencies,
    };
}
