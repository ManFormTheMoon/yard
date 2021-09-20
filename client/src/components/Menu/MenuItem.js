import React from "react";
import { withRouter } from "react-router-dom";

const MenuItem = (props) => {
  const selectedStyle = {
    style: {
      backgroundColor: "#43CBAC",
      fontWeight: "bold",
      fontSize: "18px",
    },
  };
  const selectedStyleForImg = {
    style: {
      height: "65%",
      margin: "8px",
    },
  };
  return (
    <>
      <div
        className="menu-item"
        onClick={() => {
          props.history.push(props.path);
          props.setCurrentComponent(props.itemCode);
        }}
        {...(props.currentComponent === props.itemCode && selectedStyle)}
      >
        <img
          src={props.icon}
          style={{
            height: "50%",
            margin: "12px",
          }}
          className="menu-icon"
          alt=""
          {...(props.currentComponent === props.itemCode &&
            selectedStyleForImg)}
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
    </>
  );
};

export default withRouter(MenuItem);
