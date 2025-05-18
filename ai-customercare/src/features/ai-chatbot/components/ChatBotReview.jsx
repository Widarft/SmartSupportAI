import React from "react";
import ChatBot from "./ChatBot";

const ChatBotReview = () => {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl md:text-3xl text-center md:text-left font-semibold mb-4 md:mb-6">
        Chatbot Review
      </h1>
      <ChatBot />
    </div>
  );
};

export default ChatBotReview;
