import React, {useState} from 'react';
import {LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {TransactionType} from '../../../config/entities/Transaction';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';

interface Props {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

const PADDING = 4;

const TypeToggle: React.FC<Props> = ({value, onChange}) => {
  const {theme} = useAppTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(value === 'income' ? 0 : 1);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (type: TransactionType) => {
    translateX.value = withSpring(type === 'income' ? 0 : 1, {damping: 15, stiffness: 200});
    onChange(type);
  };

  const halfWidth = (containerWidth - PADDING * 2) / 2;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value * halfWidth}],
    width: halfWidth > 0 ? halfWidth : '50%',
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[styles.container, {backgroundColor: theme.surface, borderColor: theme.border}]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: value === 'income' ? `${theme.income}18` : `${theme.expense}18`,
            borderColor: value === 'income' ? theme.income : theme.expense,
          },
          indicatorStyle,
        ]}
      />
      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePress('income')}
        activeOpacity={0.8}>
        <Text
          style={[
            Typography.headingSmall,
            {color: value === 'income' ? theme.income : theme.textTertiary},
          ]}>
          ↑  Income
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePress('expense')}
        activeOpacity={0.8}>
        <Text
          style={[
            Typography.headingSmall,
            {color: value === 'expense' ? theme.expense : theme.textTertiary},
          ]}>
          ↓  Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 52,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    bottom: 4,
    borderRadius: AppDimensions.radiusSM,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TypeToggle;
