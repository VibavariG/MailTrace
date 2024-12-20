const express = require("express");
const router = express.Router();
const { getAuthURL, oauth2Client } = require("../utils/googleAuth");
const { listEmails } = require("../controllers/emailsController");

router.get("/auth", (req, res) => {
  const url = getAuthURL();
  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.json({ message: "Authorization successful", tokens });
});

router.get("/emails", listEmails);

module.exports = router;
