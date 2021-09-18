import React from "react";
import ReferenceBookBody from "./ReferenceBookBody";
import ReferenceBookHeader from "./ReferenceBookHeader";

const ReferenceBookData = (props) => {
  return (
    <div
      style={{
        height: "800px",
        backgroundColor: "green",
        marginTop: "10px",
        marginRight: "10px",
        boxSizing: "border-box",
        width: "calc(100% - 270px)",
      }}
    >
      <ReferenceBookHeader
        currentTabs={props.currentTabs}
        setCurrentTabs={props.setCurrentTabs}
        onTabClose={props.onTabClose}
        selectedTab={props.selectedTab}
        setSelectedTab={props.setSelectedTab}
      />
      <ReferenceBookBody />
    </div>
  );
};

export default ReferenceBookData;
