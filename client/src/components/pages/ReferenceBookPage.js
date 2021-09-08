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
  const [currentTabs, setCurrentTabs] = useState([]);
  console.log(currentTabs);
  const onTabClick = (tab) => {
    if (currentTabs.filter((e) => e.value == tab.value).length == 0) {
      setCurrentTabs([...currentTabs, tab]);
    }
  };

  return (
    <div
      style={{
        width: "98%",
        height: "960px",
        backgroundColor: "#DBE6D8",
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "200px",
          height: "500px",
          backgroundColor: "red",
          marginTop: "50px",
          marginLeft: "10px",
          boxSizing: "border-box",
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
      />
    </div>
  );
};

export default ReferenceBookPage;
