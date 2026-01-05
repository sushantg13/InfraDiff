/**
 * Command line argument parsing
 */
/**
 * Parse command line arguments
 * - Supports: infradiff snapshot --out before.json
 * - Supports: infradiff diff before.json after.json
 */
export function parseArgs(argv) {
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
//# sourceMappingURL=parseArgs.js.map