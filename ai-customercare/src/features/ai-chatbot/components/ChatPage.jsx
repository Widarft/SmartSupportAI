import React, { useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const ChatPage = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSubmit,
  clearHistory,
  isLoading,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Belum ada pesan. Mulai chat sekarang!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.user === "User" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.user === "User"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <ReactMarkdown className="text-sm">
                  {message.message}
                </ReactMarkdown>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.time}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <BiLoaderAlt className="w-5 h-5 animate-spin" />
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

      {messages.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={clearHistory}
            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <FaTrash className="w-3 h-3" /> Hapus riwayat chat
          </button>
        </div>
      )}
    </>
  );
};

export default ChatPage;
