import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "../features/landing-page/components/WelcomePage";
import Register from "../features/auth/components/Register";
import Login from "../features/auth/components/Login";
import Home from "../features/home/components/Home";
import PrivateRoute from "./PrivateRoute";
import FAQ from "../features/faq-management/components";
import AIChatBotReview from "../features/ai-chatbot/components";
import { auth } from "../services/firebase";
import CategoryManagement from "../features/faq-management/components/CategoryManagement";
import AdminHistoryChat from "../features/admin-history-chat/components";
import DetailChatHistoryPage from "../features/admin-history-chat/components/DetailChatHistoryPage";
import ChatbotEmbed from "../features/ai-chatbot/components/ChatbotEmbed";
import ChatbotTestUser from "../features/user-test/components/ChatbotTestUser";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/embed" element={<ChatbotEmbed />} />

        {/* PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/faqmanagement"
          element={
            <PrivateRoute>
              <FAQ />
            </PrivateRoute>
          }
        />
        <Route
          path="/categorymanagement"
          element={
            <PrivateRoute>
              <CategoryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/aichatbotreview"
          element={
            <PrivateRoute>
              <AIChatBotReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminhistorychat"
          element={
            <PrivateRoute>
              <AdminHistoryChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminhistorychat/:customerId"
          element={
            <PrivateRoute>
              <DetailChatHistoryPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/testuser"
          element={
            <PrivateRoute>
              <ChatbotTestUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
