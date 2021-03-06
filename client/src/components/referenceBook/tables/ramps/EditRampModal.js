import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import Select from "react-select";
import { dictinary } from "../../../../dictinary/dictinary";

const EditRampModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyRampIds);

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
      setBadFields([]);
    }
    else {
      props.onUnsuccesfulEdit();
      const err = data.error;
      if (err.includes("name_ru") && err.includes("Duplicate")) {
        props.showMessage(`?????????? ?? ???????????? ?????????????????????????? ?????? ????????????????????`);
      } else if (err.includes("integration_id") && err.includes("Duplicate")) {
        props.showMessage(`?????????? ?? ???????????? ?????????? ???????????????????? ?????? ????????????????????`);
      } else if (
        err.includes("area_id") ||
        err.includes("transport_type_id") ||
        err.includes("name_ru")
      ) {
        props.showMessage(`?????????????????? ???????????????????????? ????????`);
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

  const onChangeNameRuHandler = (event) => {
    setInputValues({ ...inputValues, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    setInputValues({ ...inputValues, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    setInputValues({
      ...inputValues,
      blocked: 1 * (event.target.value == "????"),
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
      autoset: 1 * (event.target.value == "????"),
    });
  };
  const onChangeUsedForSlotHandler = (event) => {
    setInputValues({
      ...inputValues,
      used_for_slot: 1 * (event.target.value == "????"),
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
      object_map: 1 * (event.target.value == "????"),
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
          onChange={onChangeNameRuHandler}
          style={{ marginLeft: "30px", width: "60%" }}
        />
      </div>
      <div className="row-styles">
        <div style={rowName}>
          {dictinary.stream.ru}:<span> *</span>
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
          value={inputValues.blocked ? "????" : "??????"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
      </div>
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
        <div style={rowName}>{dictinary.capacity.ru}:</div>
        <input
          type="text"
          placeholder={dictinary.capacity.ru}
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
          <option>px</option>
          <option>3</option>
        </select>
      </div>
      <div className="row-styles">
        <div style={rowName}>{dictinary.autoAssigment.ru}:</div>
        <select
          onChange={onChangeAutosetHandler}
          value={inputValues.autoset ? "????" : "??????"}
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
          value={inputValues.used_for_slot ? "????" : "??????"}
          style={{ marginLeft: "30px", width: "30%" }}
        >
          <option>{dictinary.no.ru}</option>
          <option>{dictinary.yes.ru}</option>
        </select>
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
        <div style={rowName}>{dictinary.onMap.ru}?</div>
        <select
          onChange={onChangeObjectMapHandler}
          value={inputValues.object_map ? "????" : "??????"}
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
          <option>Left</option>
          <option>Right</option>
          <option>Top</option>
          <option>Bottom</option>
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

export default EditRampModal;
