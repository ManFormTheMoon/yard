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
  
  const GroupEditTransportTypeModal = (props) => {
    const [inputValues, setInputValues] = useState(props.emptyTransportType);
    const [checkboxValues, setCheckboxValues] = useState({});
  
    const setCheckbox = (value, event) => {
      setCheckboxValues({
        ...checkboxValues,
        [value]: event.target.checked,
      });
    };
    
    const onGroupEditEvent = async (checkboxValues, inputValues1) => {
      if (
        (inputValues1.capacity == "0" ||
          !!checkboxValues.capacity ||
          !inputValues1.capacity) &&
        !!inputValues1.unit
      ) {
        props.showMessage(
          dictinary.errorUnitAndCapacity.ru
        );
        return;
      }
      if (
        inputValues1.capacity != "0" &&
        !checkboxValues.capacity &&
        !!inputValues1.capacity &&
        (!inputValues1.unit || checkboxValues.unit)
      ) {
        props.showMessage(
          dictinary.errorCapacityAndUnit.ru
        );
        return;
      }
      if (!!checkboxValues.capacity != !!checkboxValues.unit) {
        props.showMessage(
          dictinary.errorNullCapacityAndUnit.ru
        );
        return;
      }
      const keys = Object.keys(checkboxValues);
      let result = {};
      for (let i = 0; i < keys.length; i++) {
        if (checkboxValues[keys[i]] == true) {
          result[keys[i]] = true;
        }
      }
      let inputValues = {};
      Object.assign(inputValues, inputValues1);
      let body = {};
      body.values = inputValues;
      body.ids = props.selectedRows;
      body.toclear = result;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/transportTypes/groupEdit", {
        method: "POST",
        body: body,
        headers: headers,
      });
      const data = await response.json();
      if (data.message == "ok") {
        props.onSuccesfulGroupEdit();
        setCheckboxValues({});
        setInputValues(props.emptyTransportType);
      } else {
        setCheckboxValues({});
        props.onUnsuccesfulGroupEdit();
      }
    };
  
    const onCancelEvent = () => {
      setCheckboxValues({});
      setInputValues({
        name_ru: "",
        capacity: "",
        unit: "",
        comment: "",
      });
      props.setVisible(false);
    };
  
    const onChangeCapacityHandler = (event) => {
      setInputValues({ ...inputValues, capacity: event.target.value });
    };
    
    const onChangeUnitHandler = (event) => {
      setInputValues({ ...inputValues, unit: event.target.value });
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
  

      <div className="row-styles">
      <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          max={500}
          onChange={onChangeCapacityHandler}
          value={inputValues.capacity}
          style={{ marginLeft: "30px", width: "60%" }}
        />
         <input
            type="checkbox"
            checked={checkboxValues.capacity}
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
          <option>Паллеты</option>
          <option>Тонны</option>
          <option>Литры</option>
          <option>Куб метр</option>
        </select>
        <input
            type="checkbox"
            checked={checkboxValues.unit}
            onChange={(event) => setCheckbox("unit", event)}
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
  
  export default GroupEditTransportTypeModal;