# InfraDiff

Intelligent Infrastructure Change Analysis for React Native and Node.js projects.

InfraDiff provides behavior-aware change detection that goes beyond simple dependency diffs. It analyzes your project changes and provides actionable recommendations with context-aware commands tailored to your package manager and framework.

## Installation

### Using npx (Recommended)

No installation required. Run directly:

```bash
npx infradiff snapshot --out before.json
npx infradiff diff before.json after.json
```

### Global Installation

```bash
npm install -g infradiff
infradiff snapshot --out before.json
infradiff diff before.json after.json
```

## Quick Start

1. **Create a snapshot before making changes:**
   ```bash
   npx infradiff snapshot --out before.json
   ```

2. **Make your project changes** (add dependencies, modify configs, etc.)

3. **Create a snapshot after changes:**
   ```bash
   npx infradiff snapshot --out after.json
   ```

4. **Analyze the differences:**
   ```bash
   npx infradiff diff before.json after.json
   ```

## Features

### Behavior-Aware Analysis
- Detects native module additions with platform-specific guidance
- Identifies configuration changes that require cache resets
- Provides context-aware recommendations based on your changes

### Package Manager Awareness
- Automatically detects your package manager (npm, yarn, pnpm)
- Tailors install commands and recommendations accordingly
- Provides both development and CI-specific guidance

### Intelligent Grouping
- Groups related findings to reduce noise
- Shows "Native Module Added (2)" instead of duplicate entries
- Prioritizes findings by severity and impact

### Framework-Specific Rules
- **React Native**: Native module detection, Metro/Babel config analysis
- **Node.js**: Dependency tracking, environment variable changes
- Extensible architecture for additional frameworks

## Commands

### `snapshot`

Creates a snapshot of your project's current state.

```bash
npx infradiff snapshot [--out <file>]
```

**Options:**
- `--out, -o <file>`: Output snapshot to specified file (default: prints to stdout)

**Examples:**
```bash
npx infradiff snapshot --out before.json
npx infradiff snapshot > snapshot.json
```

### `diff`

Analyzes changes between two snapshots and provides semantic insights.

```bash
npx infradiff diff <before> <after> [--json]
```

**Options:**
- `--json`: Include detailed JSON report (default: semantic analysis only)

**Examples:**
```bash
npx infradiff diff before.json after.json
npx infradiff diff before.json after.json --json
```

## Example Output

### React Native Native Module Detection

```
Semantic Analysis:

============================================================

Dependencies Updated
Severity: medium | Confidence: high | Tags: [dependency, lockfile, summary]
   Action Required:
   • Run 'npm install' to sync dependency tree
   • Native modules detected - see specific native module recommendations
------------------------------------------------------------

Native Module Added (2)
Severity: high | Confidence: high | Tags: [dependency, native, ios, android]
• react-native-gesture-handler
• react-native-maps
   Action Required:
   • Run 'cd ios && pod install'
   • Rebuild Android project
   • Test on both iOS and Android platforms
------------------------------------------------------------

Metro Config File Changed
Severity: medium | Confidence: high | Tags: [file, config, bundler]
File modified: metro.config.js
   Action Required:
   • Restart Metro: 'npx react-native start --reset-cache'
   • If issues persist: delete node_modules and run 'npm install'
   • Test bundling behavior
------------------------------------------------------------
```

## Supported Project Types

### React Native
- Native module detection and platform-specific guidance
- Metro bundler configuration analysis
- Babel configuration change detection
- iOS Podfile and Android Gradle file tracking
- Package manager aware commands

### Node.js
- Dependency and devDependency tracking
- Environment variable change detection
- Package manager detection and appropriate commands
- Lockfile analysis

## How It Works

1. **Project Detection**: Automatically identifies your project type and package manager
2. **File Tracking**: Monitors key configuration files and dependency manifests
3. **Change Analysis**: Compares snapshots to identify meaningful changes
4. **Rule Engine**: Applies framework-specific rules to generate insights
5. **Contextual Recommendations**: Provides actionable next steps based on your setup

## Requirements

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Repository

https://github.com/sushantg13/InfraDiff
