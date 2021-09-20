import React from "react";
import referenceBookIcon from "../../img/reference-book-buttons/dictionary.png";

const selectedStyle = {
  color: "#4BC2AA",
  fontSize: "20px",
  fontWeight: "bold",
  marginLeft: "10px",
  display: "block",
  alignItems: "center",
  display: "flex",
  flexdirection: "column",
  margin: "10px",
};

const notSelectedStyle = {
  top: "5px",
  color: "black",
  fontSize: "18px",
  marginLeft: "10px",
  margin: "10px",
  display: "flex",
  flexdirection: "column",
  alignItems: "center",
};

const ReferenceBookItem = (props) => {
  return (
    <div
      style={props.selected ? selectedStyle : notSelectedStyle}
      onClick={() => {
        props.onTabClick({
          id: props.index,
          value: props.value,
          name: props.name,
        });
      }}
      key={`book-item-${props.index}`}
    >
      <img
        src={referenceBookIcon}
        style={{ height: "20px", marginRight: "5px" }}
      />
      {props.index}. {props.name}
    </div>
  );
};

export default ReferenceBookItem;
