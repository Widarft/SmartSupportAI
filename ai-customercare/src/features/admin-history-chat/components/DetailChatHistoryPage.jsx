import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaRobot,
  FaSearch,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { getCustomerChat } from "../services/adminChatHistoryService";
import { generateChatSummary } from "../services/summaryService";

const DetailChatHistoryPage = () => {
  const { customerId: urlCustomerId } = useParams();
  const customerId = urlCustomerId || "customer123";
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID tidak ditemukan");
      setLoading(false);
      return;
    }

    console.log("Loading chat data for customer ID:", customerId);

    try {
      const unsubscribe = getCustomerChat(customerId, (chatData) => {
        console.log("Received chat data:", chatData.length, "messages");
        setChats(chatData);
        setLoading(false);
      });

      return () => {
        console.log("Unsubscribing from chat listener");
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    } catch (err) {
      console.error("Error setting up chat listener:", err);
      setError(`Gagal memuat data chat: ${err.message}`);
      setLoading(false);
    }
  }, [customerId]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={() => navigate("/adminhistorychat")}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Memuat data...</div>;
  }

  const filteredChats = chats.filter((chat) =>
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByDate = () => {
    const groupedChats = {};
    filteredChats.forEach((chat) => {
      const timestamp =
        chat.timestamp instanceof Date
          ? chat.timestamp
          : new Date(chat.timestamp);
      const date = timestamp.toLocaleDateString();

      if (!groupedChats[date]) {
        groupedChats[date] = [];
      }
      groupedChats[date].push(chat);
    });
    return groupedChats;
  };

  const handleGenerateSummary = async () => {
    if (!chats.length) return;

    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      const result = await generateChatSummary(chats);
      setSummary(result);
    } catch (error) {
      setSummaryError("Gagal menghasilkan kesimpulan");
      console.error("Summary generation error:", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-gray-200 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to list
        </button>
        <h2 className="text-xl font-bold">Chat Details</h2>
        <p className="text-sm text-gray-300 mt-2">Customer: {customerId}</p>
        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary || chats.length === 0}
          className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center ${
            isGeneratingSummary
              ? "bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FaFileAlt className="mr-2" />
          {isGeneratingSummary ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6">Chat History</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Chatting</h3>
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="p-4 max-h-[700px] overflow-auto">
                {Object.entries(groupChatsByDate()).map(([date, chats]) => (
                  <div key={date} className="mb-6">
                    <div className="text-sm font-medium text-gray-500 mb-2 flex justify-center">
                      {date}
                    </div>
                    <div className="space-y-3">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex ${
                            chat.sender === "user"
                              ? "justify-end"
                              : "justify-start"
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
                                {chat.timestamp instanceof Date
                                  ? chat.timestamp.toLocaleTimeString()
                                  : new Date(
                                      chat.timestamp
                                    ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </>
          )}
        </div>
        {summary && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" />
              Chat Summary
            </h3>
            <div className="p-4 bg-blue-50 rounded">
              <ReactMarkdown className="prose">{summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {summaryError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {summaryError}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailChatHistoryPage;
