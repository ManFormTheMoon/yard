import React from "react";
import removeIcon from "../../img/reference-book-buttons/remove.png";

const DeleteButton = (props) => {
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
      onClick={props.onDeleteHandler}
    >
      <img
        src={removeIcon}
        alt=""
        style={{ height: "100%", marginRight: "10px" }}
      />
      {props.children}
    </div>
  );
};

export default DeleteButton;
