import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Setup: undefined;
  Game: undefined;
  History: undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
