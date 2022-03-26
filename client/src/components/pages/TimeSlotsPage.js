import React, { useState } from "react";
import TimeSlotsHeaderTab from "../timeSlots/TimeSlotsHeaderTab";
import TimeSlotsBody from "../timeSlots/TimeSlotsBody";

const tabsInfo = [
  {
    index: 1,
    name: "Тайм-слоты таблица",
    value: "timeSlotsTable",
  },
  {
    index: 2,
    name: "Тайм-слоты график",
    value: "timeSlotsGraphic",
  },
];

const TimeSlotsPage = (props) => {
  const [selectedTab, setSelectedTab] = useState("");

  const onTabClick = (tab) => {
    setSelectedTab(tab.value);
    props.history.push("/data/timeSlots/" + tab.value);
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
          <TimeSlotsHeaderTab
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
        <TimeSlotsBody />
      </div>
    </div>
  );
};

export default TimeSlotsPage;
