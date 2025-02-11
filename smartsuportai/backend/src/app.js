import express from "express";
import dotenv from "dotenv";
import chatbotRoutes from "./features/aichatbot/routes/chatbotRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Chatbot Backend is Running...");
});

export default app;
