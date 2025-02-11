import React, { useEffect, useState } from "react";
import { auth } from "../../../services/firebase";
import Sidebar from "../../../components/ui/Sidebar";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar tetap ada di sini */}
      <Sidebar />

      {/* Konten Utama */}
      <div className="flex-1 p-6 bg-gray-200">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-lg">Hello, {user.email}!</p>
      </div>
    </div>
  );
};

export default Home;
