import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";
import attention from "./../../../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../../../dictinary/dictinary";

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
      <div style={{ display: "flex" }}>
        <img
          src={attention}
          style={{ width: "30px", height: "30px", marginRight: "10px" }}
          alt=""
        />
        <div style={{ fontSize: "18px", fontWeight: "" }}>
          Выделено {props.countRows}{" "}
          {props.countRows == 1
            ? "запись"
            : props.countRows >= 2 && props.countRows <= 4
            ? "записи"
            : "записей"}
          . Вы уверены, что хотите их удалить?
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "40px",
          marginTop: "25px",
          marginLeft: "20px",
        }}
      >
        <ApplyButton onOk={onDeleteEvent} children={"Сохранить изменения"} />
        <CancelButton
          onCancel={onCancelEvent}
          children={dictinary.cancel.ru}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </Modal>
  );
};

export default DeleteRampModal;
