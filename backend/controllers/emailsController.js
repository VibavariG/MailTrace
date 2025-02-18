const { fetchEmails } = require("../services/emailFetcher");
const { connectDB } = require("../services/emailStorage"); 

const listEmails = async (req, res) => {
  try {
    const collection = await connectDB();  
    const emails = await collection.find({}).toArray();
    res.json(emails);
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails", details: error.message });
  }
};


const refreshEmails = async (req, res) => {
  try {
    const { startDate, endDate } = req.body; // Get date range from request body

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Missing startDate or endDate parameters" });
    }

    console.log(`🔄 Refreshing emails from ${startDate} to ${endDate}...`);
    
    const emails = await fetchEmails(startDate, endDate);
    res.json({ message: "Emails refreshed successfully", count: emails.length });
  } catch (error) {
    console.error("❌ Error in refreshEmails:", error);
    res.status(500).json({ error: "Failed to refresh emails", details: error.message });
  }
};

module.exports = { listEmails, refreshEmails };
