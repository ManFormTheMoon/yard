import React from "react";
import { Route } from "react-router-dom";
import TimeSlotsTable from "./timeSlotsTable/TimeSlotsTable";
import TimeSlotsGraphic from "./timeSlotsGraphic/TimeSlotsGraphic";

const TimeSlotsBody = () => {
  return (
    <div
      style={{
        height: "calc(100% - 20px)",
        backgroundColor: "pink",
        boxSizing: "border-box",
        margin: "10px",
      }}
    >
      <Route path="/data/timeSlots/timeSlotsTable" component={TimeSlotsTable} />
      <Route
        path="/data/timeSlots/timeSlotsGraphic"
        component={TimeSlotsGraphic}
      />
    </div>
  );
};

export default TimeSlotsBody;
