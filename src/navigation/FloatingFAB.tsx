import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {navigationRef, NavigationService} from './NavigationService';
import {Routes} from './RouterConfig';
import {useAppTheme} from '../config/theme/AppTheme';
import {AppDimensions} from '../config/constants/AppDimensions';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FloatingFAB: React.FC = () => {
  const {theme} = useAppTheme();
  const insets = useSafeAreaInsets();
  const fabScale = useSharedValue(1);
  const [currentRoute, setCurrentRoute] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      setCurrentRoute(navigationRef.getCurrentRoute()?.name);
    });
    return unsubscribe;
  }, []);

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: fabScale.value}],
  }));

  if (currentRoute === Routes.ADD_TRANSACTION) {
    return null;
  }

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPressIn={() => {
        fabScale.value = withSpring(0.88, {damping: 12, stiffness: 300});
      }}
      onPressOut={() => {
        fabScale.value = withSpring(1, {damping: 12, stiffness: 300});
      }}
      onPress={() => NavigationService.navigate(Routes.ADD_TRANSACTION)}
      style={[
        styles.fabWrap,
        {
          right: 24,
          bottom: 120 + insets.bottom,
        },
        fabAnimStyle,
      ]}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.fab}>
        <Icon name="plus" size={26} color="#fff" />
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  fabWrap: {
    position: 'absolute',
    shadowColor: '#4338CA',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
    zIndex: 999,
  },
  fab: {
    width: AppDimensions.fabSize,
    height: AppDimensions.fabSize,
    borderRadius: AppDimensions.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingFAB;
