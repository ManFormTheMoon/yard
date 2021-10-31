import React, { useState, useEffect } from "react";
import Modal from "../../../Modal/Modal";
import ApplyButton from "../../userUI/ApplyButton";
import CancelButton from "../../userUI/CancelButton";
import { dictinary } from "../../../dictinary/dictinary";
import CustomDataPicker from "../../react-datepicker/CustomDataPicker";
import Select, { components } from "react-select";
import IndicatorsContainer from "../../react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../react-select/select-style";
import SearchButton from "../../userUI/SearchButton";

const emptyFilter = {
  document_date: null,
  cargo_type_id: "",
  stream: "",
};

const ConnectUnrelatedDocumentsModal = (props) => {
  const [abacaba, setAbacaba] = useState(0);
  const [wholeData, setWholeData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(emptyFilter);
  const [cargoLabel, setCargoLabel] = useState({
    label: "",
    value: "",
    id: "",
  });
  const [currentDocument, setCurrentDocument] = useState({});
  const [documentDate, setDocumentDate] = useState(null);
  const [stream, setStream] = useState("");
  useEffect(async () => {
    if (props.visible == true) {
      let headers = {};
      headers["Content-Type"] = "application/json";
      let dataDocument;
      //current document
      {
        let body = {};

        body.documentId = props.selected;
        body = JSON.stringify(body);
        const response = await fetch(
          "/api/workPlace/unrelatedDocuments/getOneForConnect",
          {
            method: "POST",
            body: body,
            headers: headers,
          }
        );
        dataDocument = await response.json();
        setCurrentDocument(dataDocument);
        console.log(dataDocument);
        setCargoLabel({
          label: dataDocument.data[0].cargo_type,
          value: dataDocument.data[0].cargo_type,
          id: dataDocument.data[0].cargo_type_id,
        });
        let pos = dataDocument.data[0].document_date.indexOf(".");
        setDocumentDate(
          new Date(dataDocument.data[0].document_date.substring(0, pos))
        );
        if (!!dataDocument.data[0].document_date.receiver_name) {
          await setStream("Input");
        } else {
          await setStream("Output");
        }
      }
      //time-slots
      {
        let headers = {};
        headers["Content-Type"] = "application/json";
        let body = {};
        if (!!dataDocument.data[0].document_date.receiver_name) {
          body.stream = "Input";
        } else {
          body.stream = "Output";
        }
        let pos = dataDocument.data[0].document_date.indexOf(".");
        body.documentDate = new Date(
          dataDocument.data[0].document_date.substring(0, pos)
        );
        body.cargo = dataDocument.data[0].cargo_type_id;
        body = JSON.stringify(body);
        console.log("sdfdasfsdfsdfsdkjfsudh");
        const response = await fetch(
          "/api/timeSlots/getForUnrelatedDocuments",
          {
            method: "POST",
            body: body,
            headers: headers,
          }
        );
        const data = await response.json();
        console.log(data);
        setWholeData(data.data);
      }
    } else {
      setSelectedRow(null);
    }
  }, [props.visible]);

  const onConnectEvent = async () => {
    if (selectedRow != null) {
      let timeSlot = wholeData.filter((cur) => cur.id == selectedRow)[0];
      console.log(timeSlot);
      let addRelatedDocument = {
        warehouse_id: currentDocument.warehouse_id,
        area_id: timeSlot.area_id,
        ramp_id: timeSlot.ramp_id,
        document_number: currentDocument.document_number,
        cargo_type_id: currentDocument.cargo_type_id,
        document_date: currentDocument.document_date,
        truck_number: currentDocument.truck_number,
        semitrailer_number: currentDocument.semitrailer_number,
        driver_fio: currentDocument.driver_fio,
        visit_number: timeSlot.visit_number,
        vt_planned_start_time: timeSlot.vt_planned_start_time,
        actual_arrival_time: timeSlot.actual_arrival_time,
        load_planned_start_time: timeSlot.load_planned_start_time,
        actual_load_start_time: timeSlot.actual_load_start_time,
        load_planned_finish_time: timeSlot.load_planned_finish_time,
        actual_load_finish_time: timeSlot.actual_load_finish_time,
        vt_planned_finish_time: timeSlot.vt_planned_finish_time,
        actual_departure_time: timeSlot.actual_departure_time,
        in_the_norm: null,
        deviation_from_the_standard: null,
        arrived_on_time: null,
        late_arrival: null,
      };

      //add to related documents
      {
        let headers = {};
        headers["Content-Type"] = "application/json";
        let body = {};

        body.obj = addRelatedDocument;
        body = JSON.stringify(body);
        const response = await fetch("/api/workPlace/relatedDocuments/add", {
          method: "POST",
          body: body,
          headers: headers,
        });
        const data = await response.json();
      }
      //props.onSucccessfulConnect();
    } else {
      //props.onUnsuccessfulConnect();
    }
  };

  const onSearchClick = () => {
    setAbacaba(abacaba + 1);
  };

  const onChangeInputsHandler = (event, value) => {
    setCurrentFilters({ ...currentFilters, [value]: event.target.value });
  };

  const addRowToSelect = (value) => {
    if (selectedRow == value) {
      setSelectedRow(null);
    } else {
      setSelectedRow(value);
    }
  };

  const changeBoxItemHandler = (value, event) => {
    if (event.target.checked) {
      setSelectedRow(value);
    } else {
      setSelectedRow(null);
    }
  };

  return (
    <Modal
      visible={props.visible}
      setVisible={props.setVisible}
      style={{
        width: "60%",
        height: "75%",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "15px",
        overflowY: "scroll",
      }}
    >
      {/* <div
        style={{
          display: "flex",
          width: "98%",
          height: "100px",
          backgroundColor: "red",
          fontSize: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "50%",
            backgroundColor: "green",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "20px",
            }}
          >
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            >
              Дата документа:
            </div>
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            >
              Поток:
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            >
              <CustomDataPicker
                selected={documentDate}
                dateFormat="dd/MM/yyyy"
                isDisabled={true}
              />
            </div>
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            >
              <select style={{ width: "128px" }} value={stream} disabled>
                <option>Input</option>
                <option>Output</option>
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "50%",
            justifyContent: "center",
            backgroundColor: "yellow",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "20px",
            }}
          >
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            >
              Тип груза:
            </div>
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                height: "50%",
                width: "100px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Select
                value={cargoLabel}
                styles={customSelectStyles}
                components={{ IndicatorsContainer }}
                isDisabled={true}
              />
            </div>
            <div
              style={{ height: "50%", display: "flex", alignItems: "center" }}
            ></div>
          </div>
        </div>
      </div> */}
      {/* <div style={{ height: "70%", overflowY: "scroll" }}>
        <table
          style={{
            borderRadius: "3px",
            border: "0.5px solid #87C9B6",
            tableLayout: "fixed",
            marginTop: "10px",
            overflow: "scroll",
          }}
        >
          <tr>
            <th style={{ minWidth: "30px" }}></th>
            <th style={{ minWidth: "100px" }}>Дата</th>
            <th style={{ minWidth: "100px" }}>Поток</th>
            <th style={{ minWidth: "100px" }}>Тип груза</th>
            <th style={{ minWidth: "100px" }}>Участок</th>
            <th style={{ minWidth: "100px" }}>Плановое время прибытия</th>
            <th style={{ minWidth: "100px" }}>
              Плановое время начала обработки
            </th>
            <th style={{ minWidth: "100px" }}>
              Плановое время завершения обработки
            </th>
            <th style={{ minWidth: "100px" }}>Плановое время убытия</th>
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
                <td>{cur.slot_start_date}</td>
                <td>{stream}</td>
                <td>{cargoLabel.label}</td>
                <td>{cur.area_name}</td>
                <td>{cur.planned_arrival_time}</td>
                <td>{cur.load_planned_start_time}</td>
                <td>{cur.load_planned_finish_time}</td>
                <td>{cur.planned_departure_time}</td>
              </tr>
            );
          })}
        </table>
      </div>
      <div className="modal-button">
        <ApplyButton onOk={onConnectEvent} children={"Сохранить изменения"} />
        <CancelButton
          onCancel={() => props.setVisible(false)}
          children={dictinary.cancel.ru}
          style={{ marginLeft: "10px" }}
        />
      </div> */}
    </Modal>
  );
};

export default ConnectUnrelatedDocumentsModal;
