const { google } = require("googleapis");
const { oauth2Client } = require("../utils/googleAuth");

const listEmails = async (req, res) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      q: 'subject:"thank you for applying"',
    });
    res.json(response.data.messages);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Failed to fetch emails.");
  }
};

module.exports = { listEmails };
