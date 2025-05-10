import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">
        Selamat Datang di Website Kami
      </h1>
      <p className="text-lg mb-10">
        Silahkan login atau register untuk melanjutkan.
      </p>
      <div className="grid grid-cols-1 gap-2 w-40">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 mb-2 rounded-lg transition duration-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
