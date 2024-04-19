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

  const { db } = await connectToDatabase();

  try {
    const uploads = await db.collection('uploadedFiles').find({
      userEmail
    }).toArray();

    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Uploads.' });
  }
}