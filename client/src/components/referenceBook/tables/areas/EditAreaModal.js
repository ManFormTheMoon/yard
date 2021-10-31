import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditAreaModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyAreaIds);

  const [badFields, setBadFields] = useState([]);
  
  const [warehousesNamesOptions, setWarehousesNamesOptions] = useState(
    []
  );
  const [selectedWarehouseName, setSelectedWarehouseName] = useState({
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
      "/api/referenceBook/warehouse/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataTC = await responseTC.json();
    setWarehousesNamesOptions([
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentAreaId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/areas/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      console.log(data);
      setSelectedWarehouseName({
        id: data.warehouse_id,
        value: data.warehouse_name,
        label: data.warehouse_name,
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
    const response = await fetch("/api/referenceBook/areas/edit", {
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
        props.showMessage(`Рампа с данным наименованием уже существует`);
      } else if (
        err.includes("warehouse_id") ||
        err.includes("object_map") ||
        err.includes("name_ru")
      ) {
        props.showMessage(`Заполните обязательные поля`);
      }
      // if () {
      //   props.showMessage(`Поле ${dictinary.name.ru} заполнено некорректно`);
      // }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      if (!inputValues.object_map) {
        temp.push("object_map");
      }
      if (!selectedWarehouseName.label) {
        temp.push("warehouse_name");
      }
      setBadFields(temp);
    }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const changeSelectedWarehouseName = (value) => {
    setSelectedWarehouseName(value);
    setInputValues({
      ...inputValues,
      warehouse_id: value.id,
    });
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
      <div className="title-modal">{dictinary.updateArea.ru}</div>
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
          {badFields.includes("warehouse_name") == true ? (
            <b>{dictinary.warehouses.ru}</b>
          ) : (
            dictinary.warehouses.ru
          )}
          :<span> *</span>
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
        <Select
            value={selectedWarehouseName}
            options={warehousesNamesOptions}
            onChange={(value) => {
              changeSelectedWarehouseName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("warehouse_name") == true ? (
            <b>{dictinary.onMap.ru}</b>
          )  : (
            dictinary.onMap.ru
          )}
          :<span> *</span>
        </div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map ? "Да" : "Нет"}
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

export default EditAreaModal;
