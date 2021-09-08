import React from "react";
import ReferenceBookBody from "./ReferenceBookBody";
import ReferenceBookHeader from "./ReferenceBookHeader";

const ReferenceBookData = (props) => {
  return (
    <div
      style={{
        flexGrow: 1,
        height: "500px",
        backgroundColor: "green",
        marginTop: "10px",
        boxSizing: "border-box",
      }}
    >
      <ReferenceBookHeader
        currentTabs={props.currentTabs}
        setCurrentTabs={props.setCurrentTabs}
      />
      <ReferenceBookBody />
    </div>
  );
};

export default ReferenceBookData;
