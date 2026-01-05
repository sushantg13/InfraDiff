/**
 * Human-readable output renderer
 */
import { Finding } from '../rules/types.js';

export function renderHuman(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log("No semantic issues detected.");
    return;
  }

  console.log("\nSemantic Analysis:\n");
  console.log("============================================================\n");

  for (const finding of findings) {
    const severityIcon = getSeverityIcon(finding.severity);
    const severityLabel = finding.severity.toUpperCase();
    
    console.log(`${severityIcon} [${severityLabel}] ${finding.title}`);
    console.log(`Severity: ${finding.severity} | Confidence: ${finding.confidence} | Tags: [${finding.tags.join(', ')}]`);
    
    // Render data if present
    if (finding.data && Object.keys(finding.data).length > 0) {
      if (finding.groupKey === 'native-module-added' && finding.data.items) {
        // Special handling for grouped native modules
        const modules = finding.data.items.map((item: any) => `• ${item.module}`).join('\n');
        console.log(modules);
      } else if (finding.data.module) {
        // Single native module
        console.log(`Native module added: ${finding.data.module}`);
      } else if (finding.data.from && finding.data.to) {
        // Version change
        console.log(`${finding.data.from} → ${finding.data.to}`);
      } else if (finding.data.file) {
        // File change
        console.log(`File modified: ${finding.data.file}`);
      }
    }
    
    // Render recommendations
    if (finding.recommendations.length > 0) {
      console.log("   Action Required:");
      for (const rec of finding.recommendations) {
        console.log(`   • ${rec}`);
      }
    }
    
  console.log("------------------------------------------------------------\n");
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
}
