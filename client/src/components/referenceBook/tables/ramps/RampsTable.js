import React, { useEffect, useState } from "react";
import ButtonsBlock from "../../ButtonsBlock";
import ballImg from "./../../../../img/reference-book-buttons/attention.png";
import AddRampModal from "./AddRampModal";
import "./Ramps.css";
import EditRampModal from "./EditRampModal";
import GroupEditRampModal from "./GroupEditRampModal";
import DeleteRampModal from "./DeleteRampModal";
import FooterNavigation from "../../FooterNavigation";
import { dictinary } from "../../../../dictinary/dictinary";

import AsyncSelect from "react-select/async";
import Select from "react-select";

const emptyRamp = {
  id: "",
  name_ru: "",
  stream: "",
  blocked: "",
  area_name: "",
  integration_id: "",
  capacity: "",
  unit: "",
  object_map: "",
  comment: "",
  used_for_slot: "",
  transport_type_name: "",
  orientation: "",
  autoset: "",
};

const emptyRampIds = {
  id: "",
  name_ru: "",
  stream: "",
  blocked: "",
  area_id: "",
  integration_id: "",
  capacity: "",
  unit: "",
  object_map: "",
  comment: "",
  used_for_slot: "",
  transport_type_id: "",
  orientation: "",
  autoset: "",
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

const RampsTable = (props) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [groupEditModalVisible, setGroupEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageText, setMessageText] = useState();
  const [messageVisible, setMessageVisible] = useState(false);
  const [inputRowValue, setInputRowValue] = useState(rowsOnPageCount);

  const [selectedAreaName, setSelectedAreaName] = useState({
    value: "",
    label: "",
  });
  const [areaNamesOptions, setAreaNameOptions] = useState([]);

  const [selectedTCTypesName, setSelectedTCTypesName] = useState({
    value: "",
    label: "",
  });
  const [TCTypesNamesOptions, setTCTypesNameOptions] = useState([]);

  const changeSelectedAreaName = (value) => {
    setSelectedAreaName(value);
    setCurrentFilters({ ...currentFilters, ["area_name"]: value.label });
  };

  const changeSelectedTCTypeName = (value) => {
    setSelectedTCTypesName(value);
    setCurrentFilters({
      ...currentFilters,
      ["transport_type_name"]: value.label,
    });
  };

  useEffect(async () => {
    let body = {};
    body.limit = rowsOnPageCount;
    body.page = currentPage;
    body.filters = currentFilters;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/ramps/get", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    setWholeData(data.data.result);
    setTotalRows(data.data.count);

    //options for areas
    let areasOptions = [""];
    for (let i = 0; i < data.data.result.length; i++) {
      areasOptions.push(data.data.result[i].area_name);
    }
    areasOptions = unique(areasOptions);
    areasOptions = areasOptions.map((cur) => {
      return {
        label: cur,
        value: cur,
      };
    });
    setAreaNameOptions(areasOptions);

    //options for TS types
    let TCTypesOptions = [""];
    for (let i = 0; i < data.data.result.length; i++) {
      TCTypesOptions.push(data.data.result[i].transport_type_name);
    }
    TCTypesOptions = unique(TCTypesOptions);
    TCTypesOptions = TCTypesOptions.map((cur) => {
      return {
        label: cur,
        value: cur,
      };
    });
    setTCTypesNameOptions(TCTypesOptions);

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
      showMessage("Не выбраны записи для удаления");
    }
  };

  const onSuccesfulAdd = () => {
    setAddModalVisible(false);
    showMessage("Добавлено!");
    setAbacaba(abacaba + 1);
  };
  const onUnsuccesfulAdd = () => {
    showMessage("Некорректные данные!");
  };

  const onSuccesfulGroupEdit = () => {
    setGroupEditModalVisible(false);
    showMessage("Изменено!");
    setAbacaba(abacaba + 1);
  };
  const onUnsuccesfulGroupEdit = () => {
    showMessage("Некорректные данные!");
  };

  const onSuccesfulEdit = async () => {
    setEditModalVisible(false);
    showMessage("Изменено!");
    await setAbacaba(abacaba + 1);
  };

  const onUnsuccesfulEdit = () => {
    showMessage("Некорректные данные!");
  };

  const onGroupEditHandler = () => {
    if (selectedRows.length <= 1) {
      showMessage("Выделите больше записей!");
    } else {
      setGroupEditModalVisible(true);
    }
  };

  const onReloadEvent = () => {
    showMessage("Обновлено!");
    setAbacaba(abacaba + 1);
  };

  const onEditHandler = async () => {
    if (selectedRows.length != 1) {
      showMessage("Выберите ровно одну запись!");
    } else {
      setEditModalVisible(true);
    }
  };

  console.log(currentFilters);

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyRamp);
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
      <DeleteRampModal
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
      />
      <AddRampModal
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        style={style_model}
        onSuccesfulAdd={onSuccesfulAdd}
        onUnsuccesfulAdd={onUnsuccesfulAdd}
        emptyRampIds={emptyRampIds}
      />
      <EditRampModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        onSuccesfulEdit={onSuccesfulEdit}
        onUnsuccesfulEdit={onUnsuccesfulEdit}
        style={style_model}
        emptyRampIds={emptyRampIds}
        currentRampId={selectedRows.length > 0 ? selectedRows[0] : null}
      />
      <GroupEditRampModal
        visible={groupEditModalVisible}
        setVisible={setGroupEditModalVisible}
        style={style_model}
        selectedRows={selectedRows}
        emptyRamp={emptyRamp}
        onSuccesfulGroupEdit={onSuccesfulGroupEdit}
        onUnsuccesfulGroupEdit={onUnsuccesfulGroupEdit}
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
                ange={(event) => onChangeInputsHandler(event, "name_ru")}
                value={currentFilters.name_ru}
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
              <select
                onChange={(event) => onChangeInputsHandler(event, "blocked")}
                value={currentFilters.blocked}
                style={{ width: "150px" }}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <Select
                options={areaNamesOptions}
                value={selectedAreaName}
                placeholder={dictinary.area.ru}
                onChange={(value) => {
                  console.log(value);
                  changeSelectedAreaName(value);
                }}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "120px" }}
                placeholder="Код интеграции"
                onChange={(event) =>
                  onChangeInputsHandler(event, "integration_id")
                }
                value={currentFilters.integration_id}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "120px" }}
                placeholder={dictinary.capacity.ru}
                onChange={(event) => onChangeInputsHandler(event, "capacity")}
                value={currentFilters.capacity}
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
              <select
                onChange={(event) => onChangeInputsHandler(event, "autoset")}
                value={currentFilters.autoset}
                style={{ width: "100px" }}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <select
                onChange={(event) =>
                  onChangeInputsHandler(event, "used_for_slot")
                }
                value={currentFilters.used_for_slot}
                style={{ width: "150px" }}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <Select
                options={TCTypesNamesOptions}
                value={selectedTCTypesName}
                placeholder={dictinary.typeOfAuto.ru}
                onChange={(value) => {
                  console.log(value);
                  changeSelectedTCTypeName(value);
                }}
              />
            </td>
            <td>
              <select
                onChange={(event) => onChangeInputsHandler(event, "object_map")}
                style={{ width: "160px" }}
                value={currentFilters.object_map}
              >
                <option></option>
                <option>{dictinary.no.ru}</option>
                <option>{dictinary.yes.ru}</option>
              </select>
            </td>
            <td>
              <select
                style={{ width: "130px" }}
                onChange={(event) =>
                  onChangeInputsHandler(event, "orientation")
                }
                value={currentFilters.orientation}
              >
                <option></option>
                <option>Left</option>
                <option>Right</option>
                <option>Top</option>
                <option>Bottom</option>
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
            <th style={{ minWidth: "80px" }}>{dictinary.stream.ru}</th>
            <th style={{ minWidth: "150px" }}>{dictinary.blocked.ru}?</th>
            <th style={{ minWidth: "150px" }}>Код интеграции</th>
            <th style={{ minWidth: "150px" }}>{dictinary.area.ru}</th>
            <th style={{ minWidth: "120px" }}>{dictinary.capacity.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.unit.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.autoAssigment.ru}</th>
            <th style={{ minWidth: "150px" }}>
              {dictinary.usedForSlotting.ru}?
            </th>
            <th style={{ minWidth: "100px" }}>{dictinary.typeOfAuto.ru}</th>
            <th style={{ minWidth: "100px" }}>{dictinary.onMap.ru}?</th>
            <th style={{ minWidth: "130px" }}>{dictinary.direction.ru}</th>
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
                <td>{cur.stream}</td>
                <td>{cur.blocked}</td>
                <td>{cur.area_name}</td>
                <td>{cur.integration_id}</td>
                <td>{cur.capacity}</td>
                <td>{cur.unit}</td>
                <td>{cur.autoset}</td>
                <td>{cur.used_for_slot}</td>
                <td>{cur.transport_type_name}</td>
                <td>{cur.object_map}</td>
                <td>{cur.orientation}</td>
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

export default RampsTable;
