import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import TypeToggle from './components/TypeToggle';
import CategoryPicker from './components/CategoryPicker';
import DateSelector from './components/DateSelector';
import AppButton from '../../config/widgets/AppButton';
import {useAppTheme} from '../../config/theme/AppTheme';
import {Typography} from '../../config/theme/Typography';
import {AppDimensions} from '../../config/constants/AppDimensions';
import {useTransactionStore} from '../../store/useTransactionStore';
import {PREDEFINED_CATEGORIES} from '../../config/entities/Category';
import {TransactionType} from '../../config/entities/Transaction';
import {parseAmount} from '../../config/utils/CurrencyUtils';
import {RootStackParamList, Routes} from '../../navigation/RouterConfig';

type RouteType = RouteProp<RootStackParamList, typeof Routes.ADD_TRANSACTION>;

const AddTransactionScreen = () => {
  const {theme} = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const {addTransaction} = useTransactionStore();
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<TransactionType>(route.params?.type ?? 'expense');
  const [amountText, setAmountText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{amount?: string; category?: string}>({});
  const [saving, setSaving] = useState(false);

  const amountRef = useRef<TextInput>(null);

  const slideAnim = useSharedValue(50);
  const opacityAnim = useSharedValue(0);

  useEffect(() => {
    slideAnim.value = withSpring(0, {damping: 18});
    opacityAnim.value = withTiming(1, {duration: 300});
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{translateY: slideAnim.value}],
  }));

  useEffect(() => {
    setCategoryId('');
  }, [type]);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    const amount = parseAmount(amountText);
    if (!amountText || amount <= 0) {
      errs.amount = 'Please enter a valid amount';
    }
    if (!categoryId) {
      errs.category = 'Please select a category';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    setSaving(true);
    await addTransaction({
      type,
      amount: parseAmount(amountText),
      categoryId,
      date: date.toISOString(),
      note: note.trim(),
    });
    setSaving(false);
    navigation.goBack();
  };

  const accentColor = type === 'income' ? theme.income : theme.expense;

  return (
    <View style={[styles.container, {backgroundColor: theme.background, paddingBottom: insets.bottom || AppDimensions.paddingLG}]}>
      <View style={styles.handle} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Icon name="close" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        <Text style={[Typography.headingSmall, {color: theme.textPrimary}]}>
          New Transaction
        </Text>
        <View style={{width: 36}} />
      </View>

      <Animated.View style={[{flex: 1}, containerStyle]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 60}
          enableOnAndroid>

          <TypeToggle value={type} onChange={setType} />

          <View style={[styles.amountCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
            <Text style={[Typography.labelSmall, {color: theme.textTertiary}]}>
              AMOUNT
            </Text>
            <View style={styles.amountRow}>
              <Text style={[Typography.headingLarge, {color: accentColor}]}>₹</Text>
              <TextInput
                ref={amountRef}
                value={amountText}
                onChangeText={t => {
                  setAmountText(t.replace(/[^0-9.]/g, ''));
                  if (errors.amount) {
                    setErrors(e => ({...e, amount: undefined}));
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                style={[
                  Typography.displayLarge,
                  styles.amountInput,
                  {color: theme.textPrimary},
                ]}
                autoFocus
              />
            </View>
            {errors.amount ? (
              <Text style={[Typography.bodySmall, {color: theme.expense}]}>
                {errors.amount}
              </Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={[Typography.headingSmall, {color: theme.textPrimary, marginBottom: AppDimensions.paddingMD}]}>
              Category
            </Text>
            {errors.category ? (
              <Text style={[Typography.bodySmall, {color: theme.expense, marginBottom: 8}]}>
                {errors.category}
              </Text>
            ) : null}
            <CategoryPicker
              categories={PREDEFINED_CATEGORIES}
              selected={categoryId}
              onSelect={id => {
                setCategoryId(id);
                if (errors.category) {
                  setErrors(e => ({...e, category: undefined}));
                }
              }}
              type={type}
            />
          </View>

          <View style={styles.section}>
            <Text style={[Typography.headingSmall, {color: theme.textPrimary, marginBottom: AppDimensions.paddingMD}]}>
              Date
            </Text>
            <DateSelector value={date} onChange={setDate} />
          </View>

          <View style={styles.section}>
            <Text style={[Typography.headingSmall, {color: theme.textPrimary, marginBottom: AppDimensions.paddingMD}]}>
              Note  <Text style={[Typography.bodyMedium, {color: theme.textTertiary}]}>(optional)</Text>
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={3}
              style={[
                styles.noteInput,
                Typography.bodyLarge,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            />
          </View>

          <AppButton
            title={saving ? 'Saving...' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
            onPress={handleSave}
            loading={saving}
            style={styles.saveBtn}
          />
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#33334A',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppDimensions.paddingMD,
    paddingTop: AppDimensions.paddingSM,
    paddingBottom: AppDimensions.paddingMD,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: AppDimensions.paddingMD,
    paddingBottom: AppDimensions.paddingXL,
    gap: AppDimensions.paddingMD,
  },
  amountCard: {
    padding: AppDimensions.paddingLG,
    borderRadius: AppDimensions.radiusLG,
    borderWidth: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: AppDimensions.paddingSM,
  },
  amountInput: {
    flex: 1,
    padding: 0,
    includeFontPadding: false,
  },
  section: {},
  noteInput: {
    borderWidth: 1,
    borderRadius: AppDimensions.radiusMD,
    padding: AppDimensions.paddingMD,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  saveBtn: {
    marginTop: AppDimensions.paddingMD,
  },
});

export default AddTransactionScreen;
