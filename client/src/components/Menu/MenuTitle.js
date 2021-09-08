import React, { useContext } from "react";
import "./title.css";
import logo from "../../img/logo.jpg";
import tempPhoto from "../../img/tempPhoto.jpg";
import { AuthContext } from "../../context/auth.context";

const MenuTitle = (props) => {
  const info = useContext(AuthContext);
  return (
    <div
      className="header"
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex" }}>
        <div className="header-logo" style={{ marginLeft: "30px" }}>
          <img src={logo} style={{ height: "100%" }} alt="" />
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            font: "Calibri",
            fontSize: "48px",
            color: "white",
            fontWeight: "bold",
            marginLeft: "20px",
          }}
        >
          YMS
        </div>
      </div>
      <div className="header-info">
        <div className="header-info-text">
          {info.userName} {info.userLastName}
        </div>
        <div className="header-info-img">
          <img
            src={tempPhoto}
            style={{ height: "80%", borderRadius: "50%", marginLeft: "15px" }}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default MenuTitle;
