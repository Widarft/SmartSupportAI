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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logoutUser } from "../../features/auth/services/authService";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqOpen, setFaqOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="text-white bg-gray-800 p-2 rounded"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            className="fixed md:static z-40 w-64 flex-shrink-0 min-h-screen bg-gray-900 text-white flex flex-col"
            style={{ width: "16rem" }}
          >
            {/* Logo */}
            <div className="p-4 text-center text-xl font-bold border-b border-gray-700">
              Smart Support AI
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded ${
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-500"
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
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-500"
                      }`
                    }
                  >
                    <FaHistory />
                    History Chat
                  </NavLink>
                </li>

                {/* FAQ with Submenu */}
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

                  <AnimatePresence>
                    {faqOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 mt-1 space-y-1 overflow-hidden"
                      >
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
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <NavLink
                    to="/aichatbotreview"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded ${
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-500"
                      }`
                    }
                  >
                    <FaRobot />
                    Chatbot Review
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
