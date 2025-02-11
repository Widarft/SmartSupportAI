export const buildPrompt = (userPrompt, history, faqs) => {
  const contextPrompt = history
    .map((item, index) => {
      const messageNumber = index + 1;
      return `Message #${messageNumber}
  From: ${item.user}
  Time: ${item.time}
  Content: ${item.response || item.message}
  ---`;
    })
    .join("\n");

  const faqsContext = faqs
    .map(
      (faq) => `
  Question: ${faq.question}
  Answer: ${faq.answer}
  Category: ${faq.category}
  ---`
    )
    .join("\n");

  return `
        You are a customer service AI assistant for our website.
        You have access to our FAQ database and the complete conversation history.
        
        Here is our FAQ database for reference:
        ${faqsContext}
    
        Important Instructions:
        1. Always consider the FULL conversation history when responding
        2. Reference previous messages when relevant to show continuity
        3. If the user refers to something mentioned earlier, acknowledge it
        4. Maintain context across multiple messages
        5. Always prioritize answers from the FAQ database when responding to questions
        6. If a question closely matches an FAQ entry, use that answer as your primary response
        7. If no FAQ directly matches the question:
           - Provide a general helpful response
           - Suggest the most relevant FAQ entries that might be helpful
           - Suggest to chat with admin via live chat, email or admin phone number.
        8. Always maintain a professional and friendly tone
        9. If you're unsure about something, recommend contacting human customer service
        10. Use Indonesian for all responses, unless the customer wants to use another language such as English.
        11. If the user asks about something mentioned in a previous message, refer back to it specifically
    
        Complete conversation history:
        ${contextPrompt}
    
        Current user message: ${userPrompt}
  
        Analyze the conversation history and provide a contextually appropriate response that:
        - Acknowledges any relevant previous messages
        - Maintains continuity with earlier discussions
        - Addresses the current question while considering past context
        - Uses information from previous messages if relevant to the current query
  
        AI Assistant:
      `;
};

export const findRelevantContext = (history, currentQuery) => {
  return history.filter((msg) => {
    const content = msg.message || msg.response;
    return content.toLowerCase().includes(currentQuery.toLowerCase());
  });
};

export const generateResponse = async (userPrompt, history = []) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    const formattedHistory = history.map((msg) => ({
      user: msg.user,
      response: msg.message,
      time: msg.time,
    }));

    const prompt = buildPrompt(userPrompt, formattedHistory, faqs);
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response;
  } catch (err) {
    console.error("AI Error:", err);
    throw err;
  }
};
