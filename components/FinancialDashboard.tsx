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
                credentials: 'include'  // Stellen Sie sicher, dass Cookies mitgesendet werden
            });
            if (response.ok) {
                const data = await response.json();
                setFinancialData(data);
            }
        };

        fetchData();
    }, []);

    if (!financialData) {
        return <div>No data yet...</div>;
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