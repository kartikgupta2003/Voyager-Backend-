const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// It gives you access to Google’s Gemini API client, so you can call the AI model.

module.exports = genAI;