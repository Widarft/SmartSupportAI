import React from "react";
import Sidebar from "../../../components/ui/Sidebar";
import ChatHistoryPage from "./ChatHistoryPage";

const AdminHistoryChat = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <ChatHistoryPage />
    </div>
  );
};

export default AdminHistoryChat;
