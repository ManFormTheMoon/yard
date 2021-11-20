import React from "react";
import add from "../../img/reference-book-buttons/add.png";
import excel from "../../img/time-slot/excel.png";

const ExportButton = (props) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "2px 5px 2px 5px",
        cursor: "pointer",
        border: "1.8px #4BC2AA solid",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        fontSize: "14px",
        height: "37px",
        display: "inline-flex",
        alignItems: "center",
        ...props.style,
      }}
      onClick={props.onDownloadClick}
    >
      <img src={excel} alt="" style={{ height: "95%", marginRight: "5px" }} />
      {props.children}
    </div>
  );
};

export default ExportButton;
