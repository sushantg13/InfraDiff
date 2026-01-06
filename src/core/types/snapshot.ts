/**
 * Snapshot type definitions
 */

export interface TrackedFile {
  path: string;
  exists: boolean;
  sha256?: string;
  size?: number;
  mtimeMs?: number;
}

export interface Snapshot {
  meta: {
    tool: string;
    version: string;
    schemaVersion: string;
    createdAt: string;
    projectRoot: string;
    projectType: string;
    packageManager: string;
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
