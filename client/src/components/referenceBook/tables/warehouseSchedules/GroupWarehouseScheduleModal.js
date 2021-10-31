import React, { useState, useEffect } from "react";
import Modal from "../../../../Modal/Modal";
import "../../style.css";
import ApplyButton from "../../../userUI/ApplyButton";
import CancelButton from "../../../userUI/CancelButton";
import { dictinary } from "../../../../dictinary/dictinary";
import Select, { components } from "react-select";
import { customSelectStyles } from "../../../react-select/select-style";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";

const chechBoxStyles = {
  marginLeft: "20px",
};

const GroupWarehouseScheduleModal = (props) => {
  const [inputValues, setInputValues] = useState(props.emptyWSchedule);
  const [checkboxValues, setCheckboxValues] = useState({});

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

  const setCheckbox = (value, event) => {
    setCheckboxValues({
      ...checkboxValues,
      [value]: event.target.checked,
    });
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
      {
        label: "",
        value: "",
      },
      ...dataWarehouse.data.map((cur) => {
        return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
      }),
    ]);
  }, []);

  const onGroupEditEvent = async (checkboxValues, inputValues1) => {
    // if (inputValues1.break1_end <= inputValues1.break1_start) {
    //   props.showMessage(
    //     `Время для 1 перерыва заполнено некорректно`
    //   );
    //   return;
    // } else if (inputValues1.break2_end <= inputValues1.break2_start && inputValues1.break_quantity == 2) {
    //   props.showMessage(
    //     `Время для 2 перерыва заполнено некорректно`
    //   );
    //   return;
    // } else if (inputValues1.break1_end >= inputValues1.break2_start && inputValues1.break_quantity == 2) {
    //   props.showMessage(
    //     `Время для 1 и 2 перерыва заполнено некорректно`
    //   );
    //   return;
    // } else if (inputValues1.work_start >= inputValues1.break1_start || (inputValues1.work_start >= inputValues1.break2_start && inputValues1.break_quantity == 2)) {
    //   props.showMessage(
    //     `Время начала работы > времени начала перерыва`
    //   );
    //   return;
    // } 
    const keys = Object.keys(checkboxValues);
    let result = {};
    for (let i = 0; i < keys.length; i++) {
      if (checkboxValues[keys[i]] == true) {
        result[keys[i]] = true;
      }
    }
    let inputValues = {};
    Object.assign(inputValues, inputValues1);
    let body = {};
    body.values = inputValues;
    body.ids = props.selectedRows;
    body.toclear = result;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/warehouseSchedules/groupEdit", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    if (data.message == "ok") {
      props.onSuccesfulGroupEdit();
      setCheckboxValues({});
      console.log("x");
      setInputValues(props.emptyWSchedule);
    } else {
      setCheckboxValues({});
      props.onUnsuccesfulGroupEdit();
    }
  };

  const onCancelEvent = () => {
    setCheckboxValues({});
    setInputValues({
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
    });
    props.setVisible(false);
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
      setVisible={props.setAddModalVisible}
      style={props.style}
    >
      <div className="title-modal">{dictinary.groupEditRecord.ru}</div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.warehouses.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.areas.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.team_name.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.work_start.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.break_quantity.ru}:<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.break_start.ru} (1):<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.break_end.ru} (1):<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.break_start.ru} (2):<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
      </div>
      <div className={`${"row-styles"} ${"not-edit"}`}>
        <div style={rowName}>
          {dictinary.break_end.ru} (2):<span> *</span>
        </div>
        <div className="not-edit-box">
            <div className="not-edit-text">
              {dictinary.notEdit.ru}
              </div>
          </div>
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
        <input
          type="checkbox"
          checked={checkboxValues.comment}
          onChange={(event) => setCheckbox("comment", event)}
          style={chechBoxStyles}
        />
      </div>
      <div className="modal-button">
        <ApplyButton
          onOk={() => onGroupEditEvent(checkboxValues, inputValues)}
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

export default GroupWarehouseScheduleModal;
