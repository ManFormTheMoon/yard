// import React, { useState } from "react";
// import { Switch, Route, Redirect, Router, useHistory } from "react-router-dom";
// import MenuTitle from "./components/Menu/MenuTitle";
// import ReferenceBookPage from "./components/pages/ReferenceBookPage";
// import AuthPage from "./pages/AuthPage";
// import MainPage from "./pages/MainPage";

// export const useRoutes = (isAuth) => {
//   console.log(isAuth);
//   if (isAuth) {
//     return (
//       <Switch>
//         <Route path="/data" component={MainPage}></Route>
//         <Route
//           path="/data/referenceBook/"
//           component={ReferenceBookPage}
//         ></Route>
//         {/* <Redirect to="/data/workPlace" /> */}
//       </Switch>
//     );
//   } else {
//     return (
//       <Switch>
//         <Route path="/" exact component={AuthPage}></Route>
//         {/* <Redirect to="/" /> */}
//       </Switch>
//     );
//   }
// };
