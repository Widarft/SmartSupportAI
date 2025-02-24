import React, { useState } from "react";
import FAQManagement from "./FAQManagement";
import Sidebar from "../../../components/ui/Sidebar";

const FAQ = () => {
  return (
    <div>
      <div className="flex min-h-screen">
        <Sidebar />
        <FAQManagement />
      </div>
    </div>
  );
};

export default FAQ;
