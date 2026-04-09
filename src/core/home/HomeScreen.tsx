import React, {useMemo} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BalanceCard from './components/BalanceCard';
import RecentTransactionItem from './components/RecentTransactionItem';
import EmptyState from '../../config/widgets/EmptyState';
import {useAppTheme} from '../../config/theme/AppTheme';
import {Typography} from '../../config/theme/Typography';
import {AppDimensions} from '../../config/constants/AppDimensions';
import {useTransactionStore} from '../../store/useTransactionStore';
import {PREDEFINED_CATEGORIES} from '../../config/entities/Category';
import {getCurrentMonthKey} from '../../config/utils/DateUtils';
import {RootStackParamList, Routes} from '../../navigation/RouterConfig';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const HomeScreen = () => {
  const {theme, isDark, toggleTheme} = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {transactions, isLoading, loadTransactions, getCurrentMonthBalance} =
    useTransactionStore();

  const {income, expense, balance} = getCurrentMonthBalance();

  const recentTransactions = useMemo(() => {
    const monthKey = getCurrentMonthKey();
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return key === monthKey;
      })
      .slice(0, 6);
  }, [transactions]);

  const getCategoryById = (id: string) =>
    PREDEFINED_CATEGORIES.find(c => c.id === id) ?? PREDEFINED_CATEGORIES[PREDEFINED_CATEGORIES.length - 1];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadTransactions}
            tintColor={theme.primary}
          />
        }>
        <View style={styles.topRow}>
          <View>
            <Text style={[Typography.bodyMedium, {color: theme.textSecondary}]}>
              {getGreeting()} 👋
            </Text>
            <Text style={[Typography.headingLarge, {color: theme.textPrimary, marginTop: 2}]}>
              Dhan
            </Text>
          </View>
        </View>

        <BalanceCard
          balance={balance}
          income={income}
          expense={expense}
          onToggleTheme={toggleTheme}
          isDark={isDark}
        />

        <View style={styles.sectionHeader}>
          <Text style={[Typography.headingSmall, {color: theme.textPrimary}]}>
            Recent Transactions
          </Text>
          {recentTransactions.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.dispatch(
                  CommonActions.navigate({name: Routes.BOTTOM_TABS, params: {screen: Routes.TRANSACTIONS}}),
                )
              }>
              <Text style={[Typography.labelMedium, {color: theme.primary}]}>
                See All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {recentTransactions.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            title="No transactions yet"
            subtitle="Tap the + button to add your first income or expense"
          />
        ) : (
          recentTransactions.map((tx, i) => (
            <RecentTransactionItem
              key={tx.id}
              transaction={tx}
              category={getCategoryById(tx.categoryId)}
              index={i}
            />
          ))
        )}

        <View style={{height: AppDimensions.paddingXL}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: AppDimensions.paddingMD,
    paddingTop: AppDimensions.paddingMD,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppDimensions.paddingLG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: AppDimensions.paddingLG,
    marginBottom: AppDimensions.paddingMD,
  },
});

export default HomeScreen;
