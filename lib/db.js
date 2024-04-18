import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

export async function connectToDatabase() {
  if (!dbConnection) {
    try {
      const connection = await client.connect();
      const db = connection.db(process.env.MONGODB_DB); // Stellen Sie sicher, dass MONGODB_DB in Ihren Umgebungsvariablen gesetzt ist
      dbConnection = { db, client };
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.error("Could not connect to MongoDB.", error);
      throw error;
    }
  }
  return dbConnection;
}