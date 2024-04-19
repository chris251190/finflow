import { IncomingForm } from 'formidable';
import { connectToDatabase } from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false, // Deaktivieren Sie den standardmäßigen Body-Parser von Next.js
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Nicht authentifiziert!' });
    return;
  }

  const userEmail = session.user.email;

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Es gab einen Fehler beim Datei-Upload.' });
      return;
    }

    const { db } = await connectToDatabase();

    // Annahme: Die Datei wird als 'file' gesendet
    const file = files.file;

    // Dateiinformationen vorbereiten
    const fileData = {
      userEmail: userEmail,
      originalName: file.originalFilename,
      path: file.filepath,
      type: file.mimetype,
      size: file.size,
    };

    try {
      const result = await db.collection('uploadedFiles').insertOne(fileData);
      res.status(200).json({ message: 'Datei erfolgreich hochgeladen', result });
    } catch (dbError) {
      res.status(500).json({ error: 'Fehler beim Speichern der Dateiinformationen in der Datenbank.' });
    }
  });
}