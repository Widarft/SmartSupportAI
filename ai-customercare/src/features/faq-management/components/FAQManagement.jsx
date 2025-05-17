import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getPaginatedFAQs,
  getFAQsCount,
} from "../services/faqService";
import { getUserCategories } from "../services/categoryService";
import Swal from "sweetalert2";
import FAQModal from "./FAQModal";

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [debugMessage, setDebugMessage] = useState("");

  useEffect(() => {
    console.log("Current filter category:", filterCategory);
    console.log("Current sort order:", sortOrder);

    fetchFAQs("first");
    fetchTotalCount();
  }, [sortOrder, filterCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTotalCount = async () => {
    try {
      const count = await getFAQsCount(filterCategory);
      console.log("Total count:", count);
      setTotalItems(count);
    } catch (error) {
      console.error("Error fetching count:", error);
      setDebugMessage("Error fetching count: " + error.message);
    }
  };

  const fetchFAQs = async (direction = "first") => {
    setIsLoading(true);
    setDebugMessage("");

    try {
      if (direction === "first") {
        setCurrentPage(1);
        setFirstVisible(null);
        setLastVisible(null);
      }

      console.log(
        `Fetching FAQs with category: "${filterCategory}" and direction: ${direction}`
      );

      const result = await getPaginatedFAQs(
        pageSize,
        sortOrder,
        direction === "next" ? lastVisible : null,
        direction === "prev" ? firstVisible : null,
        direction,
        filterCategory
      );

      console.log("Fetched FAQs:", result.faqs.length);

      setFaqs(result.faqs);
      setFirstVisible(result.firstVisible);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);

      if (direction === "next" && result.faqs.length > 0) {
        setCurrentPage((prev) => prev + 1);
      } else if (direction === "prev" && result.faqs.length > 0) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }

      if (result.faqs.length === 0) {
        setDebugMessage(`There is no data by category "${filterCategory}"`);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setDebugMessage("Error: " + error.message);
      Swal.fire("Error!", "Failed to fetched FAQ data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getUserCategories();
      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (formData) => {
    let response;

    if (selectedFAQ) {
      response = await updateFAQ(selectedFAQ.id, formData);
    } else {
      response = await addFAQ(
        formData.question,
        formData.answer,
        formData.category
      );
    }

    if (response.success) {
      Swal.fire("Success!", response.message, "success");
      fetchFAQs("first");
      fetchTotalCount();
      handleCloseModal();
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  const handleDelete = async (faqId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      const response = await deleteFAQ(faqId);
      if (response.success) {
        Swal.fire("Deleted!", response.message, "success");
        fetchFAQs("first");
        fetchTotalCount();
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFAQ(null);
  };

  const handleNextPage = () => {
    if (hasMore) {
      fetchFAQs("next");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchFAQs("prev");
    }
  };

  const handleFilterChange = (e) => {
    const newCategory = e.target.value;
    console.log("Setting filter category to:", newCategory);
    setFilterCategory(newCategory);

    setCurrentPage(1);
    setFirstVisible(null);
    setLastVisible(null);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "newest" ? "oldest" : "newest"
    );
    setCurrentPage(1);
    setFirstVisible(null);
    setLastVisible(null);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-6 max-w-[1440px] bg-gray-50 rounded-lg w-full overflow-x-auto">
      <h2 className="text-3xl font-semibold mb-6">FAQ Management</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          {/* Dropdown Filter */}
          <select
            className="border p-2 rounded-md min-w-[150px]"
            onChange={handleFilterChange}
            value={filterCategory}
          >
            <option value="">All Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Tombol Sort */}
          <button
            onClick={toggleSortOrder}
            className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-100 transition"
            title={sortOrder === "newest" ? "Sort by newest" : "Sort by oldest"}
          >
            {sortOrder === "newest" ? (
              <>
                <FaSortAmountDown className="mr-2" />
                <span>Newest</span>
              </>
            ) : (
              <>
                <FaSortAmountUpAlt className="mr-2" />
                <span>Oldest</span>
              </>
            )}
          </button>

          {/* Tombol Tambah */}
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Add New FAQ
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="p-6 max-w-[1440px] bg-gray-50 rounded-lg w-full mx-auto">
            <table className="w-max border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 w-10">No</th>
                  <th className="border p-2 w-36">Date</th>
                  <th className="border p-2 w-40">Category</th>
                  <th className="border p-2 w-52">Question</th>
                  <th className="border p-2 w-[500px]">Answer</th>
                  <th className="border p-2 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="border p-4 text-center">
                      Memuat data...
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border p-4 text-center">
                      {debugMessage || "Tidak ada data FAQ"}
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq, index) => (
                    <tr
                      key={faq.id}
                      className="text-center odd:bg-white even:bg-gray-100"
                    >
                      <td className="border p-2">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="border p-2">
                        {faq.createdAt &&
                        typeof faq.createdAt.toDate === "function"
                          ? new Date(
                              faq.createdAt.toDate()
                            ).toLocaleDateString()
                          : new Date(faq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{faq.category || "-"}</td>
                      <td className="border p-2">{faq.question}</td>
                      <td className="border p-2">{faq.answer}</td>
                      <td className="p-2 flex justify-center space-x-2">
                        <button
                          className="text-yellow-500"
                          onClick={() => handleEdit(faq)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(faq.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Show {faqs.length ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(currentPage * pageSize, totalItems)} items of{" "}
              {totalItems} FAQ
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  currentPage > 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                <FaChevronLeft />
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className={`px-3 py-1 rounded ${
                  hasMore
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                onClick={handleNextPage}
                disabled={!hasMore}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FAQModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedFAQ}
        categories={categories}
      />
    </div>
  );
};

export default FAQManagement;
