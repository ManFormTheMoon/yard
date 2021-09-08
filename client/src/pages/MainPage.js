import React, { useContext } from "react";
import { Route } from "react-router-dom";
import Menu from "../components/Menu/Menu";
import MenuTitle from "../components/Menu/MenuTitle";
import ReferenceBookPage from "../components/pages/ReferenceBookPage";
import { AuthContext } from "../context/auth.context";

const MainPage = (props) => {
  const info = useContext(AuthContext);
  console.log(info);
  return (
    <>
      <MenuTitle />
      <div
        style={{ display: "flex", boxSizing: "border-box", marginTop: "80px" }}
      >
        <Menu />
        <div
          style={{
            marginLeft: "250px",
            marginTop: " 10px",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Route path="/data/referenceBook">
            <ReferenceBookPage />
          </Route>
        </div>
      </div>
    </>
  );
};

export default MainPage;
