import React from "react";
import "./modal.css";

const Modal = (props) => {
  return (
    <div className={props.visible ? "modal active" : "modal"}>
      <div style={props.style}>{props.children}</div>
    </div>
  );
};

export default Modal;
