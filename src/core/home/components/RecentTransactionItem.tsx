import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import CategoryBadge from '../../../config/widgets/CategoryBadge';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {Transaction} from '../../../config/entities/Transaction';
import {Category} from '../../../config/entities/Category';
import {formatCurrency} from '../../../config/utils/CurrencyUtils';
import {formatDate} from '../../../config/utils/DateUtils';

interface Props {
  transaction: Transaction;
  category: Category;
  index: number;
  onPress?: () => void;
}

const RecentTransactionItem: React.FC<Props> = ({transaction, category, index, onPress}) => {
  const {theme} = useAppTheme();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, {duration: 400}));
    translateX.value = withDelay(index * 80, withSpring(0, {damping: 15}));
  }, [index]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateX: translateX.value}],
  }));

  const isIncome = transaction.type === 'income';

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.row, {backgroundColor: theme.surface, borderColor: theme.borderLight}]}>
        <CategoryBadge icon={category.icon} color={category.color} size="md" />
        <View style={styles.info}>
          <Text style={[Typography.labelMedium, {color: theme.textPrimary}]}>
            {category.name}
          </Text>
          {transaction.note ? (
            <Text
              numberOfLines={1}
              style={[Typography.bodySmall, {color: theme.textTertiary, marginTop: 2}]}>
              {transaction.note}
            </Text>
          ) : (
            <Text style={[Typography.bodySmall, {color: theme.textTertiary, marginTop: 2}]}>
              {formatDate(transaction.date)}
            </Text>
          )}
        </View>
        <Text
          style={[
            Typography.headingSmall,
            {color: isIncome ? theme.income : theme.expense},
          ]}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, true)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppDimensions.paddingMD,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    marginBottom: AppDimensions.paddingSM,
    gap: AppDimensions.paddingMD,
  },
  info: {
    flex: 1,
  },
});

export default RecentTransactionItem;
