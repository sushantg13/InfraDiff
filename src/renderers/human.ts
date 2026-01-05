/**
 * Human-readable output renderer
 */
import { Explanation } from '../rules/types.js';

/**
 * Render semantic analysis explanations in human-readable format
 */
export function renderHuman(explanations: Explanation[]): void {
  if (explanations.length === 0) return;

  console.log('\nSemantic Analysis:\n');
  console.log('='.repeat(60));
  
  for (const exp of explanations) {
    const icon = exp.severity === 'high' ? '🔴 [HIGH]' : 
                 exp.severity === 'medium' ? '🟡 [MEDIUM]' : '🟢 [LOW]';
    console.log(`\n${icon} ${exp.rule}`);
    console.log(`Severity: ${exp.severity.charAt(0).toUpperCase() + exp.severity.slice(1)} | Confidence: ${exp.confidence.charAt(0).toUpperCase() + exp.confidence.slice(1)} | Tags: [${exp.tags.join(', ')}]`);
    console.log(exp.message);
    console.log('-'.repeat(60));
  }
  console.log('\n');
}
