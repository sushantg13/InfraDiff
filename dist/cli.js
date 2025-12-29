#!/usr/bin/env node
import * as fs from "node:fs";
import * as path from "node:path";
const command = process.argv[2];
if (command === "snapshot") {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let dependencies = {};
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        dependencies = packageJson.dependencies || {};
    }
    const snapshot = {
        meta: {
            tool: "infradiff",
            version: "0.1.0",
            createdAt: new Date().toISOString(),
            projectRoot: process.cwd(),
        },
        env: {},
        dependencies, // ✅ this is correct
    };
    console.log(JSON.stringify(snapshot, null, 2));
}
else {
    console.log("Unknown command: Try 'snapshot'");
}
//# sourceMappingURL=cli.js.map