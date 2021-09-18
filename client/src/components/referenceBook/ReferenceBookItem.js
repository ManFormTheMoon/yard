import React from "react";
import { Link } from "react-router-dom";

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
    <Link
      to={`/data/referenceBook/${props.value}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={props.selected ? selectedStyle : notSelectedStyle}
        onClick={() => {
          props.onTabClick({ id: props.index, value: props.value });
        }}
        key={`book-item-${props.index}`}
      >
        {props.index}.{props.name}
      </div>
    </Link>
  );
};

export default ReferenceBookItem;
