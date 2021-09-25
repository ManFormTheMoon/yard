import React, { useState } from "react";
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
// import transporterOfficeIcon from "../../img/menu-icons/truck.png";
import MenuItem from "./MenuItem";
import { dictinary } from "../../dictinary/dictinary";
const Menu = (props) => {
  const url = window.location.href;
  const currentComponentTemp = url.split("/")[url.split("/").length - 1];

  const [currentComponent, setCurrentComponent] =
    useState(currentComponentTemp);

  return (
    <div
      // блок меню
      className="menu-container"
      style={{
        width: "250px",
        position: "fixed",
        height: "calc(100% - 80px)", //set height to add scroll
        backgroundColor: "#8AA19B",
        zIndex: "1",
        overflowY: "scroll", //scroll
        boxSizing: "border-box",
        cursor: "pointer"
      }}
    >
      <MenuItem
        path={"/data/" + dictinary.territoryMap.original}
        itemCode={dictinary.territoryMap.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={mapIcon}
        nameItem={dictinary.territoryMap.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.workPlace.original}
        itemCode={dictinary.workPlace.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={laptopIcon}
        nameItem={dictinary.workPlace.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.timeSlots.original}
        itemCode={dictinary.timeSlots.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={timeIcon}
        nameItem={dictinary.timeSlots.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.exchangeLog.original}
        itemCode={dictinary.exchangeLog.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={exchangeLogIcon}
        nameItem={dictinary.exchangeLog.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.eventLog.original}
        itemCode={dictinary.eventLog.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={eventLogIcon}
        nameItem={dictinary.eventLog.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.referenceBook.original}
        itemCode={dictinary.referenceBook.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={referenceBookIcon}
        nameItem={dictinary.referenceBook.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.configuration.original}
        itemCode={dictinary.configuration.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={configurationIcon}
        nameItem={dictinary.configuration.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.routing.original}
        itemCode={dictinary.routing.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={routingIcon}
        nameItem={dictinary.routing.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.templateLibrary.original}
        itemCode={dictinary.templateLibrary.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={templateLibraryIcon}
        nameItem={dictinary.templateLibrary.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.service.original}
        itemCode={dictinary.service.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={serviceIcon}
        nameItem={dictinary.service.ru}
      />
      <MenuItem
        path={"/data/" + dictinary.manual.original}
        itemCode={dictinary.manual.original}
        setCurrentComponent={setCurrentComponent}
        currentComponent={currentComponent}
        icon={mapIcon}
        nameItem={dictinary.manual.ru}
        nameItem="Мануал"
      />
    </div>
  );
};

export default Menu;
