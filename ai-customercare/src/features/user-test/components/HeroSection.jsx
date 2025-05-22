import React from "react";
import BGImage from "../../../assets/image/106+ Forêt Wallpapers _ Free download _ Best Collection.jpeg";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 relative overflow-hidden">
      {/* Background Image dengan Overlay */}
      <div className="absolute inset-0">
        <img
          src={BGImage}
          alt="Forest Background"
          className="object-cover w-full h-full"
        />
        <div className="bg-black opacity-40 absolute inset-0" />
      </div>

      {/* Konten Teks - Responsif */}
      <div className="relative text-white text-center z-10 px-4 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">
          Welcome To
        </h1>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
          TERRARIUM.QU
        </h2>
        <p className="mt-2 md:mt-4 text-base sm:text-lg md:text-xl">
          Terra Company
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
