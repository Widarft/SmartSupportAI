import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "../utils/promptBuilder";
import { generationConfig, safetySettings } from "../config/geminiConfig";
import { getUserFAQs } from "../../faq-management/services/faqService";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const useCustomerServiceAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const loadFAQs = async () => {
      const faqData = await getUserFAQs();
      setFaqs(faqData);
    };
    loadFAQs();
  }, []);

  const generateResponse = async (userPrompt, history = []) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("API Key is not defined. Check your .env file.");
      }

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
      setError(err.message);
      return "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi customer service kami.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (userInput, history) => {
    if (!userInput.trim()) return history;

    const userMessage = {
      user: "User",
      message: userInput,
      time: new Date().toLocaleTimeString(),
    };

    const updatedHistory = [...history, userMessage];
    const aiResponse = await generateResponse(userInput, updatedHistory);

    const aiMessage = {
      user: "AI Assistant",
      message: aiResponse,
      time: new Date().toLocaleTimeString(),
    };

    return [...updatedHistory, aiMessage];
  };

  return {
    generateResponse,
    handleSend,
    isLoading,
    error,
    faqs,
  };
};
