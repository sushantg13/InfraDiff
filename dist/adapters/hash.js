/**
 * File hashing utilities
 */
import * as fs from "node:fs";
import * as crypto from "node:crypto";
/**
 * Calculate SHA256 hash of a file
 */
export function sha256File(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
/**
 * Get file stats (size and modification time)
 */
export function getFileStats(filePath) {
    const stats = fs.statSync(filePath);
    return {
        size: stats.size,
        mtimeMs: stats.mtimeMs
    };
}
//# sourceMappingURL=hash.js.map