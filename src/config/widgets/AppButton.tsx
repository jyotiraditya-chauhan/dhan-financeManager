import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useAppTheme} from '../theme/AppTheme';
import {AppDimensions} from '../constants/AppDimensions';
import {Typography} from '../theme/Typography';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AppButton: React.FC<Props> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const {theme} = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {damping: 15});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {damping: 15});
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[animatedStyle, style]}>
        <LinearGradient
          colors={
            disabled
              ? [theme.border, theme.border]
              : [theme.gradientStart, theme.gradientEnd]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.primaryBtn}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.primaryLabel, Typography.headingSmall]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[
        styles.outlineBtn,
        {
          borderColor:
            variant === 'outline' ? theme.primary : 'transparent',
          backgroundColor:
            variant === 'ghost' ? 'transparent' : 'transparent',
        },
        style,
        animatedStyle,
      ]}>
      <Text
        style={[
          Typography.headingSmall,
          {color: theme.primary},
        ]}>
        {title}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    height: 54,
    borderRadius: AppDimensions.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AppDimensions.paddingLG,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  outlineBtn: {
    height: 54,
    borderRadius: AppDimensions.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AppDimensions.paddingLG,
    borderWidth: 1.5,
  },
});

export default AppButton;
