import React, { useEffect, useState } from "react";
import ballImg from "../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../dictinary/dictinary.js";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../components/react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../components/react-select/select-style";
import CustomDataPicker from "../react-datepicker/CustomDataPicker";
import CustomDataRangePicker from "../react-datepicker/CustomDataRangePicker";
import CustomTimeRangePicker from "../react-datepicker/CustomTimeRangePicker";
import ButtonsBlockTimeSlots from "./ButtonsBlockTimeSlots";
import xlsx from "node-xlsx";
import download from "downloadjs";

const emptyTimeSlot = {
  id: "",
  visit_number: "",
  slot_start_date_first: null,
  slot_start_date_second: null,
  vt_planned_start_time_first: null,
  vt_planned_start_time_second: null,
  load_planned_start_time_first: null,
  load_planned_start_time_second: null,
  load_planned_finish_time_first: null,
  load_planned_finish_time_second: null,
  vt_planned_finish_time_first: null,
  vt_planned_finish_time_second: null,
  planned_arrival_time_first: null,
  planned_arrival_time_second: null,
  planned_departure_time_first: null,
  planned_departure_time_second: null,
  use_break: "",
  warehouse_id: "",
  area_id: "",
  ramp_id: "",
  stream: "",
  route_number: "",
  invoice_number: "",
  status: "",
  actual_arrival_time_first: null,
  actual_arrival_time_second: null,
  actual_load_start_time_first: null,
  actual_load_start_time_second: null,
  actual_load_finish_time_first: null,
  actual_load_finish_time_second: null,
  actual_departure_time_first: null,
  actual_departure_time_second: null,
  visit_time_first: null,
  visit_time_second: null,
  gate2gate_first: null,
  gate2gate_second: null,
  cargo: null,
  q_ty: "",
  unit: "",
  truck_type: "",
  truck_number: "",
  trailer_number: "",
  driver_fio: "",
  driver_number: "",
  fleet: "",
  carrier_name: "",
  coupon_number: "",
};

const emptyLabel = {
  label: "",
  value: "",
};

const TimeSlotsTable = (props) => {
  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(emptyTimeSlot);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageText, setMessageText] = useState();
  const [messageVisible, setMessageVisible] = useState(false);
  const [inputRowValue, setInputRowValue] = useState(rowsOnPageCount);

  const [selectedAreaName, setSelectedAreaName] = useState(emptyLabel);
  const [areaNamesOptions, setAreaNameOptions] = useState([]);

  const [selectedRampName, setSelectedRampName] = useState(emptyLabel);
  const [rampNamesOptions, setRampNameOptions] = useState([]);

  const [selectedWarehouseName, setSelectedWareshouseName] =
    useState(emptyLabel);
  const [warehouseNamesOptions, setWarehouseNameOptions] = useState([]);

  const changeSelectedAreaName = (value) => {
    setSelectedAreaName(value);
    console.log(value);
    setCurrentFilters({ ...currentFilters, ["area_id"]: value.id });
  };

  const changeSelectedRampName = (value) => {
    setSelectedRampName(value);
    setCurrentFilters({ ...currentFilters, ["ramp_id"]: value.id });
  };
  const changeSelectedWarehouseName = (value) => {
    setSelectedWareshouseName(value);
    setCurrentFilters({ ...currentFilters, ["warehouse_id"]: value.id });
  };

  useState(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    //areas names
    {
      const response = await fetch("/api/referenceBook/areas/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setAreaNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }
    //ramps names
    {
      const response = await fetch("/api/referenceBook/ramps/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setRampNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }

    //warehouses names
    {
      console.log("as");
      const response = await fetch("/api/referenceBook/warehouses/getNames ", {
        method: "POST",
        headers: headers,
      });
      console.log("ada");
      const data = await response.json();
      console.log(data);
      setWarehouseNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }
  }, []);

  console.log(areaNamesOptions);
  console.log(warehouseNamesOptions);
  console.log(rampNamesOptions);
  useEffect(async () => {
    let filters = Object.assign({}, currentFilters);
    filters.slot_start_date_first?.toString();
    let body = {};
    body.limit = 1;
    body.filters = currentFilters;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/timeSlots/get", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    setWholeData(data.data);
    console.log(data);
    setSelectedRows([]);
  }, [rowsOnPageCount, abacaba, currentPage]);

  const onSearchClick = () => {
    setAbacaba(abacaba + 1);
  };

  const showMessage = (text) => {
    setMessageText(text);
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 3000);
  };

  const onReloadEvent = () => {
    showMessage(dictinary.updated.ru + "!");
    setAbacaba(abacaba + 1);
  };

  console.log(currentFilters);

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyTimeSlot);
    setAbacaba(setAbacaba + 1);
  };

  const onPagesInputDown = (event) => {
    if (event.key == "Enter") {
      if (1 * event.target.value == 0) {
        setRowsOnPageCount(100);
        setInputRowValue(100);
      } else {
        setRowsOnPageCount(1 * event.target.value);
      }
    }
  };

  const changeBoxItemHandler = (value, event) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, value]);
    } else {
      setSelectedRows(selectedRows.filter((cur) => cur != value));
    }
  };

  const addRowToSelect = (value) => {
    if (selectedRows.indexOf(value) != -1) {
      setSelectedRows(selectedRows.filter((cur) => cur != value));
    } else {
      setSelectedRows([...selectedRows, value]);
    }
  };

  const onChangeGlobalCheckBox = (event) => {
    if (event.target.checked) {
      let a = [];
      for (let i = 0; i < wholeData.length; i++) {
        a.push(wholeData[i].id);
      }
      setSelectedRows(a);
    } else {
      setSelectedRows([]);
    }
  };

  const onDownloadClick = () => {
    const qwerty = [
      [1, 2, 3],
      ["a", "b", "c"],
    ];

    let buffer = xlsx
      .build([{ name: "mySheetName", data: qwerty }])
      .toString("base64");
    download(atob(buffer), "data.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const onChangeInputsHandler = (event, value) => {
    setCurrentFilters({ ...currentFilters, [value]: event.target.value });
  };

  const onChangeDateInputsHandler = (path, value) => {
    setCurrentFilters({ ...currentFilters, [path]: value });
  };
  return (
    <>
      {messageVisible && (
        <div className="message-visible">
          <img
            src={ballImg}
            style={{ width: "20px", marginRight: "10px" }}
            alt=""
          />
          {messageText}
        </div>
      )}
      <div
        style={{
          minHeight: "calc(100% - 50px)",
          height: "calc(100% - 40px)",
          maxHeight: "calc(100%- 40px)",
          backgroundColor: "#FFFFFF",
          display: "block",
          padding: "0px 20px",
          overflowX: "scroll",
          overflowY: "scroll",
          boxSizing: "border-box",
        }}
      >
        <ButtonsBlockTimeSlots
          onSearchClick={onSearchClick}
          onSearchClearHandler={onSearchClearHandler}
          onDownloadClick={onDownloadClick}
        />
        <br />
        <table
          style={{
            borderRadius: "3px",
            border: "0.5px solid #87C9B6",
            tableLayout: "fixed",
            marginTop: "-10px",
            overflow: "scroll",
          }}
        >
          <tr>
            <td style={{ width: "40px" }}>
              <input
                type="checkbox"
                checked={selectedRows.length == wholeData.length}
                onChange={(event) => onChangeGlobalCheckBox(event)}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                placeholder={dictinary.code.ru}
                onChange={(event) => onChangeInputsHandler(event, "id")}
                value={currentFilters.id}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                placeholder="Номер визита"
                onChange={(event) =>
                  onChangeInputsHandler(event, "visit_number")
                }
                value={currentFilters.visit_number}
              />
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomDataRangePicker
                  firstSelected={currentFilters.slot_start_date_first}
                  secondSelected={currentFilters.slot_start_date_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler("slot_start_date_first", value);
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler("slot_start_date_second", value);
                  }}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.vt_planned_start_time_first}
                  secondSelected={currentFilters.vt_planned_start_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "vt_planned_start_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "vt_planned_start_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.load_planned_start_time_first}
                  secondSelected={currentFilters.load_planned_start_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "load_planned_start_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "load_planned_start_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.load_planned_finish_time_first}
                  secondSelected={
                    currentFilters.load_planned_finish_time_second
                  }
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "load_planned_finish_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "load_planned_finish_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.vt_planned_finish_time_first}
                  secondSelected={currentFilters.vt_planned_finish_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "vt_planned_finish_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "vt_planned_finish_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.planned_arrival_time_first}
                  secondSelected={currentFilters.planned_arrival_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "planned_arrival_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "planned_arrival_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.planned_departure_time_first}
                  secondSelected={currentFilters.planned_departure_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "planned_departure_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "planned_departure_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "use_break")}
                value={currentFilters.use_break}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <Select
                options={warehouseNamesOptions}
                value={selectedWarehouseName}
                onChange={(value) => {
                  changeSelectedWarehouseName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <Select
                options={areaNamesOptions}
                value={selectedAreaName}
                placeholder={dictinary.area.ru}
                onChange={(value) => {
                  changeSelectedAreaName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <Select
                options={rampNamesOptions}
                value={selectedRampName}
                onChange={(value) => {
                  changeSelectedRampName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "stream")}
                value={currentFilters.stream}
              >
                <option></option>
                <option>Input</option>
                <option>Output</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "route_number")
                }
                value={currentFilters.route_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "invoice_number")
                }
                value={currentFilters.invoice_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "status")}
                value={currentFilters.status}
              />
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.actual_arrival_time_first}
                  secondSelected={currentFilters.actual_arrival_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "actual_arrival_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "actual_arrival_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.actual_load_start_time_first}
                  secondSelected={currentFilters.actual_load_start_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "actual_load_start_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "actual_load_start_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.actual_load_finish_time_first}
                  secondSelected={currentFilters.actual_load_finish_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "actual_load_finish_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "actual_load_finish_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.actual_departure_time_first}
                  secondSelected={currentFilters.actual_departure_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "actual_departure_time_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "actual_departure_time_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.visit_time_first}
                  secondSelected={currentFilters.visit_time_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler("visit_time_first", value);
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler("visit_time_second", value);
                  }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.gate2gate_first}
                  secondSelected={currentFilters.gate2gate_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler("gate2gate_first", value);
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler("gate2gate_second", value);
                  }}
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "cargo")}
                value={currentFilters.cargo}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "q_ty")}
                value={currentFilters.q_ty}
              />
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "unit")}
                value={currentFilters.unit}
                style={{ width: "120px" }}
              >
                <option></option>
                <option>kg</option>
                <option>px</option>
                <option>3</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "truck_type")}
                value={currentFilters.truck_type}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "truck_number")
                }
                value={currentFilters.truck_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "trailer_number")
                }
                value={currentFilters.trailer_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "driver_fio")}
                value={currentFilters.driver_fio}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "driver_number")
                }
                value={currentFilters.driver_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) => onChangeInputsHandler(event, "fleet")}
                value={currentFilters.fleet}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "carrier_name")
                }
                value={currentFilters.carrier_name}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "coupon_number")
                }
                value={currentFilters.coupon_number}
              />
            </td>
          </tr>
          <tr>
            <th style={{ minWidth: "100px" }}></th>
            <th style={{ minWidth: "100px" }}>ID тайм-слота</th>
            <th style={{ minWidth: "100px" }}>Номер визита</th>
            <th style={{ minWidth: "100px" }}>Дата начала слота</th>
            <th style={{ minWidth: "100px" }}>Плановое время начала визита</th>
            <th style={{ minWidth: "100px" }}>
              Плановое время начала обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Плановое время завершения обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Плановое время завершения визита
            </th>
            <th style={{ minWidth: "100px" }}>Плановое время прибытия</th>
            <th style={{ minWidth: "100px" }}>Плановое время убытия</th>
            <th style={{ minWidth: "100px" }}>Накладывается на перерыв</th>
            <th style={{ minWidth: "100px" }}>Площадка</th>
            <th style={{ minWidth: "100px" }}>Участок</th>
            <th style={{ minWidth: "100px" }}>Рампа</th>
            <th style={{ minWidth: "100px" }}>Поток</th>
            <th style={{ minWidth: "100px" }}>Номер маршрута</th>
            <th style={{ minWidth: "100px" }}>Номер накладной</th>
            <th style={{ minWidth: "100px" }}>Текущий статус</th>
            <th style={{ minWidth: "100px" }}>Фактическое время прибытия</th>
            <th style={{ minWidth: "100px" }}>
              Фактическое время начала обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Фактическое время завершения обработки
            </th>
            <th style={{ minWidth: "100px" }}>Фактическое время убытия</th>
            <th style={{ minWidth: "100px" }}>Время визита</th>
            <th style={{ minWidth: "100px" }}>G2G</th>
            <th style={{ minWidth: "100px" }}>Груз</th>
            <th style={{ minWidth: "100px" }}>Количество</th>
            <th style={{ minWidth: "100px" }}>Единица измерения кол-ва</th>
            <th style={{ minWidth: "100px" }}>Тис ТС</th>
            <th style={{ minWidth: "100px" }}>Номер ТС</th>
            <th style={{ minWidth: "100px" }}>Номер полуприцепа</th>
            <th style={{ minWidth: "100px" }}>ФИО водителя</th>
            <th style={{ minWidth: "100px" }}>Номер телефона</th>
            <th style={{ minWidth: "100px" }}>Флот</th>
            <th style={{ minWidth: "100px" }}>Название ТЭК</th>
            <th style={{ minWidth: "100px" }}>Номер талона</th>
          </tr>
          {wholeData.map((cur) => {
            return (
              <tr
                {...(selectedRows.indexOf(cur.id) != -1
                  ? { className: "selectedRow" }
                  : {})}
                onClick={() => addRowToSelect(cur.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    onChange={(event) => changeBoxItemHandler(cur.id, event)}
                    checked={selectedRows.indexOf(cur.id) != -1}
                  />
                </td>
                <td>{cur.id}</td>
                <td>{cur.visit_number}</td>
                <td>{cur.slot_start_date}</td>
                <td>{cur.vt_planned_start_time}</td>
                <td>{cur.load_planned_start_time}</td>
                <td>{cur.load_planned_finish_time}</td>
                <td>{cur.vt_planned_finish_time}</td>
                <td>{cur.planned_arrival_time}</td>
                <td>{cur.planned_departure_time}</td>
                <td>{cur.use_break == 1 ? "Да" : "Нет"}</td>
                <td>{cur.warehouse_name}</td>
                <td>{cur.area_name}</td>
                <td>{cur.ramp_name}</td>
                <td>{cur.stream}</td>
                <td>{cur.route_number}</td>
                <td>{cur.invoice_number}</td>
                <td>{cur.status}</td>
                <td>{cur.actual_arrival_time}</td>
                <td>{cur.actual_load_start_time}</td>
                <td>{cur.actual_load_finish_time}</td>
                <td>{cur.actual_departure_time}</td>
                <td>{cur.visit_time}</td>
                <td>{cur.gate2gate}</td>
                <td>{cur.cargo}</td>
                <td>{cur.q_ty}</td>
                <td>{cur.unit}</td>
                <td>{cur.truck_type}</td>
                <td>{cur.truck_number}</td>
                <td>{cur.trailer_number}</td>
                <td>{cur.driver_fio}</td>
                <td>{cur.driver_number}</td>
                <td>{cur.fleet}</td>
                <td>{cur.carrier_name}</td>
                <td>{cur.coupon_number}</td>
              </tr>
            );
          })}
        </table>
      </div>
      {/* <FooterNavigation
        onReloadEvent={onReloadEvent}
        onPagesInputDown={onPagesInputDown}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRows={totalRows}
        inputRowValue={inputRowValue}
        setInputRowValue={setInputRowValue}
        rowsOnPageCount={rowsOnPageCount}
      /> */}
    </>
  );
};

export default TimeSlotsTable;
