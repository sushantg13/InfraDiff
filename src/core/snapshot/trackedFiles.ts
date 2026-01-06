/**
 * Tracked files configuration for different project types
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { TrackedFile } from '../types/snapshot.js';
import { sha256File, getFileStats } from '../../adapters/hash.js';

/**
 * React Native files to track
 */
export const RN_TRACKED_FILES = [
    'package.json',
    'yarn.lock',
    'package-lock.json',
    'pnpm-lock.yaml',
    'metro.config.js',
    'babel.config.js',
    'tsconfig.json',
    'ios/Podfile',
    'ios/Podfile.lock',
    'android/build.gradle',
    'android/app/build.gradle',
    'android/gradle.properties',
    'app.json',
    'app.config.js'
];

/**
 * Directories and files to ignore when tracking
 */
export const IGNORE_PATTERNS = [
    'node_modules/',
    'ios/Pods/',
    'android/.gradle/',
    'android/app/build/',
    'ios/build/',
    '.git/',
    'dist/',
    'build/'
];

/**
 * Check if a file path should be ignored
 */
export function shouldIgnoreFile(filePath: string): boolean {
    return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Get tracked files for a project based on frameworks
 */
export function getTrackedFilesForProject(frameworks: string[]): string[] {
    if (frameworks.includes('react-native')) {
        return RN_TRACKED_FILES;
    }
    
    // Default files for any project
    return [
        'package.json',
        'yarn.lock',
        'package-lock.json',
        'pnpm-lock.yaml'
    ];
}

/**
 * Scan and track files in a project directory
 */
export function scanTrackedFiles(projectRoot: string, frameworks: string[]): Record<string, TrackedFile> {
    const filesToTrack = getTrackedFilesForProject(frameworks);
    const trackedFiles: Record<string, TrackedFile> = {};

    for (const relativePath of filesToTrack) {
        const fullPath = path.join(projectRoot, relativePath);
        
        // Skip if file should be ignored
        if (shouldIgnoreFile(relativePath)) {
            continue;
        }

        const trackedFile: TrackedFile = {
            path: relativePath,
            exists: fs.existsSync(fullPath)
        };

        // If file exists, get hash and stats
        if (trackedFile.exists) {
            try {
                trackedFile.sha256 = sha256File(fullPath);
                const stats = getFileStats(fullPath);
                trackedFile.size = stats.size;
                trackedFile.mtimeMs = stats.mtimeMs;
            } catch (error) {
                // If we can't read the file, just mark it as existing
                console.warn(`Warning: Could not hash file ${relativePath}: ${error}`);
            }
        }

        trackedFiles[relativePath] = trackedFile;
    }

    return trackedFiles;
}
