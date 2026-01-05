#!/usr/bin/env node
// Node built-in modules for file system access and path handling
import * as fs from "node:fs";
import * as path from "node:path";
import { detectProject } from './detectors/index.js';
import { applyRules } from './rules/engine.js';
/**
 * Tiny arg helper:
 * - Supports: infradiff snapshot --out before.json
 * - Supports: infradiff diff before.json after.json
 */
function parseArgs(argv) {
    const command = argv[2]; // node dist/cli.js <command>
    const rest = argv.slice(3);
    let out;
    const positional = [];
    for (let i = 0; i < rest.length; i++) {
        const a = rest[i];
        if (a === "--out" || a === "-o") {
            out = rest[i + 1];
            i++; // skip next
            continue;
        }
        positional.push(a);
    }
    return { command, out, positional };
}
function printHelp() {
    console.log(`
        infradiff

        Commands:
        snapshot [--out file.json]
        diff <before.json> <after.json>

        Examples:
        infradiff snapshot --out before.json
        infradiff snapshot --out after.json
        infradiff diff before.json after.json
        `);
}
function readJsonFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}
function safeRecord(value) {
    if (!value || typeof value !== "object")
        return {};
    return value;
}
/**
 * Compare two string->string maps and return added/removed/changed keys.
 */
function diffMap(before, after) {
    const added = {};
    const removed = {};
    const changed = {};
    const beforeKeys = new Set(Object.keys(before));
    const afterKeys = new Set(Object.keys(after));
    for (const k of afterKeys) {
        if (!beforeKeys.has(k)) {
            added[k] = after[k];
        }
        else if (before[k] !== after[k]) {
            changed[k] = { from: before[k], to: after[k] };
        }
    }
    for (const k of beforeKeys) {
        if (!afterKeys.has(k)) {
            removed[k] = before[k];
        }
    }
    return { added, removed, changed };
}
/**
 * Compare arrays of strings and return added/removed.
 */
function diffList(before, after) {
    const b = new Set(before);
    const a = new Set(after);
    const added = [];
    const removed = [];
    for (const x of a)
        if (!b.has(x))
            added.push(x);
    for (const x of b)
        if (!a.has(x))
            removed.push(x);
    added.sort();
    removed.sort();
    return { added, removed };
}
/**
 * Build a project snapshot:
 * - dependencies & devDependencies from package.json
 * - env file names found
 * - env keys found (not values)
 */
function buildSnapshot(projectRoot) {
    // 1) Read dependencies from package.json (if present)
    const packageJsonPath = path.join(projectRoot, "package.json");
    let dependencies = {};
    let devDependencies = {};
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = readJsonFile(packageJsonPath);
        dependencies = safeRecord(packageJson.dependencies);
        devDependencies = safeRecord(packageJson.devDependencies);
    }
    // 2) Discover environment files and keys (no values stored)
    const possibleEnvFiles = [
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.example",
    ];
    const envFilesFound = [];
    const envKeysSet = new Set();
    for (const fileName of possibleEnvFiles) {
        const fullPath = path.join(projectRoot, fileName);
        if (!fs.existsSync(fullPath))
            continue;
        envFilesFound.push(fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const lines = fileContents.split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            // Ignore empty lines and comments
            if (!trimmed || trimmed.startsWith("#"))
                continue;
            // Only parse KEY=value lines
            const idx = trimmed.indexOf("=");
            if (idx <= 0)
                continue;
            const key = trimmed.slice(0, idx).trim();
            if (key)
                envKeysSet.add(key);
        }
    }
    // 3) Build final snapshot object
    return {
        meta: {
            tool: "infradiff",
            version: "0.1.0",
            createdAt: new Date().toISOString(),
            projectRoot,
        },
        env: {
            envFiles: envFilesFound.sort(),
            envKeys: Array.from(envKeysSet).sort(),
            keyCount: envKeysSet.size,
        },
        dependencies,
        devDependencies,
    };
}
/**
 * Main entry
 */
const { command, out, positional } = parseArgs(process.argv);
if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
}
if (command === "snapshot") {
    const projectRoot = process.cwd();
    // Detect project type
    const projectInfo = detectProject(projectRoot);
    console.log(`Detected: ${projectInfo.frameworks.join(', ')}`);
    const snapshot = buildSnapshot(projectRoot);
    // Store detected frameworks in snapshot metadata
    snapshot.meta.frameworks = projectInfo.frameworks;
    // Default output name if none provided
    const outputPath = path.resolve(projectRoot, out || "infradiff.snapshot.json");
    // Save snapshot to disk
    fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), "utf-8");
    console.log(`Snapshot saved to ${outputPath}`);
    process.exit(0);
}
if (command === "diff") {
    const beforePath = positional[0];
    const afterPath = positional[1];
    if (!beforePath || !afterPath) {
        console.log("diff requires two files: infradiff diff <before.json> <after.json>");
        process.exit(1);
    }
    const beforeAbs = path.resolve(process.cwd(), beforePath);
    const afterAbs = path.resolve(process.cwd(), afterPath);
    if (!fs.existsSync(beforeAbs)) {
        console.log(`Before snapshot not found: ${beforeAbs}`);
        process.exit(1);
    }
    if (!fs.existsSync(afterAbs)) {
        console.log(`After snapshot not found: ${afterAbs}`);
        process.exit(1);
    }
    const before = readJsonFile(beforeAbs);
    const after = readJsonFile(afterAbs);
    const depDiff = diffMap(safeRecord(before.dependencies), safeRecord(after.dependencies));
    const devDepDiff = diffMap(safeRecord(before.devDependencies), safeRecord(after.devDependencies));
    const envFilesDiff = diffList((before?.env?.envFiles ?? []), (after?.env?.envFiles ?? []));
    const envKeysDiff = diffList((before?.env?.envKeys ?? []), (after?.env?.envKeys ?? []));
    const report = {
        meta: {
            tool: "infradiff",
            version: "0.1.0",
            createdAt: new Date().toISOString(),
            before: beforeAbs,
            after: afterAbs,
        },
        env: {
            envFiles: envFilesDiff,
            envKeys: envKeysDiff,
        },
        dependencies: depDiff,
        devDependencies: devDepDiff,
        summary: {
            envFiles: {
                added: envFilesDiff.added.length,
                removed: envFilesDiff.removed.length,
            },
            envKeys: {
                added: envKeysDiff.added.length,
                removed: envKeysDiff.removed.length,
            },
            dependencies: {
                added: Object.keys(depDiff.added).length,
                removed: Object.keys(depDiff.removed).length,
                changed: Object.keys(depDiff.changed).length,
            },
            devDependencies: {
                added: Object.keys(devDepDiff.added).length,
                removed: Object.keys(devDepDiff.removed).length,
                changed: Object.keys(devDepDiff.changed).length,
            },
        },
    };
    // Apply semantic rules
    const frameworks = after?.meta?.frameworks || ['generic'];
    const explanations = applyRules(report, frameworks);
    // Print human-readable explanations first
    if (explanations.length > 0) {
        console.log('\nSemantic Analysis:\n');
        console.log('='.repeat(60));
        for (const exp of explanations) {
            const icon = exp.severity === 'high' ? '🔴 [HIGH]' :
                exp.severity === 'medium' ? '🟡 [MEDIUM]' : '🟢 [LOW]';
            console.log(`\n${icon} ${exp.rule}`);
            console.log(`Severity: ${exp.severity.charAt(0).toUpperCase() + exp.severity.slice(1)}`);
            console.log(exp.message);
            console.log('-'.repeat(60));
        }
        console.log('\n');
    }
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
}
// Fallback for unknown commands
console.log(`Unknown command: ${command}. Try 'infradiff --help'`);
process.exit(1);
//# sourceMappingURL=cli.js.map