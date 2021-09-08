import React from "react";

const selectedStyle = {
  color: "#4BC2AA",
  fontSize: "26px",
  fontWeight: "bold",
  marginLeft: "10px",
};

const notSelectedStyle = {
  color: "black",
  fontSize: "23px",
  marginLeft: "10px",
};

const ReferenceBookItem = (props) => {
  return (
    <div
      style={props.selected ? selectedStyle : notSelectedStyle}
      onClick={() => {
        props.onTabClick({ id: props.index, value: props.value });
      }}
    >
      {props.index}.{props.name}
    </div>
  );
};

export default ReferenceBookItem;
