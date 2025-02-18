const { google } = require("googleapis");
const { oauth2Client } = require("../utils/googleAuth");
const { classifyEmail } = require("../services/emailClassifier");
const { saveEmailToDB } = require("../services/emailStorage");

const cleanEmailBody = (text) => {
    if (!text) return "";
  
    return text
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\n{2,}/g, "\n") // Remove excessive newlines
      .replace(/https?:\/\/[^\s]+/g, "") // Remove all links
      .replace(/\bUnsubscribe\b.*$/i, "") // Remove "Unsubscribe" sections
      .replace(/\bManage your job alerts\b.*$/i, "") // Remove job alert settings
      .replace(/\bHelp\b.*$/i, "") // Remove "Help" sections
      .replace(/\bLinkedIn and the LinkedIn logo\b.*$/i, "") // Remove LinkedIn footer
      .replace(/\bSee all jobs on LinkedIn\b.*$/i, "") // Remove LinkedIn job listings section
      .replace(/\bView job:\s*\n/g, "") // Remove "View job:" text
      .replace(/\bThis email was intended for\b.*$/i, "") // Remove personalization footer
      .replace(/\bYou are receiving Job Alert emails\b.*$/i, "") // Remove job alert disclaimers
      .replace(/-{2,}/g, "") // Remove long horizontal separators
      .replace(/(\s{2,})/g, " ") // Remove extra spaces
      .trim();
};
  
/**
 * Fetches emails from Gmail based on a given date range.
 * @param {string} startDate - Start date in YYYY/MM/DD format.
 * @param {string} endDate - End date in YYYY/MM/DD format.
 */
const fetchEmails = async (startDate, endDate) => {
    try {
      console.log(`🔄 Fetching emails from Gmail between ${startDate} and ${endDate}...`);
  
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      const query = `after:${startDate} before:${endDate}`;
  
      const response = await gmail.users.messages.list({ userId: "me", q: query });
  
      if (!response.data.messages) {
        console.log("⚠️ No emails found in the given date range.");
        return [];
      }
  
      const emailDetails = await Promise.all(
        response.data.messages.map(async (message) => {
          try {
            const email = await gmail.users.messages.get({ userId: "me", id: message.id });

            const headers = email.data.payload.headers;
            const subject = headers.find((header) => header.name === "Subject")?.value || "No Subject";
            const from = headers.find((header) => header.name === "From")?.value || "Unknown Sender";
            const date = headers.find((header) => header.name === "Date")?.value || "Unknown Date";
  
            const body = email.data.payload.parts?.find((part) => part.mimeType === "text/plain")?.body?.data || "";
            const decodedBody = Buffer.from(body, "base64").toString("utf8");

            const cleanBody = cleanEmailBody(decodedBody);
  
            const emailContent = `${subject} ${decodedBody}`;
            const category = await classifyEmail(emailContent);
  
            const emailData = { id: message.id, subject, from, date, category, body: cleanBody };
  
            console.log("📌 Calling saveEmailToDB()...");
            await saveEmailToDB(emailData);
  
            return emailData;
          } catch (emailError) {
            console.error("❌ Error processing email:", emailError);
            return null;
          }
        })
      );
  
      console.log("✅ Email fetching complete.");
      return emailDetails.filter((email) => email !== null);
    } catch (error) {
      console.error("❌ Error fetching emails:", error);
      throw new Error("Failed to fetch emails from Gmail");
    }
  };

module.exports = { fetchEmails };
