import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerServiceAI } from "../services/useCustomerServiceAI";
import { BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { getCustomerChatHistory } from "../services/ chatHistoryService";
import { generateCustomerId } from "../utils/customerUtils";

import HomePageChat from "./HomePageChat";
import ChatPage from "./ChatPage";
import FAQPageChat from "./FAQPageChat";
import TabBarChat from "./TabBarChar";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { handleSend, isLoading } = useCustomerServiceAI();

  useEffect(() => {
    const customerId =
      localStorage.getItem("customerId") || generateCustomerId();

    if (!localStorage.getItem("customerId")) {
      localStorage.setItem("customerId", customerId);
    }

    const unsubscribe = getCustomerChatHistory(
      customerId,
      (firebaseMessages) => {
        const formattedMessages = firebaseMessages.map((msg) => ({
          user: msg.sender === "user" ? "User" : "AI Assistant",
          message: msg.message,
          sender: msg.sender,
          timestamp: msg.timestamp,
          time: msg.timestamp ? msg.timestamp.toLocaleTimeString() : "",
        }));
        setMessages(formattedMessages);
      }
    );

    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = await handleSend(inputMessage, messages);
    setMessages(newMessages);
    setInputMessage("");
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  const handleTabChange = (page) => {
    setActivePage(page);
  };

  const handleStartChat = () => {
    setActivePage("chat");
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <HomePageChat onStartChat={handleStartChat} />;
      case "chat":
        return (
          <ChatPage
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSubmit={handleSubmit}
            clearHistory={clearHistory}
            isLoading={isLoading}
          />
        );
      case "faq":
        return <FAQPageChat />;
      default:
        return <HomePageChat onStartChat={handleStartChat} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200"
          data-tooltip-id="chat-tooltip"
          data-tooltip-content="Customer Service"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BsChatDots className="w-6 h-6" />
          <Tooltip id="chat-tooltip" place="left" />
        </motion.button>
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Header Chatbot */}
              <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold">Customer Service Assistant</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-blue-700 rounded-full p-1 transition-colors duration-200"
                    data-tooltip-id="close-tooltip"
                    data-tooltip-content="Tutup chat"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                  <Tooltip id="close-tooltip" place="top-end" />
                </div>
              </div>

              {/* Main Content Area */}
              {renderContent()}

              {/* Tab Bar */}
              <TabBarChat
                activePage={activePage}
                onTabChange={handleTabChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatBot;
