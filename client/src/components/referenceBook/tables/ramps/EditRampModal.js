import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "./Ramps.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";

const EditRampModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyRampIds);

  const [areasNamesOptions, setAreasNamesOptions] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState({});

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
    console.log(data);
    setAreasNamesOptions([
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
    console.log(data);
    setTransportTypesNamesOptions([
      ...dataTC.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  useEffect(async () => {
    if (props.visible == true) {
      let body = {};
      body.id = props.currentRampId;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/ramps/getOne", {
        method: "POST",
        body: body,
        headers: headers,
      });
      let data = await response.json();
      data = data.data[0];
      console.log(data);
      setSelectedAreaName({
        id: data.area_id,
        value: data.area_name,
        label: data.area_name,
      });
      setSelectedTransportTypeName({
        id: data.transport_type_id,
        value: data.transport_type_name,
        label: data.transport_type_name,
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
    const response = await fetch("/api/referenceBook/ramps/edit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulEdit();
    } else {
      props.onUnsuccesfulEdit();
    }
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
  const changeSelectedTransportTypeName = (value) => {
    setSelectedTransportTypeName(value);
    setInputValues({
      ...inputValues,
      transport_type_id: value.id,
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
  const rowName = {
    width: "30%",
  };
  return (
    <Modal
      visible={props.visible}
      setVisible={props.setEditModalVisible}
      style={props.style}
    >
      <div className="title-modal">Обновление рампы</div>
      <div className="row-styles">
        <div style={rowName}>Наименование:</div>
        <input
          type="text"
          value={inputValues.name_ru}
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Поток:</div>
        <select
          onChange={onChangeStreamHandler}
          value={inputValues.stream}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Input</option>
          <option>Output</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Заблокировано?</div>
        <select
          onChange={onChangeBlockedHandler}
          value={inputValues.blocked ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Участок:</div>
        {/* <input
          type="text"
          style={{ width: "150px" }}
          placeholder="Код площадки"
          onChange={onChangeAreaIdHandler}
          value={inputValues.area_id}
          style={{ marginLeft: "30px", width: "60%" }}
        /> */}
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
        <div style={rowName}>Вместимость:</div>
        <input
          type="text"
          placeholder="Вместимость"
          onChange={onChangeCapacityHandler}
          value={inputValues.capacity}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Единица измерения:</div>
        <select
          onChange={onChangeUnitHandler}
          value={inputValues.unit}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>kg</option>
          <option>px</option>
          <option>3</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Авто назначение:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={inputValues.autoset ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Используется для слотитования?</div>
        <select
          onChange={onChangeUsedForSlotHandler}
          value={inputValues.used_for_slot ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Тип транспорта:</div>
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
        <div style={rowName}>Является объектом на карте?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map ? "Да" : "Нет"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Направление:</div>
        <select
          onChange={onChangeOrientationHandler}
          value={inputValues.orientation}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Left</option>
          <option>Right</option>
          <option>Top</option>
          <option>Bottom</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Комментарий:</div>
        <input
          type="text"
          placeholder="Не более 100 символов"
          onChange={onChangeCommentHandler}
          value={inputValues.comment}
          style={{ marginLeft: "30px", width: "60%" }}
          maxLength="100"
        />
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          height: "40px",
          marginTop: "30px",
          paddingLeft: "30px",
        }}
      >
        <ApplyButton
          onOk={() => onEditEvent(inputValues)}
          children={"Сохранить изменения"}
        />
        <CancelButton
          onCancel={onCancelEvent}
          children={"Отмена"}
          style={{ marginLeft: "10px" }}
        />
      </div>
    </Modal>
  );
};

export default EditRampModal;
