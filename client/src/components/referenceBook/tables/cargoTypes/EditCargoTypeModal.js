import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditCargoTypeModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyCargoTypesIds);

  const [badFields, setBadFields] = useState([]);
  
  const [areasNamesOptions, setAreasNamesOptions] = useState(
    []
  );
  const [selectedAreaName, setSelectedAreaName] = useState({
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
      "/api/referenceBook/areas/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataTC = await responseTC.json();
    console.log("dataTC")
    console.log(dataTC)
    setAreasNamesOptions([
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentCargoTypeId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/cargoType/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      setSelectedAreaName({
        id: data.area_id,
        value: data.area_name,
        label: data.area_name,
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
    const response = await fetch("/api/referenceBook/cargoType/edit", {
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

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, cargo_name: event.target.value });
  };
  
  const changeSelectedhAreaName = (value) => {
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
      setVisible={props.setEditModalVisible}
      style={props.style}
    >
      <div className="title-modal">{dictinary.updateCargoType.ru}</div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("cargo_name") == true ? (
            <b>{dictinary.cargoTypes.ru}</b>
          ) : (
            dictinary.cargoTypes.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="text"
          value={inputValues.cargo_name}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("area_ru") == true ? (
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
              changeSelectedhAreaName(value);
            }}
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

export default EditCargoTypeModal;
