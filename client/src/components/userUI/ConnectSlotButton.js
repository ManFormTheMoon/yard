import React from "react";
import clear from "../../img/reference-book-buttons/clean.png";

const ConnectSlotButton = (props) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "2px 5px 2px 5px",
        border: "1.8px #4BC2AA solid",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        height: "37px",
        display: "inline-flex",
        alignItems: "center",
        ...props.style,
      }}
      onClick={props.onOpenConnect}
    >
      <img src={clear} alt="" style={{ height: "95%", marginRight: "5px" }} />
      {props.children}
    </div>
  );
};

export default ConnectSlotButton;
