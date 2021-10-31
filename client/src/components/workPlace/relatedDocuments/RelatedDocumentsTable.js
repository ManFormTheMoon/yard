import React, { useEffect, useState } from "react";
import ballImg from "../../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../../dictinary/dictinary.js";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../react-select/select-style";
import CustomDataRangePicker from "../../react-datepicker/CustomDataRangePicker";
import RelatedDocumentsButtonsBlock from "./RelatedDocumentsButtonsBlock";
//import ConnectUnrelatedDocumentsModal from "./ConnectUnrelatedDocumentsModal";
import CustomTimeRangePicker from "../../react-datepicker/CustomTimeRangePicker";
const emptyRelatedDocument = {
  id: "",
  warehouse_id: "",
  area_id: "",
  ramp_id: "",
  document_number: "",
  cargo_type_id: "",
  document_date_first: null,
  document_date_second: null,
  truck_number: "",
  semitrailer_number: "",
  driver_fio: "",
  supplier_id: "",
  receiver_id: "",
  visit_number: "",
  vt_planned_start_time_first: null,
  vt_planned_start_time_second: null,
  actual_arrival_time_first: null,
  actual_arrival_time_second: null,
  load_planned_start_time_first: null,
  load_planned_start_time_second: null,
  actual_load_start_time_first: null,
  actual_load_start_time_second: null,
  load_planned_finish_time_first: null,
  load_planned_finish_time_second: null,
  actual_load_finish_time_first: null,
  actual_load_finish_time_second: null,
  vt_planned_finish_time_first: null,
  vt_planned_finish_time_second: null,
  actual_departure_time_first: null,
  actual_departure_time_second: null,
  in_the_norm: "",
  deviation_from_the_standard_first: null,
  deviation_from_the_standard_second: null,
  arrived_on_time: "",
  late_arrival_first: null,
  late_arrival_second: null,
};

const emptyLabel = {
  label: "",
  value: "",
};

const RelatedDocumentsTable = (props) => {
  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(emptyRelatedDocument);
  const [selectedRow, setSelectedRow] = useState(null);
  const [messageText, setMessageText] = useState();
  const [messageVisible, setMessageVisible] = useState(false);
  const [visibleConnectionModal, setVisibleConnectionModal] = useState(false);

  const [selectedCargoName, setSelectedCargoName] = useState(emptyLabel);
  const [cargoNamesOptions, setCargoNameOptions] = useState([]);

  const [selectedSupplierName, setSelectedSupplierName] = useState(emptyLabel);
  const [supplierNamesOptions, setSupplierNameOptions] = useState([]);

  const [selectedReceiverName, setSelectedReceiverName] = useState(emptyLabel);
  const [receiverNamesOptions, setReceiverNameOptions] = useState([]);

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
  const changeSelectedCargoName = (value) => {
    setSelectedCargoName(value);
    console.log(value);
    setCurrentFilters({ ...currentFilters, ["cargo_type_id"]: value.id });
  };

  const changeSelectedSupplierName = (value) => {
    setSelectedSupplierName(value);
    setCurrentFilters({ ...currentFilters, ["supplier_id"]: value.id });
  };
  const changeSelectedReceiverName = (value) => {
    setSelectedReceiverName(value);
    setCurrentFilters({ ...currentFilters, ["receiver_id"]: value.id });
  };
  const changeSelectedWarehouseName = (value) => {
    setSelectedWareshouseName(value);
    setCurrentFilters({ ...currentFilters, ["warehouse_id"]: value.id });
  };

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";
    // //cargo names
    {
      const response = await fetch("/api/referenceBook/cargoTypes/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setCargoNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.cargo_name, value: cur.cargo_name, id: cur.id };
        }),
      ]);
    }
    //supplier names
    {
      const response = await fetch("/api/referenceBook/suppliers/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setSupplierNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }

    //receiver names
    {
      const response = await fetch("/api/referenceBook/receivers/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setReceiverNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }

    //warehouses names
    {
      const response = await fetch("/api/referenceBook/warehouses/getNames", {
        method: "POST",
        headers: headers,
      });
      const data = await response.json();
      console.log(data);
      setWarehouseNameOptions([
        emptyLabel,
        ...data.data.map((cur) => {
          return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
        }),
      ]);
    }
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
  }, []);

  console.log(cargoNamesOptions);
  console.log(supplierNamesOptions);
  console.log(warehouseNamesOptions);

  useEffect(async () => {
    let filters = Object.assign({}, currentFilters);
    filters.slot_start_date_first?.toString();
    let body = {};
    body.limit = 1;
    body.filters = currentFilters;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/workPlace/relatedDocuments/get", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    setWholeData(data.data);
    console.log(data);
    setSelectedRow();
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

  const onOpenConnect = () => {
    if (selectedRow != null) {
      setVisibleConnectionModal(true);
    } else {
      showMessage("Выберите одну запись");
    }
  };

  console.log(currentFilters);

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyRelatedDocument);
    setAbacaba(setAbacaba + 1);
  };

  const changeBoxItemHandler = (value, event) => {
    if (event.target.checked) {
      setSelectedRow(value);
    } else {
      setSelectedRow(null);
    }
  };

  const addRowToSelect = (value) => {
    if (selectedRow == value) {
      setSelectedRow(null);
    } else {
      setSelectedRow(value);
    }
  };

  const onChangeInputsHandler = (event, value) => {
    setCurrentFilters({ ...currentFilters, [value]: event.target.value });
  };

  const onChangeDateInputsHandler = (path, value) => {
    setCurrentFilters({ ...currentFilters, [path]: value });
  };
  return (
    <>
      {/* <ConnectUnrelatedDocumentsModal
        visible={visibleConnectionModal}
        setVisible={setVisibleConnectionModal}
        selected={selectedRow}
      /> */}
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
        <RelatedDocumentsButtonsBlock
          onSearchClick={onSearchClick}
          onSearchClearHandler={onSearchClearHandler}
          onOpenConnect={onOpenConnect}
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
            <td />
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
              <input
                type="text"
                style={{ width: "100px" }}
                placeholder="Номер документа"
                onChange={(event) =>
                  onChangeInputsHandler(event, "document_number")
                }
                value={currentFilters.document_number}
              />
            </td>
            <td>
              <Select
                options={cargoNamesOptions}
                value={selectedCargoName}
                onChange={(value) => {
                  changeSelectedCargoName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomDataRangePicker
                  firstSelected={currentFilters.document_date_first}
                  secondSelected={currentFilters.document_date_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler("document_date_first", value);
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler("document_date_second", value);
                  }}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                placeholder="Номер транспортного средства"
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
                placeholder="Номер полуприцепа"
                onChange={(event) =>
                  onChangeInputsHandler(event, "semitrailer_number")
                }
                value={currentFilters.semitrailer_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "100px" }}
                placeholder="ФИО водителя"
                onChange={(event) => onChangeInputsHandler(event, "driver_fio")}
                value={currentFilters.driver_fio}
              />
            </td>
            <td>
              <Select
                options={supplierNamesOptions}
                value={selectedSupplierName}
                onChange={(value) => {
                  changeSelectedSupplierName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <Select
                options={receiverNamesOptions}
                value={selectedReceiverName}
                onChange={(value) => {
                  changeSelectedReceiverName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
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
              <select
                onChange={(event) =>
                  onChangeInputsHandler(event, "in_the_norm")
                }
                style={{ width: "160px" }}
                value={currentFilters.in_the_norm}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={
                    currentFilters.deviation_from_the_standard_first
                  }
                  secondSelected={
                    currentFilters.deviation_from_the_standard_second
                  }
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler(
                      "deviation_from_the_standard_first",
                      value
                    );
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler(
                      "deviation_from_the_standard_second",
                      value
                    );
                  }}
                />
              </div>
            </td>
            <td>
              <select
                onChange={(event) =>
                  onChangeInputsHandler(event, "arrived_on_time")
                }
                style={{ width: "160px" }}
                value={currentFilters.arrived_on_time}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomTimeRangePicker
                  firstSelected={currentFilters.late_arrival_first}
                  secondSelected={currentFilters.late_arrival_second}
                  onChangeFirst={(value) => {
                    onChangeDateInputsHandler("late_arrival_first", value);
                  }}
                  onChangeSecond={(value) => {
                    onChangeDateInputsHandler("late_arrival_second", value);
                  }}
                />
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ minWidth: "100px" }}></th>
            <th style={{ minWidth: "100px" }}>ID документа</th>
            <th style={{ minWidth: "100px" }}>Площадка</th>
            <th style={{ minWidth: "100px" }}>Участок</th>
            <th style={{ minWidth: "100px" }}>Рампа</th>
            <th style={{ minWidth: "100px" }}>Номер документа</th>
            <th style={{ minWidth: "100px" }}>Тип груза</th>
            <th style={{ minWidth: "100px" }}>Дата документа</th>
            <th style={{ minWidth: "100px" }}>Номер транспортного средства</th>
            <th style={{ minWidth: "100px" }}>Номер полуприцепа</th>
            <th style={{ minWidth: "100px" }}>ФИО водителя</th>
            <th style={{ minWidth: "100px" }}>Поставщик</th>
            <th style={{ minWidth: "100px" }}>Получатель</th>
            <th style={{ minWidth: "100px" }}>Номер визита</th>
            <th style={{ minWidth: "100px" }}>Плановое время прибытия</th>
            <th style={{ minWidth: "100px" }}>Фактическое время прибытия</th>
            <th style={{ minWidth: "100px" }}>
              Плановое время начала обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Фактическое время начала обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Плановое время окончания обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Фактическое время окончания обработки
            </th>
            <th style={{ minWidth: "100px" }}>Плановое время убытия</th>
            <th style={{ minWidth: "100px" }}>В нормативе</th>
            <th style={{ minWidth: "100px" }}>
              Отклонение от норматива, время
            </th>
            <th style={{ minWidth: "100px" }}>Прибыл вовремя</th>
            <th style={{ minWidth: "100px" }}>Опоздание, время</th>
          </tr>
          {wholeData.map((cur) => {
            return (
              <tr
                {...(selectedRow == cur.id ? { className: "selectedRow" } : {})}
                onClick={() => addRowToSelect(cur.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    onChange={(event) => changeBoxItemHandler(cur.id, event)}
                    checked={selectedRow == cur.id}
                  />
                </td>
                <td>{cur.id}</td>
                <td>{cur.document_number}</td>
                <td>{cur.warehouse_name}</td>
                <td>{cur.document_date}</td>
                <td>{cur.cargo_type}</td>
                <td>{cur.truck_number}</td>
                <td>{cur.semitrailer_number}</td>
                <td>{cur.driver_fio}</td>
                <td>{cur.supplier_name}</td>
                <td>{cur.receiver_name}</td>
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

export default RelatedDocumentsTable;
