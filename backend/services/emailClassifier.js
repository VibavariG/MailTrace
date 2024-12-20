const openai = require("../utils/openAiConfig");

/**
 * Classify the email content into predefined categories using GPT.
 * @param {string} emailContent - The subject and body of the email combined.
 * @returns {Promise<string>} - The category of the email.
 */
const classifyEmail = async (emailContent) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use GPT-4 Turbo model
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that classifies emails into categories.",
        },
        {
          role: "user",
          content: `
            Classify the following email into one of these categories:
            - Application Received
            - Rejection Email
            - Online Assessment
            - Interview Invite
            - Unrelated

            Email Content: ${emailContent}

            Return only the category name.
          `,
        },
      ],
      max_tokens: 50,
      temperature: 0.2, // Make the response deterministic
    });

    // Extract the response content
    const category = response.choices[0].message.content.trim();
    return category;
  } catch (error) {
    console.error("Error classifying email:", error.response?.data || error.message);
    throw new Error("Failed to classify email.");
  }
};

module.exports = { classifyEmail };
