import React from "react";
import ReferenceBookHeaderTabs from "./ReferenceBookHeaderTabs";

const ReferenceBookHeader = (props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "40px",
        backgroundColor: "yellow",
        display: "flex",
        overflow: "hidden",
        resize: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          marginLeft: "5px",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#112D32",
            border: "2px solid white",
          }}
        />
      </div>
      <div
        style={{
          height: "100%",
          flexGrow: 1,
          backgroundColor: "blue",
          display: "flex",
          overflow: "hidden",
          resize: "none",
        }}
      >
        <ReferenceBookHeaderTabs
          currentTabs={props.currentTabs}
          setCurrentTabs={props.setCurrentTabs}
        />
      </div>

      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          marginRight: "5px",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#112D32",
            border: "2px solid white",
          }}
        />
      </div>
    </div>
  );
};

export default ReferenceBookHeader;
