import React, { useEffect, useState } from "react";
import { auth } from "../../../services/firebase";
import Sidebar from "../../../components/ui/Sidebar";
import {
  getFAQsCount,
  getCategoriesCount,
  getUniqueCustomerCount,
  getRecentMessages,
} from "../services/dashboardServices";
import { FaUsers, FaQuestionCircle, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    faq: 0,
    categories: 0,
    customers: 0,
    recentMessages: [],
  });
  const navigate = useNavigate();

  const handleCustomerClick = (customerId) => {
    if (!customerId) return;
    navigate(`/adminhistorychat/${customerId}`);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const [faq, categories, customers, recentMessages] = await Promise.all([
          getFAQsCount(),
          getCategoriesCount(),
          getUniqueCustomerCount(),
          getRecentMessages(),
        ]);
        setStats({ faq, categories, customers, recentMessages });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl text-center md:text-left font-semibold mb-4 md:mb-6">
          Dashboard
        </h1>

        {/* Stats Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-cyan-400 text-sky-900 py-4 px-4 rounded-lg shadow flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-semibold">Jumlah Pengguna</h2>
              <p className="text-3xl font-bold">{stats.customers}</p>
            </div>
            <div className="text-sky-900 text-4xl">
              <FaUsers />
            </div>
          </div>
          <div className="bg-emerald-300 text-green-950 py-4 pl-6 pr-10 rounded-lg shadow flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-semibold">Jumlah FAQ</h2>
              <p className="text-3xl font-bold">{stats.faq}</p>
            </div>
            <div className="text-green-900 text-4xl">
              <FaQuestionCircle />
            </div>
          </div>
          <div className="bg-indigo-400 text-purple-950 py-4 pl-6 pr-10 rounded-lg shadow flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-semibold">Jumlah Kategori</h2>
              <p className="text-3xl font-bold">{stats.categories}</p>
            </div>
            <div className="text-purple-950 text-4xl">
              <FaTags />
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-2xl sm:text-2xl text-gray-900 font-medium mb-4">
            5 Pesan Terbaru
          </h2>
          <ul>
            {stats.recentMessages.map((msg) => (
              <li
                key={msg.id}
                className="mb-2 border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                onClick={() => handleCustomerClick(msg.customerId)}
              >
                <p className="font-semibold">{msg.customerId || "Unknown"}</p>
                <p className="text-sm text-gray-500">
                  {msg.timestamp?.toDate
                    ? new Date(msg.timestamp.toDate()).toLocaleString()
                    : "No Timestamp"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
