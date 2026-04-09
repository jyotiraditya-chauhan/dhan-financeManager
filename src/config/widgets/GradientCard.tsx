import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppDimensions} from '../constants/AppDimensions';

interface Props {
  colors: string[];
  style?: ViewStyle;
  children: React.ReactNode;
  start?: {x: number; y: number};
  end?: {x: number; y: number};
}

const GradientCard: React.FC<Props> = ({
  colors,
  style,
  children,
  start = {x: 0, y: 0},
  end = {x: 1, y: 1},
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: AppDimensions.radiusLG,
    overflow: 'hidden',
  },
});

export default GradientCard;
