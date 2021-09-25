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
      <div className="title-modal">{dictinary.groupEditRecord.ru}</div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.name.ru}:<span> *</span></div>
        <input
          type="text"
          value={props.inputValues.name_ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.stream.ru}:<span> *</span></div>
        <select
          onChange={onChangeStreamHandler}
          value={props.inputValues.stream}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Input</option>
          <option>Output</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.blocked.ru}?<span> *</span></div>
        <select
          onChange={onChangeBlockedHandler}
          value={props.inputValues.blocked}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.area.ru}:<span> *</span></div>
        <input
          type="text"
          placeholder={dictinary.codeArea.ru}
          onChange={onChangeAreaIdHandler}
          value={props.inputValues.area_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.capacity.ru}
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
        <div style={rowName}>{dictinary.unit.ru}:</div>
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
        <div style={rowName}>{dictinary.autoAssigment.ru}:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={props.inputValues.autoset}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.autoset}
          onChange={(event) => setCheckbox("autoset", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.usedForSlotting.ru}?</div>
        <select
          onChange={onChangeUsedForSlotHandler}
          value={props.inputValues.used_for_slot}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.used_for_slot}
          onChange={(event) => setCheckbox("used_for_slot", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.typeOfAuto.ru}:<span> *</span></div>
        <input
          type="text"
          placeholder="Код вида транспорта"
          onChange={onChangeTransportTypeIdHandler}
          value={props.inputValues.trasnport_type_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.onMap.ru}?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={props.inputValues.object_map}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
        <input
          type="checkbox"
          value={props.checkboxValues.object_map}
          onChange={(event) => setCheckbox("object_map", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.direction.ru}:</div>
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
        <div style={rowName}>{dictinary.comment.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.noMore100.ru}
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
    
      <div className='modal-button'>
        <ApplyButton
          onOk={() =>
            props.onGroupEditEvent(props.checkboxValues, props.inputValues)
          }
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
