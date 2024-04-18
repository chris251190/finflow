import React, { useState } from 'react';
import { useSession } from 'next-auth/react';  // Importieren Sie useSession

const FinancialForm: React.FC = () => {
    const { data: session, status } = useSession();  // Verwenden Sie die useSession Hook
    const [type, setType] = useState('earnings');
    const [amount, setAmount] = useState('');

    // Überprüfen Sie den Session-Status und reagieren Sie entsprechend
    if (status === "loading") {
        return <div>Loading...</div>;  // Zeigen Sie eine Ladeanzeige, während die Session geladen wird
    }

    if (!session) {
        return <div>Please log in to submit financial data.</div>;  // Aufforderung zum Einloggen, wenn keine Session vorhanden ist
    }

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
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Typ:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="earnings">Einnahmen</option>
                        <option value="expenses">Ausgaben</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Betrag:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit">Hinzufügen</button>
        </form>
    );
};

export default FinancialForm;