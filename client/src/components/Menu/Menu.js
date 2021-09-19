import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./menu.css";
import laptopIcon from "../../img/menu-icons/laptop.png";
import mapIcon from "../../img/menu-icons/map.png";
import timeIcon from "../../img/menu-icons/time.png";
import exchangeLogIcon from "../../img/menu-icons/exchange.png";
import eventLogIcon from "../../img/menu-icons/error.png";
import referenceBookIcon from "../../img/menu-icons/dictionar.png";
import configurationIcon from "../../img/menu-icons/settings.png";
import routingIcon from "../../img/menu-icons/route.png";
import templateLibraryIcon from "../../img/menu-icons/files.png";
import serviceIcon from "../../img/menu-icons/database.png";
import transporterOfficeIcon from "../../img/menu-icons/truck.png";
import MenuItem from "./MenuItem";
// import manualIcon from "../../img/menu-icons/"

const Menu = (props) => {
  const history = useHistory();

  const url = window.location.href;
  const currentComponentTemp = url.split("/")[url.split("/").length - 1];

  const [currentComponent, setCurrentComponent] =
    useState(currentComponentTemp);

  const selectedStyle = {
    style: {
      backgroundColor: "#43CBAC",
      fontWeight: "bold",
      fontSize: "21px",
    },
  };
  return (
    <div
      className="menu-container"
      style={{
        width: "250px",
        position: "fixed",
        height: "calc(100% - 80px)", //set height to add scroll
        backgroundColor: "#8AA19B",
        zIndex: "1",
        overflowY: "scroll", //scroll
        boxSizing: "border-box",
      }}
    >
      <MenuItem
        path="/data/territoryMap"
        itemCode="territoryMap"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={mapIcon}
        nameItem="Карта территории"
      />
      <MenuItem
        path="/data/workPlace"
        itemCode="workPlace"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={laptopIcon}
        nameItem="Рабочее место"
      />
      <MenuItem
        path="/data/timeSlots"
        itemCode="timeSlots"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={timeIcon}
        nameItem="Тайм-слоты"
      />
      <MenuItem
        path="/data/exchangeLog"
        itemCode="exchangeLog"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={exchangeLogIcon}
        nameItem="Журнал обменов"
      />
      <MenuItem
        path="/data/eventLog"
        itemCode="eventLog"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={eventLogIcon}
        nameItem="Журнал событий"
      />
      <MenuItem
        path="/data/referenceBook"
        itemCode="referenceBook"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={referenceBookIcon}
        nameItem="Справочники"
      />
      <MenuItem
        path="/data/configuration"
        itemCode="configuration"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={configurationIcon}
        nameItem="Конфигурация"
      />
      <MenuItem
        path="/data/routing"
        itemCode="routing"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={routingIcon}
        nameItem="Маршутизация"
      />
      <MenuItem
        path="/data/templateLibrary"
        itemCode="templateLibrary"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={templateLibraryIcon}
        nameItem="Библиотека шаблонов"
      />
      <MenuItem
        path="/data/service"
        itemCode="service"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={serviceIcon}
        nameItem="Службы"
      />
      <MenuItem
        path="/data/manual"
        itemCode="manual"
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={mapIcon}
        nameItem="Мануал"
      />
    </div>
  );
};

export default Menu;
