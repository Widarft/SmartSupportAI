import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaHistory,
  FaRobot,
  FaQuestionCircle,
  FaListAlt,
  FaQuestion,
} from "react-icons/fa";
import { logoutUser } from "../../features/auth/services/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqOpen, setFaqOpen] = useState(false);

  useEffect(() => {
    if (
      location.pathname.includes("/faqmanagement") ||
      location.pathname.includes("/categorymanagement")
    ) {
      setFaqOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/welcome");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-w-64 max-w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 text-center text-xl font-bold border-b border-gray-700">
        Smart Support AI
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-500"
                }`
              }
            >
              <FaHome />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/adminhistorychat"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-500"
                }`
              }
            >
              <FaHistory />
              History Chat
            </NavLink>
          </li>

          {/* FAQ Menu dengan Submenu */}
          <li>
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-500"
            >
              <div className="flex items-center gap-2">
                <FaQuestionCircle />
                FAQ
              </div>
              {faqOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {faqOpen && (
              <ul className="ml-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/faqmanagement"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded ${
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-500"
                      }`
                    }
                  >
                    <FaQuestion />
                    FAQ Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/categorymanagement"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded ${
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-500"
                      }`
                    }
                  >
                    <FaListAlt />
                    Category Management
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink
              to="/aichatbotreview"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-500"
                }`
              }
            >
              <FaRobot />
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
