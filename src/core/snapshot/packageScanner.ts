/**
 * Package manager detection and package.json scanning
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { readJsonFile, safeRecord } from '../../adapters/json.js';

export interface PackageManagerInfo {
  packageManager: string;
  lockfilePath?: string;
}

export interface PackageInfo {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  packageManagerInfo: PackageManagerInfo;
}

/**
 * Detect package manager based on lockfile presence
 */
export function detectPackageManager(projectRoot: string): PackageManagerInfo {
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
export function scanPackageInfo(projectRoot: string): PackageInfo {
    const packageJsonPath = path.join(projectRoot, "package.json");

    let dependencies: Record<string, string> = {};
    let devDependencies: Record<string, string> = {};

    if (fs.existsSync(packageJsonPath)) {
        const packageJson = readJsonFile<any>(packageJsonPath);
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
