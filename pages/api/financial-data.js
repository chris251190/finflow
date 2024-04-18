import { connectToDatabase } from '../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;
  console.log("User Email", userEmail);

  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { earnings, expenses } = req.body;

    const result = await db.collection('financialData').insertOne({
      userEmail,
      earnings,
      expenses,
      balance: earnings - expenses,
      date: new Date(),
    });

    res.status(201).json({ message: 'Data saved', result });
  } else if (req.method === 'GET') {
    const data = await db.collection('financialData').find({ userEmail }).toArray();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}