import React, { useState, useEffect } from "react";
import { getUserFAQs } from "../../faq-management/services/faqService";
import { BiLoaderAlt } from "react-icons/bi";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const FAQPageChat = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <BiLoaderAlt className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">Memuat FAQ...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-sm text-center">
          <p>{error}</p>
          <button
            className="mt-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-2">
          <FaQuestionCircle className="text-blue-600 w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-blue-600">
          Frequently Asked Questions
        </h3>
        <p className="text-sm text-gray-700">
          Pilih salah satu kategori di bawah ini untuk menemukan jawaban
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Tidak ada FAQ tersedia saat ini.</p>
        </div>
      ) : (
        <div className={`space-y-3 ${isMobile ? "pb-16" : ""}`}>
          {categories.map((category) => (
            <div
              key={category}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => handleCategoryClick(category)}
                className="w-full p-4 text-left bg-white flex justify-between items-center"
              >
                <h4 className="font-semibold text-gray-800">{category}</h4>
                {selectedCategory === category ? (
                  <FaChevronUp className="text-blue-600 flex-shrink-0 ml-2" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0 ml-2" />
                )}
              </button>

              {selectedCategory === category && (
                <div className="bg-gray-50 border-t">
                  {filteredFaqs.length === 0 ? (
                    <p className="text-gray-600 p-4">
                      Tidak ada FAQ dalam kategori ini.
                    </p>
                  ) : (
                    <div className="p-3 space-y-2">
                      {filteredFaqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="border bg-white rounded-lg overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleExpand(faq.id)}
                            className="w-full p-3 text-left flex justify-between items-center"
                          >
                            <h4 className="font-medium text-gray-800 text-sm">
                              {faq.question}
                            </h4>
                            {expandedId === faq.id ? (
                              <FaChevronUp className="text-blue-600 flex-shrink-0 ml-2" />
                            ) : (
                              <FaChevronDown className="text-gray-400 flex-shrink-0 ml-2" />
                            )}
                          </button>

                          {expandedId === faq.id && (
                            <div className="p-3 bg-blue-50 border-t text-sm">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
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
