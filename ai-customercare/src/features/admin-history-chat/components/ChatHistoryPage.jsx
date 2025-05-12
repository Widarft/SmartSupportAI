import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getPaginatedCustomers,
  getCustomerLastMessage,
} from "../services/adminChatHistoryService";

const ChatHistoryPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [customerDetails, setCustomerDetails] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        console.log("Loading customers for page:", currentPage);
        console.log("Filter date:", selectedDate);
        console.log("Sort order:", sortOrder);

        const { customers, total } = await getPaginatedCustomers(
          currentPage,
          pageSize,
          selectedDate,
          sortOrder
        );

        console.log("Loaded customers:", customers);
        setCustomers(customers);
        setTotalItems(total);

        // Get last message for each customer for display
        const details = await Promise.all(
          customers.map(async (customerId) => {
            if (!customerId) return { customerId: null, lastMessage: null };
            try {
              const lastMessage = await getCustomerLastMessage(customerId);
              return {
                customerId,
                lastMessage,
              };
            } catch (error) {
              console.error(
                `Error getting last message for ${customerId}:`,
                error
              );
              return { customerId, lastMessage: null };
            }
          })
        );

        setCustomerDetails(details);
      } catch (error) {
        console.error("Error loading customers:", error);
        setError("Gagal memuat daftar customer");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [currentPage, pageSize, selectedDate, sortOrder]);

  const handleCustomerClick = (customerId) => {
    if (!customerId) {
      console.error("Customer ID tidak valid:", customerId);
      return;
    }

    console.log("Navigating to customer details:", customerId);
    navigate(`/adminhistorychat/${customerId}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

 const handleNextPage = () => {
  if ((currentPage - 1) * pageSize + customers.length < totalItems) {
    setCurrentPage(currentPage + 1);
  }
};

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = (currentPage - 1) * pageSize + customers.length < totalItems;

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const formatDateTime = (date) => {
    if (!date) return "";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen min-w-[1190px]">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Chat History</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden min-w-[1100px]">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer List</h3>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={
                      selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleDateChange(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedDate && (
                    <button
                      onClick={handleClearDate}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={toggleSortOrder}
                className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50"
                title={
                  sortOrder === "newest" ? "Sort by newest" : "Sort by oldest"
                }
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
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {customers.length > 0 ? (
                  customerDetails.map((customer, index) => {
                    const customerId = customer.customerId;
                    const lastMessage = customer.lastMessage;

                    return (
                      <div
                        key={customerId || index}
                        onClick={() => handleCustomerClick(customerId)}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <FaUser className="mr-3 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-medium">
                              Customer: {customerId || "Unknown"}
                            </div>
                            {lastMessage && (
                              <div className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">
                                  {lastMessage.sender === "user"
                                    ? "User"
                                    : "Bot"}
                                  :
                                </span>{" "}
                                {lastMessage.message?.length > 50
                                  ? `${lastMessage.message.substring(0, 50)}...`
                                  : lastMessage.message}
                              </div>
                            )}
                          </div>
                          {lastMessage && (
                            <div className="text-xs text-gray-400">
                              {formatDateTime(lastMessage.timestamp)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada data customer
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-sm text-gray-600">
                  Show {customers.length ? (currentPage - 1) * pageSize + 1 : 0}{" "}
                  - {Math.min(currentPage * pageSize, totalItems)} of{" "}
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
  );
};

export default ChatHistoryPage;
