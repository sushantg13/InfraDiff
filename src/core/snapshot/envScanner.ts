/**
 * Environment file scanning utilities
 */
import * as fs from "node:fs";
import * as path from "node:path";

export interface EnvInfo {
  envFiles: string[];
  envKeys: string[];
  keyCount: number;
}

/**
 * Scan for environment files and extract keys (not values)
 */
export function scanEnvInfo(projectRoot: string): EnvInfo {
    const possibleEnvFiles = [
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.example",
    ];

    const envFilesFound: string[] = [];
    const envKeysSet = new Set<string>();

    for (const fileName of possibleEnvFiles) {
        const fullPath = path.join(projectRoot, fileName);

        if (!fs.existsSync(fullPath)) continue;

        envFilesFound.push(fileName);

        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const lines = fileContents.split(/\r?\n/);

        for (const line of lines) {
            const trimmed = line.trim();

            // Ignore empty lines and comments
            if (!trimmed || trimmed.startsWith("#")) continue;

            // Only parse KEY=value lines
            const idx = trimmed.indexOf("=");
            if (idx <= 0) continue;

            const key = trimmed.slice(0, idx).trim();
            if (key) envKeysSet.add(key);
        }
    }

    return {
        envFiles: envFilesFound.sort(),
        envKeys: Array.from(envKeysSet).sort(),
        keyCount: envKeysSet.size,
    };
}
