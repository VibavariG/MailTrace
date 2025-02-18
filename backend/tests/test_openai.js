const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set
});

const testOpenAI = async () => {
  try {
    console.log("🔎 Testing OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Classify this email: 'Your application has been received.'" }],
      max_tokens: 50,
    });

    console.log("✅ OpenAI response:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.response?.data || error.message);
  }
};

testOpenAI();
