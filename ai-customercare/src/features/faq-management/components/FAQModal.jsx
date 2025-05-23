import React from "react";
import PropTypes from "prop-types";

const FAQModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const [formData, setFormData] = React.useState({
    question: "",
    answer: "",
    category: "",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || "",
        answer: initialData.answer || "",
        category: initialData.category || "",
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        category: "",
      });
    }
  }, [initialData, isOpen]);

  const handleClose = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
    });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          {initialData?.id ? "Edit FAQ" : "Add FAQ"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Answer"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {initialData?.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FAQModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  categories: PropTypes.array.isRequired,
};

export default FAQModal;
