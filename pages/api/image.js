import { connectToDatabase } from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'Nicht authentifiziert!' });
    }

    const { id } = req.query; // ID des Bildes aus den Query-Parametern extrahieren

    if (!id) {
        return res.status(400).json({ message: 'ID ist erforderlich.' });
    }

    const { db } = await connectToDatabase();

    try {
        const image = await db.collection('images').findOne({ _id: new ObjectId(id) });
        if (!image) {
            return res.status(404).json({ message: 'Bild nicht gefunden.' });
        }
        res.setHeader('Content-Type', image.contentType);
        res.send(image.data.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Abrufen des Bildes.' });
    }
}
