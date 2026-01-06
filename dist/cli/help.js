/**
 * Help text and usage information
 */
export function printHelp() {
    console.log(`
BuildSense - Intelligent Infrastructure Change Analysis

USAGE:
  buildsense snapshot [--out <file>]           Create project snapshot
  buildsense diff <before> <after> [--json]    Analyze changes with semantic insights

OPTIONS:
  --out, -o <file>    Output snapshot to specified file
  --json              Include detailed JSON report (default: semantic analysis only)
  --help, -h          Show this help message

EXAMPLES:
  buildsense snapshot --out before.json
  buildsense diff before.json after.json
  buildsense diff before.json after.json --json

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