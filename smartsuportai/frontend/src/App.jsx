import React from "react";
import AppRoute from "./Routes/AppRoute";
import { AuthProvider } from "./features/auth/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
};

export default App;
