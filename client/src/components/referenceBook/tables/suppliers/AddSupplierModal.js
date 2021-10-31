import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptySupplierForAdd = {
  id: "",
  company_name_ru : "",
  integration_id : "",
  comment: "",
};

const AddSupplierModal = (props) => {
  const [inputValues, setInputValues] = useState(emptySupplierForAdd);

  const [badFields, setBadFields] = useState([]);


  const onAddEvent = async (values1) => {
    let values = {};
    Object.assign(values, values1);
    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/supplier/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    console.log("data ")
    console.log( data)
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptySupplierForAdd);
      setBadFields([]);
    } else {
       props.onUnsuccesfulAdd();
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

  const onCancelEvent = () => {
    setInputValues(emptySupplierForAdd);
   
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeComNameRuHandler = (event) => {
    setInputValues({ ...inputValues, company_name_ru: event.target.value });
  };
 
  const onChangeCommentHandler = (event) => {
    setInputValues({ ...inputValues, comment: event.target.value });
  };

  const onChangeIntegrationHandler = (event) => {
    setInputValues({ ...inputValues, integration_id: event.target.value });
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
      <div className="title-modal">{dictinary.addSupplier.ru}</div>
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
          placeholder={dictinary.enterCompNameOfWarehouse.ru}
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

export default AddSupplierModal;