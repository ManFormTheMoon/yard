import React from "react";
import { withRouter } from "react-router-dom";

const WorkPlaceHeaderTab = (props) => {
  const selectedStyle = {
    height: "27px",
    fontWeight: "bold",
    margin: "0px 20px",
    padding: "3px 4px 0px 10px",
    backgroundColor: "white",
    borderRadius: "3px 3px 0px 0px",
    display: "flex",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
  };

  const notSelectedStyle = {
    height: "27px",
    margin: "0px 20px",
    padding: "3px 4px 0px 10px",
    backgroundColor: "#DBE6D8",
    display: "flex",
    borderRadius: "3px 3px 0px 0px",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
  };
  return (
    <div
      style={props.selected ? selectedStyle : notSelectedStyle}
      onClick={() => {
        props.setSelectedTab(props.value.value);
        props.history.push("/data/workPlace/" + props.value.value);
      }}
    >
      <div>{props.value.name}</div>
    </div>
  );
};

export default withRouter(WorkPlaceHeaderTab);
