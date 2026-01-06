/**
 * Diff command handler
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { readJsonFile } from '../adapters/json.js';
import { calcReport } from '../core/diff/calcReport.js';
import { applyRules } from '../rules/engine.js';
import { renderHuman } from '../renderers/human.js';
import { renderJson } from '../renderers/json.js';
import { Snapshot } from '../core/types/snapshot.js';

export function handleDiffCommand(beforePath: string, afterPath: string, showJson: boolean = false): void {
  if (!beforePath || !afterPath) {
    console.log("diff requires two files: buildsense diff <before.json> <after.json>");
    process.exit(1);
  }

  const beforeAbs = path.resolve(process.cwd(), beforePath);
  const afterAbs = path.resolve(process.cwd(), afterPath);

  if (!fs.existsSync(beforeAbs)) {
    console.log(`Before snapshot not found: ${beforeAbs}`);
    process.exit(1);
  }
  if (!fs.existsSync(afterAbs)) {
    console.log(`After snapshot not found: ${afterAbs}`);
    process.exit(1);
  }

  const before = readJsonFile<Snapshot>(beforeAbs);
  const after = readJsonFile<Snapshot>(afterAbs);

  // Calculate diff report
  const report = calcReport(before, after, { beforePath: beforeAbs, afterPath: afterAbs });

  // Apply semantic rules
  const frameworks = after?.meta?.frameworks || ['generic'];
  const packageManager = after?.meta?.packageManager || 'unknown';
  const findings = applyRules(report, frameworks, packageManager);
  
  // Render human-readable findings (always)
  renderHuman(findings);

  // Render JSON report only if --json flag is provided
  if (showJson) {
    renderJson(report);
  }
}
