import React, { useState } from "react";
import { Switch, Route, Redirect, Router } from "react-router-dom";
import MenuTitle from "./components/Menu/MenuTitle";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";

export const useRoutes = (isAuth) => {
  console.log(1);
  if (isAuth) {
    return (
      <Switch>
        <Route path="/data">
          <MainPage></MainPage>
        </Route>
        <Redirect to="/data/workPlace" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact>
          <AuthPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
};
