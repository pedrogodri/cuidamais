const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Expo Router scans every file under app/ as a potential route. Test files
// colocated there (per this project's "tests live beside the file they
// test" convention) would otherwise get pulled into the native bundle and
// fail — @testing-library/react-native imports Node's `console` module,
// which doesn't exist in the RN runtime.
config.resolver.blockList = [...config.resolver.blockList, /\.test\.[jt]sx?$/];

module.exports = withNativeWind(config, { input: './global.css' });
