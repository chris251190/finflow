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

export default EarningsAndExpensesForm;