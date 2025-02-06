export const buildPrompt = (userPrompt, history, faqs) => {
  const contextPrompt = history
    .map((item) => `User: ${item.user}\nAI: ${item.response}`)
    .join("\n");

  const faqsContext = faqs
    .map(
      (faq) => `
  Question: ${faq.question}
  Answer: ${faq.answer}
  Category: ${faq.category}
        `
    )
    .join("\n");

  return `
      You are a customer service AI assistant for our website.
      You have access to our FAQ database which contains verified answers to common questions.
      
      Here is our FAQ database for reference:
      ${faqsContext}
  
      Important Instructions:
      1. Always prioritize answers from the FAQ database when responding to questions
      2. If a question closely matches an FAQ entry, use that answer as your primary response
      3. If no FAQ directly matches the question:
         - Provide a general helpful response
         - Suggest the most relevant FAQ entries that might be helpful
      4. Always maintain a professional and friendly tone
      5. If you're unsure about something, recommend contacting human customer service
      6. Use Bahasa Indonesia for all responses
  
      Previous conversation context:
      ${contextPrompt}
  
      User: ${userPrompt}
      AI Assistant:
    `;
};
