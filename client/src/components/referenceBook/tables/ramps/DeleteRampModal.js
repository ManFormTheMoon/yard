import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";

const DeleteRampModal = (props) => {
  const onCancelEvent = () => {
    props.setVisible(false);
  };
  return (
    <Modal
      visible={props.visible}
      setVisible={props.setVisible}
      style={props.style}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        Вы уверены, что хотите удалить {props.countRows}{" "}
        {props.countRows == 1
          ? "запись"
          : props.countRows >= 2 && props.countRows <= 4
          ? "записи"
          : "записей"}
        ?
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "40px",
          marginTop: "50px",
        }}
      >
        <ApplyButton
          onOk={props.onDeleteEvent}
          children={"Сохранить изменения"}
        />
        <CancelButton
          onCancel={onCancelEvent}
          children={"Отмена"}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </Modal>
  );
};

export default DeleteRampModal;
