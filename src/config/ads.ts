import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const productionBannerUnitId = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID,
  android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID,
  default: undefined,
});

export const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : productionBannerUnitId ?? '';

export const adsEnabled =
  process.env.EXPO_PUBLIC_ADS_ENABLED !== 'false' && bannerAdUnitId.length > 0;

export const bannerRequestOptions = {
  requestNonPersonalizedAdsOnly: true,
} as const;
