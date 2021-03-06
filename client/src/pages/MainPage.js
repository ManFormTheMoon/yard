import React, { useContext } from "react";
import { Route, withRouter } from "react-router-dom";
import Menu from "../components/Menu/Menu";
import MenuTitle from "../components/Menu/MenuTitle";
import ReferenceBookPage from "../components/pages/ReferenceBookPage";
import { AuthContext } from "../context/auth.context";
import "normalize.css";
import TimeSlotsPage from "../components/pages/TimeSlotsPage";
import WorkPlacePage from "../components/pages/WorkPlacePage";

const MainPage = (props) => {
  const info = useContext(AuthContext);
  console.log(info);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        float: "left",
      }}
    >
      <MenuTitle />
      <div
        style={{
          display: "flex",
          boxSizing: "border-box",
          marginTop: "80px",
          height: "calc(100% - 80px)",
          width: "100%",
        }}
      >
        <Menu />
        <div
          style={{
            marginLeft: "250px",
            marginTop: " 10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: " calc(100% - 250px)",
            height: "calc(100% - 10px)",
          }}
        >
          <Route path="/data/referenceBook" component={ReferenceBookPage} />

          <Route path="/data/timeSlots/" component={TimeSlotsPage} />

          <Route path="/data/workPlace" component={WorkPlacePage} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(MainPage);
