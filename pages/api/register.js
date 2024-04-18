import { connectToDatabase } from '../../lib/db';
import { hashPassword } from '../../lib/auth'; // Sie müssen diese Funktion noch erstellen

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password || password.trim().length < 7) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const { db } = await connectToDatabase();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password); // Implementieren Sie diese Funktion basierend auf einem Passwort-Hashing-Algorithmus wie bcrypt

  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: 'User created' });
}