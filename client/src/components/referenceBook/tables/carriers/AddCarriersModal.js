import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyCarrierForAdd = {
  id: "",
  company_name_ru: "",
  integration_id: "",
  booking_slot: dictinary.no.ru,
  blocked_time: "",
  comment: "",
};

const AddCarriersModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyCarrierForAdd);
  const [badFields, setBadFields] = useState([]);

  const onAddEvent = async (values1) => {
    if (values1.booking_slot == dictinary.yes.ru && !values1.blocked_time) {
      props.showMessage(
        `Если выбор слота разрешен, то необходимо заполнить параметр время запрета бронирования`
      );
      return;
    }
    let values = {};
    Object.assign(values, values1);
    if (!!values.booking_slot) {
      values.booking_slot = values.booking_slot == dictinary.yes.ru ? 1 : 0;
    }
    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/carriers/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyCarrierForAdd);
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      console.log(values)
      console.log(err)
      if (err.includes("company_name_ru") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleNameOfCarrier.ru);
      }
      else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(dictinary.doubleIntegrationOfCarrier.ru);
      } else if (
        err.includes("booking_slot") ||
        err.includes("company_name_ru")
      ) {
        props.showMessage(dictinary.reqField.ru);
      }
      let temp = [];
      if (!inputValues.company_name_ru) {
        temp.push("company_name_ru");
      }
      if (!inputValues.booking_slot) {
        temp.push("booking_slot");
      }
      setBadFields(temp);
    }
  };

  const onCancelEvent = () => {
    setInputValues(emptyCarrierForAdd);
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, company_name_ru: event.target.value });
  }; 
  
  const onChangeIntegrationHandler = (event) => {
    setInputValues({ ...inputValues, integration_id: event.target.value });
  };

  const onChangeObjectBookingHandler = (event) => {
    setInputValues({
      ...inputValues,
      booking_slot: event.target.value,
    });
  };
  
  const onChangeBlockedHandler = (event) => {
    setInputValues({ ...inputValues, blocked_time: event.target.value });
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
      <div className="title-modal">{dictinary.addCarrier.ru}</div>
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
          placeholder= {dictinary.enterNameOfCarrier.ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.integrationCode.ru}:</div>
        <input
          type="text"
          onChange={onChangeIntegrationHandler}
          value={inputValues.integration_id}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.booking_slot.ru}? :
        </div>
        <select
          onChange={onChangeObjectBookingHandler}
          value={inputValues.booking_slot}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
      <div style={rowName}>
          {inputValues.booking_slot == dictinary.yes.ru && !inputValues.blocked_time ? (
            <b>{dictinary.blocked_time.ru}</b>
          ) : (
            dictinary.blocked_time.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={1}
          onChange={onChangeBlockedHandler}
          value={inputValues.blocked_time}
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

export default AddCarriersModal;
