const { google } = require("googleapis");
const { oauth2Client } = require("../utils/googleAuth");
const { classifyEmail } = require("../services/emailClassifier");

const listEmails = async (req, res) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch all email messagess
    const response = await gmail.users.messages.list({ userId: "me", q: "" });
    if (!response.data.messages) return res.json([]); // No emails found

    // Process each email
    const emailDetails = await Promise.all(
      response.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        // Extract subject, sender, date, and body
        const headers = email.data.payload.headers;
        const subject = headers.find((header) => header.name === "Subject")?.value || "No Subject";
        const from = headers.find((header) => header.name === "From")?.value || "Unknown Sender";
        const date = headers.find((header) => header.name === "Date")?.value || "Unknown Date";

        const body = email.data.payload.parts?.find((part) => part.mimeType === "text/plain")?.body?.data || "";
        const decodedBody = Buffer.from(body, "base64").toString("utf8");

        const emailContent = `${subject} ${decodedBody}`; // Combine subject and body for analysis

        // Classify the email using OpenAI
        const category = await classifyEmail(emailContent);

        return { id: message.id, subject, from, date, category };
      })
    );

    // Filter out unrelated emails
    const relevantEmails = emailDetails.filter((email) => email.category !== "Unrelated");
    res.json(relevantEmails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Failed to fetch emails.");
  }
};

module.exports = { listEmails };
