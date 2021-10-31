import React, { useEffect, useState } from "react";
import ButtonsBlock from "../../ButtonsBlock";
import ballImg from "./../../../../img/reference-book-buttons/attention.png";
import AddReceiverModal from "./AddReceiverModal";
import "../../style.css";
import EditReceiverModal from "./EditReceiverModal";
import GroupEditReceiverModal from "./GroupEditReceiverModal";
import DeleteReceiverModal from "./DeleteReceiverModal";
import FooterNavigation from "../../FooterNavigation";
import { dictinary } from "../../../../dictinary/dictinary";

const emptyReceiver = {
  id: "",
  company_name_ru : "",
  integration_id : "",
  comment: "",
};

const emptyReceiverIds = {
  id: "",
  company_name_ru : "",
  integration_id : "",
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

const ReceiversTable = (props) => {
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

  useEffect(async () => {
    let body = {};
    body.limit = rowsOnPageCount;
    body.page = currentPage;
    body.filters = currentFilters;
    body = JSON.stringify(body);
    let headers = {};
    headers["Content-Type"] = "application/json";
    const response = await fetch("/api/referenceBook/receivers/get", {
      method: "POST",
      body: body,
      headers: headers,
    });
    const data = await response.json();
    console.log(data);
    setWholeData(data.data.result);
    setTotalRows(data.data.count);
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

  const onSearchClearHandler = () => {
    setCurrentFilters(emptyReceiver);
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
      <DeleteReceiverModal
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
      <AddReceiverModal
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        style={style_model}
        onSuccesfulAdd={onSuccesfulAdd}
        onUnsuccesfulAdd={onUnsuccesfulAdd}
        emptyReceiverIds={emptyReceiverIds}
        showMessage={showMessage}
      />
      <EditReceiverModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        onSuccesfulEdit={onSuccesfulEdit}
        onUnsuccesfulEdit={onUnsuccesfulEdit}
        style={style_model}
        emptyReceiverIds={emptyReceiverIds}
        currentReceiverId={selectedRows.length > 0 ? selectedRows[0] : null}
        showMessage={showMessage}
      />
     <GroupEditReceiverModal
        visible={groupEditModalVisible}
        setVisible={setGroupEditModalVisible}
        style={style_model}
        selectedRows={selectedRows}
        emptyReceiver={emptyReceiver}
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
                style={{ width: "220px" }}
                placeholder={dictinary.company_name.ru}
                onChange={(event) => onChangeInputsHandler(event, "company_name_ru")}
                value={currentFilters.company_name_ru}
              />
            </td>
            <td>
              <input
                type="text"
                style={{ width: "160px" }}
                placeholder={dictinary.integrationCode.ru}
                onChange={(event) =>
                  onChangeInputsHandler(event, "integration_id")
                }
                value={currentFilters.integration_id }
              />
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
            <th style={{ minWidth: "220px" }}>{dictinary.company_name.ru}</th>
            <th style={{ width: "160px" }}>{dictinary.integrationCode.ru}</th>
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
                <td>{cur.company_name_ru}</td>
                <td>{cur.integration_id}</td>
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

export default ReceiversTable;