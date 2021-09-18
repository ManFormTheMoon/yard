import React from "react";
import saveImg from "../../img/reference-book-buttons/check.png";

const SaveButton = (props) => {
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
        src={saveImg}
        alt=""
        style={{ height: "100%", marginRight: "10px" }}
      />
      {props.children}
    </div>
  );
};

export default SaveButton;
