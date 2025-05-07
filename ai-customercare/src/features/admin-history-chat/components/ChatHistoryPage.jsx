import React, { useState, useEffect } from "react";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPaginatedCustomers } from "../services/adminChatHistoryService";

const ChatHistoryPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        console.log("Loading customers for page:", currentPage);
        const { customers, total } = await getPaginatedCustomers(
          currentPage,
          pageSize
        );
        console.log("Loaded customers:", customers);
        setCustomers(customers);
        setTotalItems(total);
      } catch (error) {
        console.error("Error loading customers:", error);
        setError("Gagal memuat daftar customer");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [currentPage, pageSize]);

  const handleCustomerClick = (customerId) => {
    if (!customerId) {
      console.error("Customer ID tidak valid:", customerId);
      return;
    }

    console.log("Navigating to customer details:", customerId);
    // Gunakan URL yang benar untuk detail chat
    navigate(`/adminhistorychat/${customerId}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * pageSize < totalItems) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = currentPage * pageSize < totalItems;

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen min-w-[1190px]">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow overflow-hidden min-w-[1100px]">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Customer List</h3>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {customers.length > 0 ? (
                    customers.map((customerId, index) => (
                      <div
                        key={customerId || index}
                        onClick={() => handleCustomerClick(customerId)}
                        className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
                      >
                        <FaUser className="mr-3 text-blue-500" />
                        <span className="font-medium">
                          Customer: {customerId || "Unknown"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Tidak ada data customer
                    </div>
                  )}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-between items-center p-4 border-t">
                  <div className="text-sm text-gray-600">
                    Show{" "}
                    {customers.length ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
                    {Math.min(currentPage * pageSize, totalItems)} of{" "}
                    {totalItems} customers
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPage;
