import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyCargoTypeForAdd = {
  id: "",
  cargo_name: "",
  area_id: "",
  integration_id: "",
  comment: "",
};

const AddCargoTypeModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyCargoTypeForAdd);

  const [areasNamesOptions, setAreasNamesOptions] = useState(
    []
  );
  const [selectedAreaName, setSelectedAreaName] = useState({
    label: "",
    value: "",
  });
  const [badFields, setBadFields] = useState([]);

  const onAddEvent = async (values1) => {
    let values = {};
    Object.assign(values, values1);
    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/cargoType/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyCargoTypeForAdd);
      setSelectedAreaName({ value: "", label: "" });
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      console.log(err)
      if (err.includes("cargo_name") && err.includes("Duplicate")) {
        props.showMessage(dictinary.dubleNameOfCargoType.ru + "!");
      } else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleCodeOfcargoType.ru + "!");
      } else if (
        err.includes("cargo_name") ||
        err.includes("area_id")
      ) {
        props.showMessage(dictinary.reqField.ru + "!");
      }
      
      let temp = [];
      if (!inputValues.cargo_name) {
        temp.push("cargo_name");
      }
      if (!inputValues.area_id) {
        temp.push("area_id");
      }
      setBadFields(temp);
    }
  };

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    //ramps names
    const responseTC = await fetch(
      "/api/referenceBook/areas/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataTC = await responseTC.json();
    setAreasNamesOptions([
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
    setInputValues(emptyCargoTypeForAdd);
    setSelectedAreaName({ value: "", label: "" });
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, cargo_name: event.target.value });
  };
  const changeSelectedCargoTypeName = (value) => {
    setSelectedAreaName(value);
    setInputValues({
      ...inputValues,
      area_id: value.id,
    });
  };
  const onChangeIntegrationHandler = (event) => {
    setInputValues({
      ...inputValues,
      integration_id: event.target.value,
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
      <div className="title-modal">{dictinary.AddCargoType.ru}</div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("cargo_name") == true ? (
            <b>{dictinary.cargoName.ru}</b>
          ) : (
            dictinary.cargoName.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="text"
          value={inputValues.cargo_name}
          placeholder= {dictinary.enterNameOfCargoType.ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("area_id") == true ? (
            <b>{dictinary.area.ru}</b>
          ) : (
            dictinary.area.ru
          )}
          :<span> *</span>
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
        <Select
            value={selectedAreaName}
            options={areasNamesOptions}
            onChange={(value) => {
              changeSelectedCargoTypeName(value);
            }}
            styles={customSelectStyles}
            components={{ IndicatorsContainer }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.integrationCode.ru}:</div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="text"
          onChange={onChangeIntegrationHandler}
          placeholder={dictinary.integrationCode.ru}
          value={inputValues.integration_id}
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

export default AddCargoTypeModal;
