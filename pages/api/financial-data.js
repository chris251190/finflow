import { connectToDatabase } from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;

  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { type, amount } = req.body; // `type` kann 'earnings' oder 'expenses' sein, `amount` ist der Betrag

    // Prüfen, ob für heute bereits Daten vorhanden sind
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntry = await db.collection('financialData').findOne({
      userEmail,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingEntry) {
      // Aktualisieren des vorhandenen Eintrags
      const update = { $inc: {} };
      update.$inc[type] = amount; // Erhöht `earnings` oder `expenses` um `amount`
      update.$inc.balance = type === 'earnings' ? amount : -amount; // Aktualisiert den Saldo

      await db.collection('financialData').updateOne({ _id: existingEntry._id }, update);
    } else {
      // Erstellen eines neuen Eintrags, wenn noch keiner für heute existiert
      const entry = {
        userEmail,
        earnings: type === 'earnings' ? amount : 0,
        expenses: type === 'expenses' ? amount : 0,
        balance: type === 'earnings' ? amount : -amount,
        date: new Date(),
      };

      await db.collection('financialData').insertOne(entry);
    }

    res.status(201).json({ message: 'Data updated' });
  } else if (req.method === 'GET') {
    let data = await db.collection('financialData').find({ userEmail }).toArray();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}