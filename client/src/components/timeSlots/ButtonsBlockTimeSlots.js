import React from "react";
import ClearButton from "../userUI/ClearButton";
import SearchButton from "../userUI/SearchButton";

import { dictinary } from "../../dictinary/dictinary";
import ExportButton from "../userUI/ExportButton";
import DeleteButton from "../userUI/DeleteButton";

const ButtonsBlockTimeSlots = (props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "50px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
      }}
    >
      <SearchButton
        children={dictinary.search.ru}
        style={{ margin: "6px" }}
        onSearchClick={props.onSearchClick}
      />
      <ClearButton
        children={dictinary.сlearSearch.ru}
        style={{ margin: "6px" }}
        onSearchClearHandler={props.onSearchClearHandler}
      />
      <ExportButton
        children={dictinary.unloadingInExcel.ru}
        style={{ margin: "6px" }}
        onDownloadClick={props.onDownloadClick}
      />
      <DeleteButton
        children={dictinary.delete.ru}
        style={{ margin: "6px" }}
        onDeleteHandler={props.onDeleteHandler}
      />
    </div>
  );
};

export default ButtonsBlockTimeSlots;
