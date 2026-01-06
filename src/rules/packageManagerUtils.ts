/**
 * Package manager utility functions
 */

export function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn install';
    case 'pnpm':
      return 'pnpm install';
    default:
      return 'npm install';
  }
}

export function getCIInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm ci';
    case 'yarn':
      return 'yarn install --frozen-lockfile';
    case 'pnpm':
      return 'pnpm install --frozen-lockfile';
    default:
      return 'npm ci';
  }
}

export function getMetroResetCommand(packageManager: string): string {
  // For consistency with package manager, but npx works universally
  switch (packageManager) {
    case 'yarn':
      return 'yarn react-native start --reset-cache';
    case 'pnpm':
      return 'pnpm react-native start --reset-cache';
    case 'npm':
    default:
      return 'npx react-native start --reset-cache';
  }
}

export function getPodInstallCommand(packageManager: string): string {
  // Pod install is always the same, but we can provide context
  return 'cd ios && pod install';
}
