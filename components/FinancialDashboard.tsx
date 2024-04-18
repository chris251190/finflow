import React, { useEffect, useState } from 'react';

interface FinancialData {
  earnings: number;
  expenses: number;
  balance: number;
}

const FinancialDashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/financial-data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Stellen Sie sicher, dass die Authentifizierung korrekt implementiert ist
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFinancialData(data);
      }
    };

    fetchData();
  }, []);

  if (!financialData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Finanzübersicht</h1>
      <p>Einnahmen: {financialData.earnings}€</p>
      <p>Ausgaben: {financialData.expenses}€</p>
      <p>Saldo: {financialData.balance}€</p>
    </div>
  );
};

export default FinancialDashboard;