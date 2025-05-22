import React from "react";

const HomePageChat = ({ onStartChat }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-bold text-blue-600 mb-2">Selamat Datang</h3>
      <p className="text-gray-600 mb-4">
        Asisten layanan pelanggan kami siap membantu menjawab pertanyaan Anda
      </p>
      <button
        onClick={onStartChat}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Mulai Chat
      </button>
    </div>
  );
};

export default HomePageChat;
