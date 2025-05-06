import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "../utils/promptBuilder";
import { generationConfig, safetySettings } from "../config/geminiConfig";
import { getUserFAQs } from "../../faq-management/services/faqService";
import { saveChat } from "./ chatHistoryService";
import { generateCustomerId } from "../utils/customerUtils";

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

      const formattedHistory = history.map((msg) => ({
        user: msg.user || (msg.sender === "user" ? "User" : "AI Assistant"),
        response: msg.message,
      }));

      const prompt = buildPrompt(userPrompt, formattedHistory, faqs);
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

    const customerId =
      localStorage.getItem("customerId") || generateCustomerId();

    const currentTime = new Date();

    const userMessage = {
      user: "User",
      message: userInput,
      sender: "user",
      timestamp: currentTime,
      time: currentTime.toLocaleTimeString(),
    };
    await saveChat(customerId, userInput, "user");

    const aiResponse = await generateResponse(userInput, [
      ...history,
      userMessage,
    ]);

    const aiMessage = {
      user: "AI Assistant",
      message: aiResponse,
      sender: "ai",
      timestamp: new Date(),
      time: new Date().toLocaleTimeString(),
    };

    await saveChat(customerId, aiResponse, "ai");

    return [...history, userMessage, aiMessage];
  };

  return {
    generateResponse,
    handleSend,
    isLoading,
    error,
    faqs,
  };
};
