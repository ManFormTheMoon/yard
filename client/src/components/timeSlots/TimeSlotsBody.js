import React from "react";
import { Route } from "react-router-dom";
import TimeSlotsTable from "./TimeSlotsTable";

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
      <Route path="/data/timeSlots/timeSlots" component={TimeSlotsTable} />
    </div>
  );
};

export default TimeSlotsBody;
