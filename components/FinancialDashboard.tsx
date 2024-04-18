import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface FinancialData {
    earnings: number;
    expenses: number;
    balance: number;
}

const FinancialDashboard: React.FC = () => {
    const { data: session } = useSession();
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Session in useEffect", session);
            if (session) {
                const response = await fetch('/api/financial-data');
                if (response.ok) {
                    const data = await response.json();
                    setFinancialData(data);
                    console.log(data); // Log the financial data here
                }
            }
        };

        fetchData();
    }, [session]);

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