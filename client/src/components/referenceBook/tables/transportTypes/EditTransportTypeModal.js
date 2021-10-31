import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditTransportTypeModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyTransportTypeIds);
console.log(inputValues)
  const onCancelEvent = () => {
    props.setVisible(false);
    setInputValues(props.emptyTransportTypeIds);
  };
  
  const [badFields, setBadFields] = useState([]);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      setBadFields([]);
      body.id = props.currentTransportTypeId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/transportTypes/getOne", {
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
    if (!!inputValues.unit && !inputValues.capacity) {
      props.showMessage(
        `Если заполнена единица измерения то должна быть заполнена и вместимость`
      );
      return;
    } else if (!inputValues.unit && !!inputValues.capacity) {
      props.showMessage(
        `Если заполнена вместимость то должна быть заполнена и единица измерения `
      );
      return;
    }
    console.log(inputValues);
    let body = {};
    body.values = inputValues;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/transportTypes/edit", {
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
     } else if (
       err.includes("name_ru") 
     ) {
       props.showMessage(`Заполните обязательные поля`);
     }
     
     let temp = [];
     if (!inputValues.name_ru) {
       temp.push("name_ru");
     }
     setBadFields(temp);
   }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeCapacityHandler = (event) => {
    setInputValues({ ...inputValues, capacity: event.target.value });
  };
  
  const onChangeUnitHandler = (event) => {
    setInputValues({
      ...inputValues,
      unit: event.target.value,
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
      <div className="title-modal">{dictinary.updateRamp.ru}</div>
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

export default EditTransportTypeModal;