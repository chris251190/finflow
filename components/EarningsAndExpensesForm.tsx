import React, { useState } from 'react';

const EarningsAndExpensesForm: React.FC = () => {
    const [type, setType] = useState('earnings');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/financial-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, amount: Number(amount) }),
                credentials: 'include'  // Stellen Sie sicher, dass Cookies mitgesendet werden
            });
            if (response.ok) {
                setType('earnings');
                setAmount('');
                alert('Finanzdaten erfolgreich aktualisiert');
            } else {
                alert('Fehler beim Aktualisieren der Finanzdaten');
            }
        } catch (error) {
            console.error('Fehler beim Senden der Daten', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Typ:
                    <select value={type} onChange={(e) => setType(e.target.value)} className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="earnings">Einnahmen</option>
                        <option value="expenses">Ausgaben</option>
                    </select>
                </label>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Betrag:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </label>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Hinzufügen</button>
        </form>
    );
};

export default EarningsAndExpensesForm;