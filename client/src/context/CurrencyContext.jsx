import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, locale: 'en-IN' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.0, locale: 'ja-JP' },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('globetrotter_currency');
      return saved && SUPPORTED_CURRENCIES[saved] ? saved : 'USD';
    } catch (_) {
      return 'USD';
    }
  });

  useEffect(() => {
    localStorage.setItem('globetrotter_currency', currency);
  }, [currency]);

  const setCurrency = (code) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
    }
  };

  /**
   * Formats a base USD amount into the active currency with appropriate symbol and commas.
   * @param {number} amountInUSD Base amount in USD
   * @param {string} [overrideCurrency] Optional currency override
   * @returns {string} e.g. "$1,250", "₹1,04,375", "€1,150"
   */
  const formatCurrency = (amountInUSD, overrideCurrency) => {
    const currCode = overrideCurrency || currency;
    const info = SUPPORTED_CURRENCIES[currCode] || SUPPORTED_CURRENCIES.USD;
    const num = Number(amountInUSD) || 0;
    const converted = num * info.rate;

    const formattedNumber = Math.round(converted).toLocaleString(info.locale);
    return `${info.symbol}${formattedNumber}`;
  };

  const activeCurrencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: activeCurrencyInfo.symbol,
        activeCurrencyInfo,
        supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
