import mongoose, { connection } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connectionObject: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connectionObject.isConnected) {
    console.log("Already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL!);

    connectionObject.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.log("Database connection error");
    console.log(error);
    process.exit(1);
  }
}

export default dbConnection;
