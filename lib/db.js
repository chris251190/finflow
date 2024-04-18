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
      const db = connection.db(process.env.MONGODB_DB); // Ensure MONGODB_DB is set in your environment variables
      dbConnection = { db, client };
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.error("Could not connect to MongoDB.", error);
      throw error;
    }
  }
  return dbConnection;
}