import { scanPackageInfo } from './packageScanner.js';
import { scanEnvInfo } from './envScanner.js';
import { scanTrackedFiles } from './trackedFiles.js';
/**
 * Build a complete project snapshot
 */
export function buildSnapshot(projectRoot, frameworks = []) {
    // Scan package information
    const packageInfo = scanPackageInfo(projectRoot);
    // Scan environment information
    const envInfo = scanEnvInfo(projectRoot);
    // Scan tracked files based on project frameworks
    const trackedFiles = scanTrackedFiles(projectRoot, frameworks);
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
            frameworks: frameworks,
        },
        files: trackedFiles,
        env: envInfo,
        dependencies: packageInfo.dependencies,
        devDependencies: packageInfo.devDependencies,
    };
}
//# sourceMappingURL=buildSnapshot.js.map