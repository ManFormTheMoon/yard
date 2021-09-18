import { event } from "jquery";
import React, { useEffect, useState } from "react";
import { useHttp } from "../../../hooks/useHttp";
import ButtonsBlock from "../ButtonsBlock";
import gridImg from "./../../../img/reference-book-buttons/grid.png";
import leftArrowImg from "./../../../img/reference-book-buttons/left-arrow.png";
import rightArrowImg from "./../../../img/reference-book-buttons/right-arrow.png";
import firstPageArrowImg from "./../../../img/reference-book-buttons/first_page_arrow.png";
import lastPageArrowImg from "./../../../img/reference-book-buttons/last_page_arrow.png";
import refreshImg from "./../../../img/reference-book-buttons/refresh.png";
import "./Ramps.css";

const RampsTable = (props) => {
  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [rowsOnPageCount, setRowsOnPageCount] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
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
    setSelectedRows([]);
  }, [rowsOnPageCount, abacaba, currentPage]);
  const onSearchClick = () => {
    setAbacaba(abacaba + 1);
  };
  console.log(wholeData);
  console.log(totalRows);
  console.log(rowsOnPageCount);
  console.log(selectedRows);
  console.log(currentFilters);

  const onDeleteHandler = async () => {
    console.log(1);
    console.log(selectedRows);
    if (selectedRows.length > 0) {
      console.log(2);
      let body = {};
      body.arr = selectedRows;
      body = JSON.stringify(body);
      let headers = {};
      headers["Content-Type"] = "application/json";
      const response = await fetch("/api/referenceBook/ramps/delete", {
        method: "POST",
        body: body,
        headers: headers,
      });
      console.log(3);
      setSelectedRows([]);
      await setAbacaba(abacaba + 1);
    }
  };

  const onSearchClearHandler = () => {
    console.log("Xxx");
    setCurrentFilters({
      id: "",
      name_ru: "",
      stream: "",
      blocked: "",
      area_id: "",
      capacity: "",
      unit: "",
      object_map: "",
      comment: "",
      used_for_slot: "",
      trasnport_type_id: "",
      orientation: "",
      autoset: "",
    });
  };

  const onKeyDownHandler = (event) => {
    if (event.key == "Enter") {
      setRowsOnPageCount(1 * event.target.value);
    }
  };

  const changeBoxItemHandler = (value, event) => {
    console.log(value);
    console.log(event.target.checked);
    if (event.target.checked) {
      setSelectedRows([...selectedRows, value]);
    } else {
      setSelectedRows(selectedRows.filter((cur) => cur != value));
    }
  };

  const onChangeGlobalCheckBox = (event) => {
    console.log(event.target.checked);
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

  const onChangeIdHandler = (event) => {
    setCurrentFilters({ ...currentFilters, id: event.target.value });
  };
  const onChangeNameRuHandler = (event) => {
    setCurrentFilters({ ...currentFilters, name_ru: event.target.value });
  };
  const onChangeStreamHandler = (event) => {
    setCurrentFilters({ ...currentFilters, stream: event.target.value });
  };
  const onChangeBlockedHandler = (event) => {
    setCurrentFilters({ ...currentFilters, blocked: event.target.value });
  };
  const onChangeAreaIdHandler = (event) => {
    setCurrentFilters({ ...currentFilters, area_id: event.target.value });
  };
  const onChangeCapacityHandler = (event) => {
    setCurrentFilters({ ...currentFilters, capacity: event.target.value });
  };
  const onChangeUnitHandler = (event) => {
    setCurrentFilters({ ...currentFilters, unit: event.target.value });
  };
  const onChangeAutosetHandler = (event) => {
    setCurrentFilters({ ...currentFilters, autoset: event.target.value });
  };
  const onChangeUsedForSlotHandler = (event) => {
    setCurrentFilters({ ...currentFilters, used_for_slot: event.target.value });
  };
  const onChangeTransportTypeIdHandler = (event) => {
    setCurrentFilters({
      ...currentFilters,
      trasnport_type_id: event.target.value,
    });
  };
  const onChangeObjectMapHandler = (event) => {
    setCurrentFilters({ ...currentFilters, object_map: event.target.value });
  };
  const onChangeOrientationHandler = (event) => {
    setCurrentFilters({ ...currentFilters, orientation: event.target.value });
  };
  const onChangeCommentHandler = (event) => {
    setCurrentFilters({ ...currentFilters, comment: event.target.value });
  };
  return (
    <>
      <div
        style={{
          // width: "200%",
          // minHeight: "calc(100% - 53px)",
          height: "750px",
          backgroundColor: "brown",
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
        />
        <br />
        {wholeData.length > 0 && (
          <table
            style={{
              border: "1px solid black",
              tableLayout: "fixed",
              // width: "2000px",
            }}
          >
            <tr>
              <td style={{ width: "50px" }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length == rowsOnPageCount}
                  onChange={(event) => onChangeGlobalCheckBox(event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "50px" }}
                  placeholder="Код"
                  onChange={onChangeIdHandler}
                  value={currentFilters.id}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "150px" }}
                  placeholder="Наименование"
                  onChange={onChangeNameRuHandler}
                  value={currentFilters.name_ru}
                />
              </td>
              <td>
                <select
                  onChange={onChangeStreamHandler}
                  value={currentFilters.stream}
                >
                  <option></option>
                  <option>Input</option>
                  <option>Output</option>
                </select>
              </td>
              <td>
                <select
                  onChange={onChangeBlockedHandler}
                  value={currentFilters.blocked}
                >
                  <option></option>
                  <option>Да</option>
                  <option>Нет</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "150px" }}
                  placeholder="Код площадки"
                  onChange={onChangeAreaIdHandler}
                  value={currentFilters.area_id}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "120px" }}
                  placeholder="Вместимость"
                  onChange={onChangeCapacityHandler}
                  value={currentFilters.capacity}
                />
              </td>
              <td>
                <select
                  onChange={onChangeUnitHandler}
                  value={currentFilters.unit}
                >
                  <option></option>
                  <option>kg</option>
                  <option>px</option>
                  <option>3</option>
                </select>
              </td>
              <td>
                <select
                  onChange={onChangeAutosetHandler}
                  value={currentFilters.autoset}
                >
                  <option></option>
                  <option>Да</option>
                  <option>Нет</option>
                </select>
              </td>
              <td>
                <select
                  onChange={onChangeUsedForSlotHandler}
                  value={currentFilters.used_for_slot}
                >
                  <option></option>
                  <option>Да</option>
                  <option>Нет</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "100px" }}
                  placeholder="Код вида транспорта"
                  onChange={onChangeTransportTypeIdHandler}
                  value={currentFilters.trasnport_type_id}
                />
              </td>
              <td>
                <select
                  onChange={onChangeObjectMapHandler}
                  value={currentFilters.object_map}
                >
                  <option></option>
                  <option>Да</option>
                  <option>Нет</option>
                </select>
              </td>
              <td>
                <select
                  onChange={onChangeOrientationHandler}
                  value={currentFilters.orientation}
                >
                  <option></option>
                  <option>Left</option>
                  <option>Riight</option>
                  <option>Top</option>
                  <option>Bottom</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "250px" }}
                  placeholder="Комментарии"
                  onChange={onChangeCommentHandler}
                  value={currentFilters.comment}
                />
              </td>
            </tr>
            <tr>
              <th style={{ minWidth: "50px" }}></th>
              <th style={{ minWidth: "50px" }}>Код</th>
              <th style={{ minWidth: "150px" }}>Наименование</th>
              <th style={{ minWidth: "80px" }}>Поток</th>
              <th style={{ minWidth: "150px" }}>Заблокировано</th>
              <th style={{ minWidth: "150px" }}>Код плошадки</th>
              <th style={{ minWidth: "120px" }}>Вместиность</th>
              <th style={{ minWidth: "100px" }}>Единица измерения</th>
              <th style={{ minWidth: "100px" }}>Авто набор</th>
              <th style={{ minWidth: "150px" }}>Используется для слота</th>
              <th style={{ minWidth: "100px" }}>Код типа транспорта</th>
              <th style={{ minWidth: "100px" }}>Карта объектов</th>
              <th style={{ minWidth: "130px" }}>Направление</th>
              <th style={{ minWidth: "250px" }}>Комментарии</th>
            </tr>
            {wholeData.map((cur) => {
              return (
                <tr>
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
                  <td>{cur.area_id}</td>
                  <td>{cur.capacity}</td>
                  <td>{cur.unit}</td>
                  <td>{cur.autoset}</td>
                  <td>{cur.used_for_slot}</td>
                  <td>{cur.trasnport_type_id}</td>
                  <td>{cur.object_map}</td>
                  <td>{cur.orientation}</td>
                  <td>{cur.comment}</td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "tomato",
          display: "flex",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          <img src={gridImg} style={{ height: "80%" }} alt="" />
          Столбцы
          <input
            onKeyDown={onKeyDownHandler}
            style={{ width: "50px", marginLeft: "20px" }}
          />
        </div>
        <div
          style={{
            height: "100%",
            marginLeft: "20px",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => {
            setAbacaba(abacaba + 1);
          }}
        >
          <img src={refreshImg} style={{ height: "80%" }} alt="" />
          Обновить
        </div>
        <div
          style={{
            height: "100%",
            marginLeft: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={firstPageArrowImg}
            style={{ height: "60%" }}
            onClick={() => {
              setCurrentPage(1);
            }}
          />
          <img
            src={leftArrowImg}
            style={{ height: "60%", marginLeft: "30px" }}
            onClick={() => {
              setCurrentPage(Math.max(currentPage - 1, 1));
            }}
          />
          <input
            style={{ width: "50px", margin: "0px 10px" }}
            type="number"
            value={currentPage}
            onChange={(event) => {
              setCurrentPage(event.target.value);
            }}
          />
          <img
            src={rightArrowImg}
            style={{ height: "60%" }}
            onClick={() => {
              setCurrentPage(
                Math.min(
                  currentPage + 1,
                  Math.floor(
                    (totalRows + 1 * rowsOnPageCount - 1) /
                      (rowsOnPageCount * 1)
                  )
                )
              );
            }}
          />
          <img
            src={lastPageArrowImg}
            style={{ height: "60%", marginLeft: "30px" }}
            onClick={() => {
              setCurrentPage(
                Math.floor(
                  (totalRows + 1 * rowsOnPageCount - 1) / (rowsOnPageCount * 1)
                )
              );
            }}
          />
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            marginLeft: "50px",
          }}
        >
          Total - {totalRows}
        </div>
      </div>
    </>
  );
};

export default RampsTable;
