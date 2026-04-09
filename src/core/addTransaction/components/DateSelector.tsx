import React, {useState} from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../../config/theme/AppTheme';
import {Typography} from '../../../config/theme/Typography';
import {AppDimensions} from '../../../config/constants/AppDimensions';
import {MONTHS, formatDate} from '../../../config/utils/DateUtils';
import AppButton from '../../../config/widgets/AppButton';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<Props> = ({value, onChange}) => {
  const {theme} = useAppTheme();
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
  const days = Array.from({length: 31}, (_, i) => i + 1);

  const commit = () => {
    onChange(tempDate);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={[styles.trigger, {backgroundColor: theme.surface, borderColor: theme.border}]}>
        <Icon name="calendar-outline" size={18} color={theme.textSecondary} />
        <Text style={[Typography.bodyLarge, {color: theme.textPrimary, marginLeft: 10, flex: 1}]}>
          {formatDate(value.toISOString())}
        </Text>
        <Icon name="chevron-down" size={18} color={theme.textTertiary} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={[styles.backdrop, {backgroundColor: theme.overlay}]}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={[styles.sheet, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <View style={styles.sheetHeader}>
            <Text style={[Typography.headingSmall, {color: theme.textPrimary}]}>
              Select Date
            </Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Icon name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.pickerCol}>
              <Text style={[Typography.labelSmall, {color: theme.textTertiary, marginBottom: 8, textAlign: 'center'}]}>
                Day
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                {days.map(d => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth(), d))}
                    style={[
                      styles.pickerItem,
                      tempDate.getDate() === d && {backgroundColor: `${theme.primary}20`},
                    ]}>
                    <Text
                      style={[
                        Typography.bodyLarge,
                        {color: tempDate.getDate() === d ? theme.primary : theme.textPrimary, textAlign: 'center'},
                      ]}>
                      {String(d).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerCol}>
              <Text style={[Typography.labelSmall, {color: theme.textTertiary, marginBottom: 8, textAlign: 'center'}]}>
                Month
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setTempDate(new Date(tempDate.getFullYear(), i, tempDate.getDate()))}
                    style={[
                      styles.pickerItem,
                      tempDate.getMonth() === i && {backgroundColor: `${theme.primary}20`},
                    ]}>
                    <Text
                      style={[
                        Typography.bodyLarge,
                        {color: tempDate.getMonth() === i ? theme.primary : theme.textPrimary, textAlign: 'center'},
                      ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerCol}>
              <Text style={[Typography.labelSmall, {color: theme.textTertiary, marginBottom: 8, textAlign: 'center'}]}>
                Year
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                {years.map(y => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setTempDate(new Date(y, tempDate.getMonth(), tempDate.getDate()))}
                    style={[
                      styles.pickerItem,
                      tempDate.getFullYear() === y && {backgroundColor: `${theme.primary}20`},
                    ]}>
                    <Text
                      style={[
                        Typography.bodyLarge,
                        {color: tempDate.getFullYear() === y ? theme.primary : theme.textPrimary, textAlign: 'center'},
                      ]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <AppButton title="Confirm Date" onPress={commit} style={styles.confirmBtn} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    paddingHorizontal: AppDimensions.paddingMD,
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: AppDimensions.radiusXL,
    borderTopRightRadius: AppDimensions.radiusXL,
    borderWidth: 1,
    padding: AppDimensions.paddingLG,
    paddingBottom: Platform.OS === 'ios' ? 40 : AppDimensions.paddingLG,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppDimensions.paddingLG,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: AppDimensions.paddingMD,
    marginBottom: AppDimensions.paddingLG,
  },
  pickerCol: {
    flex: 1,
  },
  pickerScroll: {
    height: 200,
  },
  pickerItem: {
    paddingVertical: AppDimensions.paddingSM + 2,
    borderRadius: AppDimensions.radiusSM,
    marginBottom: 4,
  },
  confirmBtn: {
    width: '100%',
  },
});

export default DateSelector;
