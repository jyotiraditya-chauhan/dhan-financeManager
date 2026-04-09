import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {monthKeyToLabel} from '../../../config/utils/DateUtils';

interface Props {
  months: string[];
  selected: string;
  onSelect: (key: string) => void;
}

const MonthFilter: React.FC<Props> = ({months, selected, onSelect}) => {
  const {theme} = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scroll}>
      {months.map(key => {
        const isSelected = key === selected;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            activeOpacity={0.7}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.primary : theme.surface,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}>
            <Text
              style={[
                Typography.labelMedium,
                {color: isSelected ? '#fff' : theme.textSecondary},
              ]}>
              {monthKeyToLabel(key)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppDimensions.paddingMD,
    paddingVertical: AppDimensions.paddingSM,
    gap: AppDimensions.paddingSM,
  },
  chip: {
    height: 36,
    paddingHorizontal: AppDimensions.paddingMD,
    borderRadius: AppDimensions.radiusFull,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});

export default MonthFilter;
