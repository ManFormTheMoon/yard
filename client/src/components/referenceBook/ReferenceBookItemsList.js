import React from "react";
import ReferenceBookItem from "./ReferenceBookItem";

const ReferenceBookItemsList = (props) => {
  return (
    <div>
      {props.tabsInfo.map((value) => (
        <ReferenceBookItem
          onTabClick={props.onTabClick}
          selected={
            props.currentTabs.filter((e) => e.value == value.value).length > 0
          }
          name={value.name}
          index={value.index}
          value={value.value}
        />
      ))}
    </div>
  );
};

export default ReferenceBookItemsList;
