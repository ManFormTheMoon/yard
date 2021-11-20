import React, { useEffect, useState } from "react";
import ballImg from "../../../img/reference-book-buttons/attention.png";
import { dictinary } from "../../../dictinary/dictinary.js";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../react-select/select-style";
import CustomDataRangePicker from "../../react-datepicker/CustomDataRangePicker";
import UnrelatedDocumentsButtonsBlock from "./UnrelatedDocumentsButtonsBlock";
import ConnectUnrelatedDocumentsModal from "./ConnectUnrelatedDocumentsModal";
import dateFormats from "../../../dateFormats/dateFormats";
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


function unique(arr) {
  let result = [];
  let temp = [];
  for (let str of arr) {
    if (!temp.includes(str.name)) {
      result.push(str);
    }
  }
  return result;
}

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

  const [selectedSupplierName, setSelectedSupplierName] = useState({
    value: "",
    label: "",
  });
  const [supplierNamesOptions, setSupplierNameOptions] = useState([]);

  const [selectedReceiverName, setSelectedReceiverName] = useState(emptyLabel);
  const [receiverNamesOptions, setReceiverNameOptions] = useState([]);
  const [selectedWarehouseName, setSelectedWareshouseName] = useState({
    value: "",
    label: "",
  });
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
          return { label: cur.company_name_ru, value: cur.company_name_ru, id: cur.id };
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
          return { label: cur.company_name_ru, value: cur.company_name_ru, id: cur.id };
        }),
      ]);
    }

    //warehouses names
    // {
    //   const response = await fetch("/api/referenceBook/warehouse/getNames", {
    //     method: "POST",
    //     headers: headers,
    //   });
    //   const data = await response.json();
    //   console.log(data);
    //   setWarehouseNameOptions([
    //     emptyLabel,
    //     ...data.data.map((cur) => {
    //       return { label: cur.name_ru, value: cur.name_ru, id: cur.id };
    //     }),
    //   ]);
    // }
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
    // supplier names
    {
      let suppliersOptions = [""];
      for (let i = 0; i < data.data.length; i++) {
        suppliersOptions.push({name: data.data[i].supplier_name, id:data.data[i].supplier_id});
      }
      suppliersOptions = unique(suppliersOptions);
      suppliersOptions = suppliersOptions.map((cur) => {
        return {
          label: cur.name,
          value: cur.name,
          id: cur.id
        };
      });
      setSupplierNameOptions(suppliersOptions);
    }
    // warehouses names
    {
      let warehousesOptions = [""];
      for (let i = 0; i < data.data.length; i++) {
        warehousesOptions.push({name: data.data[i].warehouse_name, id:data.data[i].warehouse_id});
      }
      warehousesOptions = unique(warehousesOptions);
      warehousesOptions = warehousesOptions.map((cur) => {
        return {
          label: cur.name,
          value: cur.name,
          id: cur.id
        };
      });
      setWarehouseNameOptions(warehousesOptions);
    }
    console.log(data);
    setSelectedRow();
  }, [rowsOnPageCount, abacaba, currentPage]);
  console.log(warehouseNamesOptions)
  console.log("warehouseNamesOptions")
  console.log("warehouseNamesOptions")
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
    setSelectedWareshouseName(emptyLabel);
    setSelectedSupplierName(emptyLabel);
    setSelectedCargoName(emptyLabel);
    setSelectedReceiverName(emptyLabel);
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
                style={{ width: "95%" }}
                placeholder={dictinary.code.ru}
                onChange={(event) => onChangeInputsHandler(event, "id")}
                value={currentFilters.id}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "95%" }}
                placeholder={dictinary.documentNumber.ru}
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
                  dateFormat="dd.MM.yyyy"
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
                style={{ width: "95%" }}
                placeholder={dictinary.autoNumber.ru}
                onChange={(event) =>
                  onChangeInputsHandler(event, "truck_number")
                }
                value={currentFilters.truck_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "95%" }}
                placeholder={dictinary.semitrailerNumber.ru}
                onChange={(event) =>
                  onChangeInputsHandler(event, "semitrailer_number")
                }
                value={currentFilters.semitrailer_number}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "95%" }}
                placeholder={dictinary.nameDriver.ru}
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
            <th style={{ minWidth: "40px" }}></th>
            <th style={{ minWidth: "100px" }}>{dictinary.IdDocument.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.documentNumber.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.warehouses.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.dateDocument.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.cargoTypes.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.autoNumber.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.semitrailerNumber.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.nameDriver.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.suppliers.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.receivers.ru}</th>
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
                <td>{dateFormats(cur.document_date)}</td>
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
