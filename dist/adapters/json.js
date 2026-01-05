/**
 * JSON file operations adapter
 */
import * as fs from "node:fs";
export function readJsonFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}
export function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
export function safeRecord(value) {
    if (!value || typeof value !== "object")
        return {};
    return value;
}
//# sourceMappingURL=json.js.map