import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyExtrabuildingForAdd = {
  id: "",
  name_ru: "",
  object_map: dictinary.no.ru,
  comment: "",
};

const AddAreaModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyExtrabuildingForAdd);
  const [badFields, setBadFields] = useState([]);

  const onAddEvent = async (values1) => {
    let values = {};
    Object.assign(values, values1);
    if (!!values.object_map) {
      values.object_map = values.object_map == dictinary.yes.ru ? 1 : 0;
    }

    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/extrabuildings/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyExtrabuildingForAdd);
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      console.log(values)
      console.log(err)
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleNameOfExtrabuilding.ru);
      }
      else if (
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

  const onCancelEvent = () => {
    setInputValues(emptyExtrabuildingForAdd);
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  }; 
  
  const onChangeObjectMapHandler = (event) => {
    setInputValues({
      ...inputValues,
      object_map: event.target.value,
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
      <div className="title-modal">{dictinary.addExtrabuilding.ru}</div>
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
          placeholder= {dictinary.enterNameOfExtrabuilding.ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.onMap.ru}? :
        </div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map}
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

export default AddAreaModal;
