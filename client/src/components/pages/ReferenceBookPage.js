import React, { useState } from "react";
import ReferenceBookData from "../referenceBook/ReferenceBookData";
import ReferenceBookItem from "../referenceBook/ReferenceBookItem";
import { arrayMove } from "react-sortable-hoc";
import ReferenceBookItemsList from "../referenceBook/ReferenceBookItemsList";
import { useHistory } from "react-router-dom";

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
    name: "График работ площадки",
    value: "RampWorkField",
  },
  {
    index: 8,
    name: "График работ рамп",
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
    name: "КПП – контрольно-пропускные пункты",
    value: "KPP",
  },
  {
    index: 12,
    name: "Дополнительные строения",
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
  const history = useHistory();
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
    console.log(tab);
    console.log(selectedTab);
    if (tab.value == selectedTab) {
      console.log("xx");
      console.log(currentTabs);
      if (currentTabs.length == 1) {
        console.log("xxx");
        // window.location.href = "http://localhost:3000/data/referenceBook/";
        // window.history.pushState(
        //   null,
        //   null,
        //   "http://localhost:3000/data/referenceBook/"
        // );
        // history.push("/data/exchangeLog");
      }
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
        backgroundColor: "orange",
        display: "flex",
        width: "98%",
      }}
    >
      <div
        style={{
          width: "15%",
          minWidth: "250px",
          height: "800px",
          backgroundColor: "red",
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
