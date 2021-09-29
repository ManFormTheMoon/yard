import React, { useState } from "react";
import Modal from "../../../../Modal/Modal";
import "./Ramps.css";
import good from "./../../../../img/reference-book-buttons/check.png";
import bad from "./../../../../img/reference-book-buttons/remove.png";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { dictinary } from "../../../../dictinary/dictinary";

const chechBoxStyles = {
  marginLeft: "20px",
};

const GroupEditRampModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyRamp);
  const [checkboxValues, setCheckboxValues] = useState({});

  const setCheckbox = (value, event) => {
    setCheckboxValues({
      ...checkboxValues,
      [value]: event.target.checked,
    });
  };

  const onGroupEditEvent = async (checkboxValues, inputValues1) => {
    const keys = Object.keys(checkboxValues);
    let result = {};
    for (let i = 0; i < keys.length; i++) {
      if (checkboxValues[keys[i]] == true) {
        result[keys[i]] = true;
      }
    }
    let inputValues = {};
    Object.assign(inputValues, inputValues1);
    if (!!inputValues.blocked) {
      inputValues.blocked = inputValues.blocked == "Да" ? 1 : 0;
    }
    if (!!inputValues.autoset) {
      inputValues.autoset = inputValues.autoset == "Да" ? 1 : 0;
    }
    if (!!inputValues.used_for_slot) {
      inputValues.used_for_slot = inputValues.used_for_slot == "Да" ? 1 : 0;
    }
    if (!!inputValues.object_map) {
      inputValues.object_map = inputValues.object_map == "Да" ? 1 : 0;
    }
    let body = {};
    body.values = inputValues;
    body.ids = props.selectedRows;
    body.toclear = result;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/ramps/groupEdit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulGroupEdit();
      setInputValues(props.emptyRamp);
    } else {
      props.onUnsuccesfulGroupEdit();
    }
  };

  const onCancelEvent = () => {
    setInputValues({
      name_ru: "",
      stream: "",
      blocked: "",
      area_id: "",
      capacity: "",
      unit: "",
      object_map: "",
      comment: "",
      used_for_slot: "",
      transport_type_id: "",
      orientation: "",
      autoset: "",
    });
    props.setVisible(false);
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    setInputValues({ ...inputValues, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    setInputValues({ ...inputValues, blocked: event.target.value });
  };
  const onChangeAreaIdHandler = (event) => {
    setInputValues({ ...inputValues, area_id: event.target.value });
  };
  const onChangeCapacityHandler = (event) => {
    setInputValues({
      ...inputValues,
      capacity: event.target.value,
    });
  };
  const onChangeUnitHandler = (event) => {
    setInputValues({ ...inputValues, unit: event.target.value });
  };
  const onChangeAutosetHandler = (event) => {
    setInputValues({ ...inputValues, autoset: event.target.value });
  };
  const onChangeUsedForSlotHandler = (event) => {
    setInputValues({
      ...inputValues,
      used_for_slot: event.target.value,
    });
  };
  const onChangeTransportTypeIdHandler = (event) => {
    setInputValues({
      ...inputValues,
      transport_type_id: event.target.value,
    });
  };
  const onChangeObjectMapHandler = (event) => {
    setInputValues({
      ...inputValues,
      object_map: event.target.value,
    });
  };
  const onChangeOrientationHandler = (event) => {
    setInputValues({
      ...inputValues,
      orientation: event.target.value,
    });
  };
  const onChangeCommentHandler = (event) => {
    setInputValues({ ...inputValues, comment: event.target.value });
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
      <div className="title-modal">{dictinary.groupEditRecord.ru}</div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.name.ru}:<span> *</span>
        </div>
        <input
          type="text"
          value={inputValues.name_ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.stream.ru}:<span> *</span>
        </div>
        <select
          onChange={onChangeStreamHandler}
          value={inputValues.stream}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Input</option>
          <option>Output</option>
        </select>
        <input
          type="checkbox"
          value={checkboxValues.stream}
          onChange={(event) => setCheckbox("stream", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.blocked.ru}?<span> *</span>
        </div>
        <select
          onChange={onChangeBlockedHandler}
          value={inputValues.blocked}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.area.ru}:<span> *</span>
        </div>
        <input
          type="text"
          placeholder={dictinary.codeArea.ru}
          onChange={onChangeAreaIdHandler}
          value={inputValues.area_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.capacity.ru}
          onChange={onChangeCapacityHandler}
          value={inputValues.capacity}
          style={{ marginLeft: "30px", width: "60%" }}
        />
        <input
          type="checkbox"
          value={checkboxValues.capacity}
          onChange={(event) => setCheckbox("capacity", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.unit.ru}:</div>
        <select
          onChange={onChangeUnitHandler}
          value={inputValues.unit}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>kg</option>
          <option>px</option>
          <option>3</option>
        </select>
        <input
          type="checkbox"
          value={checkboxValues.unit}
          onChange={(event) => setCheckbox("unit", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.autoAssigment.ru}:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={inputValues.autoset}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={checkboxValues.autoset}
          onChange={(event) => setCheckbox("autoset", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.usedForSlotting.ru}?</div>
        <select
          onChange={onChangeUsedForSlotHandler}
          value={inputValues.used_for_slot}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={checkboxValues.used_for_slot}
          onChange={(event) => setCheckbox("used_for_slot", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.typeOfAuto.ru}:<span> *</span>
        </div>
        <input
          type="text"
          placeholder="Код вида транспорта"
          onChange={onChangeTransportTypeIdHandler}
          value={inputValues.transport_type_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.onMap.ru}?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={checkboxValues.object_map}
          onChange={(event) => setCheckbox("object_map", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.direction.ru}:</div>
        <select
          onChange={onChangeOrientationHandler}
          value={inputValues.orientation}
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
          value={checkboxValues.orientation}
          onChange={(event) => setCheckbox("orientation", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.comment.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.noMore100.ru}
          onChange={onChangeCommentHandler}
          value={inputValues.comment}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
        <input
          type="checkbox"
          value={checkboxValues.comment}
          onChange={(event) => setCheckbox("comment", event)}
          style={chechBoxStyles}
        />
      </div>

      <div className="modal-button">
        <ApplyButton
          onOk={() => onGroupEditEvent(checkboxValues, inputValues)}
          children={dictinary.saveEdit.ru}
        />
        <CancelButton
          onCancel={onCancelEvent}
          children={dictinary.cancel.ru}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </Modal>
  );
};

export default GroupEditRampModal;
