import React from "react";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";

const SortableItem = SortableElement(({ value }) => (
  <div
    style={{
      height: "30px",
      margin: "0px 10px",
      padding: "0px 10px",
      backgroundColor: "orange",
    }}
  >
    {value.id}.{value.value}
  </div>
));

const SortableList = SortableContainer(({ items }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "flex-end",
        maxWidth: "100%",
        minWidth: "100%",
      }}
    >
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

const ReferenceBookHeaderTabs = (props) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    props.setCurrentTabs(arrayMove(props.currentTabs, oldIndex, newIndex));
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "purple",
        alignItems: "flex-end",
        overflow: "hidden",
        maxWidth: "100%",
        minWidth: "100%",
      }}
    >
      <SortableList
        items={props.currentTabs}
        onSortEnd={onSortEnd}
        lockAxis="x"
        axis="x"
      />
    </div>
  );
};

export default ReferenceBookHeaderTabs;
