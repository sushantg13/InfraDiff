/**
 * JSON output renderer
 */
import { Report } from '../core/types/report.js';

/**
 * Render report as JSON to console
 */
export function renderJson(report: Report): void {
  console.log(JSON.stringify(report, null, 2));
}
