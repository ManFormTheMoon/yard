import React, { useState } from "react";
import TimeSlotsHeaderTab from "../timeSlots/TimeSlotsHeaderTab";
import TimeSlotsBody from "../timeSlots/TimeSlotsBody";
import WorkPlaceHeaderTab from "../workPlace/WorkPlaceHeaderTab";
import WorkPlaceBody from "../workPlace/WorkPlaceBody";

const tabsInfo = [
  {
    index: 1,
    name: "Несвязанные документы",
    value: "unrelatedDocuments",
  },
  {
    index: 2,
    name: "Cвязанные документы",
    value: "relatedDocuments",
  },
  {
    index: 3,
    name: "Работа с визами",
    value: "workWithVisas",
  },
  {
    index: 4,
    name: "Рабочее место",
    value: "workPlaceRole",
  },
];

const WorkPlacePage = (props) => {
  const [selectedTab, setSelectedTab] = useState("");

  const onTabClick = (tab) => {
    setSelectedTab(tab.value);
    props.history.push("/data/workPlace/" + tab.value);
  };

  const changeSelected = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div
      style={{
        minWidth: "98%",
        height: "100%",
        backgroundColor: "#8DA19B",
        display: "flex",
        width: "98%",
        borderRadius: "10px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "calc(100% - 40px)",
          height: "40px",
          maxWidth: "100%",
          borderRadius: "5px 5px 0px 0px",
          alignItems: "flex-end",
        }}
      >
        {tabsInfo.map((value, index) => (
          <WorkPlaceHeaderTab
            key={`item-${index}`}
            index={index}
            value={value}
            selected={selectedTab == value.value}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </div>
      <div
        style={{
          height: "90%",
          maxHeight: "calc(100% - 60px)",
          backgroundColor: "#FFFFFF",
          // marginLeft: "10px",
          boxSizing: "border-box",
          width: "calc(100% - 20px)",
        }}
      >
        <WorkPlaceBody />
      </div>
    </div>
  );
};

export default WorkPlacePage;
