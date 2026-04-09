import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TransactionItem from './components/TransactionItem';
import MonthFilter from './components/MonthFilter';
import EmptyState from '../../config/widgets/EmptyState';
import {useAppTheme} from '../../config/theme/AppTheme';
import {Typography} from '../../config/theme/Typography';
import {AppDimensions} from '../../config/constants/AppDimensions';
import {useTransactionStore} from '../../store/useTransactionStore';
import {PREDEFINED_CATEGORIES} from '../../config/entities/Category';
import {
  formatCurrency} from '../../config/utils/CurrencyUtils';
import {
  formatSectionDate,
  getAvailableMonths,
  getCurrentMonthKey,
  isSameDay,
} from '../../config/utils/DateUtils';
import {Transaction} from '../../config/entities/Transaction';

const TransactionsScreen = () => {
  const {theme} = useAppTheme();
  const {transactions, deleteTransaction, getTotalByTypeAndMonth} = useTransactionStore();

  const allMonths = useMemo(() => {
    const months = getAvailableMonths(transactions.map(t => t.date));
    const current = getCurrentMonthKey();
    if (!months.includes(current)) {
      return [current, ...months];
    }
    return months;
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey);

  const monthlyIncome = getTotalByTypeAndMonth('income', selectedMonth);
  const monthlyExpense = getTotalByTypeAndMonth('expense', selectedMonth);

  const filteredTxs = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    return transactions.filter(t => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === parseInt(year, 10) &&
        d.getMonth() + 1 === parseInt(month, 10)
      );
    });
  }, [transactions, selectedMonth]);

  const sections = useMemo(() => {
    const grouped: {[key: string]: Transaction[]} = {};
    filteredTxs.forEach(tx => {
      const key = tx.date.split('T')[0];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(tx);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({
        title: formatSectionDate(new Date(date).toISOString()),
        data,
      }));
  }, [filteredTxs]);

  const getCategoryById = (id: string) =>
    PREDEFINED_CATEGORIES.find(c => c.id === id) ?? PREDEFINED_CATEGORIES[PREDEFINED_CATEGORIES.length - 1];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[Typography.headingLarge, {color: theme.textPrimary}]}>
          Transactions
        </Text>
      </View>

      <MonthFilter
        months={allMonths}
        selected={selectedMonth}
        onSelect={setSelectedMonth}
      />

      <View style={[styles.summaryStrip, {backgroundColor: theme.surface, borderColor: theme.border}]}>
        <View style={styles.stripItem}>
          <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Income</Text>
          <Text style={[Typography.headingSmall, {color: theme.income}]}>
            +{formatCurrency(monthlyIncome, true)}
          </Text>
        </View>
        <View style={[styles.stripDivider, {backgroundColor: theme.border}]} />
        <View style={styles.stripItem}>
          <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Expenses</Text>
          <Text style={[Typography.headingSmall, {color: theme.expense}]}>
            -{formatCurrency(monthlyExpense, true)}
          </Text>
        </View>
        <View style={[styles.stripDivider, {backgroundColor: theme.border}]} />
        <View style={styles.stripItem}>
          <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Saved</Text>
          <Text style={[Typography.headingSmall, {color: theme.primary}]}>
            {formatCurrency(Math.max(monthlyIncome - monthlyExpense, 0), true)}
          </Text>
        </View>
      </View>

      {sections.length === 0 ? (
        <EmptyState
          icon="receipt-text-outline"
          title="No transactions"
          subtitle="No transactions found for this month. Add one using the + button."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({section: {title}}) => (
            <Text
              style={[
                Typography.labelSmall,
                {color: theme.textTertiary, marginBottom: AppDimensions.paddingSM, marginTop: AppDimensions.paddingMD},
              ]}>
              {title}
            </Text>
          )}
          renderItem={({item}) => (
            <TransactionItem
              transaction={item}
              category={getCategoryById(item.categoryId)}
              onDelete={deleteTransaction}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: AppDimensions.paddingMD,
    paddingTop: AppDimensions.paddingMD,
    paddingBottom: AppDimensions.paddingSM,
  },
  summaryStrip: {
    flexDirection: 'row',
    marginHorizontal: AppDimensions.paddingMD,
    marginTop: AppDimensions.paddingSM,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    paddingVertical: AppDimensions.paddingMD,
  },
  stripItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  stripDivider: {
    width: 1,
    marginVertical: 4,
  },
  list: {
    paddingHorizontal: AppDimensions.paddingMD,
    paddingBottom: AppDimensions.paddingXL,
  },
});

export default TransactionsScreen;
