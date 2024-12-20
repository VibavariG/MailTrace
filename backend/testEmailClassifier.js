const { classifyEmail } = require("./services/emailClassifier");

const emailContent = `Thank you for applying to ABC Inc. We are excited to proceed to the next step, which is an online assessment. Please complete it by this Friday.`;

classifyEmail(emailContent)
  .then((category) => {
    console.log("Email Category:", category);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
