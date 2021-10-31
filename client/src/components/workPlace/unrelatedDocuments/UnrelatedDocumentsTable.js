import React, { useEffect, useState } from "react";
import ballImg from "../../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../../dictinary/dictinary.js";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../react-select/select-style";
import CustomDataRangePicker from "../../react-datepicker/CustomDataRangePicker";
import UnrelatedDocumentsButtonsBlock from "./UnrelatedDocumentsButtonsBlock";
import ConnectUnrelatedDocumentsModal from "./ConnectUnrelatedDocumentsModal";

const emptyUnrelatedDocument = {
  id: "",
  document_number: "",
  warehouse_id: "",
  document_date_first: null,
  document_date_second: null,
  cargo_type_id: "",
  truck_number: "",
  semitrailer_number: "",
  driver_fio: "",
  supplier_id: "",
  receiver_id: "",
};

const emptyLabel = {
  label: "",
  value: "",
};

const UnrelatedDocumentsTable = (props) => {
  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(emptyUnrelatedDocument);
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

  const [selectedWarehouseName, setSelectedWareshouseName] =
    useState(emptyLabel);
  const [warehouseNamesOptions, setWarehouseNameOptions] = useState([]);

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
      const response = await fetch("/api/referenceBook/warehouse/getNames", {
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
    const response = await fetch("/api/workPlace/unrelatedDocuments/get", {
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

  const onSucccessfulConnect = () => {
    showMessage("Успешно");
  };

  const onUnsucccessfulConnect = () => {
    showMessage("Выберите тайм-слот");
  };
  console.log(currentFilters);

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyUnrelatedDocument);
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
      <ConnectUnrelatedDocumentsModal
        visible={visibleConnectionModal}
        setVisible={setVisibleConnectionModal}
        selected={selectedRow}
        onSucccessfulConnect={onSucccessfulConnect}
        onUnsucccessfulConnect={onUnsucccessfulConnect}
      />
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
        <UnrelatedDocumentsButtonsBlock
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
          </tr>
          <tr>
            <th style={{ minWidth: "100px" }}></th>
            <th style={{ minWidth: "100px" }}>ID документа</th>
            <th style={{ minWidth: "100px" }}>Номер документа</th>
            <th style={{ minWidth: "100px" }}>Участок</th>
            <th style={{ minWidth: "100px" }}>Дата документа</th>
            <th style={{ minWidth: "100px" }}>Тип груза</th>
            <th style={{ minWidth: "100px" }}>Номер транспортного средства</th>
            <th style={{ minWidth: "100px" }}>Номер полуприцепа</th>
            <th style={{ minWidth: "100px" }}>ФИО водителя</th>
            <th style={{ minWidth: "100px" }}>Поставщик</th>
            <th style={{ minWidth: "100px" }}>Получатель</th>
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

export default UnrelatedDocumentsTable;
