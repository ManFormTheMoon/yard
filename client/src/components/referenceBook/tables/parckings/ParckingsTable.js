import React, { useEffect, useState } from "react";
import ButtonsBlock from "../../ButtonsBlock";
import ballImg from "./../../../../img/reference-book-buttons/attention.png";
import AddParckingModal from "./AddParckingModal";
import "../../style.css";
import EditParckingModal from "./EditParckingModal";
import GroupEditParckingModal from "./GroupEditParckingModal";
import DeleteParckingModal from "./DeleteParckingModal";
import FooterNavigation from "../../FooterNavigation";
import { dictinary } from "../../../../dictinary/dictinary";

import AsyncSelect from "react-select/async";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../../react-select/IndicatorsContainer";
import { customSelectStyles } from "../../../react-select/select-style";
const emptyParcking = {
  id: "",
  name_ru: "",
  warehouse_id: "",
  type: "",
  capacity_width: "",
  capacity_length: "",
  main: "",
  autoreserve: "",
  comment: "",
};

const emptyParckingIds = {
  id: "",
  name_ru: "",
  warehouse_id: "",
  type: "",
  capacity_width: "",
  capacity_length: "",
  main: "",
  autoreserve: "",
  comment: "",
};

function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }
  return result;
}

const ParckingsTable = (props) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [groupEditModalVisible, setGroupEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageText, setMessageText] = useState();
  const [messageVisible, setMessageVisible] = useState(false);
  const [inputRowValue, setInputRowValue] = useState(rowsOnPageCount);


  const [selectedWarehouseName, setSelectedWarehouseName] = useState({
    value: "",
    label: "",
  });
  const [warehouseNamesOptions, setWarehouseNameOptions] = useState([]);

  const changeSelectedWarehouseName = (value) => {
    setSelectedWarehouseName(value);
    setCurrentFilters({ ...currentFilters, ["warehouse_name"]: value.label });
  };

  useEffect(async () => {
    let body = {};
    body.limit = rowsOnPageCount;
    body.page = currentPage;
    body.filters = currentFilters;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/parckings/get", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    setWholeData(data.data.result);
    setTotalRows(data.data.count);

    let warehousesOptions = [""];
    for (let i = 0; i < data.data.result.length; i++) {
      warehousesOptions.push(data.data.result[i].warehouse_name);
    }
    warehousesOptions = unique(warehousesOptions);
    warehousesOptions = warehousesOptions.map((cur) => {
      return {
        label: cur,
        value: cur,
      };
    });
    setWarehouseNameOptions(warehousesOptions);

    setSelectedRows([]);
  }, [rowsOnPageCount, abacaba, currentPage]);

  const onSearchClick = () => {
    setAbacaba(abacaba + 1);
  };
  console.log(wholeData);

  const showMessage = (text) => {
    setMessageText(text);
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 3000);
  };

  const onSuccesfulDelete = async () => {
    await setAbacaba(abacaba + 1);
    await setCurrentPage(1);
    await setDeleteModalVisible(false);
  };

  const onDeleteHandler = () => {
    if (selectedRows.length > 0) {
      setDeleteModalVisible(true);
    } else {
      showMessage(dictinary.errorDelete.ru + ".");
    }
  };

  const onSuccesfulAdd = () => {
    setAddModalVisible(false);
    showMessage(dictinary.added.ru + "!");
    setAbacaba(abacaba + 1);
  };
  const onUnsuccesfulAdd = () => {
    showMessage(dictinary.errorData.ru + "!");
  };

  const onSuccesfulGroupEdit = () => {
    setGroupEditModalVisible(false);
    showMessage(dictinary.changed.ru + "!");
    setAbacaba(abacaba + 1);
  };
  const onUnsuccesfulGroupEdit = () => {
    showMessage(dictinary.errorData.ru + "!");
  };

  const onSuccesfulEdit = async () => {
    setEditModalVisible(false);
    showMessage(dictinary.changed.ru + "!");
    await setAbacaba(abacaba + 1);
  };

  const onUnsuccesfulEdit = () => {
    showMessage(dictinary.errorData.ru + "!");
  };

  const onGroupEditHandler = () => {
    if (selectedRows.length <= 1) {
      showMessage(dictinary.errorGrEdit.ru + "!");
    } else {
      setGroupEditModalVisible(true);
    }
  };

  const onReloadEvent = () => {
    showMessage(dictinary.updated.ru + "!");
    setAbacaba(abacaba + 1);
  };

  const onEditHandler = async () => {
    if (selectedRows.length != 1) {
      showMessage(dictinary.errorEdit.ru);
    } else {
      setEditModalVisible(true);
    }
  };

  console.log(currentFilters);

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyParcking);
    setAbacaba(setAbacaba + 1);
  };

  const onPagesInputDown = (event) => {
    if (event.key == "Enter") {
      console.log(1 * event.target.value);
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

  const onChangeInputsHandler = (event, value) => {
    setCurrentFilters({ ...currentFilters, [value]: event.target.value });
  };

  const onAddHandler = () => {
    setAddModalVisible(true);
  };

  const style_model = {
    width: "60%",
    height: "75%",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "15px",
    overflowY: "scroll",
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
      <DeleteParckingModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        style={{
          width: "330px",
          height: "120px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "30px 20px 20px 20px",
        }}
        countRows={selectedRows.length}
        selectedRows={selectedRows}
        onSuccesfulDelete={onSuccesfulDelete}
        showMessage={showMessage}
      />
      <AddParckingModal
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        style={style_model}
        onSuccesfulAdd={onSuccesfulAdd}
        onUnsuccesfulAdd={onUnsuccesfulAdd}
        emptyParckingIds={emptyParckingIds}
        showMessage={showMessage}
      />
      <EditParckingModal
      visible={editModalVisible}
      setVisible={setEditModalVisible}
      onSuccesfulEdit={onSuccesfulEdit}
      onUnsuccesfulEdit={onUnsuccesfulEdit}
      style={style_model}
      emptyParckingIds={emptyParckingIds}
      currentParckingId={selectedRows.length > 0 ? selectedRows[0] : null}
      showMessage={showMessage}
    />
      <GroupEditParckingModal
        visible={groupEditModalVisible}
        setVisible={setGroupEditModalVisible}
        style={style_model}
        selectedRows={selectedRows}
        emptyParcking={emptyParcking}
        onSuccesfulGroupEdit={onSuccesfulGroupEdit}
        onUnsuccesfulGroupEdit={onUnsuccesfulGroupEdit}
        showMessage={showMessage}
      />
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
        <ButtonsBlock
          onSearchClick={onSearchClick}
          onDeleteHandler={onDeleteHandler}
          onSearchClearHandler={onSearchClearHandler}
          onAddHandler={onAddHandler}
          onEditHandler={onEditHandler}
          onGroupEditHandler={onGroupEditHandler}
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
                style={{ width: "70px" }}
                placeholder={dictinary.code.ru}
                onChange={(event) => onChangeInputsHandler(event, "id")}
                value={currentFilters.id}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "150px" }}
                placeholder={dictinary.name.ru}
                onChange={(event) => onChangeInputsHandler(event, "name_ru")}
                value={currentFilters.name_ru}
              />
            </td>
            <td>
               <Select
                options={warehouseNamesOptions}
                value={selectedWarehouseName}
                placeholder={dictinary.warehouses.ru}
                onChange={(value) => {
                  console.log(value);
                  changeSelectedWarehouseName(value);
                }}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
              />
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "type")}
                style={{ width: "160px" }}
                value={currentFilters.type}
              >
                <option></option>
                <option>{dictinary.internal.ru}</option>
                <option>{dictinary.external.ru}</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "120px" }}
                placeholder={dictinary.capacityWidth.ru}
                onChange={(event) => onChangeInputsHandler(event, "capacity_width")}
                value={currentFilters.capacityWidth}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "120px" }}
                placeholder={dictinary.capacityLength.ru}
                onChange={(event) => onChangeInputsHandler(event, "capacity_length")}
                value={currentFilters.capacityLength}
              />
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "main")}
                style={{ width: "160px" }}
                value={currentFilters.main}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "autoreserve")}
                style={{ width: "180px" }}
                value={currentFilters.autoreserve}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                style={{ width: "250px" }}
                placeholder={dictinary.comment.ru}
                onChange={(event) => onChangeInputsHandler(event, "comment")}
                value={currentFilters.comment}
              />
            </td>
          </tr>
          <tr>
            <th style={{ minWidth: "40px" }}></th>
            <th style={{ minWidth: "50px" }}>{dictinary.code.ru}</th>
            <th style={{ minWidth: "150px" }}>{dictinary.name.ru}</th>
            <th style={{ minWidth: "150px" }}>{dictinary.warehouses.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.type.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.capacityWidth.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.capacityLength.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.main.ru}?</th>
            <th style={{ minWidth: "180px" }}>{dictinary.autoreserve.ru}?</th>
            <th style={{ minWidth: "250px" }}>{dictinary.comment.ru}</th>
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
                <td>{cur.name_ru}</td>
                <td>{cur.warehouse_name}</td>
                <td>{cur.type}</td>
                <td>{cur.capacity_width}</td>
                <td>{cur.capacity_length}</td>
                <td>
                  {cur.main == 1 ? dictinary.yes.ru : dictinary.no.ru}
                </td>
                <td>
                  {cur.autoreserve == 1 ? dictinary.yes.ru : dictinary.no.ru}
                </td>
                <td>{cur.comment}</td>
              </tr>
            );
          })}
        </table>
      </div>
      <FooterNavigation
        onReloadEvent={onReloadEvent}
        onPagesInputDown={onPagesInputDown}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRows={totalRows}
        inputRowValue={inputRowValue}
        setInputRowValue={setInputRowValue}
        rowsOnPageCount={rowsOnPageCount}
      />
    </>
  );
};

export default ParckingsTable;