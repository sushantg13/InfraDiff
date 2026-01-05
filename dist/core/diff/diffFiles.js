/**
 * Compare tracked files between two snapshots
 */
export function diffFiles(beforeFiles, afterFiles) {
    const fileDiffs = [];
    // Get all file paths from both snapshots
    const allPaths = new Set([
        ...Object.keys(beforeFiles),
        ...Object.keys(afterFiles)
    ]);
    for (const filePath of allPaths) {
        const beforeFile = beforeFiles[filePath];
        const afterFile = afterFiles[filePath];
        // File was added
        if (!beforeFile && afterFile?.exists) {
            fileDiffs.push({
                path: filePath,
                after: afterFile.sha256,
                change: "added"
            });
            continue;
        }
        // File was removed
        if (beforeFile?.exists && !afterFile?.exists) {
            fileDiffs.push({
                path: filePath,
                before: beforeFile.sha256,
                change: "removed"
            });
            continue;
        }
        // File was changed (both exist but different hashes)
        if (beforeFile?.exists && afterFile?.exists &&
            beforeFile.sha256 !== afterFile.sha256) {
            fileDiffs.push({
                path: filePath,
                before: beforeFile.sha256,
                after: afterFile.sha256,
                change: "changed"
            });
            continue;
        }
    }
    return fileDiffs;
}
//# sourceMappingURL=diffFiles.js.map