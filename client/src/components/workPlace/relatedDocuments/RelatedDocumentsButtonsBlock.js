import React from "react";
import ClearButton from "../../userUI/ClearButton";
import SearchButton from "../../userUI/SearchButton";
import { dictinary } from "../../../dictinary/dictinary";
import ConnectSlotButton from "../../userUI/ConnectSlotButton";

const RelatedDocumentsButtonsBlock = (props) => {
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
      <ConnectSlotButton
        children="Привязать слот"
        style={{ margin: "6px" }}
        onOpenConnect={props.onOpenConnect}
      />
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
    </div>
  );
};

export default RelatedDocumentsButtonsBlock;
