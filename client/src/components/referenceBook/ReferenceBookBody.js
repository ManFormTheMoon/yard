import React from "react";
import { Route } from "react-router-dom";

import RampsTable from "./tables/ramps/RampsTable";

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
    </div>
  );
};

export default ReferenceBookBody;
