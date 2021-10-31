import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditParckingModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyParckingIds);

  const [badFields, setBadFields] = useState([]);
  
  const [warehousesNamesOptions, setWarehousesNamesOptions] = useState(
    []
  );
  const [selectedWarehouseName, setSelectedWarehouseName] = useState({
    label: "",
    value: "",
  });
  const onCancelEvent = () => {
    props.setVisible(false);
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
    const dataTC = await responseTC.json();
    setWarehousesNamesOptions([
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentParckingId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/parckings/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      console.log(data);
      setSelectedWarehouseName({
        id: data.warehouse_id,
        value: data.warehouse_name,
        label: data.warehouse_name,
      });
      setInputValues(data);
    }
  }, [props.visible]);

  const onEditEvent = async () => {
    console.log(inputValues);
    let body = {};
    body.values = inputValues;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/parckings/edit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulEdit();
      setBadFields([]);
    }
    else {
      props.onUnsuccesfulEdit();
      const err = data.error;
      console.log(err)
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.dubleNameOfParcking.ru);
      } else if (
        err.includes("warehouse_id") ||
        err.includes("main") ||
        err.includes("name_ru") ||
        err.includes("type") ||
        err.includes("autoreserve") ||
        err.includes("capacity_width")||
        err.includes("capacity_length")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      if (!inputValues.main) {
        temp.push("main");
      }
      if (!inputValues.type) {
        temp.push("type");
      }
      if (!inputValues.autoreserve) {
        temp.push("autoreserve");
      }
      if (!inputValues.capacity_length) {
        temp.push("capacity_length");
      }
      if (!inputValues.capacity_width) {
        temp.push("capacity_width");
      }
      if (!selectedWarehouseName.label) {
        temp.push("warehouse_name");
      }
      setBadFields(temp);
    }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
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
  const changeSelectedWarehouseName = (value) => {
    setSelectedWarehouseName(value);
    setInputValues({
      ...inputValues,
      warehouse_id: value.id,
    });
  };
  const onChangeAutoreserveHandler = (event) => {
    setInputValues({
      ...inputValues,
      autoreserve: 1 * (event.target.value == dictinary.yes.ru),
    });
  };
  const onChangeMainHandler = (event) => {
    setInputValues({
      ...inputValues,
      main: 1 * (event.target.value == dictinary.yes.ru),
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
      setVisible={props.setEditModalVisible}
      style={props.style}
    >
      <div className="title-modal">{dictinary.updateArea.ru}</div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("name_ru") == true ? (
            <b>{dictinary.name.ru}</b>
          ) : (
            dictinary.name.ru
          )}
          :<span> *</span>
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
          {badFields.includes("warehouse_name") == true ? (
            <b>{dictinary.warehouses.ru}</b>
          ) : (
            dictinary.warehouses.ru
          )}
          :<span> *</span>
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
        <Select
            value={selectedWarehouseName}
            options={warehousesNamesOptions}
            onChange={(value) => {
              changeSelectedWarehouseName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.type.ru} :
        </div>
        <select
          onChange={onChangeTypeHandler}
          value={inputValues.type}
          style={{ marginLeft: "30px", width: "30%" }}
        >
        <option>{dictinary.internal.ru}</option>
        <option>{dictinary.external.ru}</option>
        </select>
      </div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("capacity_width") == true ? (
            <b>{dictinary.capacityWidth.ru}</b>
          ) : (
            dictinary.capacityWidth.ru
          )}
          :<span> *</span>
        </div>
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
        <div style={rowName}>
          {badFields.includes("capacity_length") == true ? (
            <b>{dictinary.capacityLength.ru}</b>
          ) : (
            dictinary.capacityLength.ru
          )}
          :<span> *</span>
        </div>
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
        <div style={rowName}>{dictinary.main.ru}:</div>
        <select
          onChange={onChangeMainHandler}
          value={inputValues.main ? dictinary.yes.ru : dictinary.no.ru}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.autoreserve.ru}:</div>
        <select
          onChange={onChangeAutoreserveHandler}
          value={inputValues.autoreserve ? dictinary.yes.ru : dictinary.no.ru}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.comment.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.comment.ru}
          onChange={onChangeCommentHandler}
          value={inputValues.comment}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
      </div>
      <div className="modal-button">
        <ApplyButton
          onOk={() => onEditEvent(inputValues)}
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

export default EditParckingModal;
