import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generationConfig, safetySettings } from "../config/geminiConfig.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResponse = async (userPrompt, history = [], faqs = []) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    const prompt = buildPrompt(userPrompt, history, faqs);
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response;
  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("Terjadi kesalahan saat menghubungi AI.");
  }
};
