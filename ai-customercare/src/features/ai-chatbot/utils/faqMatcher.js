export const findTopRelevantFAQs = (userPrompt, faqs, topN = 5) => {
  const similarityScore = (str1, str2) => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter((word) => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  };

  const scoredFaqs = faqs.map((faq) => ({
    ...faq,
    score: similarityScore(userPrompt, faq.question),
  }));

  return scoredFaqs
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .filter((faq) => faq.score > 0);
};
