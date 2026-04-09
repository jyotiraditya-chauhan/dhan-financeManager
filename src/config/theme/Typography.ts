import {Platform, TextStyle} from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  displayLarge: {
    fontFamily,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  } as TextStyle,
  displayMedium: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  headingLarge: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,
  headingMedium: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  headingSmall: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.1,
  } as TextStyle,
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
  } as TextStyle,
  labelMedium: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  } as TextStyle,
  labelSmall: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  } as TextStyle,
  amount: {
    fontFamily,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  } as TextStyle,
};
