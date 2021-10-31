import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyWarehouseScheduleForAdd = {
  id: "",
  team_name: "",
  area_id: "",
  warehouse_id: "",
  work_start: "",
  break_quantity: 1,
  break1_start: "",
  break1_end: "",
  break2_start: "",
  break2_end: "",
  comment: "",
};

const AddWarehouseScheduleModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyWarehouseScheduleForAdd);

  const [areasNamesOptions, setAreasNamesOptions] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState({
    label: "",
    value: "",
  });
  const [badFields, setBadFields] = useState([]);

  const [transportTypesNamesOptions, setTransportTypesNamesOptions] = useState(
    []
  );
  const [selectedTransportTypeName, setSelectedTransportTypeName] = useState({
    label: "",
    value: "",
  });

  const onAddEvent = async (values1) => {
    if (values1.break1_end <= values1.break1_start) {
      props.showMessage(
        `Время для 1 перерыва заполнено некорректно`
      );
      return;
    } else if (values1.break2_end <= values1.break2_start && values1.break_quantity == 2) {
      props.showMessage(
        `Время для 2 перерыва заполнено некорректно`
      );
      return;
    } else if (values1.break1_end >= values1.break2_start && values1.break_quantity == 2) {
      props.showMessage(
        `Время для 1 и 2 перерыва заполнено некорректно`
      );
      return;
    } else if (values1.work_start >= values1.break1_start || (values1.work_start >= values1.break2_start && values1.break_quantity == 2)) {
      props.showMessage(
        `Время начала работы > времени начала перерыва`
      );
      return;
    } 
    //else if (!values1.unit && !!values1.capacity) {
    //   props.showMessage(
    //     `Если заполнена вместимость то должна быть заполнена и единица измерения `
    //   );
    //   return;
    // }
    // if (values1.object_map == dictinary.no.ru && !!values1.orientation) {
    //   props.showMessage(
    //     `Если рампа это объект на карте то укажите направление`
    //   );
    //   return;
    // } else if (
    //   !(values1.object_map == dictinary.no.ru) &&
    //   !values1.orientation
    // ) {
    //   props.showMessage(
    //     `Если указано направление, то укажите, что рампа это объект на карте `
    //   );
    //   return;
    // }
    let values = {};
    Object.assign(values, values1);

    let body = {};
    body.values = values;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/warehouseSchedules/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyWarehouseScheduleForAdd);
      setSelectedTransportTypeName({ value: "", label: "" });
      setSelectedAreaName({ value: "", label: "" });
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      console.log("err")
      console.log(err)
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
      if (!selectedAreaName.label) {
        temp.push("area_name");
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

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    //ramps names
    const response = await fetch("/api/referenceBook/areas/getNames", {
      method: "POST",
      headers: headers,
    });
    const dataA = await response.json();
    console.log(dataA);
    setAreasNamesOptions([
      {
        label: "",
        value: "",
      },

      ...dataA.data.map((cur) => {
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
    console.log(dataWarehouse)
    setTransportTypesNamesOptions([
      {
        label: "",
        value: "",
      },
      ...dataWarehouse.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  const onCancelEvent = () => {
    setInputValues(emptyWarehouseScheduleForAdd);
    setSelectedTransportTypeName({ value: "", label: "" });
    setSelectedAreaName({ value: "", label: "" });
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, team_name: event.target.value });
  };

  const onChangeWorkStartHandler = (event) => {
    setInputValues({ ...inputValues, work_start: event.target.value });
  };
  const onChangeBreakQuanHandler = (event) => {
    setInputValues({ ...inputValues, break_quantity: event.target.value });
  };
  const onChangeBreak1SStartHandler = (event) => {
    setInputValues({ ...inputValues, break1_start: event.target.value });

  };const onChangeBreak1EStartHandler = (event) => {
    setInputValues({ ...inputValues, break1_end: event.target.value });
  };
  const onChangeBreak2SStartHandler = (event) => {
    setInputValues({ ...inputValues, break2_start: event.target.value });

  };const onChangeBreak2EStartHandler = (event) => {
    setInputValues({ ...inputValues, break2_end: event.target.value });
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
      <div className="title-modal">{dictinary.addWSchedule.ru}</div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("area_name") == true ? (
            <b>{dictinary.area.ru}</b>
          ) : (
            dictinary.area.ru
          )}
          :<span> *</span>
        </div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
          <Select
            value={selectedAreaName}
            placeholder={dictinary.enterArea.ru}
            options={areasNamesOptions}
            onChange={(value) => {
              changeSelectedAreaName(value);
            }}
            styles={customSelectStyles}
            components={{ IndicatorsContainer }}
          />
        </div>
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
            value={selectedTransportTypeName}
            options={transportTypesNamesOptions}
            onChange={(value) => {
              changeSelectedTransportTypeName(value);
            }}
            styles={customSelectStyles}
            components={{ IndicatorsContainer }}
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
          placeholder= {dictinary.enterNameOfWSchedule.ru}
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
          {badFields.includes("break_quantity") == true ? (
            <b>{dictinary.break_quantity.ru}</b>
          ) : (
            dictinary.break_quantity.ru
          )}
          :<span> *</span>
        </div>
        <select
          onChange={onChangeBreakQuanHandler}
          value={inputValues.break_quantity}
          style={{ marginLeft: "30px", width: "31%" }}
        >
          <option>1</option>
          <option>2</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break1_start") == true ? (
            <b>{dictinary.break_start.ru} (1)</b>
          ) : (
            dictinary.break_start.ru + " (1)"
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak1SStartHandler}
          placeholder={dictinary.break_start.ru}
          value={inputValues.break1_start}
          style={{ marginLeft: "30px", width: "15%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("break1_end") == true ? (
            <b>{dictinary.break_end.ru} (1)</b>
          ) : (
            dictinary.break_end.ru + " (1)"
          )}
          :<span> *</span>
        </div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="time"
          onChange={onChangeBreak1EStartHandler}
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
          onChange={onChangeBreak2SStartHandler}
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
          onChange={onChangeBreak2EStartHandler}
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
          children={"Сохранить изменения"}
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

export default AddWarehouseScheduleModal;
