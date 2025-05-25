import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useCustomerServiceAI } from "../services/useCustomerServiceAI";
import {
  getCustomerChatHistory,
  saveChat,
} from "../services/chatHistoryService";
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
  const [dimensions, setDimensions] = useState({ width: 384, height: 600 });
  const chatBotRef = useRef(null);
  const { handleSend, isLoading } = useCustomerServiceAI();
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Sign in customer using custom token
  useEffect(() => {
    const signInCustomerIfNeeded = async () => {
      const auth = getAuth();
      const tokenSignedKey = "customerSignedIn";

      if (!auth.currentUser && !localStorage.getItem(tokenSignedKey)) {
        const clientId =
          localStorage.getItem("customerId") || generateCustomerId();
        localStorage.setItem("customerId", clientId);

        const adminUid = new URLSearchParams(window.location.search).get("uid");
        if (!adminUid) {
          console.error("Admin UID tidak ditemukan di URL.");
          return;
        }

        try {
          const res = await fetch(
            `https://us-central1-smartsupportai-8e731.cloudfunctions.net/generateCustomToken?clientId=${clientId}&uid=${adminUid}`
          );
          const { token } = await res.json();

          await signInWithCustomToken(auth, token);
          localStorage.setItem(tokenSignedKey, "true");
          console.log("Customer signed in with custom token.");
        } catch (err) {
          console.error("Gagal login dengan custom token:", err);
        }
      }
    };

    signInCustomerIfNeeded();
  }, []);

  const calculateDimensions = () => {
    const maxWidth = 384;
    const maxHeight = 600;
    const aspectRatio = maxHeight / maxWidth;

    const availableWidth = window.innerWidth * 0.9;
    const availableHeight = window.innerHeight * 0.8;
    const heightLimited = availableHeight < maxHeight;

    let newWidth, newHeight;

    if (heightLimited) {
      newHeight = availableHeight;
      newWidth = newHeight / aspectRatio;
      newWidth = Math.min(newWidth, availableWidth);
    } else {
      newWidth = Math.min(availableWidth, maxWidth);
      newHeight = newWidth * aspectRatio;

      if (newHeight > availableHeight) {
        newHeight = availableHeight;
        newWidth = newHeight / aspectRatio;
      }
    }

    return { width: newWidth, height: newHeight };
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

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

        if (firebaseMessages.length > 0) {
          setHasWelcomed(true);
        }
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const sendWelcomeMessage = async () => {
      if (
        isOpen &&
        activePage === "chat" &&
        messages.length === 0 &&
        !hasWelcomed
      ) {
        const customerId =
          localStorage.getItem("customerId") || generateCustomerId();
        const welcomeMessage = {
          user: "AI Assistant",
          message:
            "Halo! Saya asisten virtual Anda. Ada yang bisa saya bantu? Misalnya anda ingin informasi tentang produk, pemesanan, atau informasi lainnya",
          sender: "ai",
          timestamp: new Date(),
          time: new Date().toLocaleTimeString(),
        };

        await new Promise((resolve) => setTimeout(resolve, 500));
        await saveChat(customerId, welcomeMessage.message, "ai");

        setMessages([welcomeMessage]);
        setHasWelcomed(true);
      }
    };

    sendWelcomeMessage();
  }, [isOpen, activePage, messages.length, hasWelcomed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = await handleSend(inputMessage, messages);
    setMessages(newMessages);
    setInputMessage("");
  };

  const clearHistory = () => {
    setMessages([]);
    setHasWelcomed(false);
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
            showInput={false}
          />
        );
      case "faq":
        return <FAQPageChat />;
      default:
        return <HomePageChat onStartChat={handleStartChat} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatBotRef}>
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
              className="bg-white rounded-lg shadow-xl flex flex-col"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                maxWidth: "96vw",
                maxHeight: "80vh",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Header Chatbot */}
              <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold truncate">
                  Customer Service Assistant
                </h3>
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
              <div className="flex flex-col flex-grow overflow-hidden">
                {renderContent()}
              </div>

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
