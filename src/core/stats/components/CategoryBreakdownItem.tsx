import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CategoryBadge from '../../../config/widgets/CategoryBadge';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {formatCurrency} from '../../../config/utils/CurrencyUtils';

interface Props {
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

const CategoryBreakdownItem: React.FC<Props> = ({name, icon, color, amount, percentage}) => {
  const {theme} = useAppTheme();

  return (
    <View style={styles.row}>
      <CategoryBadge icon={icon} color={color} size="sm" />
      <View style={styles.middle}>
        <View style={styles.labelRow}>
          <Text style={[Typography.labelMedium, {color: theme.textPrimary}]}>{name}</Text>
          <Text style={[Typography.labelMedium, {color: theme.textSecondary}]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
        <View style={[styles.barBg, {backgroundColor: theme.border}]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
      <Text style={[Typography.labelMedium, {color: theme.textPrimary, minWidth: 70, textAlign: 'right'}]}>
        {formatCurrency(amount, true)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppDimensions.paddingMD,
    marginBottom: AppDimensions.paddingMD,
  },
  middle: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default CategoryBreakdownItem;
