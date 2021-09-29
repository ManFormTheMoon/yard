import React from "react";
import { withRouter } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import closeIcon from "../../img/close.png";

const SortableItem = withRouter(
  SortableElement((props) => {
    console.log(props);
    const selectedStyle = {
      height: "27px",
      fontWeight: "bold",
      margin: "0px 2px",
      padding: "3px 4px 0px 10px",
      backgroundColor: "white",
      borderRadius: "3px 3px 0px 0px",
      display: "flex",
      justifyContent: "space-between",
      whiteSpace: "nowrap",
    };

    const notSelectedStyle = {
      height: "27px",
      margin: "0px 2px",
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
          props.history.push("/data/referenceBook/" + props.value.value);
        }}
      >
        <div>
          {props.value.id}. {props.value.name}
        </div>
        <div
          style={{ height: "100%", marginLeft: "10px" }}
          onClick={(e) => {
            e.stopPropagation();
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
    );
  })
);

const SortableList = withRouter(
  SortableContainer((props) => {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "flex-end",
          maxWidth: "100%",
          minWidth: "100%",
          //overflowY: "scroll",
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
  })
);

const ReferenceBookHeaderTabs = (props) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    props.setCurrentTabs(arrayMove(props.currentTabs, oldIndex, newIndex));
  };
  console.log(props.currentTabs);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#8DA19B",
        paddingLeft: "6px",
        borderradius: "5px 5px 0 0",
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

export default withRouter(ReferenceBookHeaderTabs);
