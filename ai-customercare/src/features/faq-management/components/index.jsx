import React, { useState } from "react";
import FAQManagement from "./FAQManagement";
import Sidebar from "../../../components/ui/Sidebar";
import CategoryManagement from "./CategoryManagement";

const FAQ = () => {
  const [currentPage, setCurrentPage] = useState("faq");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <nav className="bg-blue-500 p-4 mb-4">
          <button
            className={`text-white mr-4 ${
              currentPage === "faq" ? "font-bold" : ""
            }`}
            onClick={() => setCurrentPage("faq")}
          >
            FAQ
          </button>
          <button
            className={`text-white ${
              currentPage === "category" ? "font-bold" : ""
            }`}
            onClick={() => setCurrentPage("category")}
          >
            Kategori
          </button>
        </nav>
        {currentPage === "faq" && <FAQManagement />}
        {currentPage === "category" && <CategoryManagement />}
      </div>
    </div>
  );
};

export default FAQ;
