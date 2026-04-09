import {TransactionType} from './Transaction';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
}

export const PREDEFINED_CATEGORIES: Category[] = [
  {id: 'salary', name: 'Salary', icon: 'briefcase', color: '#10B981', type: 'income'},
  {id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#06B6D4', type: 'income'},
  {id: 'investment', name: 'Investment', icon: 'chart-line', color: '#A855F7', type: 'income'},
  {id: 'business', name: 'Business', icon: 'store', color: '#F59E0B', type: 'income'},
  {id: 'other_income', name: 'Other', icon: 'plus-circle-outline', color: '#64748B', type: 'income'},
  {id: 'food', name: 'Food', icon: 'food-fork-drink', color: '#F59E0B', type: 'expense'},
  {id: 'housing', name: 'Housing', icon: 'home', color: '#8B5CF6', type: 'expense'},
  {id: 'transport', name: 'Transport', icon: 'car', color: '#3B82F6', type: 'expense'},
  {id: 'health', name: 'Health', icon: 'heart-pulse', color: '#EF4444', type: 'expense'},
  {id: 'entertainment', name: 'Fun', icon: 'television-play', color: '#EC4899', type: 'expense'},
  {id: 'shopping', name: 'Shopping', icon: 'shopping', color: '#14B8A6', type: 'expense'},
  {id: 'education', name: 'Education', icon: 'school', color: '#6366F1', type: 'expense'},
  {id: 'utilities', name: 'Utilities', icon: 'lightning-bolt', color: '#F97316', type: 'expense'},
  {id: 'other_expense', name: 'Other', icon: 'dots-horizontal', color: '#64748B', type: 'expense'},
];
