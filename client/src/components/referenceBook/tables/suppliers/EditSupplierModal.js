import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditSupplierModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptySupplierIds);
  const onCancelEvent = () => {
    props.setVisible(false);
    setInputValues(props.emptySupplierIds);
  };
  
  const [badFields, setBadFields] = useState([]);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      setBadFields([]);
      body.id = props.currentSupplierId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/suppliers/getOne", {
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
    const response = await fetch("/api/referenceBook/suppliers/edit", {
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
       if (err.includes("company_name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleNameOfSupplier.ru);
       }
       else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleIntegrationOfSupplier.ru);
       }
       else if (
        err.includes("company_name_ru")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      let temp = [];
      if (!inputValues.company_name_ru) {
        temp.push("company_name_ru");
      }
      setBadFields(temp);
    }
  };

  const onChangeComNameRuHandler = (event) => {
    setInputValues({ ...inputValues, company_name_ru: event.target.value });
  };
  const onChangeIntegrationHandler = (event) => {
    setInputValues({ ...inputValues, integration_id: event.target.value });
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
      <div className="title-modal">{dictinary.updateSupplier.ru}</div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("company_name_ru") == true ? (
            <b>{dictinary.company_name.ru}</b>
          ) : (
            dictinary.company_name.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="text"
          value={inputValues.company_name_ru}
          onChange={onChangeComNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
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

export default EditSupplierModal;