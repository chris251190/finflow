import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FinancialData {
  date: string;
  earnings: number;
  expenses: number;
  balance: number;
}

interface FinancialDataContextType {
  financialData: FinancialData[];
  setFinancialData: (data: FinancialData[]) => void;
  reloadData: () => Promise<void>;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const useFinancialData = (): FinancialDataContextType => {  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};

export const FinancialDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);

  const reloadData = useCallback(async () => {
    const response = await fetch('/api/financial-data', { credentials: 'include' });
    if (response.ok) {
      const data: FinancialData[] = await response.json();
      setFinancialData(data);
    }
  }, []);

  return (
    <FinancialDataContext.Provider value={{ financialData, setFinancialData, reloadData }}>
      {children}
    </FinancialDataContext.Provider>
  );
};