export const buildPrompt = (userPrompt, history, faqs) => {
  const contextPrompt = history
    .map(
      (item, index) => `Message #${index + 1}
    From: ${item.user}
    Time: ${item.time}
    Content: ${item.response || item.message}
    ---`
    )
    .join("\n");

  const faqsContext = faqs
    .map(
      (faq) =>
        `Question: ${faq.question}\nAnswer: ${faq.answer}\nCategory: ${faq.category}\n---`
    )
    .join("\n");

  return `
          You are a customer service AI assistant.
          You have access to our FAQ database and conversation history.
          
          FAQ Database:
          ${faqsContext}
  
          Complete conversation history:
          ${contextPrompt}
      
          Current user message: ${userPrompt}
      
          AI Assistant:
        `;
};
