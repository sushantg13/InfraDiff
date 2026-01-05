import { Rule, RuleContext, Explanation } from './types.js';
import { reactNativeRules } from './react-native.js';

export function loadRules(frameworks: string[]): Rule[] {
  const allRules: Rule[] = [];
  
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

export function applyRules(diff: any, frameworks: string[]): Explanation[] {
  const rules = loadRules(frameworks);
  const explanations: Explanation[] = [];
  
  // Check dependencies added
  for (const [pkg, version] of Object.entries(diff.dependencies.added)) {
    const context: RuleContext = {
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
    const c = change as { from: string; to: string };
    const context: RuleContext = {
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
    const context: RuleContext = {
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
    const c = change as { from: string; to: string };
    const context: RuleContext = {
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
  
  return explanations;
}
