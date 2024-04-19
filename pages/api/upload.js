import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Deaktivieren Sie den standardmäßigen Body-Parser von Next.js
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Es gab einen Fehler beim Datei-Upload.' });
      return;
    }
    // Hier können Sie die Datei verarbeiten, z.B. in einen Cloud-Speicher hochladen
    // Beispiel: Dateiinformationen ausgeben
    console.log(files); // Enthält Informationen über die hochgeladenen Dateien

    res.status(200).json({ message: 'Datei erfolgreich hochgeladen', files });
  });
}