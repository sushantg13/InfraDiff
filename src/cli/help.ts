/**
 * Help text and usage information
 */

export function printHelp(): void {
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
