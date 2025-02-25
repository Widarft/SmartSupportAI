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
  const [selectedCategory, setSelectedCategory] = useState(null);

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
      <h3 className="font-bold text-lg text-blue-600">
        Frequently Asked Questions
      </h3>
      <p className="mb-4 text-sm text-gray-700">
        Select one of the categories below that you are looking for
      </p>

      {categories.length > 0 && (
        <div className="mb-4 space-y-2">
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
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>

              {selectedCategory === category && (
                <div className="p-4 bg-gray-50 border-t">
                  {filteredFaqs.length === 0 ? (
                    <p className="text-gray-600">
                      Tidak ada FAQ dalam kategori ini.
                    </p>
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
                            <h4 className="font-semibold text-gray-800">
                              {faq.question}
                            </h4>
                            {expandedId === faq.id ? (
                              <FaChevronUp className="text-blue-600" />
                            ) : (
                              <FaChevronDown className="text-gray-400" />
                            )}
                          </button>

                          {expandedId === faq.id && (
                            <div className="p-4 bg-gray-50 border-t">
                              <p className="text-gray-600">{faq.answer}</p>
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
