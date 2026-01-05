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
export function applyRules(diff, frameworks) {
    const rules = loadRules(frameworks);
    const explanations = [];
    // Check dependencies added
    for (const [pkg, version] of Object.entries(diff.dependencies.added)) {
        const context = {
            diff,
            change: {
                type: 'dependency',
                action: 'added',
                key: pkg,
                after: version
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                explanations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    confidence: 'high',
                    tags: ['dependency'],
                    message: rule.explain(context)
                });
            }
        }
    }
    // Check dependencies changed
    for (const [pkg, change] of Object.entries(diff.dependencies.changed)) {
        const c = change;
        const context = {
            diff,
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
                explanations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    confidence: 'high',
                    tags: ['dependency'],
                    message: rule.explain(context)
                });
            }
        }
    }
    // Check devDependencies added
    for (const [pkg, version] of Object.entries(diff.devDependencies.added)) {
        const context = {
            diff,
            change: {
                type: 'devDependency',
                action: 'added',
                key: pkg,
                after: version
            }
        };
        for (const rule of rules) {
            if (rule.match(context)) {
                explanations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    confidence: 'high',
                    tags: ['devDependency'],
                    message: rule.explain(context)
                });
            }
        }
    }
    // Check devDependencies changed
    for (const [pkg, change] of Object.entries(diff.devDependencies.changed)) {
        const c = change;
        const context = {
            diff,
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
                explanations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    confidence: 'high',
                    tags: ['devDependency'],
                    message: rule.explain(context)
                });
            }
        }
    }
    // Check file changes
    for (const fileChange of diff.files?.changed || []) {
        const context = {
            diff,
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
                explanations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    confidence: 'high',
                    tags: ['file', 'config'],
                    message: rule.explain(context)
                });
            }
        }
    }
    return explanations;
}
//# sourceMappingURL=engine.js.map