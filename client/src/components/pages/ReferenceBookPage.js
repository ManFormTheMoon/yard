import React, { useState } from "react";
import ReferenceBookData from "../referenceBook/ReferenceBookData";
import ReferenceBookItem from "../referenceBook/ReferenceBookItem";
import { arrayMove } from "react-sortable-hoc";
import ReferenceBookItemsList from "../referenceBook/ReferenceBookItemsList";

const tabsInfo = [
  {
    index: 1,
    name: "Рампы",
    value: "Ramps",
  },
  {
    index: 2,
    name: "Нормативы",
    value: "Standarts",
  },
  {
    index: 3,
    name: "Площадка",
    value: "Field",
  },
  {
    index: 4,
    name: "Участки",
    value: "Regions",
  },
  {
    index: 5,
    name: "Приоритеты",
    value: "Priorities",
  },
  {
    index: 6,
    name: "Типы ТС",
    value: "TCTypes",
  },
  {
    index: 7,
    name: "График площадки",
    value: "RampWorkField",
  },
  {
    index: 8,
    name: "График рамп",
    value: "RampWorkSchedule",
  },
  {
    index: 9,
    name: "Поставщики",
    value: "Suppliers",
  },
  {
    index: 10,
    name: "Перевозчики",
    value: "Carriers",
  },
  {
    index: 11,
    name: "КПП",
    value: "KPP",
  },
  {
    index: 12,
    name: "Доп. строения",
    value: "AdditionalBuildings",
  },
  {
    index: 13,
    name: "Тип входящей поставки",
    value: "TypeOfIncomingDelivery",
  },
  {
    index: 14,
    name: "Парковки",
    value: "ParkingLots",
  },
];

const ReferenceBookPage = () => {
  const [currentTabs, setCurrentTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  console.log(currentTabs);

  const onTabClick = (tab) => {
    if (currentTabs.filter((e) => e.value == tab.value).length == 0) {
      setCurrentTabs([...currentTabs, tab]);
    }
    setSelectedTab(tab.value);
  };

  const onTabClose = (tab) => {
    console.log(tab);
    setCurrentTabs(currentTabs.filter((e) => e.value != tab.value));
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
        borderRadius:"10px",
      }}
    >
      <div
        style={{
          width: "15%",
          minWidth: "250px",
          borderRadius:"5px",
          height: "90%",
          backgroundColor: "#FFFFFF",
          marginTop: "50px",
          marginLeft: "10px",
          overflowX: "scroll",
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

export default ReferenceBookPage;
