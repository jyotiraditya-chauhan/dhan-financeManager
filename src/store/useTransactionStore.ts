import {create} from 'zustand';
import {Transaction, TransactionType} from '../config/entities/Transaction';
import {AppConstants} from '../config/constants/AppConstants';
import {StorageUtils} from '../config/utils/StorageUtils';
import {getMonthKey} from '../config/utils/DateUtils';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getByMonth: (monthKey: string) => Transaction[];
  getTotalByTypeAndMonth: (type: TransactionType, monthKey: string) => number;
  getBalance: () => number;
  getCurrentMonthBalance: () => {income: number; expense: number; balance: number};
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  loadTransactions: async () => {
    set({isLoading: true});
    const data = await StorageUtils.get<Transaction[]>(AppConstants.STORAGE_KEYS.TRANSACTIONS);
    set({transactions: data ?? [], isLoading: false});
  },

  addTransaction: async tx => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...get().transactions];
    set({transactions: updated});
    await StorageUtils.set(AppConstants.STORAGE_KEYS.TRANSACTIONS, updated);
  },

  deleteTransaction: async id => {
    const updated = get().transactions.filter(t => t.id !== id);
    set({transactions: updated});
    await StorageUtils.set(AppConstants.STORAGE_KEYS.TRANSACTIONS, updated);
  },

  getByMonth: monthKey => {
    return get().transactions.filter(t => getMonthKey(t.date) === monthKey);
  },

  getTotalByTypeAndMonth: (type, monthKey) => {
    return get()
      .getByMonth(monthKey)
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getBalance: () => {
    return get().transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
  },

  getCurrentMonthBalance: () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const income = get().getTotalByTypeAndMonth('income', monthKey);
    const expense = get().getTotalByTypeAndMonth('expense', monthKey);
    return {income, expense, balance: income - expense};
  },
}));
