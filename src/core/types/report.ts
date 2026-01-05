/**
 * Report type definitions
 */

export interface FileDiff {
  path: string;
  before?: string;  // hash
  after?: string;   // hash
  change: "added" | "removed" | "changed";
}

export interface Report {
  meta: {
    tool: string;
    version: string;
    schemaVersion: string;
    createdAt: string;
    before: string;
    after: string;
  };
  env: {
    envFiles: {
      added: string[];
      removed: string[];
    };
    envKeys: {
      added: string[];
      removed: string[];
    };
  };
  files: {
    changed: FileDiff[];
  };
  dependencies: {
    added: Record<string, string>;
    removed: Record<string, string>;
    changed: Record<string, { from: string; to: string }>;
  };
  devDependencies: {
    added: Record<string, string>;
    removed: Record<string, string>;
    changed: Record<string, { from: string; to: string }>;
  };
  summary: {
    envFiles: {
      added: number;
      removed: number;
    };
    envKeys: {
      added: number;
      removed: number;
    };
    files: {
      changed: number;
    };
    dependencies: {
      added: number;
      removed: number;
      changed: number;
    };
    devDependencies: {
      added: number;
      removed: number;
      changed: number;
    };
  };
}
