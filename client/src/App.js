import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/auth.context";
import history from "./history";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";

function App() {
  const { token, userId, userRole, userName, userLastName, login, logout } =
    useAuth();
  const isAuth = !!token;
  console.log(history);
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
      <BrowserRouter>
        <Switch>
          {isAuth && (
            <Switch>
              <Route path="/data" component={MainPage}></Route>
              <Redirect to="/data/workPlace" />
            </Switch>
          )}
          {!isAuth && (
            <Switch>
              <Route path="/" exact component={AuthPage}></Route>
              <Redirect to="/" />
            </Switch>
          )}
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
