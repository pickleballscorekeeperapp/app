import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

export function usePortraitOrientation() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(
        () => undefined,
      );
    }, []),
  );
}

export function useUnlockedOrientation() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.unlockAsync().catch(() => undefined);
    }, []),
  );
}
