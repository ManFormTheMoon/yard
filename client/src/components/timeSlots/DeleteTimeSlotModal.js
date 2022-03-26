import React, { useState } from "react";
import Modal from "../../Modal/Modal";
import ApplyButton from "../userUI/ApplyButton";
import CancelButton from "../userUI/CancelButton";
import good from "./../../img/reference-book-buttons/check.png";
import bad from "./../../img/reference-book-buttons/remove.png";
import attention from "./../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../dictinary/dictinary";

const DeleteTimeSlotModal = (props) => {
  const onDeleteEvent = async () => {
    console.log(props.id);
    let body = {};
    body.id = props.id;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/timeSlots/delete", {
      method: "POST",
      body: body,
      headers: headers,
    });

    const data = await response.json();
    console.log("data ");
    console.log(data);
    if (data.message == "bad") {
      const err = data.error;
      //   if (err.includes("foreign key")) {
      //     let mesError = dictinary.errorKey.ru;
      //     if (err.includes("standart_times")) {
      //       mesError = mesError + "'" + dictinary.standarts.ru + "'";
      //     }
      //     props.showMessage(mesError);
      //   }
      console.log("GGGGG-GGGGG");
    } else {
      props.onSuccesfulDelete();
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
          Вы уверены, что хотите удалить?
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

export default DeleteTimeSlotModal;
