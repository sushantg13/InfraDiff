import { reactNativeRules } from './react-native.js';
export function loadRules(frameworks) {
    const allRules = [];
    for (const framework of frameworks) {
        switch (framework) {
            case 'react-native':
                allRules.push(...reactNativeRules);
                break;
            // Will Add more frameworks here later
            default:
                break;
        }
    }
    return allRules;
}
export function applyRules(diff, frameworks, packageManager = 'unknown') {
    const rules = loadRules(frameworks);
    const findings = [];
    // Check dependencies added
    for (const [pkg, version] of Object.entries(diff.dependencies.added)) {
        const context = {
            diff,
            packageManager: packageManager,
            change: {
                type: 'dependency',
                action: 'added',
                key: pkg,
                after: version
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                const finding = rule.analyze(context);
                if (finding) {
                    findings.push(finding);
                }
            }
        }
    }
    // Check dependencies changed
    for (const [pkg, change] of Object.entries(diff.dependencies.changed)) {
        const c = change;
        const context = {
            diff,
            packageManager: packageManager,
            change: {
                type: 'dependency',
                action: 'changed',
                key: pkg,
                before: c.from,
                after: c.to
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                const finding = rule.analyze(context);
                if (finding) {
                    findings.push(finding);
                }
            }
        }
    }
    // Check devDependencies added
    for (const [pkg, version] of Object.entries(diff.devDependencies.added)) {
        const context = {
            diff,
            packageManager: packageManager,
            change: {
                type: 'devDependency',
                action: 'added',
                key: pkg,
                after: version
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                const finding = rule.analyze(context);
                if (finding) {
                    findings.push(finding);
                }
            }
        }
    }
    // Check devDependencies changed
    for (const [pkg, change] of Object.entries(diff.devDependencies.changed)) {
        const c = change;
        const context = {
            diff,
            packageManager: packageManager,
            change: {
                type: 'devDependency',
                action: 'changed',
                key: pkg,
                before: c.from,
                after: c.to
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                const finding = rule.analyze(context);
                if (finding) {
                    findings.push(finding);
                }
            }
        }
    }
    // Check file changes
    for (const fileChange of diff.files?.changed || []) {
        const context = {
            diff,
            packageManager: packageManager,
            change: {
                type: 'file',
                action: fileChange.change,
                key: fileChange.path,
                before: fileChange.before,
                after: fileChange.after
            },
            fileChanges: diff.files?.changed || []
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                const finding = rule.analyze(context);
                if (finding) {
                    findings.push(finding);
                }
            }
        }
    }
    // Add summary rules that evaluate the entire diff context
    const summaryContext = {
        diff,
        packageManager: packageManager,
        fileChanges: diff.files?.changed || []
    };
    for (const rule of rules) {
        if (rule.match(summaryContext)) {
            const finding = rule.analyze(summaryContext);
            if (finding) {
                findings.push(finding);
            }
        }
    }
    return groupFindings(findings);
}
function groupFindings(findings) {
    const grouped = new Map();
    const ungrouped = [];
    const seen = new Set();
    // Deduplicate findings by title first
    const deduplicated = findings.filter(finding => {
        const key = `${finding.title}-${JSON.stringify(finding.data)}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
    // Separate findings by groupKey
    for (const finding of deduplicated) {
        if (finding.groupKey) {
            if (!grouped.has(finding.groupKey)) {
                grouped.set(finding.groupKey, []);
            }
            grouped.get(finding.groupKey).push(finding);
        }
        else {
            ungrouped.push(finding);
        }
    }
    const result = [...ungrouped];
    // Create grouped findings
    for (const [groupKey, groupedFindings] of grouped) {
        if (groupedFindings.length === 1) {
            // Single finding, no need to group
            result.push(groupedFindings[0]);
        }
        else {
            // Multiple findings, create grouped finding
            const first = groupedFindings[0];
            const allData = groupedFindings.map(f => f.data);
            const allRecommendations = [...new Set(groupedFindings.flatMap(f => f.recommendations))];
            result.push({
                title: `${first.title} (${groupedFindings.length})`,
                severity: first.severity,
                confidence: first.confidence,
                tags: first.tags,
                groupKey: first.groupKey,
                data: { items: allData },
                recommendations: allRecommendations
            });
        }
    }
    return result;
}
//# sourceMappingURL=engine.js.map