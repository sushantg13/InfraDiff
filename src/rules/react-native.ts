import { Rule, RuleContext, Finding } from './types.js';

export const reactNativeRules: Rule[] = [
  // Rule 1: Native Module Detection
  {
    name: 'Native Module Added',
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
    analyze: (context: RuleContext): Finding => {
      const pkg = context.change!.key;
      return {
        title: 'Native Module Added',
        severity: 'high',
        confidence: 'high',
        tags: ['dependency', 'native', 'ios', 'android'],
        groupKey: 'native-module-added',
        data: {
          module: pkg,
          version: context.change!.after
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
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.key === 'react-native' && 
             context.change.action === 'changed';
    },
    analyze: (context: RuleContext): Finding => {
      const { before, after } = context.change!;
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
    analyze: (context: RuleContext): Finding => {
      const { key, action, before, after } = context.change!;
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
          "Clear Metro cache: 'npx react-native start --reset-cache'",
          "Monitor bundle size and build time",
          "Test bundling behavior thoroughly"
        ]
      };
    }
  },

  // Rule 4: Metro Config File Changed
  {
    name: 'Metro Config File Changed',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.type === 'file' && 
             context.change.key === 'metro.config.js' &&
             context.change.action === 'changed';
    },
    analyze: (context: RuleContext): Finding => {
      return {
        title: 'Metro Config File Changed',
        severity: 'medium',
        confidence: 'high',
        tags: ['file', 'config', 'bundler'],
        data: {
          file: 'metro.config.js'
        },
        recommendations: [
          "Restart Metro: 'npx react-native start --reset-cache'",
          "If issues persist: delete node_modules and reinstall",
          "Test bundling behavior"
        ]
      };
    }
  },

  // Rule 5: Babel Config File Changed
  {
    name: 'Babel Config File Changed',
    match: (context: RuleContext) => {
      if (!context.change) return false;
      return context.change.type === 'file' && 
             context.change.key === 'babel.config.js' &&
             context.change.action === 'changed';
    },
    analyze: (context: RuleContext): Finding => {
      return {
        title: 'Babel Config File Changed',
        severity: 'medium',
        confidence: 'high',
        tags: ['file', 'config', 'transform'],
        data: {
          file: 'babel.config.js'
        },
        recommendations: [
          "Restart Metro: 'npx react-native start --reset-cache'",
          "If new plugins added: run 'npm install'",
          "Rebuild if transforms affect native code"
        ]
      };
    }
  }
];
