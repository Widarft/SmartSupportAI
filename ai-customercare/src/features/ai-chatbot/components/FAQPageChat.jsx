import React, { useState, useEffect } from "react";
import { getUserFAQs } from "../../faq-management/services/faqService";
import { BiLoaderAlt } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQPageChat = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        const faqData = await getUserFAQs();
        setFaqs(faqData);

        const uniqueCategories = [
          ...new Set(faqData.map((faq) => faq.category)),
        ].filter((category) => category);

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error loading FAQs:", err);
        setError("Gagal memuat FAQ. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <BiLoaderAlt className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="font-bold text-lg mb-4 text-blue-600">Pertanyaan Umum</h3>

      {categories.length > 0 && (
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredFaqs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {selectedCategory
            ? `Tidak ada FAQ dalam kategori "${selectedCategory}"`
            : "Belum ada FAQ tersedia. Silakan tambahkan FAQ melalui menu pengelolaan FAQ."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full p-4 text-left bg-white flex justify-between items-center"
              >
                <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                {expandedId === faq.id ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>

              {expandedId === faq.id && (
                <div className="p-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                  {faq.category && (
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQPageChat;
