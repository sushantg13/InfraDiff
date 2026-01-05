export interface Rule {
  name: string;
  severity: 'low' | 'medium' | 'high';
  // Function that checks if this rule applies to a specific change
  match: (context: RuleContext) => boolean;
  // Function that generates the explanation
  explain: (context: RuleContext) => string;
}

export interface RuleContext {
  // The full diff report
  diff: any;
  // Specific change being evaluated
  change?: {
    type: 'dependency' | 'devDependency' | 'env';
    action: 'added' | 'removed' | 'changed';
    key: string;
    before?: any;
    after?: any;
  };
}

export interface Explanation {
  rule: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}
