import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select, { components } from "react-select";
import "./Ramps.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyRampForAdd = {
  id: "",
  name_ru: "",
  stream: "Input",
  blocked: 0,
  area_id: "",
  integration_id: "",
  capacity: "",
  unit: "",
  object_map: 0,
  comment: "",
  used_for_slot: 0,
  transport_type_id: "",
  orientation: "",
  autoset: 0,
};

const AddRampModal = (props) => {
  const [inputValues, setInputValues] = useState(emptyRampForAdd);

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
    if (values1.object_map == dictinary.no.ru && !!values1.orientation) {
      props.showMessage(
        `Если рампа это объект на карте то укажите направление`
      );
      return;
    } else if (
      !(values1.object_map == dictinary.no.ru) &&
      !values1.orientation
    ) {
      props.showMessage(
        `Если указано направление, то укажите, что рампа это объект на карте `
      );
      return;
    }

    let body = {};
    body.values = values1;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/ramps/add", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulAdd();
      setInputValues(emptyRampForAdd);
      setSelectedTransportTypeName({ value: "", label: "" });
      setSelectedAreaName({ value: "", label: "" });
      setBadFields([]);
    } else {
      props.onUnsuccesfulAdd();
      const err = data.error;
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(`Рампа с данным наименованием уже существует`);
      } else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(`Рампа с данным кодом интеграции уже существует`);
      } else if (
        err.includes("area_id") ||
        err.includes("transport_type_id") ||
        err.includes("name_ru")
      ) {
        props.showMessage(`Заполните обязательные поля`);
      }
      let temp = [];
      if (!inputValues.name_ru) {
        temp.push("name_ru");
      }
      if (!inputValues.stream) {
        temp.push("stream");
      }
      if (!selectedAreaName.label) {
        temp.push("area_name");
      }
      if (!selectedTransportTypeName.label) {
        temp.push("transport_type_name");
      }
      setBadFields(temp);
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
    const data = await response.json();
    console.log(data);
    setAreasNamesOptions([
      {
        label: "",
        value: "",
      },
      ...data.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);

    //tc types names
    const responseTC = await fetch(
      "/api/referenceBook/transportType/getNames",
      {
        method: "POST",
        headers: headers,
      }
    );
    const dataTC = await responseTC.json();
    setTransportTypesNamesOptions([
      {
        label: "",
        value: "",
      },
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  const onCancelEvent = () => {
    setInputValues(emptyRampForAdd);
    setSelectedTransportTypeName({ value: "", label: "" });
    setSelectedAreaName({ value: "", label: "" });
    setBadFields([]);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    setInputValues({ ...inputValues, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    setInputValues({
      ...inputValues,
      blocked: 1 * (event.target.value == "Да"),
    });
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
      transport_type_id: value.id,
    });
  };

  const onChangeCapacityHandler = (event) => {
    setInputValues({
      ...inputValues,
      capacity: event.target.value,
    });
  };
  const onChangeUnitHandler = (event) => {
    setInputValues({ ...inputValues, unit: event.target.value });
  };
  const onChangeAutosetHandler = (event) => {
    setInputValues({
      ...inputValues,
      autoset: 1 * (event.target.value == "Да"),
    });
  };
  const onChangeUsedForSlotHandler = (event) => {
    setInputValues({
      ...inputValues,
      used_for_slot: 1 * (event.target.value == "Да"),
    });
  };
  const onChangeObjectMapHandler = (event) => {
    setInputValues({
      ...inputValues,
      object_map: 1 * (event.target.value == "Да"),
    });
  };
  const onChangeOrientationHandler = (event) => {
    setInputValues({
      ...inputValues,
      orientation: event.target.value,
    });
  };
  const onChangeCommentHandler = (event) => {
    setInputValues({ ...inputValues, comment: event.target.value });
  };
  const onChangeIntegrationHandler = (event) => {
    setInputValues({
      ...inputValues,
      integration_id: event.target.value,
    });
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
      <div className="title-modal">{dictinary.addRamp.ru}</div>
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
          placeholder="Введите название рампы"
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("stream") == true ? (
            <b>{dictinary.stream.ru}</b>
          ) : (
            dictinary.stream.ru
          )}
          :<span> *</span>
        </div>
        <select
          onChange={onChangeStreamHandler}
          value={inputValues.stream}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>Input</option>
          <option>Output</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.blocked.ru}?</div>
        <select
          onChange={onChangeBlockedHandler}
          value={inputValues.blocked ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
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
        <div style={rowName}>Код интеграции:</div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="text"
          onChange={onChangeIntegrationHandler}
          placeholder={"Код интеграции"}
          value={inputValues.integration_id}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="number"
          style={{ width: "120px" }}
          placeholder={dictinary.enterNumber.ru}
          min={0}
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
          <option>kg</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.autoAssigment.ru}:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={inputValues.autoset ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.usedForSlotting.ru}?</div>
        <select
          onChange={onChangeUsedForSlotHandler}
          value={inputValues.used_for_slot ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {badFields.includes("transport_type_name") == true ? (
            <b>{dictinary.typeOfAuto.ru}</b>
          ) : (
            dictinary.typeOfAuto.ru
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
        <div style={rowName}>{dictinary.onMap.ru}?</div>
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
        <div style={rowName}>{dictinary.direction.ru}:</div>
        <select
          onChange={onChangeOrientationHandler}
          value={inputValues.orientation}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>!!!!Left</option>
          <option>Right</option>
          <option>Top</option>
          <option>Bottom</option>
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

export default AddRampModal;
