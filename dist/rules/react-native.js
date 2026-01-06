import { getInstallCommand, getMetroResetCommand } from './packageManagerUtils.js';
export const reactNativeRules = [
    // Rule 1: Native Module Detection
    {
        name: 'Native Module Added',
        match: (context) => {
            if (!context.change)
                return false;
            if (context.change.type !== 'dependency')
                return false;
            if (context.change.action !== 'added')
                return false;
            const nativeModules = [
                'react-native-maps',
                'react-native-camera',
                'react-native-permissions',
                'react-native-image-picker',
                'react-native-video',
                'react-native-gesture-handler',
                'react-native-reanimated',
                '@react-native-community/geolocation',
                'react-native-linear-gradient'
            ];
            return nativeModules.includes(context.change.key);
        },
        analyze: (context) => {
            const pkg = context.change.key;
            return {
                title: 'Native Module Added',
                severity: 'high',
                confidence: 'high',
                tags: ['dependency', 'native', 'ios', 'android'],
                groupKey: 'native-module-added',
                data: {
                    module: pkg,
                    version: context.change.after
                },
                recommendations: [
                    "Run 'cd ios && pod install'",
                    "Rebuild Android project",
                    "Test on both iOS and Android platforms"
                ]
            };
        }
    },
    // Rule 2: React Native Version Change
    {
        name: 'React Native Version Change',
        match: (context) => {
            if (!context.change)
                return false;
            return context.change.key === 'react-native' &&
                context.change.action === 'changed';
        },
        analyze: (context) => {
            const { before, after } = context.change;
            return {
                title: 'React Native Version Change',
                severity: 'high',
                confidence: 'high',
                tags: ['dependency', 'framework', 'breaking'],
                data: {
                    from: before,
                    to: after
                },
                recommendations: [
                    `Review migration guide: https://react-native-community.github.io/upgrade-helper/`,
                    "Test thoroughly on both iOS and Android",
                    "Check if dependencies are compatible",
                    "Review breaking changes documentation"
                ]
            };
        }
    },
    // Rule 3: Metro Config Dependency
    {
        name: 'Metro-Related Package Change',
        match: (context) => {
            if (!context.change)
                return false;
            const metroPackages = [
                '@react-native/metro-config',
                'metro',
                'metro-config',
                'metro-resolver'
            ];
            return metroPackages.includes(context.change.key);
        },
        analyze: (context) => {
            const { key, action, before, after } = context.change;
            const metroResetCmd = getMetroResetCommand(context.packageManager);
            return {
                title: 'Metro Package Change',
                severity: 'medium',
                confidence: 'high',
                tags: ['dependency', 'bundler', 'metro'],
                data: {
                    package: key,
                    action,
                    from: before,
                    to: after
                },
                recommendations: [
                    `Clear Metro cache: '${metroResetCmd}'`,
                    "Monitor bundle size and build time",
                    "Test bundling behavior thoroughly"
                ]
            };
        }
    },
    // Rule 4: Metro Config File Changed
    {
        name: 'Metro Config File Changed',
        match: (context) => {
            if (!context.change)
                return false;
            return context.change.type === 'file' &&
                context.change.key === 'metro.config.js' &&
                context.change.action === 'changed';
        },
        analyze: (context) => {
            const metroResetCmd = getMetroResetCommand(context.packageManager);
            const installCmd = getInstallCommand(context.packageManager);
            return {
                title: 'Metro Config File Changed',
                severity: 'medium',
                confidence: 'high',
                tags: ['file', 'config', 'bundler'],
                data: {
                    file: 'metro.config.js'
                },
                recommendations: [
                    `Restart Metro: '${metroResetCmd}'`,
                    `If issues persist: delete node_modules and run '${installCmd}'`,
                    "Test bundling behavior"
                ]
            };
        }
    },
    // Rule 5: Babel Config File Changed
    {
        name: 'Babel Config File Changed',
        match: (context) => {
            if (!context.change)
                return false;
            return context.change.type === 'file' &&
                context.change.key === 'babel.config.js' &&
                context.change.action === 'changed';
        },
        analyze: (context) => {
            const metroResetCmd = getMetroResetCommand(context.packageManager);
            const installCmd = getInstallCommand(context.packageManager);
            return {
                title: 'Babel Config File Changed',
                severity: 'medium',
                confidence: 'high',
                tags: ['file', 'config', 'transform'],
                data: {
                    file: 'babel.config.js'
                },
                recommendations: [
                    `Restart Metro: '${metroResetCmd}'`,
                    `If new plugins added: run '${installCmd}'`,
                    "Rebuild if transforms affect native code"
                ]
            };
        }
    },
    // Rule 6: Dependencies Updated Summary
    {
        name: 'Dependencies Updated',
        match: (context) => {
            // Check if both package.json and lockfile changed
            const fileChanges = context.fileChanges || [];
            const packageJsonChanged = fileChanges.some(f => f.path === 'package.json' && f.change === 'changed');
            const lockfileChanged = fileChanges.some(f => (f.path === 'package-lock.json' || f.path === 'yarn.lock' || f.path === 'pnpm-lock.yaml') &&
                f.change === 'changed');
            return packageJsonChanged && lockfileChanged;
        },
        analyze: (context) => {
            const installCmd = getInstallCommand(context.packageManager);
            // Check if native modules were added to determine severity
            const hasNativeModules = Object.keys(context.diff.dependencies?.added || {}).some(pkg => {
                const nativeModules = [
                    'react-native-maps', 'react-native-camera', 'react-native-permissions',
                    'react-native-image-picker', 'react-native-video', 'react-native-gesture-handler',
                    'react-native-reanimated', '@react-native-community/geolocation', 'react-native-linear-gradient'
                ];
                return nativeModules.includes(pkg);
            });
            return {
                title: 'Dependencies Updated',
                severity: hasNativeModules ? 'medium' : 'low',
                confidence: 'high',
                tags: ['dependency', 'lockfile', 'summary'],
                data: {
                    packageJsonChanged: true,
                    lockfileChanged: true,
                    hasNativeModules
                },
                recommendations: [
                    `Run '${installCmd}' to sync dependency tree`,
                    hasNativeModules ? "Native modules detected - see specific native module recommendations" : "Standard dependency update"
                ]
            };
        }
    }
];
//# sourceMappingURL=react-native.js.map