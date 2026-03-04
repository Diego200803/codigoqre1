import React, { createContext, useContext, useState } from 'react';

type BalanceContextType = {
  balance: number;
  discount: (amount: number) => void;
};

const BalanceContext = createContext<BalanceContextType>({
  balance: 100000,
  discount: () => {},
});

export const useBalance = () => useContext(BalanceContext);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(100000);

  const discount = (amount: number) => {
    setBalance(prev => prev - amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, discount }}>
      {children}
    </BalanceContext.Provider>
  );
}