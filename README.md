# BuildSense

Intelligent Infrastructure Change Analysis for React Native and Node.js projects.

BuildSense provides behavior-aware change detection that goes beyond simple dependency diffs. It analyzes your project changes and provides actionable recommendations with context-aware commands tailored to your package manager and framework.

BuildSense is designed for React Native developers who want fast, reliable answers to "what changed and what do I need to do now?" after dependency or configuration updates.

## Installation

### Using npx (Recommended)

No installation required. Run directly:

```bash
npx buildsense snapshot --out before.json
npx buildsense diff before.json after.json
```

### Global Installation

```bash
npm install -g buildsense
buildsense snapshot --out before.json
buildsense diff before.json after.json
```

## Quick Start

1. **Create a snapshot before making changes:**
   ```bash
   npx buildsense snapshot --out before.json
   ```

2. **Make your project changes** (add dependencies, modify configs, etc.)

3. **Create a snapshot after changes:**
   ```bash
   npx buildsense snapshot --out after.json
   ```

4. **Analyze the differences:**
   ```bash
   npx buildsense diff before.json after.json
   ```

## Simple, Real-World Workflows

BuildSense is designed to answer one question quickly: **"What changed, and what do I need to do now?"**

Here are two common scenarios where BuildSense eliminates guesswork.

### Scenario 1: Adding a React Native Feature (Solo Developer)

You're building a React Native app and decide to add map functionality. You install a new dependency:

```bash
npm install react-native-maps
```

After the install, the app no longer builds on iOS, Android crashes on launch, and Metro errors don't clearly explain why.

**With BuildSense:**

Before installing the package:
```bash
npx buildsense snapshot --out before.json
```

After installing:
```bash
npx buildsense snapshot --out after.json
npx buildsense diff before.json after.json
```

**BuildSense shows exactly what changed:**

```
🟡 [MEDIUM] Dependencies Updated
Severity: medium | Confidence: high | Tags: [dependency, lockfile, summary]
   Action Required:
   • Run 'npm install' to sync dependency tree
   • Native modules detected - see specific native module recommendations

🔴 [HIGH] Native Module Added
Severity: high | Confidence: high | Tags: [dependency, native, ios, android]
Native module added: react-native-maps
   Action Required:
   • Run 'cd ios && pod install'
   • Rebuild Android project
   • Test on both iOS and Android platforms
```

BuildSense automatically detects you're using npm and provides the correct install and rebuild steps. Instead of guessing or searching through docs, you immediately know the next steps to fix the issue.

### Scenario 2: Team Collaboration ("It Works on My Machine")

You're working on a React Native project with a team. Another developer updates dependencies and modifies Metro configuration. When you pull the latest code, the app no longer runs locally.

**A practical team workflow:**

Keep snapshots in your project (they're safe to share - no source code or secrets):

```
snapshots/
  before-maps-feature.json
  after-maps-feature.json
```

Before making structural changes:
```bash
npx buildsense snapshot --out snapshots/before-maps-feature.json
```

After the changes:
```bash
npx buildsense snapshot --out snapshots/after-maps-feature.json
```

When someone's environment breaks, they can compare:
```bash
npx buildsense diff snapshots/before-maps-feature.json snapshots/after-maps-feature.json
```

**BuildSense highlights exactly what matters:**

```
🟡 [MEDIUM] Metro Config File Changed
File modified: metro.config.js
   Action Required:
   • Restart Metro: 'npx react-native start --reset-cache'
   • If issues persist: delete node_modules and run 'npm install'

🔴 [HIGH] Native Module Added (2)
• react-native-gesture-handler
• react-native-maps
   Action Required:
   • Run 'cd ios && pod install'
   • Rebuild Android project
```

Instead of guessing what broke, you immediately see which installs, rebuilds, or cache resets are required. This removes guesswork and avoids long Slack threads trying to reconstruct what changed.

**Privacy guarantee:** Snapshots are JSON-only and contain no source code, secrets, or environment values - they're safe to share with your team.

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
- Groups related findings to reduce noise and improve readability
- Consolidates similar changes into single, comprehensive reports
- Prioritizes findings by severity and impact

### Framework-Specific Rules
- **React Native**: Native module detection, Metro/Babel config analysis
- **Node.js**: Dependency tracking, environment variable changes
- Extensible architecture for additional frameworks

## Commands

### `snapshot`

Creates a snapshot of your project's current state.

```bash
npx buildsense snapshot [--out <file>]
```

**Options:**
- `--out, -o <file>`: Output snapshot to specified file (default: prints to stdout)

**Examples:**
```bash
npx buildsense snapshot --out before.json
npx buildsense snapshot > snapshot.json
```

### `diff`

Analyzes changes between two snapshots and provides semantic insights.

```bash
npx buildsense diff <before> <after> [--json]
```

**Options:**
- `--json`: Include detailed JSON report (default: semantic analysis only)

**Examples:**
```bash
npx buildsense diff before.json after.json
npx buildsense diff before.json after.json --json
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
- Environment variable key change detection (values are never read)
- Package manager detection and appropriate commands
- Lockfile analysis

## Security & Privacy

### Local Processing
- All analysis happens locally on your machine
- No data is transmitted to external servers
- Complete privacy and security for your project information

### File Integrity
- Uses SHA256 hashing for reliable change detection
- Tracks only configuration files and dependency manifests
- Never stores or processes sensitive data like API keys or secrets

### What Gets Tracked
- Package manifests (package.json, lockfiles)
- Configuration files (Metro, Babel, TypeScript configs)
- Build configuration files (iOS Podfile, Android Gradle)
- Environment file names only (not contents)

### What Gets Ignored
- Source code files
- Environment variable values
- Secrets and sensitive data
- Build artifacts and generated files

## How It Works

1. **Project Detection**: Automatically identifies your project type and package manager
2. **File Tracking**: Uses SHA256 hashing to monitor key configuration files and dependency manifests
3. **Change Analysis**: Compares file hashes and dependency trees to identify meaningful changes
4. **Rule Engine**: Applies framework-specific rules to generate insights
5. **Contextual Recommendations**: Provides actionable next steps based on your setup and package manager

## Roadmap

### Current Support
- **React Native**: Full native module detection, Metro/Babel analysis
- **Node.js**: Dependency tracking, environment monitoring

### Coming Soon
- **React**: Component library changes, build tool updates
- **Vue.js**: Vue CLI and Vite configuration analysis
- **Angular**: Angular CLI and workspace configuration tracking
- **Additional frameworks**: Based on community feedback and usage patterns

## Requirements

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Sushant Gupta**
- Email: guptasushant754@gmail.com
- GitHub: [@sushantg13](https://github.com/sushantg13)

## License

MIT License - see LICENSE file for details.

## Repository

https://github.com/sushantg13/InfraDiff
