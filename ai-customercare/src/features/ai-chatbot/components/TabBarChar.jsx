import React from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { BsChatDotsFill, BsChatDots } from "react-icons/bs";
import { FaQuestionCircle, FaRegQuestionCircle } from "react-icons/fa";

const TabBarChat = ({ activePage, onTabChange }) => {
  return (
    <div className="bg-white border-t flex justify-around items-center w-full p-2">
      <button
        onClick={() => onTabChange("home")}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          activePage === "home"
            ? "text-blue-600"
            : "text-gray-600 hover:text-blue-500"
        }`}
      >
        {activePage === "home" ? (
          <IoHome className="w-6 h-6" />
        ) : (
          <IoHomeOutline className="w-6 h-6" />
        )}
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        onClick={() => onTabChange("chat")}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          activePage === "chat"
            ? "text-blue-600"
            : "text-gray-600 hover:text-blue-500"
        }`}
      >
        {activePage === "chat" ? (
          <BsChatDotsFill className="w-6 h-6" />
        ) : (
          <BsChatDots className="w-6 h-6" />
        )}
        <span className="text-xs mt-1">Chat</span>
      </button>

      <button
        onClick={() => onTabChange("faq")}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
          activePage === "faq"
            ? "text-blue-600"
            : "text-gray-600 hover:text-blue-500"
        }`}
      >
        {activePage === "faq" ? (
          <FaQuestionCircle className="w-6 h-6" />
        ) : (
          <FaRegQuestionCircle className="w-6 h-6" />
        )}
        <span className="text-xs mt-1">FAQ</span>
      </button>
    </div>
  );
};

export default TabBarChat;
