import React from "react";
import { useRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import "materialize-css";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/auth.context";

function App() {
  const { token, userId, userRole, userName, userLastName, login, logout } =
    useAuth();
  const isAuth = !!token;
  const routes = useRoutes(isAuth);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        userRole,
        userName,
        userLastName,
        isAuth,
      }}
    >
      <Router>{routes}</Router>
    </AuthContext.Provider>
  );
}

export default App;
