import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditCheckpointModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyCheckpointIds);

  const [badFields, setBadFields] = useState([]);
  
  const onCancelEvent = () => {
    props.setVisible(false);
  };

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentCheckpointId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/checkpoint/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      console.log("body.id");
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
    const response = await fetch("/api/referenceBook/checkpoint/edit", {
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
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleNameOfCheckpoint.ru);
      }
      else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleIntegrationOfCheckpoint.ru);
      } else if (
        err.includes("object_map") ||
        err.includes("name_ru")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      if (!inputValues.object_map) {
        temp.push("object_map");
      }
      setBadFields(temp);
    }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  
  const onChangeIntegrationHandler = (event) => {
    setInputValues({ ...inputValues, integration_id: event.target.value });
  }; 

  const onChangeObjectMapHandler = (event) => {
    setInputValues({
      ...inputValues,
      object_map: 1 * (event.target.value == dictinary.yes.ru),
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
      <div className="title-modal">{dictinary.updateCheckpoint.ru}</div>
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
        <div style={rowName}>{dictinary.integrationCode.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.integrationCode.ru}
          onChange={onChangeIntegrationHandler}
          value={inputValues.integration_id}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.onMap.ru}? :</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map ? "????" : "??????"}
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

export default EditCheckpointModal;