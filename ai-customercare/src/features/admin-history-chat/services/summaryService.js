import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateChatSummary = async (chatHistory) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1000,
      },
    });

    const prompt = `
      Anda adalah asisten customer service yang ahli dalam menganalisis percakapan.
      Buatkan rangkuman percakapan berikut dalam poin-poin penting dengan format:
      
      - Masalah utama: [jelaskan masalah utama]
      - Solusi yang diberikan: [poin solusi]
      - Kesimpulan: [ringkasan akhir]
      - Rekomendasi: [saran tindak lanjut jika ada]
      - Saran FAQ : [saran jika perlu penambahan di FAQ jika chatbot tidak bisa menjawab, jika chatbot bisa menjawab, tidak perlu]
      
      Percakapan:
      ${chatHistory.map((chat) => `${chat.sender}: ${chat.message}`).join("\n")}
    `;

    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};
