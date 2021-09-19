import React from "react";
import ReferenceBookBody from "./ReferenceBookBody";
import ReferenceBookHeader from "./ReferenceBookHeader";

const ReferenceBookData = (props) => {
  return (
    <div
      style={{
        height: "95%",
        backgroundColor: "#FFFFFF",
        margin: "10px 0 0 10px",
        boxSizing: "border-box",
       //???? display:"flex",
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
