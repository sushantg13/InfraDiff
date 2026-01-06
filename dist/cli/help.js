/**
 * Help text and usage information
 */
export function printHelp() {
    console.log(`
InfraDiff - Intelligent Infrastructure Change Analysis

USAGE:
  infradiff snapshot [--out <file>]           Create project snapshot
  infradiff diff <before> <after> [--json]    Analyze changes with semantic insights

OPTIONS:
  --out, -o <file>    Output snapshot to specified file
  --json              Include detailed JSON report (default: semantic analysis only)
  --help, -h          Show this help message

EXAMPLES:
  infradiff snapshot --out before.json
  infradiff diff before.json after.json
  infradiff diff before.json after.json --json

FEATURES:
  • Behavior-aware change detection with actionable recommendations
  • Package manager awareness (npm/yarn/pnpm) for context-specific commands
  • Framework-specific analysis (React Native with native module detection)
  • Intelligent grouping of related findings
  • Professional semantic output with optional detailed JSON reports

SUPPORTED FRAMEWORKS:
  • React Native (native modules, Metro/Babel config, dependency analysis)
  • Node.js (dependency tracking, environment variables)

For more information, visit: https://github.com/sushantg13/InfraDiff
        `);
}
//# sourceMappingURL=help.js.map