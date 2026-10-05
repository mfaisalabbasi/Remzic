const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    resolveRequest: (context, moduleName, platform) => {
      // Force jose to use its browser build to prevent server-side Node dependencies
      if (moduleName === 'jose') {
        const ctx = {
          ...context,
          unstable_conditionNames: ['browser'],
        };
        return ctx.resolveRequest(ctx, moduleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
