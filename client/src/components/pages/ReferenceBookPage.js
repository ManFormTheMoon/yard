import React, { useState } from "react";
import ReferenceBookData from "../referenceBook/ReferenceBookData";
import ReferenceBookItem from "../referenceBook/ReferenceBookItem";
import { arrayMove } from "react-sortable-hoc";
import ReferenceBookItemsList from "../referenceBook/ReferenceBookItemsList";
// import { withRouter } from "react-router";
import { withRouter } from "react-router-dom";
import { dictinary } from "../../dictinary/dictinary";

const tabsInfo = [
  {
    index: 1,
    name: dictinary.ramps.ru,
    value: dictinary.ramps.original,
  },
  {
    index: 2,
    name: dictinary.standarts.ru,
    value: dictinary.standarts.original,
  },
  {
    index: 3,
    name: dictinary.field.ru,
    value: dictinary.field.original,
  },
  {
    index: 4,
    name: dictinary.regions.ru,
    value: dictinary.regions.original,
  },
  {
    index: 5,
    name: dictinary.priorities.ru,
    value: dictinary.priorities.original,
  },
  {
    index: 6,
    name: dictinary.TCTypes.ru,
    value: dictinary.TCTypes.original,
  },
  {
    index: 7,
    name: dictinary.rampWorkField.ru,
    value: dictinary.rampWorkField.original,
  },
  {
    index: 8,
    name: dictinary.rampWorkSchedule.ru,
    value: dictinary.rampWorkSchedule.original,
  },
  {
    index: 9,
    name: dictinary.suppliers.ru,
    value: dictinary.suppliers.original,
  },
  {
    index: 10,
    name: dictinary.carriers.ru,
    value: dictinary.carriers.original,
  },
  {
    index: 11,
    name: dictinary.KPP.ru,
    value: dictinary.KPP.original,
  },
  {
    index: 12,
    name: dictinary.additionalBuildings.ru,
    value: dictinary.additionalBuildings.original,
  },
  {
    index: 13,
    name: dictinary.typeOfIncomingDelivery.ru,
    value: dictinary.typeOfIncomingDelivery.original,
  },
  {
    index: 14,
    name: dictinary.parkingLots.ru,
    value: dictinary.parkingLots.original,
  },
];

const ReferenceBookPage = (props) => {
  console.log(props);
  const [currentTabs, setCurrentTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  console.log(currentTabs);

  const onTabClick = (tab) => {
    if (currentTabs.filter((e) => e.value == tab.value).length == 0) {
      setCurrentTabs([...currentTabs, tab]);
    }
    setSelectedTab(tab.value);
    props.history.push("/data/referenceBook/" + tab.value);
  };

  const onTabClose = (tab) => {
    console.log(tab);
    setCurrentTabs(currentTabs.filter((e) => e.value != tab.value));
    console.log(tab);
    console.log(selectedTab);
    if (tab.value == selectedTab) {
      console.log("xx");
      console.log(currentTabs);
      console.log("xxx");
      console.log(props.history);
      props.history.push("/data/referenceBook");
    }
  };

  const changeSelected = (tab) => {
    setSelectedTab(tab);
    if (currentTabs.filter((e) => e.value == tab).length == 0) {
      let fullTab;
      for (let i = 0; i < tabsInfo.length; i++) {
        if (tabsInfo[i].value == tab) {
          fullTab = tabsInfo[i];
          break;
        }
      }
      setCurrentTabs([...currentTabs, fullTab]);
    }
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
      }}
    >
      <div
        style={{
          minWidth: "250px",
          borderRadius: "5px",
          height: "90%",
          maxHeight: "calc(100% - 70px)",
          backgroundColor: "#FFFFFF",
          marginTop: "40px",
          marginLeft: "10px",
          overflowY: "scroll",
        }}
      >
        <ReferenceBookItemsList
          onTabClick={onTabClick}
          currentTabs={currentTabs}
          tabsInfo={tabsInfo}
        />
      </div>
      <ReferenceBookData
        currentTabs={currentTabs}
        setCurrentTabs={setCurrentTabs}
        onTabClose={onTabClose}
        selectedTab={selectedTab}
        setSelectedTab={changeSelected}
      />
    </div>
  );
};

export default withRouter(ReferenceBookPage);
