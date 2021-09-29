import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";

const DeleteRampModal = (props) => {
  const onDeleteEvent = async () => {
    console.log(props.selectedRows);
    let body = {};
    body.arr = props.selectedRows;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/ramps/delete", {
      method: "POST",
      body: body,
      headers: headers,
    });
    props.onSuccesfulDelete();
  };
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
        <ApplyButton onOk={onDeleteEvent} children={"Сохранить изменения"} />
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
