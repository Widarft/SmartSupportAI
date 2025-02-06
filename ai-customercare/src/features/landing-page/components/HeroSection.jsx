import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Website!</h1>
      <p className="text-lg mb-4">Please login or register to continue.</p>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
      >
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </div>
  );
};

export default LandingPage;
