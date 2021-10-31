import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditWarehouseScheduleModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyWScheduleIds);

  const [areasNamesOptions, setAreasNamesOptions] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState({});

  const [badFields, setBadFields] = useState([]);
  const [transportTypesNamesOptions, setTransportTypesNamesOptions] = useState(
    []
  );
  const [selectedTransportTypeName, setSelectedTransportTypeName] = useState(
    {}
  );

  const onCancelEvent = () => {
    props.setVisible(false);
  };

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    //ramps names
    const response = await fetch("/api/referenceBook/areas/getNames", {
      method: "POST",
      headers: headers,
    });
    const data = await response.json();
    console.log("1");
    console.log(data);
    setAreasNamesOptions([
      ...data.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);

    //Warehouse types names
    const responseWarehouse = await fetch(
      "/api/referenceBook/warehouse/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataWarehouse = await responseWarehouse.json();
    console.log(data);
    setTransportTypesNamesOptions([
      ...dataWarehouse.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentWScheduleId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/warehouseSchedules/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      
      let data = await response.json();
      data = data.data[0];
      console.log("data");
      console.log(body);
      setSelectedAreaName({
        id: data.area_id,
        value: data.area_name,
        label: data.area_name,
      });
      setSelectedTransportTypeName({
        id: data.warehouse_id,
        value: data.warehouse_name,
        label: data.warehouse_name,
      });
      setInputValues(data);
    }
  }, [props.visible]);

  const onEditEvent = async () => {
    if (inputValues.break1_end <= inputValues.break1_start) {
      props.showMessage(
        `Время для 1 перерыва заполнено некорректно`
      );
      return;
    } else if (inputValues.break2_end <= inputValues.break2_start && inputValues.break_quantity == 2) {
      props.showMessage(
        `Время для 2 перерыва заполнено некорректно`
      );
      return;
    } else if (inputValues.break1_end >= inputValues.break2_start && inputValues.break_quantity == 2) {
      props.showMessage(
        `Время для 1 и 2 перерыва заполнено некорректно`
      );
      return;
    } else if (inputValues.work_start >= inputValues.break1_start || (inputValues.work_start >= inputValues.break2_start && inputValues.break_quantity == 2)) {
      props.showMessage(
        `Время начала работы > времени начала перерыва`
      );
      return;
    } 
    console.log(inputValues);
    let body = {};
    body.values = inputValues;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/warehouseSchedules/edit", {
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
      if (err.includes("team_name") && err.includes("Duplicate")) {
        props.showMessage(`Рампа с данным наименованием уже существует`);
      } else if (
        err.includes("area_id") ||
        err.includes("transport_type_id") ||
        err.includes("team_name")
      ) {
        props.showMessage(`Заполните обязательные поля`);
      }
      // if () {
      //   props.showMessage(`Поле ${dictinary.name.ru} заполнено некорректно`);
      // }
      let temp = [];
      if (!inputValues.team_name) {
        temp.push("team_name");
      }
      if (!selectedAreaName.label) {
        temp.push("area_name");
      }
      if (!selectedTransportTypeName.label) {
        temp.push("warehouse_name");
      }
      if (!inputValues.work_start) {
        temp.push("work_start");
      }
      if (!inputValues.break1_start) {
        temp.push("break1_start");
      }
      if (!inputValues.break1_end) {
        temp.push("break1_end");
      }
      if (!inputValues.break2_start) {
        temp.push("break2_start");
      }
      if (!inputValues.break2_end) {
        temp.push("break2_end");
      }
      setBadFields(temp);
      console.log(badFields)
    }
  };

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, team_name: event.target.value });
  };
 
  const changeSelectedAreaName = (value) => {
    setSelectedAreaName(value);
    setInputValues({
      ...inputValues,
      area_id: value.id,
    });
  };

  const changeSelectedTransportTypeName = (value) => {
    setSelectedTransportTypeName(value);
    setInputValues({
      ...inputValues,
      warehouse_id: value.id,
    });
  };
  const onChangeWorkStartHandler = (event) => {
    setInputValues({
      ...inputValues, 
      work_start: event.target.value,
    });
  };
  const onChangeBreak1SHandler = (event) => {
    setInputValues({ ...inputValues, break1_start: event.target.value });
  };
  
  const onChangeBreak1EHandler = (event) => {
    setInputValues({ ...inputValues, break1_end: event.target.value });
  };
  
  const onChangeBreak2SHandler = (event) => {
    setInputValues({ ...inputValues, break2_start: event.target.value });
  };
  
  const onChangeBreak2EHandler = (event) => {
    setInputValues({ ...inputValues, break2_end: event.target.value });
  };

  const onChangeBreakQuantityHandler = (event) => {
    setInputValues({ ...inputValues, break_quantity: event.target.value });
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
      <div className="title-modal">{dictinary.updateWSchedule.ru}</div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.areas.ru}:<span> *</span>:</div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
          <Select
            value={selectedAreaName}
            options={areasNamesOptions}
            onChange={(value) => {
              changeSelectedAreaName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.typeOfAuto.ru}:<span> *</span>
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
          <Select
            value={selectedTransportTypeName}
            options={transportTypesNamesOptions}
            onChange={(value) => {
              changeSelectedTransportTypeName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
      <div style={rowName}>
          {badFields.includes("team_name") == true ? (
            <b>{dictinary.team_name.ru}</b>
          ) : (
            dictinary.team_name.ru
          )}
          :<span> *</span>
        </div>
        <input
          type="text"
          value={inputValues.team_name}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>

      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("work_start") == true ? (
            <b>{dictinary.work_start.ru}</b>
          ) : (
            dictinary.work_start.ru
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeWorkStartHandler}
          placeholder={dictinary.work_start.ru}
          value={inputValues.work_start}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.break_quantity.ru}:<span> *</span>
        </div>
        <select
          onChange={onChangeBreakQuantityHandler}
          value={inputValues.break_quantity}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>1</option>
          <option>2</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break1_start") == true ? (
            <b>{dictinary.break_start.ru}</b>
          ) : (
            dictinary.break_start.ru
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak1SHandler}
          placeholder={dictinary.break_start.ru}
          value={inputValues.break1_start}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break1_end") == true ? (
            <b>{dictinary.break_end.ru}</b>
          ) : (
            dictinary.break_end.ru
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak1EHandler}
          placeholder={dictinary.break_end.ru}
          value={inputValues.break1_end}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div>
      {inputValues.break_quantity == 2  ? (
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break2_start") == true ? (
            <b>{dictinary.break_start.ru} (2)</b>
          ) : (
            dictinary.break_start.ru + " (2)"
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak2SHandler}
          placeholder={dictinary.break_start.ru}
          value={inputValues.break2_start}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div> )
      : <div></div> }
      {inputValues.break_quantity == 2  ? (
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break2_end") == true ? (
            <b>{dictinary.break_end.ru} (2)</b>
          ) : (
            dictinary.break_end.ru + " (2)"
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak2EHandler}
          placeholder={dictinary.break_end.ru}
          value={inputValues.break2_end}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div> )
      : <div></div> }
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

export default EditWarehouseScheduleModal;
