const base = require('./app.json');

const IOS_TEST_ADMOB_APP_ID = 'ca-app-pub-3940256099942544~1458002511';
const ANDROID_TEST_ADMOB_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

const isProductionBuild = process.env.EAS_BUILD_PROFILE === 'production';
const buildPlatform = process.env.EAS_BUILD_PLATFORM;
const requiresIosAdMob = isProductionBuild && buildPlatform !== 'android';
const requiresAndroidAdMob = isProductionBuild && buildPlatform === 'android';

const iosAdMobAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID;
const androidAdMobAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
const iosBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID;
const androidBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID;

if (requiresIosAdMob && (!iosAdMobAppId || !iosBannerUnitId)) {
  throw new Error(
    'Missing AdMob iOS environment variables. Create the iOS app and banner ad unit in AdMob, then add EXPO_PUBLIC_ADMOB_IOS_APP_ID and EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID before production builds.',
  );
}

if (requiresAndroidAdMob && (!androidAdMobAppId || !androidBannerUnitId)) {
  throw new Error(
    'Missing AdMob Android environment variables. Create the Android app and banner ad unit in AdMob, then add EXPO_PUBLIC_ADMOB_ANDROID_APP_ID and EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID before production builds.',
  );
}

module.exports = () => {
  const expo = base.expo;

  return {
    expo: {
      ...expo,
      plugins: [
        ...(expo.plugins ?? []),
        [
          'react-native-google-mobile-ads',
          {
            iosAppId: iosAdMobAppId || IOS_TEST_ADMOB_APP_ID,
            androidAppId: androidAdMobAppId || ANDROID_TEST_ADMOB_APP_ID,
            optimizeInitialization: true,
            optimizeAdLoading: true,
          },
        ],
      ],
    },
  };
};
