import React from "react";
import connect from "../../img/reference-book-buttons/connect.png";

const GroupEditButton = (props) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "5px 3px",
        border: "2px black solid",
        borderRadius: "10px",
        height: "40px",
        display: "inline-flex",
        alignItems: "center",
        ...props.style,
      }}
      onClick={props.onClick}
    >
      <img
        src={connect}
        alt=""
        style={{ height: "100%", marginRight: "10px" }}
      />
      {props.children}
    </div>
  );
};

export default GroupEditButton;
