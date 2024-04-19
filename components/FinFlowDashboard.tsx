import React, { useEffect, useState } from 'react';

interface FinancialData {
    date: string;
    earnings: number;
    expenses: number;
    balance: number;
}

interface FinancialSummary {
    totalEarnings: number;
    totalExpenses: number;
    finalBalance: number;
    startDate: string;
    endDate: string;
}

const FinFlowDashboard: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [summary, setSummary] = useState<FinancialSummary | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/financial-data', {
                credentials: 'include'  // Stellen Sie sicher, dass Cookies mitgesendet werden
            });
            if (response.ok) {
                const data: FinancialData[] = await response.json();
                setFinancialData(data);
                calculateSummary(data);
            }
        };

        const calculateSummary = (data: FinancialData[]) => {
            const totalEarnings = data.reduce((acc, curr) => acc + curr.earnings, 0);
            const totalExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
            const finalBalance = totalEarnings - totalExpenses;
            const startDate = data.length > 0 ? data[0].date : '';
            const endDate = data.length > 0 ? data[data.length - 1].date : '';
            setSummary({ totalEarnings, totalExpenses, finalBalance, startDate, endDate });
        };

        fetchData();
    }, []);

    if (!financialData.length) {
        return <div>No data yet...</div>;
    }

    return (
        <div>
            <h1>Finanzübersicht</h1>
            {financialData.map((data, index) => (
                <div key={index}>
                    <h2>{data.date}</h2>
                    <p>Einnahmen: {data.earnings}€</p>
                    <p>Ausgaben: {data.expenses}€</p>
                    <p>Saldo: {data.balance}€</p>
                </div>
            ))}
            {summary && (
                <div>
                    <h2>Zusammenfassung</h2>
                    <p>Zeitraum: {summary.startDate} bis {summary.endDate}</p>
                    <p>Gesamteinnahmen: {summary.totalEarnings}€</p>
                    <p>Gesamtausgaben: {summary.totalExpenses}€</p>
                    <p>Aktuelles Saldo: {summary.finalBalance}€</p>
                </div>
            )}
        </div>
    );
};

export default FinFlowDashboard;