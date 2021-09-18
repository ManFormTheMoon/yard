import React from "react";
import AddButton from "../userUI/AddButton";
import ClearButton from "../userUI/ClearButton";
import DeleteButton from "../userUI/DeleteButton";
import EditButton from "../userUI/EditButton";
import GroupEditButton from "../userUI/GroupEditButton";
import SaveButton from "../userUI/SaveButton";
import SearchButton from "../userUI/SearchButton";

const ButtonsBlock = (props) => {
  return (
    <div
      style={{
        width: "1000px",
        height: "50px",
        backgroundColor: "violet",
        display: "flex",
        alignItems: "center",
      }}
    >
      <AddButton children="Добавить" style={{ margin: "6px" }} />
      <EditButton children="Редактировать" style={{ margin: "6px" }} />
      <DeleteButton
        children="Удалить"
        style={{ margin: "6px" }}
        onDeleteHandler={props.onDeleteHandler}
      />
      <SaveButton children="Сохранить" style={{ margin: "6px" }} />
      <GroupEditButton
        children="Групповое редактирование"
        style={{ margin: "6px" }}
      />
      <SearchButton
        children="Поиск"
        style={{ margin: "6px" }}
        onSearchClick={props.onSearchClick}
      />
      <ClearButton
        children="Очистить поиск"
        style={{ margin: "6px" }}
        onSearchClearHandler={props.onSearchClearHandler}
      />
    </div>
  );
};

export default ButtonsBlock;
