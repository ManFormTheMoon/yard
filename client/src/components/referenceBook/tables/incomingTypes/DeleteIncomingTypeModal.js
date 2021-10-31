import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";
import attention from "./../../../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../../../dictinary/dictinary";

const DeleteAreaModal = (props) => {
  
  const [badFields, setBadFields] = useState([]);
  
  const onDeleteEvent = async () => {
    let body = {};
    body.arr = props.selectedRows;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/area/delete", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    console.log("data ")
    console.log( data.error)
    if (data.message == "bad") {    
      const err = data.error;
       if (err.includes("foreign key")) {
        let mesError = dictinary.errorKey.ru
        if (err.includes("ramps")) {
          mesError= mesError + "'" + dictinary.ramps.ru + "'"
        } 
        if (err.includes("cargo_types")) {
          mesError= mesError + "'" + dictinary.cargoTypes.ru + "'"
        }
        props.showMessage(mesError);
       } 
    } else {
      props.onSuccesfulDelete();
      setBadFields([]);
    } 
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
        <ApplyButton onOk={onDeleteEvent} children={dictinary.saveEdit.ru} />
        <CancelButton
          onCancel={onCancelEvent}
          children={dictinary.cancel.ru}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </Modal>
  );
};

export default DeleteAreaModal;
