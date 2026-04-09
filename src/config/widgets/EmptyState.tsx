import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../theme/AppTheme';
import {Typography} from '../theme/Typography';
import {AppDimensions} from '../constants/AppDimensions';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<Props> = ({icon, title, subtitle}) => {
  const {theme} = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          {backgroundColor: `${theme.primary}15`},
        ]}>
        <Icon name={icon} size={40} color={theme.primary} />
      </View>
      <Text style={[Typography.headingSmall, {color: theme.textPrimary, marginTop: 20}]}>
        {title}
      </Text>
      <Text
        style={[
          Typography.bodyMedium,
          {color: theme.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 22},
        ]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: AppDimensions.paddingXL * 2,
    paddingHorizontal: AppDimensions.paddingXL,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmptyState;
