import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PieChart} from 'react-native-gifted-charts';
import CategoryBreakdownItem from './components/CategoryBreakdownItem';
import MonthFilter from '../transactions/components/MonthFilter';
import EmptyState from '../../config/widgets/EmptyState';
import {useAppTheme} from '../../config/theme/AppTheme';
import {Typography} from '../../config/theme/Typography';
import {AppDimensions} from '../../config/constants/AppDimensions';
import {useTransactionStore} from '../../store/useTransactionStore';
import {PREDEFINED_CATEGORIES} from '../../config/entities/Category';
import {
  formatCurrency} from '../../config/utils/CurrencyUtils';
import {
  getAvailableMonths,
  getCurrentMonthKey,
  monthKeyToLabel,
} from '../../config/utils/DateUtils';

const {width} = Dimensions.get('window');

const StatsScreen = () => {
  const {theme} = useAppTheme();
  const {transactions, getTotalByTypeAndMonth} = useTransactionStore();

  const allMonths = useMemo(() => {
    const months = getAvailableMonths(transactions.map(t => t.date));
    const current = getCurrentMonthKey();
    if (!months.includes(current)) {
      return [current, ...months];
    }
    return months;
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const income = getTotalByTypeAndMonth('income', selectedMonth);
  const expense = getTotalByTypeAndMonth('expense', selectedMonth);

  const filteredTxs = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    return transactions.filter(t => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === parseInt(year, 10) &&
        d.getMonth() + 1 === parseInt(month, 10) &&
        t.type === activeTab
      );
    });
  }, [transactions, selectedMonth, activeTab]);

  const categoryData = useMemo(() => {
    const totals: {[id: string]: number} = {};
    filteredTxs.forEach(t => {
      totals[t.categoryId] = (totals[t.categoryId] ?? 0) + t.amount;
    });

    const total = Object.values(totals).reduce((a, b) => a + b, 0);

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([id, amount]) => {
        const cat = PREDEFINED_CATEGORIES.find(c => c.id === id);
        return {
          id,
          name: cat?.name ?? id,
          icon: cat?.icon ?? 'dots-horizontal',
          color: cat?.color ?? '#888',
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
        };
      });
  }, [filteredTxs]);

  const pieData = categoryData.map(c => ({
    value: c.percentage,
    color: c.color,
    text: '',
  }));

  const totalForTab = activeTab === 'expense' ? expense : income;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[Typography.headingLarge, {color: theme.textPrimary}]}>
            Statistics
          </Text>
        </View>

        <MonthFilter months={allMonths} selected={selectedMonth} onSelect={setSelectedMonth} />

        <View style={[styles.overviewCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
          <View style={styles.overviewItem}>
            <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Income</Text>
            <Text style={[Typography.headingMedium, {color: theme.income}]}>
              {formatCurrency(income, true)}
            </Text>
          </View>
          <View style={[styles.overviewDivider, {backgroundColor: theme.border}]} />
          <View style={styles.overviewItem}>
            <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Expenses</Text>
            <Text style={[Typography.headingMedium, {color: theme.expense}]}>
              {formatCurrency(expense, true)}
            </Text>
          </View>
          <View style={[styles.overviewDivider, {backgroundColor: theme.border}]} />
          <View style={styles.overviewItem}>
            <Text style={[Typography.bodySmall, {color: theme.textSecondary}]}>Net</Text>
            <Text
              style={[
                Typography.headingMedium,
                {color: income - expense >= 0 ? theme.income : theme.expense},
              ]}>
              {formatCurrency(Math.abs(income - expense), true)}
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(['expense', 'income'] as const).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === t ? (t === 'expense' ? theme.expense : theme.income) : theme.surface,
                  borderColor: t === 'expense' ? theme.expense : theme.income,
                },
              ]}>
              <Text
                style={[
                  Typography.labelMedium,
                  {color: activeTab === t ? '#fff' : theme.textSecondary},
                ]}>
                {t === 'expense' ? 'Expenses' : 'Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {categoryData.length === 0 ? (
          <EmptyState
            icon="chart-donut"
            title="No data"
            subtitle={`No ${activeTab} transactions for ${monthKeyToLabel(selectedMonth)}`}
          />
        ) : (
          <View style={styles.chartSection}>
            <View style={styles.donutWrap}>
              <PieChart
                data={pieData.length > 0 ? pieData : [{value: 1, color: theme.border}]}
                donut
                radius={90}
                innerRadius={62}
                innerCircleColor={theme.background}
                backgroundColor={theme.background}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text style={[Typography.bodySmall, {color: theme.textTertiary}]}>
                      {activeTab === 'expense' ? 'Spent' : 'Earned'}
                    </Text>
                    <Text style={[Typography.headingSmall, {color: theme.textPrimary}]}>
                      {formatCurrency(totalForTab, true)}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View style={[styles.breakdownCard, {backgroundColor: theme.surface, borderColor: theme.border}]}>
              <Text
                style={[
                  Typography.headingSmall,
                  {color: theme.textPrimary, marginBottom: AppDimensions.paddingLG},
                ]}>
                Breakdown
              </Text>
              {categoryData.map(c => (
                <CategoryBreakdownItem
                  key={c.id}
                  name={c.name}
                  icon={c.icon}
                  color={c.color}
                  amount={c.amount}
                  percentage={c.percentage}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{height: AppDimensions.paddingXL * 2}} />
      </ScrollView>
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
  overviewCard: {
    flexDirection: 'row',
    marginHorizontal: AppDimensions.paddingMD,
    marginTop: AppDimensions.paddingSM,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1,
    paddingVertical: AppDimensions.paddingMD,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  overviewDivider: {
    width: 1,
    marginVertical: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: AppDimensions.paddingSM,
    paddingHorizontal: AppDimensions.paddingMD,
    marginTop: AppDimensions.paddingLG,
  },
  tab: {
    flex: 1,
    paddingVertical: AppDimensions.paddingSM + 2,
    borderRadius: AppDimensions.radiusMD,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  chartSection: {
    paddingHorizontal: AppDimensions.paddingMD,
    marginTop: AppDimensions.paddingLG,
  },
  donutWrap: {
    alignItems: 'center',
    marginBottom: AppDimensions.paddingLG,
  },
  centerLabel: {
    alignItems: 'center',
  },
  breakdownCard: {
    borderRadius: AppDimensions.radiusLG,
    borderWidth: 1,
    padding: AppDimensions.paddingLG,
  },
});

export default StatsScreen;
