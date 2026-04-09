import {AppConstants} from '../constants/AppConstants';

export const formatCurrency = (amount: number, compact = false): string => {
  if (compact) {
    if (amount >= 10000000) {
      return `${AppConstants.CURRENCY_SYMBOL}${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `${AppConstants.CURRENCY_SYMBOL}${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `${AppConstants.CURRENCY_SYMBOL}${(amount / 1000).toFixed(1)}K`;
    }
  }
  return `${AppConstants.CURRENCY_SYMBOL}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const parseAmount = (text: string): number => {
  const cleaned = text.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};
