import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ProjectInfo {
  frameworks: string[];
  detected: {
    [key: string]: boolean;
  };
}

export function detectProject(projectRoot: string): ProjectInfo {
  const has = (file: string) => fs.existsSync(path.join(projectRoot, file));
  
  const detected: { [key: string]: boolean } = {};
  const frameworks: string[] = [];

  // Check for React Native
  if (has('metro.config.js') || has('app.json') || has('react-native.config.js')) {
    detected['react-native'] = true;
    frameworks.push('react-native');
  }

  // Check for Next.js
  if (has('next.config.js') || has('next.config.mjs')) {
    detected['nextjs'] = true;
    frameworks.push('nextjs');
  }

  // Check for Vue
  if (has('vue.config.js') || has('vite.config.js')) {
    detected['vue'] = true;
    frameworks.push('vue');
  }

  // Check for Node.js backend
  if (has('server.js') || has('app.js') || has('index.js')) {
    detected['nodejs'] = true;
    frameworks.push('nodejs');
  }

  // Default to generic if nothing detected
  if (frameworks.length === 0) {
    frameworks.push('generic');
  }

  return {
    frameworks,
    detected
  };
}
