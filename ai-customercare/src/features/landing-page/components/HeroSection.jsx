import React from "react";
import logo from "../../../assets/logo/logo.png";

const HeroSection = () => {
  return (
    <div className=" flex items-center justify-center">
      <img src={logo} alt="logo" />
      <h1 className="font-extrabold text-center text-7xl">Hero Section</h1>
      <p className="flex col">Branch Dev</p>
    </div>
  );
};

export default HeroSection;
