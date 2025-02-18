const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const testConnection = async () => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    client.close();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

testConnection();
