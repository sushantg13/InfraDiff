/**
 * Snapshot command handler
 */
import * as path from "node:path";
import { detectProject } from '../detectors/index.js';
import { buildSnapshot } from '../core/snapshot/buildSnapshot.js';
import { writeJsonFile } from '../adapters/json.js';
export function handleSnapshotCommand(projectRoot, outputPath) {
    // Detect project type
    const projectInfo = detectProject(projectRoot);
    console.log(`Detected: ${projectInfo.frameworks.join(', ')}`);
    const snapshot = buildSnapshot(projectRoot);
    // Store detected frameworks and project type in snapshot metadata
    snapshot.meta.frameworks = projectInfo.frameworks;
    snapshot.meta.projectType = projectInfo.frameworks.includes('react-native') ? 'react-native' :
        projectInfo.frameworks.includes('vue') ? 'vue' :
            projectInfo.frameworks.includes('nextjs') ? 'react' :
                'generic';
    // Default output name if none provided
    const finalOutputPath = path.resolve(projectRoot, outputPath || "infradiff.snapshot.json");
    // Save snapshot to disk
    writeJsonFile(finalOutputPath, snapshot);
    console.log(`Snapshot saved to ${finalOutputPath}`);
}
//# sourceMappingURL=snapshotCommand.js.map