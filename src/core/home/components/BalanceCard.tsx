import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import GradientCard from '../../../config/widgets/GradientCard';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {formatCurrency} from '../../../config/utils/CurrencyUtils';
import {formatMonthYear} from '../../../config/utils/DateUtils';

interface Props {
  balance: number;
  income: number;
  expense: number;
  onToggleTheme: () => void;
  isDark: boolean;
}

const BalanceCard: React.FC<Props> = ({balance, income, expense, onToggleTheme, isDark}) => {
  const {theme} = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, {duration: 500}));
    translateY.value = withDelay(100, withSpring(0, {damping: 15}));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  const monthLabel = formatMonthYear(new Date().toISOString());

  return (
    <Animated.View style={animStyle}>
      <GradientCard
        colors={['#13111E', '#1C1830', '#211D3A']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={[Typography.labelSmall, {color: 'rgba(255,255,255,0.6)'}]}>
              {monthLabel}
            </Text>
            <Text style={[Typography.bodyMedium, {color: 'rgba(255,255,255,0.85)', marginTop: 2}]}>
              Total Balance
            </Text>
          </View>
          <TouchableOpacity onPress={onToggleTheme} style={styles.themeBtn}>
            <Icon
              name={isDark ? 'weather-sunny' : 'weather-night'}
              size={20}
              color="rgba(255,255,255,0.85)"
            />
          </TouchableOpacity>
        </View>

        <Text style={[Typography.displayMedium, styles.balanceText]}>
          {formatCurrency(Math.abs(balance))}
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconRow}>
              <View style={[styles.dot, {backgroundColor: '#10B981'}]} />
              <Text style={[Typography.labelMedium, {color: 'rgba(255,255,255,0.6)'}]}>
                Income
              </Text>
            </View>
            <Text style={[Typography.headingSmall, {color: '#fff', marginTop: 4}]}>
              {formatCurrency(income, true)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconRow}>
              <View style={[styles.dot, {backgroundColor: '#EF4444'}]} />
              <Text style={[Typography.labelMedium, {color: 'rgba(255,255,255,0.6)'}]}>
                Expenses
              </Text>
            </View>
            <Text style={[Typography.headingSmall, {color: '#fff', marginTop: 4}]}>
              {formatCurrency(expense, true)}
            </Text>
          </View>
        </View>
      </GradientCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: AppDimensions.paddingLG,
    minHeight: AppDimensions.cardHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    color: '#FFFFFF',
    marginTop: AppDimensions.paddingMD,
    marginBottom: AppDimensions.paddingLG,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: AppDimensions.radiusMD,
    paddingVertical: AppDimensions.paddingMD,
    paddingHorizontal: AppDimensions.paddingLG,
  },
  summaryItem: {
    flex: 1,
  },
  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: AppDimensions.paddingMD,
  },
});

export default BalanceCard;
