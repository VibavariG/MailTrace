const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI; 
const dbName = "mailtrace";
const collectionName = "emails";

let client;

const connectDB = async () => {
  if (!client) {
    client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }
  return client.db(dbName).collection(collectionName);
};

const saveEmailToDB = async (emailData) => {
    try {
      const collection = await connectDB();
      
      console.log(`📌 Attempting to save email: ${JSON.stringify(emailData, null, 2)}`); // Debug log
      
      const result = await collection.updateOne(
        { id: emailData.id },
        { $set: emailData },
        { upsert: true }
      );
      
      if (result.modifiedCount > 0 || result.upsertedCount > 0) {
        console.log(`✅ Email saved: ${emailData.subject} -> ${emailData.category}`);
      } else {
        console.log(`⚠️ No changes made to MongoDB. Email might already exist.`);
      }
    } catch (error) {
      console.error("❌ Error saving email:", error);
    }
  };

module.exports = { connectDB, saveEmailToDB };
