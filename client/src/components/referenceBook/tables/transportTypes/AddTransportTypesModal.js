import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyTransportTypeForAdd = {
  id: "",
  name_ru: "",
  capacity: "",
  unit: "",
  comment: "",
};

const AddTransportTypesModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyTransportTypeForAdd);

  const [badFields, setBadFields] = useState([]);


  const onAddEvent = async (values1) => {
    if (!!values1.unit && !values1.capacity) {
      props.showMessage(
        `Если заполнена единица измерения то должна быть заполнена и вместимость`
      );
      return;
    } else if (!values1.unit && !!values1.capacity) {
      props.showMessage(
        `Если заполнена вместимость то должна быть заполнена и единица измерения `
      );
      return;
    }
    let values = {};
    Object.assign(values, values1);
    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/transportType/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    console.log("data ")
    console.log( data)
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyTransportTypeForAdd);
      setBadFields([]);
    } else {
       props.onUnsuccesfulAdd();
      const err = data.error;
      console.log("2"+err)
       if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleNameOfTrType.ru);
       } else if (
        err.includes("name_ru")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      setBadFields(temp);
    }
  };

  const onCancelEvent = () => {
    setInputValues(emptyTransportTypeForAdd);
   
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
 
  const onChangeCommentHandler = (event) => {
    setInputValues({ ...inputValues, comment: event.target.value });
  };

  const onChangeCapacityHandler = (event) => {
    setInputValues({ ...inputValues, capacity: event.target.value });
  };
  const onChangeUnitHandler = (event) => {
    setInputValues({ ...inputValues, unit: event.target.value });
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
      <div className="title-modal">{dictinary.addTransportType.ru}</div>
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
          placeholder={dictinary.enterNameOfWarehouse.ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
      <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          max={500}
          onChange={onChangeCapacityHandler}
          value={inputValues.capacity}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.unit.ru}:</div>
        <select
          onChange={onChangeUnitHandler}
          value={inputValues.unit}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Паллеты</option>
          <option>Тонны</option>
          <option>Литры</option>
          <option>Куб метр</option>
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

export default AddTransportTypesModal;