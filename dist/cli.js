#!/usr/bin/env node
/**
 * InfraDiff CLI - Main entry point
 * Clean, minimal orchestrator that delegates to command handlers
 */
import { parseArgs } from './cli/parseArgs.js';
import { printHelp } from './cli/help.js';
import { handleSnapshotCommand } from './commands/snapshotCommand.js';
import { handleDiffCommand } from './commands/diffCommand.js';
/**
 * Main entry point
 */
const { command, out, json, positional } = parseArgs(process.argv);
if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
}
if (command === "snapshot") {
    const projectRoot = process.cwd();
    handleSnapshotCommand(projectRoot, out);
    process.exit(0);
}
if (command === "diff") {
    const beforePath = positional[0];
    const afterPath = positional[1];
    handleDiffCommand(beforePath, afterPath, json);
    process.exit(0);
}
// Fallback for unknown commands
console.log(`Unknown command: ${command}. Try 'infradiff --help'`);
process.exit(1);
//# sourceMappingURL=cli.js.map