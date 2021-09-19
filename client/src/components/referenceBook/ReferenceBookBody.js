import React from "react";
import { Route, Link } from "react-router-dom";
import RampsTable from "./tables/ramps/RampsTable";

const ReferenceBookBody = () => {
  return (
    <div
      style={{
        // height: "100%",
        backgroundColor: "pink",
        boxSizing: "border-box",
      }}
    >
      <Route path="/data/referenceBook/Ramps">
        <RampsTable />
      </Route>
    </div>
  );
};

export default ReferenceBookBody;
