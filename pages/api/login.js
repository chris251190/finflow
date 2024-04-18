import { connectToDatabase } from '../../lib/db';
import { verifyPassword } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body;

  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    res.status(403).json({ message: 'Invalid password' });
    return;
  }

  res.status(200).json({ message: 'Logged in!' });
}