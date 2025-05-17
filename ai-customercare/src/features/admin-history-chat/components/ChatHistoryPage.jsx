import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaFilter,
  FaTimes,
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
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [customerDetails, setCustomerDetails] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth < 640) {
        setPageSize(5);
      } else {
        setPageSize(10);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const { customers, total } = await getPaginatedCustomers(
          currentPage,
          pageSize,
          selectedDate,
          sortOrder
        );

        setCustomers(customers);
        setTotalItems(total);

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
    setCurrentPage(1);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = (currentPage - 1) * pageSize + customers.length < totalItems;

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const formatDateTime = (date) => {
    if (!date) return "";

    if (windowWidth < 640) {
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";

    const limit = windowWidth < 640 ? maxLength / 2 : maxLength;

    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-6 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
          Chat History
        </h1>
        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base sm:text-lg font-medium">Customer List</h3>

            {/* Mobile Filter Toggle Button */}
            <div className="sm:hidden flex justify-end w-full">
              <button
                onClick={toggleFilters}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              >
                <FaFilter className="mr-2" />
                <span className="text-sm">Filter</span>
              </button>
            </div>

            {/* Filter Controls - Desktop */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
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
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                )}
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

            {/* Filter Controls - Mobile */}
            {showFilters && (
              <div className="sm:hidden w-full space-y-3 pb-2">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-600">Tanggal</label>
                  <div className="flex items-center">
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
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    {selectedDate && (
                      <button
                        onClick={handleClearDate}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleSortOrder}
                  className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50 w-full justify-center"
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
            )}
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
                        className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start sm:items-center">
                          <FaUser className="mt-1 sm:mt-0 mr-2 sm:mr-3 text-blue-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base">
                              {truncateText(customerId || "Unknown", 20)}
                            </div>
                            {lastMessage && (
                              <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                <span className="font-medium">
                                  {lastMessage.sender === "user"
                                    ? "User"
                                    : "Bot"}
                                  :
                                </span>{" "}
                                {truncateText(lastMessage.message, 50)}
                              </div>
                            )}
                          </div>
                          {lastMessage && (
                            <div className="text-xs text-gray-400 shrink-0 ml-2">
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
              <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t gap-3">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Show {customers.length ? (currentPage - 1) * pageSize + 1 : 0}{" "}
                  - {Math.min(currentPage * pageSize, totalItems)} of{" "}
                  {totalItems} customers
                </div>
                <div className="flex space-x-2 items-center">
                  <button
                    className={`px-2 sm:px-3 py-1 rounded ${
                      currentPage > 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    className={`px-2 sm:px-3 py-1 rounded ${
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
