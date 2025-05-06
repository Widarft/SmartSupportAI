import React, { useState, useEffect } from "react";
import {
  getAllChatHistory,
  getUniqueCustomers,
  getCustomerChat,
} from "../services/adminChatHistoryService";
import { FaSearch, FaUser, FaRobot, FaFilter } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const ChatHistoryPage = () => {
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all chat history
    const unsubscribe = getAllChatHistory((chats) => {
      setAllChats(chats);
      setFilteredChats(chats);
      setLoading(false);
    });

    // Get all unique customers
    const loadCustomers = async () => {
      const customerList = await getUniqueCustomers();
      setCustomers(customerList);
    };

    loadCustomers();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter chats when customer or search query changes
    let result = [...allChats];

    // Filter by customer ID
    if (selectedCustomer) {
      const unsubscribe = getCustomerChat(selectedCustomer, (chats) => {
        result = chats;

        // Then apply search filter
        if (searchQuery) {
          result = result.filter((chat) =>
            chat.message.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setFilteredChats(result);
      });

      return () => unsubscribe();
    } else {
      // Just apply search filter if no customer selected
      if (searchQuery) {
        result = result.filter((chat) =>
          chat.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredChats(result);
    }
  }, [selectedCustomer, searchQuery, allChats]);

  // Group chats by customerId and date
  const groupChatsByCustomer = () => {
    const groupedChats = {};

    filteredChats.forEach((chat) => {
      const date = chat.timestamp.toLocaleDateString();
      const key = `${chat.customerId}-${date}`;

      if (!groupedChats[key]) {
        groupedChats[key] = {
          customerId: chat.customerId,
          date: date,
          chats: [],
        };
      }

      groupedChats[key].chats.push(chat);
    });

    // Sort by date (newest first)
    return Object.values(groupedChats).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  const handleCustomerFilter = (customerId) => {
    setSelectedCustomer(customerId === selectedCustomer ? "" : customerId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCustomer("");
    setSearchQuery("");
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Chat History Monitoring</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedCustomer}
                onChange={(e) => handleCustomerFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Customers</option>
                {customers.map((customerId) => (
                  <option key={customerId} value={customerId}>
                    Customer: {customerId.substring(0, 8)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Chat History Display */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredChats.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-500">No chat history found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupChatsByCustomer().map((group) => (
            <div
              key={`${group.customerId}-${group.date}`}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Customer Header */}
              <div className="bg-blue-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    Customer ID: {group.customerId}
                  </h3>
                  <span className="text-sm">{group.date}</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4">
                {group.chats
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex ${
                        chat.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg flex ${
                          chat.sender === "user"
                            ? "bg-blue-100 text-blue-900 rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="mr-2 mt-1">
                          {chat.sender === "user" ? (
                            <FaUser className="text-blue-600" />
                          ) : (
                            <FaRobot className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <ReactMarkdown className="text-sm whitespace-pre-wrap">
                            {chat.message}
                          </ReactMarkdown>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {chat.formattedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryPage;
