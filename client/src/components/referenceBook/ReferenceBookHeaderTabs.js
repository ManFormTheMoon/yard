import React from "react";
import { Link } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import closeIcon from "../../img/close.png";

const SortableItem = SortableElement((props) => {
  const selectedStyle = {
    height: "30px",
    margin: "0px 10px",
    paddingLeft: "10px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
  };

  const notSelectedStyle = {
    height: "30px",
    margin: "0px 10px",
    paddingLeft: "10px",
    backgroundColor: "lightblue",
    display: "flex",
    justifyContent: "space-between",
  };

  console.log(props.onTabClose);
  return (
    <Link to={`/data/referenceBook/${props.value.value}`}>
      <div
        style={props.selected ? selectedStyle : notSelectedStyle}
        onClick={() => {
          props.setSelectedTab(props.value.value);
        }}
      >
        <div>
          {props.value.id}.{props.value.value}
        </div>
        <div
          style={{ height: "100%", marginLeft: "10px" }}
          onClick={() => {
            props.onTabClose(props.value);
          }}
        >
          <img
            src={closeIcon}
            alt=""
            style={{ height: "60%" }}
            key={`img- ${props}`}
          />
        </div>
      </div>
    </Link>
  );
});

const SortableList = SortableContainer((props) => {
  console.log(props.onTabClose);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "flex-end",
        maxWidth: "100%",
        minWidth: "100%",
        overflowY: "scroll",
        overflowX: "scroll",
      }}
    >
      {props.items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={value}
          selected={props.selectedTab == value.value}
          onTabClose={props.onTabClose}
          setSelectedTab={props.setSelectedTab}
        />
      ))}
    </div>
  );
});

const ReferenceBookHeaderTabs = (props) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    props.setCurrentTabs(arrayMove(props.currentTabs, oldIndex, newIndex));
  };
  console.log(props.onTabClose);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "purple",
        alignItems: "flex-end",
      }}
    >
      <SortableList
        distance={1}
        items={props.currentTabs}
        onSortEnd={onSortEnd}
        lockAxis="x"
        axis="x"
        onTabClose={props.onTabClose}
        selectedTab={props.selectedTab}
        setSelectedTab={props.setSelectedTab}
      />
    </div>
  );
};

export default ReferenceBookHeaderTabs;
