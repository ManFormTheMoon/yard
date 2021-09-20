import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import "./Ramps.css";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";

const chechBoxStyles = {
  marginLeft: "20px",
};

const GroupEditRampModal = (props) => {
  console.log(props.checkboxValues);

  const setCheckbox = (value, event) => {
    console.log(value);
    console.log(event.target.value);
    console.log(event);
    props.setCheckboxValues({
      ...props.checkboxValues,
      [value]: event.target.checked,
    });
  };

  const onCancelEvent = () => {
    props.setInputValues({
      name_ru: "",
      stream: "",
      blocked: "",
      area_id: "",
      capacity: "",
      unit: "",
      object_map: "",
      comment: "",
      used_for_slot: "",
      trasnport_type_id: "",
      orientation: "",
      autoset: "",
    });
    props.setVisible(false);
  };

  const onChangeNameRuHandler = (event) => {
    props.setInputValues({ ...props.inputValues, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    props.setInputValues({ ...props.inputValues, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    props.setInputValues({ ...props.inputValues, blocked: event.target.value });
  };
  const onChangeAreaIdHandler = (event) => {
    props.setInputValues({ ...props.inputValues, area_id: event.target.value });
  };
  const onChangeCapacityHandler = (event) => {
    props.setInputValues({
      ...props.inputValues,
      capacity: event.target.value,
    });
  };
  const onChangeUnitHandler = (event) => {
    props.setInputValues({ ...props.inputValues, unit: event.target.value });
  };
  const onChangeAutosetHandler = (event) => {
    props.setInputValues({ ...props.inputValues, autoset: event.target.value });
  };
  const onChangeUsedForSlotHandler = (event) => {
    props.setInputValues({
      ...props.inputValues,
      used_for_slot: event.target.value,
    });
  };
  const onChangeTransportTypeIdHandler = (event) => {
    props.setInputValues({
      ...props.inputValues,
      trasnport_type_id: event.target.value,
    });
  };
  const onChangeObjectMapHandler = (event) => {
    props.setInputValues({
      ...props.inputValues,
      object_map: event.target.value,
    });
  };
  const onChangeOrientationHandler = (event) => {
    props.setInputValues({
      ...props.inputValues,
      orientation: event.target.value,
    });
  };
  const onChangeCommentHandler = (event) => {
    props.setInputValues({ ...props.inputValues, comment: event.target.value });
  };
  const rowName = {
    width: "30%",
  };
  return (
    <Modal
      visible={props.visible}
      setVisible={props.setAddModalVisible}
      style={props.style}
    >
      <div className="title-modal">Групповое редактирование записей</div>
      <div className="row-styles">
        <div style={rowName}>Наименование:</div>
        <input
          type="text"
          value={props.inputValues.name_ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
        <input
          type="checkbox"
          value={props.checkboxValues.name_ru}
          onChange={(event) => setCheckbox("name_ru", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Поток:</div>
        <select
          onChange={onChangeStreamHandler}
          value={props.inputValues.stream}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Input</option>
          <option>Output</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.stream}
          onChange={(event) => setCheckbox("stream", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Заблокировано?</div>
        <select
          onChange={onChangeBlockedHandler}
          value={props.inputValues.blocked}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Участок:</div>
        <input
          type="text"
          placeholder="Код площадки"
          onChange={onChangeAreaIdHandler}
          value={props.inputValues.area_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Вместимость:</div>
        <input
          type="text"
          placeholder="Вместимость"
          onChange={onChangeCapacityHandler}
          value={props.inputValues.capacity}
          style={{ marginLeft: "30px", width: "60%" }}
        />
        <input
          type="checkbox"
          value={props.checkboxValues.capacity}
          onChange={(event) => setCheckbox("capacity", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Единица измерения:</div>
        <select
          onChange={onChangeUnitHandler}
          value={props.inputValues.unit}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>kg</option>
          <option>px</option>
          <option>3</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.unit}
          onChange={(event) => setCheckbox("unit", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Авто назначение:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={props.inputValues.autoset}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Используется для слотитования?</div>
        <select
          onChange={onChangeUsedForSlotHandler}
          value={props.inputValues.used_for_slot}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Тип транспорта:</div>
        <input
          type="text"
          placeholder="Код вида транспорта"
          onChange={onChangeTransportTypeIdHandler}
          value={props.inputValues.trasnport_type_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Является объектом на карте?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={props.inputValues.object_map}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Направление:</div>
        <select
          onChange={onChangeOrientationHandler}
          value={props.inputValues.orientation}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Left</option>
          <option>Right</option>
          <option>Top</option>
          <option>Bottom</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.orientation}
          onChange={(event) => setCheckbox("orientation", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Комментарий:</div>
        <input
          type="text"
          placeholder="Не более 100 символов"
          onChange={onChangeCommentHandler}
          value={props.inputValues.comment}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
        <input
          type="checkbox"
          value={props.checkboxValues.comment}
          onChange={(event) => setCheckbox("comment", event)}
          style={chechBoxStyles}
        />
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          height: "40px",
          marginTop: "30px",
          paddingLeft: "30px",
        }}
      >
        <ApplyButton
          onOk={() =>
            props.onGroupEditEvent(props.checkboxValues, props.inputValues)
          }
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

export default GroupEditRampModal;
