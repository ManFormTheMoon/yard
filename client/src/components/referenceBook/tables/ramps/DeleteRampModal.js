import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
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
        <div
          style={{
            boxSizing: "border-box",
            padding: "5px 3px",
            border: "2px black solid",
            borderRadius: "10px",
            height: "40px",
            display: "inline-flex",
            alignItems: "center",
          }}
          onClick={() => props.onDeleteEvent()}
        >
          <img
            src={good}
            alt=""
            style={{ height: "100%", marginRight: "10px" }}
          />
          Сохранить изменения
        </div>
        <div
          style={{
            boxSizing: "border-box",
            padding: "5px 3px",
            border: "2px black solid",
            borderRadius: "10px",
            height: "40px",
            display: "inline-flex",
            alignItems: "center",
            marginLeft: "20px",
          }}
          onClick={onCancelEvent}
        >
          <img
            src={bad}
            alt=""
            style={{ height: "100%", marginRight: "10px" }}
          />
          Отмена
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRampModal;
