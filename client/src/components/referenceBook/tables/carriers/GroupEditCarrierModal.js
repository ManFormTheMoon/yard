import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { dictinary } from "../../../../dictinary/dictinary";
import Select, { components } from "react-select";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";

const chechBoxStyles = {
  marginLeft: "20px",
};

const GroupEditCarrierModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyCarrier);
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
    if (!!inputValues.booking_slot) {
      inputValues.booking_slot = inputValues.booking_slot == "Да" ? 1 : 0;
    }
    if (inputValues1.booking_slot == dictinary.yes.ru && !inputValues1.blocked_time) {
      props.showMessage(
        `Если выбор слота разрешен, то необходимо заполнить параметр время запрета бронирования`
      );
      return;
    }
    let body = {};
    body.values = inputValues;
    body.ids = props.selectedRows;
    body.toclear = result;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/carriers/groupEdit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulGroupEdit();
      setCheckboxValues({});
      console.log("x");
      setInputValues(props.emptyCarrier);
    } else {
      setCheckboxValues({});
      props.onUnsuccesfulGroupEdit();
    }
  };

  const onCancelEvent = () => {
    setCheckboxValues({});
    setInputValues({
      booking_slot: "",
      blocked_time: "",
      comment: "",
      
    });
    props.setVisible(false);
  };
  
  const onChangeBookingHandler = (event) => {
    setInputValues({
      ...inputValues,
      booking_slot: event.target.value,
    });
  };
  const onChangeBlockedHandler = (event) => {
    setInputValues({ ...inputValues, blocked_time: event.target.value });
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
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.name.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
    
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.integrationCode.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.integrationCode.ru}
              </div>
          </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.booking_slot.ru}?</div>
        <select
          onChange={onChangeBookingHandler}
          value={inputValues.booking_slot}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
      <div style={rowName}>
          {inputValues.booking_slot == dictinary.yes.ru && !inputValues.blocked_time ? (
            <b>{dictinary.blocked_time.ru}</b>
          ) : (
            dictinary.blocked_time.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          onChange={onChangeBlockedHandler}
          value={inputValues.blocked_time}
          style={{ marginLeft: "30px", width: "60%" }}
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
          checked={checkboxValues.comment}
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

export default GroupEditCarrierModal;
