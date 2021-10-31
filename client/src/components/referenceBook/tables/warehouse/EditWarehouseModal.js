import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditWarehouseModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyWarehouseIds);
console.log(inputValues)
  const onCancelEvent = () => {
    props.setVisible(false);
    setInputValues(props.emptyWarehouseIds);
  };
  
  const [badFields, setBadFields] = useState([]);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      setBadFields([]);
      body.id = props.currentWarehouseId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/warehouses/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      console.log(data);
      setInputValues(data);
      console.log(badFields)
    }
  }, [props.visible]);

  const onEditEvent = async () => {
    console.log(inputValues);
    let body = {};
    body.values = inputValues;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/warehouses/edit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    
    if (data.message == "ok") {
      props.onSuccesfulEdit();
    } 
    else {
      props.onUnsuccesfulEdit();
     const err = data.error;
     console.log("2"+err)
      if (err.includes("name_ru") && err.includes("Duplicate")) {
       props.showMessage(`Площадка с данным наименованием уже существует`);
     } else if (err.includes("integration_id") && err.includes("Duplicate")) {
       props.showMessage(`Площадка с данным кодом интеграции уже существует`);
     } else if (
       err.includes("name_ru") ||
       err.includes("UTC")
     ) {
       props.showMessage(`Заполните обязательные поля`);
     }
     
     let temp = [];
     if (!inputValues.name_ru) {
       temp.push("name_ru");
     }
     if (!inputValues.UTC) {
       temp.push("UTC");
     }
     setBadFields(temp);
   }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeUTCHandler = (event) => {
    setInputValues({ ...inputValues, UTC: event.target.value });
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
      <div className="title-modal">{dictinary.updateWarehouse.ru}</div>
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
          {badFields.includes("UTC") == true ? (
            <b>{dictinary.UTC.ru}</b>
          ) : (
            dictinary.UTC.ru
          )}
          :<span> *</span>
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
      <div className="row-styles">
        <div style={rowName}>{dictinary.integrationCode.ru}:</div>
        <input
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

export default EditWarehouseModal;