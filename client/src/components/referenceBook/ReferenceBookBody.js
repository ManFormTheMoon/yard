import React from "react";
import { Route } from "react-router-dom";

import RampsTable from "./tables/ramps/RampsTable";
import WarehousesTable from "./tables/warehouse/WarehousesTable";
import TransportTypesTable from "./tables/transportTypes/TransportTypesTable";
import AreasTable from "./tables/areas/AreasTable";
import SuppliersTable from "./tables/suppliers/SuppliersTable";
import ReceiversTable from "./tables/receivers/ReceiversTable";
import CargoTypesTable from "./tables/cargoTypes/CargoTypesTable";
import CheckpointsTable from "./tables/checkpoints/CheckpointsTable";
import ExtrabuildingsTable from "./tables/extrabuildings/ExtrabuildingsTable";
import IncomingTypesTable from "./tables/incomingTypes/IncomingTypesTable";
import ParckingsTable from "./tables/parckings/ParckingsTable";
import CarriersTable from "./tables/carriers/CarriersTable";
import WarehouseScheduleTable from "./tables/warehouseSchedules/WarehouseScheduleTable";
import RampScheduleTable from "./tables/rampSchedules/RampScheduleTable";


const ReferenceBookBody = () => {
  return (
    <div
      style={{
        height: "calc(100% - 60px)",
        backgroundColor: "pink",
        boxSizing: "border-box",
        margin: "10px",
      }}
    >
      <Route path="/data/referenceBook/Ramps" component={RampsTable}></Route>
      <Route path="/data/referenceBook/Warehouses" component={WarehousesTable}></Route>
      <Route path="/data/referenceBook/TransportTypes" component={TransportTypesTable}></Route>
      <Route path="/data/referenceBook/Areas" component={AreasTable}></Route>
      <Route path="/data/referenceBook/Suppliers" component={SuppliersTable}></Route>
      <Route path="/data/referenceBook/Receivers" component={ReceiversTable}></Route>
      <Route path="/data/referenceBook/CargoTypes" component={CargoTypesTable}></Route>
      <Route path="/data/referenceBook/Checkpoints" component={CheckpointsTable}></Route>
      <Route path="/data/referenceBook/Extrabuildings" component={ExtrabuildingsTable}></Route>
      <Route path="/data/referenceBook/IncomingTypes" component={IncomingTypesTable}></Route>
      <Route path="/data/referenceBook/Parckings" component={ParckingsTable}></Route>
      <Route path="/data/referenceBook/Carriers" component={CarriersTable}></Route>
      <Route path="/data/referenceBook/WarehouseSchedules" component={WarehouseScheduleTable}></Route>
      <Route path="/data/referenceBook/RampSchedules" component={RampScheduleTable}></Route>
    </div>
  );
};

export default ReferenceBookBody;
