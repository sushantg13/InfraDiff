import { Rule, RuleContext } from './types.js';

export const reactNativeRules: Rule[] = [
  // Rule 1: Native Module Detection
  {
    name: 'Native Module Added',
    severity: 'high',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      if (context.change.type !== 'dependency') return false;
      if (context.change.action !== 'added') return false;
      
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
    explain: (context: RuleContext) => {
      const pkg = context.change!.key;
      return `Native module added: ${pkg}\n` +
             `   Action Required:\n` +
             `   • iOS: Run 'cd ios && pod install'\n` +
             `   • Android: May require rebuild\n` +
             `   Impact: Native code changes require full rebuild`;
    }
  },

  // Rule 2: React Native Version Change
  {
    name: 'React Native Version Change',
    severity: 'high',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.key === 'react-native' && 
             context.change.action === 'changed';
    },
    explain: (context: RuleContext) => {
      const { before, after } = context.change!;
      return `React Native version changed: ${before} → ${after}\n` +
             `   Major Impact:\n` +
             `   • Breaking changes possible\n` +
             `   • Review migration guide: https://react-native-community.github.io/upgrade-helper/\n` +
             `   • Test thoroughly on both iOS and Android\n` +
             `   • Check if dependencies are compatible`;
    }
  },

  // Rule 3: Metro Config Dependency
  {
    name: 'Metro-Related Package Change',
    severity: 'medium',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      const metroPackages = [
        '@react-native/metro-config',
        'metro',
        'metro-config',
        'metro-resolver'
      ];
      return metroPackages.includes(context.change.key);
    },
    explain: (context: RuleContext) => {
      const { key, action, before, after } = context.change!;
      if (action === 'changed') {
        return `Metro bundler config changed: ${key} (${before} → ${after})\n` +
               `   Impact:\n` +
               `   • Bundle size may change\n` +
               `   • Build time may be affected\n` +
               `   • Clear cache: 'npx react-native start --reset-cache'`;
      }
      return `Metro bundler package ${action}: ${key}\n` +
             `   Impact: Bundling behavior will change`;
    }
  },

  // Rule 4: Metro Config File Changed
  {
    name: 'Metro Config File Changed',
    severity: 'medium',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.type === 'file' && 
             context.change.key === 'metro.config.js' &&
             context.change.action === 'changed';
    },
    explain: (context: RuleContext) => {
      return `Metro config file modified\n` +
             `   Action Required:\n` +
             `   • Restart Metro: 'npx react-native start --reset-cache'\n` +
             `   • If issues persist: delete node_modules and reinstall\n` +
             `   Impact: Bundling behavior may change`;
    }
  },

  // Rule 5: Babel Config File Changed
  {
    name: 'Babel Config File Changed',
    severity: 'medium',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.type === 'file' && 
             context.change.key === 'babel.config.js' &&
             context.change.action === 'changed';
    },
    explain: (context: RuleContext) => {
      return `Babel config file modified\n` +
             `   Action Required:\n` +
             `   • Restart Metro: 'npx react-native start --reset-cache'\n` +
             `   • If new plugins added: run 'npm install'\n` +
             `   • Rebuild if transforms affect native code\n` +
             `   Impact: JavaScript transformation may change`;
    }
  }
];
