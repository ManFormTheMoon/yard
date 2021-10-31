import React from "react";
import { Route } from "react-router-dom";
import RelatedDocumentsTable from "./relatedDocuments/RelatedDocumentsTable";
import UnrelatedDocumentsTable from "./unrelatedDocuments/UnrelatedDocumentsTable";

const WorkPlaceBody = () => {
  return (
    <div
      style={{
        height: "calc(100% - 20px)",
        backgroundColor: "pink",
        boxSizing: "border-box",
        margin: "10px",
      }}
    >
      <Route
        path="/data/workPlace/unrelatedDocuments"
        component={UnrelatedDocumentsTable}
      />
      <Route
        path="/data/workPlace/relatedDocuments"
        component={RelatedDocumentsTable}
      />
    </div>
  );
};

export default WorkPlaceBody;
