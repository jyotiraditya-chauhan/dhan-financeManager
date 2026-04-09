import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryBadge from '../../../config/widgets/CategoryBadge';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {Transaction} from '../../../config/entities/Transaction';
import {Category} from '../../../config/entities/Category';
import {formatCurrency} from '../../../config/utils/CurrencyUtils';
import {formatDate, formatTime} from '../../../config/utils/DateUtils';

const DELETE_THRESHOLD = -80;

interface Props {
  transaction: Transaction;
  category: Category;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<Props> = ({transaction, category, onDelete}) => {
  const {theme} = useAppTheme();
  const translateX = useSharedValue(0);
  const deleteOpacity = useSharedValue(0);

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      {text: 'Cancel', style: 'cancel', onPress: () => {
        translateX.value = withSpring(0);
        deleteOpacity.value = withTiming(0);
      }},
      {text: 'Delete', style: 'destructive', onPress: () => onDelete(id)},
    ]);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate(e => {
      if (e.translationX <= 0) {
        translateX.value = Math.max(e.translationX, -100);
        deleteOpacity.value = Math.min(Math.abs(e.translationX) / 80, 1);
      }
    })
    .onEnd(e => {
      if (e.translationX < DELETE_THRESHOLD) {
        runOnJS(confirmDelete)(transaction.id);
      } else {
        translateX.value = withSpring(0);
        deleteOpacity.value = withTiming(0);
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
  }));

  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.deleteAction, {backgroundColor: theme.expense}, deleteStyle]}>
        <Icon name="trash-can-outline" size={22} color="#fff" />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            rowStyle,
            styles.row,
            {backgroundColor: theme.surface, borderColor: theme.borderLight},
          ]}>
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
            ) : null}
            <Text style={[Typography.bodySmall, {color: theme.textTertiary, marginTop: 2}]}>
              {formatDate(transaction.date)} · {formatTime(transaction.createdAt)}
            </Text>
          </View>
          <Text
            style={[
              Typography.headingSmall,
              {color: isIncome ? theme.income : theme.expense},
            ]}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, true)}
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: AppDimensions.paddingSM,
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    borderRadius: AppDimensions.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppDimensions.paddingMD,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    gap: AppDimensions.paddingMD,
  },
  info: {
    flex: 1,
  },
});

export default TransactionItem;
