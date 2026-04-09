import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppTheme} from '../theme/AppTheme';
import {AppDimensions} from '../constants/AppDimensions';
import {Typography} from '../theme/Typography';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppTextInput: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const {theme} = useAppTheme();
  const [focused, setFocused] = useState(false);
  const borderAnim = useSharedValue(0);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: borderAnim.value === 1 ? theme.primary : error ? theme.expense : theme.border,
    borderWidth: borderAnim.value === 1 ? 1.5 : 1,
  }));

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[Typography.labelMedium, {color: theme.textSecondary, marginBottom: 8}]}>
        {label}
      </Text>
      <Animated.View
        style={[
          styles.inputRow,
          {backgroundColor: theme.surface},
          animatedBorder,
        ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          {...props}
          placeholderTextColor={theme.textTertiary}
          style={[
            styles.input,
            Typography.bodyLarge,
            {color: theme.textPrimary, flex: 1},
          ]}
          onFocus={e => {
            setFocused(true);
            borderAnim.value = withTiming(1, {duration: 200});
            props.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            borderAnim.value = withTiming(0, {duration: 200});
            props.onBlur?.(e);
          }}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </Animated.View>
      {error ? (
        <Text style={[Typography.bodySmall, {color: theme.expense, marginTop: 6}]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: AppDimensions.paddingMD,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    minHeight: 54,
    paddingHorizontal: AppDimensions.paddingMD,
  },
  input: {
    paddingVertical: AppDimensions.paddingSM + 4,
  },
  iconLeft: {
    marginRight: AppDimensions.paddingSM,
  },
  iconRight: {
    marginLeft: AppDimensions.paddingSM,
  },
});

export default AppTextInput;
