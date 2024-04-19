import React, { useEffect, useState } from 'react';
import { useFinancialData } from '../contexts/FinancialDataContext';
import { useUploads } from '../contexts/UploadsContext';
import { DocumentModal } from './DocumentModal';
import { IncrementalCache } from 'next/dist/server/lib/incremental-cache';


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
    const { financialData, reloadData } = useFinancialData();
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const { uploads, fetchUploadsForDate } = useUploads();
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        reloadData();
    }, [reloadData]);

    const calculateSummary = (data: FinancialData[]) => {
        const totalEarnings = data.reduce((acc, curr) => acc + curr.earnings, 0);
        const totalExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
        const finalBalance = totalEarnings - totalExpenses;
        const startDate = data.length > 0 ? formatDate(data[0].date) : '';
        const endDate = data.length > 0 ? formatDate(data[data.length - 1].date) : '';
        setSummary({ totalEarnings, totalExpenses, finalBalance, startDate, endDate });
    };

    useEffect(() => {
        if (financialData.length > 0) {
            calculateSummary(financialData);
            financialData.forEach((data) => {
                fetchUploadsForDate(data.date);
            });
        }
    }, [financialData, uploads]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    };

    const handleDocumentClick = (document: any) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
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
                        <p className="text-md mb-2">Einnahmen: <span className="font-semibold">{data.earnings.toFixed(2)}€</span></p>
                        <p className="text-md mb-2">Ausgaben: <span className="font-semibold">{data.expenses.toFixed(2)}€</span></p>
                        <p className="text-md mb-2">Saldo: <span className="font-semibold">{data.balance ? data.balance.toFixed(2) : '0.00'}€</span></p>

                        {uploads[data.date] && uploads[data.date].length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold">Uploads:</h3>
                                <ul>
                                    {uploads[data.date].map((upload, uploadIndex) => (
                                        <li key={uploadIndex} onClick={() => handleDocumentClick(upload)}><a href="#" onClick={(e) => e.preventDefault()}>{upload.originalName}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {selectedDocument && <DocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} document={selectedDocument} />}
            {summary && (
                <div className="mt-8 p-6 bg-blue-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Zusammenfassung</h2>
                    <p className="text-md mb-2">Zeitraum: <span className="font-semibold">{summary.startDate} bis {summary.endDate}</span></p>
                    <p className="text-md mb-2">Gesamteinnahmen: <span className="font-semibold">{summary.totalEarnings.toFixed(2)}€</span></p>
                    <p className="text-md mb-2">Gesamtausgaben: <span className="font-semibold">{summary.totalExpenses.toFixed(2)}€</span></p>
                    <p className="text-md">Aktuelles Saldo: <span className="font-semibold">{summary.finalBalance ? summary.finalBalance.toFixed(2) : '0.00'}€</span></p>
                </div>
            )}
        </div>
    );
};

export default FinFlowDashboard;