import React from "react";
import ReferenceBookBody from "./ReferenceBookBody";
import ReferenceBookHeader from "./ReferenceBookHeader";

const ReferenceBookData = (props) => {
  return (
    <div
      style={{
        height: "calc(90% + 50px)",
        maxHeight: "calc(100% - 20px)",
        backgroundColor: "#FFFFFF",
        marginLeft: "10px",
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
