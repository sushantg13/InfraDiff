#!/usr/bin/env node

// Node built-in modules for file system access and path handling
import * as fs from "node:fs";
import * as path from "node:path";

// Second command passed to the command line
const command = process.argv[2];

if (command === "snapshot") {

  // gets the absolute path of the current project (where the CLI is run)
  const projectRoot = process.cwd();

  //1. Read dependencies from package.json

  const packageJsonPath = path.join(projectRoot, "package.json");
  let dependencies: Record<string, string> = {};

  // If package.json exists, read and extract dependencies
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    );

    dependencies = packageJson.dependencies || {};
  }

  //2. Discover environment files and keys

  // Common env file patterns used in JS / React / React Native projects
  const possibleEnvFiles = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.example",
  ];

  const envFilesFound: string[] = [];
  const envKeysSet = new Set<string>(); // Set avoids duplicate keys

  for (const fileName of possibleEnvFiles) {
    const fullPath = path.join(projectRoot, fileName);

    // Only process env files that actually exist
    if (fs.existsSync(fullPath)) {
      envFilesFound.push(fileName);

      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const lines = fileContents.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();

        // Ignore comments and empty lines
        if (!trimmed || trimmed.startsWith("#")) continue;

        // Extract KEY from KEY=value
        const [key] = trimmed.split("=");

        if (key) {
          envKeysSet.add(key);
        }
      }
    }
  }

  

  // 3. Building the Snapshot object
  const snapshot = {
    meta: {
      tool: "infradiff",
      version: "0.1.0",
      createdAt: new Date().toISOString(),
      projectRoot,
    },

    // Environment configuration summary (no values stored)
    env: {
      envFiles: envFilesFound,
      envKeys: Array.from(envKeysSet),
      keyCount: envKeysSet.size,
    },

    // Runtime dependencies from package.json
    dependencies,
  };

    // 4. Save snapshot to disk
     

  const outputPath = path.join(projectRoot, "infradiff.snapshot.json");

  fs.writeFileSync(
    outputPath,
    JSON.stringify(snapshot, null, 2),
    "utf-8"
  );

  //print snapshot to console for immediate feedback
  console.log(JSON.stringify(snapshot, null, 2));

} else {
  // Fallback for unknown commands
  console.log("Unknown command: Try 'snapshot'");
}
