import React from "react";
import clear from "../../img/reference-book-buttons/clean.png";

const ClearButton = (props) => {
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
      onClick={props.onSearchClearHandler}
    >
      <img src={clear} alt="" style={{ height: "100%", marginRight: "10px" }} />
      {props.children}
    </div>
  );
};

export default ClearButton;
