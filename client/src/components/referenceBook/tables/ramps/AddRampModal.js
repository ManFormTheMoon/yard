import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";
const AddRampModal = (props) => {
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
  const rowStyles = {
    width: "100%",
    height: "38px",
    backgroundColor: "tomato",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    boxSizing: "border-box",
    marginTop: "18px",
  };
  return (
    <Modal
      visible={props.visible}
      setVisible={props.setAddModalVisible}
      style={props.style}
    >
      <div
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "tomato",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
          boxSizing: "border-box",
        }}
      >
        Добавление рампы
      </div>
      <div style={rowStyles}>
        Наименование
        <input
          value={props.inputValues.name_ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px" }}
        />
      </div>
      <div style={rowStyles}>
        Поток
        <select
          onChange={onChangeStreamHandler}
          value={props.inputValues.stream}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Input</option>
          <option>Output</option>
        </select>
      </div>
      <div style={rowStyles}>
        Заблокировано
        <select
          onChange={onChangeBlockedHandler}
          value={props.inputValues.blocked}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div style={rowStyles}>
        Код плошадки
        <input
          type="text"
          style={{ width: "150px" }}
          placeholder="Код площадки"
          onChange={onChangeAreaIdHandler}
          value={props.inputValues.area_id}
          style={{ marginLeft: "30px" }}
        />
      </div>
      <div style={rowStyles}>
        Вместимость
        <input
          type="text"
          style={{ width: "120px" }}
          placeholder="Вместимость"
          onChange={onChangeCapacityHandler}
          value={props.inputValues.capacity}
          style={{ marginLeft: "30px" }}
        />
      </div>
      <div style={rowStyles}>
        Единица измерения
        <select
          onChange={onChangeUnitHandler}
          value={props.inputValues.unit}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>kg</option>
          <option>px</option>
          <option>3</option>
        </select>
      </div>
      <div style={rowStyles}>
        Авто набор
        <select
          onChange={onChangeAutosetHandler}
          value={props.inputValues.autoset}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div style={rowStyles}>
        Используется для слота
        <select
          onChange={onChangeUsedForSlotHandler}
          value={props.inputValues.used_for_slot}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div style={rowStyles}>
        Код вида транспорта
        <input
          type="text"
          style={{ width: "100px" }}
          placeholder="Код вида транспорта"
          onChange={onChangeTransportTypeIdHandler}
          value={props.inputValues.trasnport_type_id}
          style={{ marginLeft: "30px" }}
        />
      </div>
      <div style={rowStyles}>
        Карта объектов
        <select
          onChange={onChangeObjectMapHandler}
          value={props.inputValues.object_map}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div style={rowStyles}>
        Направление
        <select
          onChange={onChangeOrientationHandler}
          value={props.inputValues.orientation}
          style={{ marginLeft: "30px" }}
        >
          <option></option>
          <option>Left</option>
          <option>Right</option>
          <option>Top</option>
          <option>Bottom</option>
        </select>
      </div>
      <div style={rowStyles}>
        Комментарии
        <input
          type="text"
          placeholder="Не более 100 символов"
          onChange={onChangeCommentHandler}
          value={props.inputValues.comment}
          style={{ width: "500px", marginLeft: "30px" }}
          maxLength="100"
        />
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
          onClick={() => props.onAddEvent(props.inputValues)}
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

export default AddRampModal;
