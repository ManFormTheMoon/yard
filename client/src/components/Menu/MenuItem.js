import React from "react";
import { Link, useHistory } from "react-router-dom";

const MenuItem = (props) => {
  const history = useHistory();
  const selectedStyle = {
    style: {
      backgroundColor: "#43CBAC",
      fontWeight: "bold",
      fontSize: "21px",
    },
  };
  return (
    <Link to={props.path} style={{ textDecoration: "none" }}>
      <div
        className="menu-item"
        onClick={() => {
          history.push(props.path);
          props.setCurrentComponent(props.itemCode);
        }}
        {...(props.currentComponent == props.itemCode && selectedStyle)}
      >
        <img
          src={props.icon}
          style={{ height: "60%" }}
          className="menu-icon"
          alt=""
        />
        {props.nameItem}
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "90%",
            height: "2px",
            backgroundColor: "#414A52",
            borderRadius: "2px",
            margin: "3px 0px",
          }}
        />
      </div>
    </Link>
  );
};

export default MenuItem;
