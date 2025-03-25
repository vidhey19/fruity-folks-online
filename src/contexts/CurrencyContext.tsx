
import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = {
  code: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
  name: string;
};

type CurrencyContextType = {
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
};

const currencies: Currency[] = [
  { code: "USD", symbol: "$", rate: 1, name: "US Dollar" },
  { code: "EUR", symbol: "€", rate: 0.92, name: "Euro" },
  { code: "GBP", symbol: "£", rate: 0.79, name: "British Pound" },
  { code: "INR", symbol: "₹", rate: 83.5, name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", rate: 150.2, name: "Japanese Yen" },
];

const CurrencyContext = createContext<CurrencyContextType>({
  currencies,
  selectedCurrency: currencies[0],
  setSelectedCurrency: () => {},
  formatPrice: () => "",
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved currency from localStorage, default to USD
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    return savedCurrency 
      ? currencies.find(c => c.code === savedCurrency) || currencies[0] 
      : currencies[0];
  });

  // Save selected currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedCurrency", selectedCurrency.code);
  }, [selectedCurrency]);

  // Format price based on selected currency
  const formatPrice = (price: number): string => {
    const convertedPrice = price * selectedCurrency.rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      maximumFractionDigits: 2
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currencies, 
      selectedCurrency, 
      setSelectedCurrency,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
