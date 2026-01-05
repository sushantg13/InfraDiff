export interface TrackedFile {
  path: string;
  exists: boolean;
  sha256?: string;
  size?: number;
  mtimeMs?: number;
}

export interface FileDiff {
  path: string;
  before?: string;  // hash
  after?: string;   // hash
  change: "added" | "removed" | "changed";
}

export interface Snapshot {
  meta: {
    tool: string;
    version: string;
    schemaVersion: string;
    createdAt: string;
    projectRoot: string;
    projectType: string;
    packageManager: "yarn" | "npm" | "pnpm" | "unknown";
    lockfilePath?: string;
    frameworks: string[];
  };
  files: Record<string, TrackedFile>;
  env: {
    envFiles: string[];
    envKeys: string[];
    keyCount: number;
  };
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface Finding {
  title: string;
  severity: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  tags: string[];
  groupKey?: string;
  data: Record<string, any>;
  recommendations: string[];
}

export interface Rule {
  name: string;
  // Function that checks if this rule applies to a specific change
  match: (context: RuleContext) => boolean;
  // Function that generates structured finding
  analyze: (context: RuleContext) => Finding | null;
}

export interface RuleContext {
  // The full diff report
  diff: any;
  // Specific change being evaluated
  change?: {
    type: 'dependency' | 'devDependency' | 'env' | 'file';
    action: 'added' | 'removed' | 'changed';
    key: string;
    before?: any;
    after?: any;
  };
  // File changes for file-based rules
  fileChanges?: FileDiff[];
}

export interface Explanation {
  rule: string;
  severity: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  tags: string[];
  message: string;
}
