import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyIncomingTypeForAdd = {
  id: "",
  name_ru: "",
  warehouse_id: "",
  autoenter: dictinary.no.ru,
  comment: "",
};

const AddIncomingTypeModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyIncomingTypeForAdd);

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
    if (!!values.autoenter) {
      values.autoenter = values.autoenter == dictinary.yes.ru ? 1 : 0;
    }

    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/incomingTypes/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyIncomingTypeForAdd);
      setSelectedWarehouseName({ value: "", label: "" });
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.dubleNameOfIncomingType.ru);
      } else if (
        err.includes("warehouse_id") ||
        err.includes("autoenter") ||
        err.includes("name_ru")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      // if () {
      //   props.showMessage(`Поле ${dictinary.name.ru} заполнено некорректно`);
      // }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      if (!inputValues.autoenter) {
        temp.push("autoenter");
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
    setInputValues(emptyIncomingTypeForAdd);
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
  const onChangeObjectAutoenterHandler = (event) => {
    setInputValues({
      ...inputValues,
      autoenter: event.target.value,
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
      <div className="title-modal">{dictinary.addIncomeType.ru}</div>
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
          placeholder= {dictinary.enterNameOfRapm.ru}
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
        <div style={rowName}>{dictinary.autoenter.ru}? :
        </div>
        <select
          onChange={onChangeObjectAutoenterHandler}
          value={inputValues.autoenter}
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

export default AddIncomingTypeModal;
