import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppDimensions} from '../constants/AppDimensions';

interface Props {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: {container: 32, icon: 16},
  md: {container: 44, icon: 20},
  lg: {container: 56, icon: 26},
};

const CategoryBadge: React.FC<Props> = ({icon, color, size = 'md'}) => {
  const {container, icon: iconSize} = sizeMap[size];

  return (
    <View
      style={[
        styles.badge,
        {
          width: container,
          height: container,
          borderRadius: container / 3,
          backgroundColor: `${color}20`,
        },
      ]}>
      <Icon name={icon} size={iconSize} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryBadge;
