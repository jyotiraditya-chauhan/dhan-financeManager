import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Category} from '../../../config/entities/Category';
import {TransactionType} from '../../../config/entities/Transaction';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
  type: TransactionType;
}

const COLS = 4;

const CategoryPicker: React.FC<Props> = ({categories, selected, onSelect, type}) => {
  const {theme} = useAppTheme();

  const filtered = categories.filter(c => c.type === type || c.type === 'both');

  const remainder = filtered.length % COLS;
  const padded = remainder === 0
    ? filtered
    : [...filtered, ...Array.from({length: COLS - remainder}, (_, i) => ({
        id: `__pad_${i}`,
        name: '',
        icon: '',
        color: '',
        type: 'both' as const,
      }))];

  return (
    <FlatList
      data={padded}
      keyExtractor={item => item.id}
      numColumns={COLS}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      renderItem={({item}) => {
        if (item.id.startsWith('__pad_')) {
          return <View style={styles.item} />;
        }
        const isSelected = item.id === selected;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
            style={[
              styles.item,
              {
                backgroundColor: isSelected ? `${item.color}20` : theme.surface,
                borderColor: isSelected ? item.color : theme.border,
                borderWidth: 1,
              },
            ]}>
            <Icon
              name={item.icon}
              size={22}
              color={isSelected ? item.color : theme.textTertiary}
            />
            <Text
              numberOfLines={1}
              style={[
                Typography.bodySmall,
                {
                  color: isSelected ? item.color : theme.textSecondary,
                  marginTop: 6,
                  textAlign: 'center',
                },
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    gap: AppDimensions.paddingSM,
    marginBottom: AppDimensions.paddingSM,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: AppDimensions.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
    padding: AppDimensions.paddingSM,
  },
});

export default CategoryPicker;
