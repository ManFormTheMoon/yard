import React from "react";
import connect from "../../img/reference-book-buttons/connect.png";

const GroupEditButton = (props) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "2px 5px 2px 5px",
        border: "1.8px #4BC2AA solid",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        fontSize: "14px",
        height: "37px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        ...props.style,
      }}
      onClick={props.onGroupEditHandler}
    >
      <img src={connect} alt="" style={{ height: "95%", marginRight: "5px" }} />
      {props.children}
    </div>
  );
};

export default GroupEditButton;
