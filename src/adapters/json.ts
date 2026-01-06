/**
 * JSON file operations adapter
 */
import * as fs from "node:fs";

export function readJsonFile<T = any>(filePath: string): T {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

export function writeJsonFile(filePath: string, data: any): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function safeRecord(value: any): Record<string, string> {
    if (!value || typeof value !== "object") return {};
    return value as Record<string, string>;
}
