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
  
  const GroupEditWarehouseModal = (props) => {
    const [inputValues, setInputValues] = useState(props.emptyWarehouse);
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
      let body = {};
      body.values = inputValues;
      body.ids = props.selectedRows;
      body.toclear = result;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/warehouses/groupEdit", {
        method: "POST",
        body: body,
        headers: headers,
      });
      const data = await response.json();
      if (data.message == "ok") {
        props.onSuccesfulGroupEdit();
        setCheckboxValues({});
        setInputValues(props.emptyWarehouse);
      } else {
        setCheckboxValues({});
        props.onUnsuccesfulGroupEdit();
      }
    };
  
    const onCancelEvent = () => {
      setCheckboxValues({});
      setInputValues({
        name_ru: "",
        integration_id: "",
        UTC: "",
        comment: "",
      });
      props.setVisible(false);
    };
  
    const onChangeUTCHandler = (event) => {
      setInputValues({ ...inputValues, UTC: event.target.value });
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
        <div style={rowName}>
         {dictinary.UTC.ru}:
         <span> *</span>
        </div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={-12}
          max={12}
          onChange={onChangeUTCHandler}
          value={inputValues.UTC}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
        <div className={`${"row-styles"} ${"not-edit"}`}>
          <div style={rowName}>
            {dictinary.integrationCode.ru}:
          </div>
          <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
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
  
  export default GroupEditWarehouseModal;