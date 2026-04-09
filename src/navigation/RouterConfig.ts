export const Routes = {
  BOTTOM_TABS: 'BottomTabs',
  HOME: 'Home',
  TRANSACTIONS: 'Transactions',
  STATS: 'Stats',
  ADD_TRANSACTION: 'AddTransaction',
} as const;

export type RootStackParamList = {
  [Routes.BOTTOM_TABS]: undefined;
  [Routes.ADD_TRANSACTION]: {type?: 'income' | 'expense'};
};

export type BottomTabParamList = {
  [Routes.HOME]: undefined;
  [Routes.TRANSACTIONS]: undefined;
  [Routes.STATS]: undefined;
};
