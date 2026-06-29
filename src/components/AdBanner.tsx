import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  useForeground,
  type BannerAdProps,
} from 'react-native-google-mobile-ads';
import { bannerAdUnitId, bannerRequestOptions, adsEnabled } from '@/config/ads';
import { colors, radius, space } from '@/theme';

type AdBannerProps = {
  style?: ViewStyle;
};

export function AdBanner({ style }: AdBannerProps) {
  const bannerRef = useRef<BannerAd>(null);
  const [hidden, setHidden] = useState(false);

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  if (!adsEnabled || hidden) return null;

  const onAdFailedToLoad: BannerAdProps['onAdFailedToLoad'] = () => {
    setHidden(true);
  };

  return (
    <View style={[styles.shell, style]}>
      <BannerAd
        ref={bannerRef}
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={bannerRequestOptions}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginVertical: space['4'],
  },
});
