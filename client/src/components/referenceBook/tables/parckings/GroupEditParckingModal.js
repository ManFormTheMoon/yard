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

const GroupEditAreaModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyParcking);
  const [checkboxValues, setCheckboxValues] = useState({});

  const [warehousesNamesOptions, setWarehousesNamesOptions] = useState(
    []
  );
  const [selectedTransportTypeName, setSelectedWarehouseName] = useState({
    label: "",
    value: "",
  });

  const setCheckbox = (value, event) => {
    setCheckboxValues({
      ...checkboxValues,
      [value]: event.target.checked,
    });
  };

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    
    //tc types names
    const responseTC = await fetch(
      "/api/referenceBook/warehouse/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataW = await responseTC.json();
    setWarehousesNamesOptions([
      {
        label: "",
        value: "",
      },
      ...dataW.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

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
    if (!!inputValues.main) {
      inputValues.main = inputValues.main == dictinary.yes.ru ? 1 : 0;
    }
    if (!!inputValues.autoreserve) {
      inputValues.autoreserve = inputValues.autoreserve == dictinary.yes.ru ? 1 : 0;
    }
    let body = {};
    body.values = inputValues;
    body.ids = props.selectedRows;
    body.toclear = result;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/parckings/groupEdit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulGroupEdit();
      setCheckboxValues({});
      console.log("x");
      setInputValues(props.emptyParcking);
    } else {
      setCheckboxValues({});
      props.onUnsuccesfulGroupEdit();
    }
  };

  const onCancelEvent = () => {
    setCheckboxValues({});
    setInputValues({
      warehouse_id: "",
      type: "",
      capacity_width: "",
      capacity_length: "",
      main: "",
      autoreserve: "",
      comment: "",
      
    });
    props.setVisible(false);
  };

  const onChangeTypeHandler = (event) => {
    setInputValues({ ...inputValues, type: event.target.value });
  };
  const onChangeCapacityWHandler = (event) => {
    setInputValues({ ...inputValues, capacity_width: event.target.value });
  };
  const onChangeCapacityLHandler = (event) => {
    setInputValues({ ...inputValues, capacity_length: event.target.value });
  };
  const onChangeMainHandler = (event) => {
    setInputValues({ ...inputValues, main: event.target.value });
  };
  const onChangeAutoreserveHandler = (event) => {
    setInputValues({ ...inputValues, autoreserve: event.target.value });
  };

  const changeSelectedWarehouseName = (value) => {
    setSelectedWarehouseName(value);
    setInputValues({
      ...inputValues,
      warehouse_id: value.id,
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
          {dictinary.warehouses.ru}:
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
          <Select
            value={selectedTransportTypeName}
            options={warehousesNamesOptions}
            onChange={(value) => {
              changeSelectedWarehouseName(value);
            }}
            styles={customSelectStyles}
            components={{ IndicatorsContainer }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.type.ru}</div>
        <select
          onChange={onChangeTypeHandler}
          value={inputValues.type}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.internal.ru}</option>
          <option>{dictinary.external.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.capacityWidth.ru}:</div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          max={100}
          onChange={onChangeCapacityWHandler}
          value={inputValues.capacity_width}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.capacityLength.ru}:</div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          max={100}
          onChange={onChangeCapacityLHandler}
          value={inputValues.capacity_length}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.main.ru}?</div>
        <select
          onChange={onChangeMainHandler}
          value={inputValues.main}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.autoreserve.ru}?</div>
        <select
          onChange={onChangeAutoreserveHandler}
          value={inputValues.autoreserve}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
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

export default GroupEditAreaModal;
