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
            const startDate = data.length > 0 ? formatDate(data[0].date) : '';
            const endDate = data.length > 0 ? formatDate(data[data.length - 1].date) : '';
            setSummary({ totalEarnings, totalExpenses, finalBalance, startDate, endDate });
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    };

    if (!financialData.length) {
        return <div className="text-center py-5">No data yet...</div>;
    }

    return (
        <div className="m-10 mx-auto px-4">
            <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialData.map((data, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{formatDate(data.date)}</h2>
                        <p className="text-md mb-2">Einnahmen: <span className="font-semibold">{data.earnings}€</span></p>
                        <p className="text-md mb-2">Ausgaben: <span className="font-semibold">{data.expenses}€</span></p>
                        <p className="text-md">Saldo: <span className="font-semibold">{data.balance}€</span></p>
                    </div>
                ))}
            </div>
            {summary && (
                <div className="mt-8 p-6 bg-blue-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Zusammenfassung</h2>
                    <p className="text-md mb-2">Zeitraum: <span className="font-semibold">{summary.startDate} bis {summary.endDate}</span></p>
                    <p className="text-md mb-2">Gesamteinnahmen: <span className="font-semibold">{summary.totalEarnings}€</span></p>
                    <p className="text-md mb-2">Gesamtausgaben: <span className="font-semibold">{summary.totalExpenses}€</span></p>
                    <p className="text-md">Aktuelles Saldo: <span className="font-semibold">{summary.finalBalance}€</span></p>
                </div>
            )}
        </div>
    );
};

export default FinFlowDashboard;