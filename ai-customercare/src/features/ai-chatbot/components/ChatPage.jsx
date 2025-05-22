import React, { useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { FaUser, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const ChatPage = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSubmit,
  isLoading,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "";
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isUserMessage =
            message.sender === "user" || message.user === "User";
          const messageTime = formatTime(message.timestamp || message.time);

          return (
            <div
              key={index}
              className={`flex ${
                isUserMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg flex ${
                  isUserMessage
                    ? "bg-blue-100 text-blue-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="mr-2 mt-1">
                  {isUserMessage ? (
                    <FaUser className="text-blue-600" />
                  ) : (
                    <FaRobot className="text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <ReactMarkdown className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </ReactMarkdown>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {messageTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[70%] flex">
              <div className="mr-2 mt-1">
                <FaRobot className="text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <BiLoaderAlt className="animate-spin" />
                <span>Mengetik...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatPage;
