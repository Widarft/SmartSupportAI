import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/services/authService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/landingpage");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 text-center text-xl font-bold border-b border-gray-700">
        Smart Support AI
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4">
        <ul>
          <li>
            <NavLink
              to="/"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/adminhistorychat"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              History Chat
            </NavLink>
          </li>

          {/* FAQ Menu dengan Submenu */}
          <li>
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700"
            >
              <span>FAQ</span>
              {faqOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Submenu FAQ */}
            {faqOpen && (
              <ul className="ml-4 mt-1">
                <li>
                  <NavLink
                    to="/faqmanagement"
                    className="block px-4 py-2 rounded hover:bg-gray-700"
                  >
                    FAQ Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/categorymanagement"
                    className="block px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Category Management
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink
              to="/aichatbotreview"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Chatbot Review
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
