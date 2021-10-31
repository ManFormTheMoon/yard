import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyParckingForAdd = {
  id: "",
  name_ru: "",
  warehouse_id: "",
  type: dictinary.internal.ru,
  capacity_width: "",
  capacity_length: "",
  main: dictinary.no.ru,
  autoreserve: dictinary.no.ru,
  comment: "",
};

const AddParckingModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyParckingForAdd);

  const [warehousesNamesOptions, setWarehousesNamesOptions] = useState(
    []
  );
  const [selectedWarehouseName, setSelectedWarehouseName] = useState({
    label: "",
    value: "",
  });
  const [badFields, setBadFields] = useState([]);

  const onAddEvent = async (values1) => {
    let values = {};
    Object.assign(values, values1);
    if (!!values.main) {
      values.main = values.main == dictinary.yes.ru ? 1 : 0;
    }
    if (!!values.autoreserve) {
      values.autoreserve = values.autoreserve == dictinary.yes.ru ? 1 : 0;
    }
    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/parckings/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyParckingForAdd);
      setSelectedWarehouseName({ value: "", label: "" });
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
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

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    //ramps names
    const responseTC = await fetch(
      "/api/referenceBook/warehouse/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataTC = await responseTC.json();
    setWarehousesNamesOptions([
      {
        label: "",
        value: "",
      },
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  const onCancelEvent = () => {
    setInputValues(emptyParckingForAdd);
    setSelectedWarehouseName({ value: "", label: "" });
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const changeSelectedWarehouseName = (value) => {
    setSelectedWarehouseName(value);
    setInputValues({
      ...inputValues,
      warehouse_id: value.id,
    });
  };

  const onChangeTypeHandler = (event) => {
    setInputValues({ ...inputValues, type: event.target.value });
  };

  const onChangeCapacityLHandler = (event) => {
    setInputValues({ ...inputValues, capacity_length: event.target.value });
  };

  const onChangeCapacityWHandler = (event) => {
    setInputValues({ ...inputValues, capacity_width: event.target.value });
  };

  const onChangeMainHandler = (event) => {
    setInputValues({
      ...inputValues,
      main: event.target.value,
    });
  };
  
  const onChangeAutoreserveHandler = (event) => {
    setInputValues({ ...inputValues, autoreserve: event.target.value });
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
      <div className="title-modal">{dictinary.addParcking.ru}</div>
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
          placeholder= {dictinary.enterNameOfParcking.ru}
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
            styles={customSelectStyles}
            components={{ IndicatorsContainer }}
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
          value={inputValues.main}
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
          value={inputValues.autoreserve}
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
          placeholder={dictinary.noMore100.ru}
          onChange={onChangeCommentHandler}
          value={inputValues.comment}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
      </div>
      <div className="modal-button">
        <ApplyButton
          onOk={() => onAddEvent(inputValues)}
          children={"Сохранить изменения"}
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

export default AddParckingModal;
