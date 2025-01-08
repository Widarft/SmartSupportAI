import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../features/landing-page";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
