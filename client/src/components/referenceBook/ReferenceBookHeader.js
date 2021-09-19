import React from "react";
import ReferenceBookHeaderTabs from "./ReferenceBookHeaderTabs";

const ReferenceBookHeader = (props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "40px",
        backgroundColor: "black",
        display: "flex",
        maxWidth: "100%",
      }}
    >
      <ReferenceBookHeaderTabs
        currentTabs={props.currentTabs}
        setCurrentTabs={props.setCurrentTabs}
        onTabClose={props.onTabClose}
        selectedTab={props.selectedTab}
        setSelectedTab={props.setSelectedTab}
      />
    </div>
  );
};

export default ReferenceBookHeader;
