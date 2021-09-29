import React, { useEffect, useState } from "react";
import Modal from "../../../../Modal/Modal";
import Select from "react-select";
import "./Ramps.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";

const AddRampModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyRampIds);

  const [areasNamesOptions, setAreasNamesOptions] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState({
    label: "",
    value: "",
  });

  const [transportTypesNamesOptions, setTransportTypesNamesOptions] = useState(
    []
  );
  const [selectedTransportTypeName, setSelectedTransportTypeName] = useState({
    label: "",
    value: "",
  });

  const onAddEvent = async (values1) => {
    let values = {};
    Object.assign(values, values1);
    if (!!values.blocked) {
      values.blocked = values.blocked == "Да" ? 1 : 0;
    }
    if (!!values.autoset) {
      values.autoset = values.autoset == "Да" ? 1 : 0;
    }
    if (!!values.used_for_slot) {
      values.used_for_slot = values.used_for_slot == "Да" ? 1 : 0;
    }
    if (!!values.object_map) {
      values.object_map = values.object_map == "Да" ? 1 : 0;
    }

    let body = {};
    body.values = values;
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
      setInputValues(props.emptyRampIds);
    } else {
      props.onUnsuccesfulAdd();
    }
  };

  console.log(areasNamesOptions);
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
    console.log(data);
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
  console.log(inputValues);

  const onCancelEvent = () => {
    setInputValues(props.emptyRampIds);
    props.setVisible(false);
  };
  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    setInputValues({ ...inputValues, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    setInputValues({ ...inputValues, blocked: event.target.value });
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
    setInputValues({ ...inputValues, autoset: event.target.value });
  };
  const onChangeUsedForSlotHandler = (event) => {
    setInputValues({
      ...inputValues,
      used_for_slot: event.target.value,
    });
  };
  const onChangeObjectMapHandler = (event) => {
    setInputValues({
      ...inputValues,
      object_map: event.target.value,
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
      <div className="title-modal">Добавление рампы</div>
      <div className="row-styles">
        <div style={rowName}>Наименование:</div>
        <input
          type="text"
          value={inputValues.name_ru}
          placeholder="Введите название рампы"
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
          value={inputValues.blocked}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option></option>
          <option>Да</option>
          <option>Нет</option>
        </select>
      </div>
      <div className="row-styles" style={{ margin: "10px 0px" }}>
        <div style={rowName}>Участок:</div>
        <div style={{ marginLeft: "30px", width: "30%" }}>
          <Select
            value={selectedAreaName}
            options={areasNamesOptions}
            onChange={(value) => {
              console.log(value);
              changeSelectedAreaName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>Код интеграции:</div>
        <input
          style={{ marginLeft: "30px", width: "30%" }}
          type="text"
          placeholder="Введите код интеграции"
          onChange={onChangeIntegrationHandler}
          value={inputValues.integration_id}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>Вместимость:</div>
        <input
          type="text"
          style={{ width: "120px" }}
          placeholder="Введите число"
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
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>Авто назначение:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={inputValues.autoset}
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
          value={inputValues.used_for_slot}
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
              console.log(value);
              changeSelectedTransportTypeName(value);
            }}
          />
        </div>
      </div>
      <div className="row-styles">
        <div style={rowName}>Является объектом на карте?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map}
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
          onOk={() => onAddEvent(inputValues)}
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

export default AddRampModal;
