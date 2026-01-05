/**
 * Help text and usage information
 */
export function printHelp() {
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
//# sourceMappingURL=help.js.map