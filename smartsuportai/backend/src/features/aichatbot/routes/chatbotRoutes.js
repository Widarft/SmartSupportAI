import express from "express";
import { generateResponse } from "../services/chatbotService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { userPrompt, history, faqs } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "User prompt is required" });
    }

    const response = await generateResponse(userPrompt, history, faqs);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
