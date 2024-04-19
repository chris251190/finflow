import { connectToDatabase } from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Nicht authentifiziert!' });
  }

  const userEmail = session.user.email;
  const { date } = req.query; // Datum aus den Query-Parametern extrahieren

  if (!date) {
    return res.status(400).json({ message: 'Datum ist erforderlich.' });
  }

  const { db } = await connectToDatabase();

  // Konvertieren Sie das Datum in ein Date-Objekt, um den Beginn und das Ende des Tages zu bestimmen
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  try {
    const uploads = await db.collection('uploadedFiles').find({
      userEmail,
      uploadDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).toArray();

    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Uploads.' });
  }
}