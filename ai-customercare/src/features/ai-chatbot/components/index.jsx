import React from "react";
import Sidebar from "../../../components/ui/Sidebar";
import ChatBotReview from "./ChatBotReview";

const AIChatBotReview = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <ChatBotReview />
    </div>
  );
};

export default AIChatBotReview;
