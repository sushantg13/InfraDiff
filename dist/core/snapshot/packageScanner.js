/**
 * Package manager detection and package.json scanning
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { readJsonFile, safeRecord } from '../../adapters/json.js';
/**
 * Detect package manager based on lockfile presence
 */
export function detectPackageManager(projectRoot) {
    const lockfiles = [
        { file: "yarn.lock", manager: "yarn" },
        { file: "package-lock.json", manager: "npm" },
        { file: "pnpm-lock.yaml", manager: "pnpm" }
    ];
    for (const { file, manager } of lockfiles) {
        const lockfilePath = path.join(projectRoot, file);
        if (fs.existsSync(lockfilePath)) {
            return { packageManager: manager, lockfilePath: file };
        }
    }
    return { packageManager: "unknown" };
}
/**
 * Scan package.json for dependencies and detect package manager
 */
export function scanPackageInfo(projectRoot) {
    const packageJsonPath = path.join(projectRoot, "package.json");
    let dependencies = {};
    let devDependencies = {};
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = readJsonFile(packageJsonPath);
        dependencies = safeRecord(packageJson.dependencies);
        devDependencies = safeRecord(packageJson.devDependencies);
    }
    const packageManagerInfo = detectPackageManager(projectRoot);
    return {
        dependencies,
        devDependencies,
        packageManagerInfo
    };
}
//# sourceMappingURL=packageScanner.js.map