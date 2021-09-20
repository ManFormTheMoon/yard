import React from "react";
import checkImg from "../../img/reference-book-buttons/check.png";

const ApplyButton = (props) => {
  console.log(props);
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
        ...props.style,
      }}
      onClick={props.onOk}
    >
      <img
        src={checkImg}
        alt=""
        style={{ height: "95%", marginRight: "5px" }}
      />
      {props.children}
    </div>
  );
};

export default ApplyButton;
