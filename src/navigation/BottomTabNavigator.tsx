import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import HomeScreen from '../core/home/HomeScreen';
import TransactionsScreen from '../core/transactions/TransactionsScreen';
import StatsScreen from '../core/stats/StatsScreen';
import {BottomTabParamList, Routes} from './RouterConfig';
import {useAppTheme} from '../config/theme/AppTheme';
import {AppDimensions} from '../config/constants/AppDimensions';
import {Typography} from '../config/theme/Typography';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface TabItemProps {
  icon: string;
  iconActive: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({icon, iconActive, label, isFocused, onPress}) => {
  const {theme} = useAppTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.88, {damping: 10, stiffness: 400}, () => {
      scale.value = withSpring(1, {damping: 10});
    });
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.tabBtn}>
      <Animated.View style={[styles.tabItem, animStyle]}>
        <Icon
          name={isFocused ? iconActive : icon}
          size={22}
          color={isFocused ? theme.primary : theme.textTertiary}
        />
        <Text
          style={[
            Typography.bodySmall,
            {
              color: isFocused ? theme.primary : theme.textTertiary,
              marginTop: 3,
              fontWeight: isFocused ? '600' : '400',
            },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const TAB_CONFIG = [
  {route: Routes.HOME,         icon: 'home-outline',        iconActive: 'home',        label: 'Home'},
  {route: Routes.TRANSACTIONS, icon: 'swap-horizontal',     iconActive: 'swap-horizontal', label: 'Activity'},
  {route: Routes.STATS,        icon: 'chart-donut-variant', iconActive: 'chart-donut', label: 'Stats'},
] as const;

const CustomTabBar = ({state, navigation}: BottomTabBarProps) => {
  const {theme} = useAppTheme();
  const TAB_HEIGHT = AppDimensions.tabBarHeight + (Platform.OS === 'ios' ? 20 : 0);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: TAB_HEIGHT,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
      ]}>
      {TAB_CONFIG.map((cfg, idx) => (
        <TabItem
          key={cfg.route}
          icon={cfg.icon}
          iconActive={cfg.iconActive}
          label={cfg.label}
          isFocused={state.index === idx}
          onPress={() => {
            if (state.index !== idx) {
              navigation.navigate(cfg.route);
            }
          }}
        />
      ))}
    </View>
  );
};

const BottomTabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{headerShown: false}}>
    <Tab.Screen name={Routes.HOME} component={HomeScreen} />
    <Tab.Screen name={Routes.TRANSACTIONS} component={TransactionsScreen} />
    <Tab.Screen name={Routes.STATS} component={StatsScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabNavigator;
