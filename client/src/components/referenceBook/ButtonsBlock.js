import React from "react";
import AddButton from "../userUI/AddButton";
import ClearButton from "../userUI/ClearButton";
import DeleteButton from "../userUI/DeleteButton";
import EditButton from "../userUI/EditButton";
import GroupEditButton from "../userUI/GroupEditButton";
import SaveButton from "../userUI/SaveButton";
import SearchButton from "../userUI/SearchButton";

import { dictinary } from "../../dictinary/dictinary";

const ButtonsBlock = (props) => {
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
      <AddButton
        children={dictinary.add.ru}
        style={{ margin: "6px" }}
        onAddHandler={props.onAddHandler}
      />
      <EditButton
        children={dictinary.edit.ru}
        style={{ margin: "6px" }}
        onEditHandler={props.onEditHandler}
      />
      <DeleteButton
        children={dictinary.delete.ru}
        style={{ margin: "6px" }}
        onDeleteHandler={props.onDeleteHandler}
      />
      <SaveButton children={dictinary.save.ru} style={{ margin: "6px" }} />
      <GroupEditButton
        children={dictinary.editGroup.ru}
        style={{ margin: "6px" }}
        onGroupEditHandler={props.onGroupEditHandler}
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

export default ButtonsBlock;
