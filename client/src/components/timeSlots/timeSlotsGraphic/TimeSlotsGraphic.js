import React, { useState, useEffect } from "react";
import CustomDataPicker from "../../react-datepicker/CustomDataPicker";
import IndicatorsContainer from "../../../components/react-select/IndicatorsContainer.js";
import { customSelectStyles } from "../../../components/react-select/select-style";

let RELATION = 15;
let MINUTES_IN_DAY = (60 * 24) / RELATION;
let MINUTE_SIZE = 40;
let FIRST_COL_WIDTH = 100;
let FIRST_ROW_HEIGHT = 40;
let SECOND_COL_WIDTH = 50;
let SECOND_ROW_HEIGHT = 40;

let ROW_SIZE = 30;

let DATE_PERIOD = 50;
let TIME_PERIOD = 3;

let current_key = 1;

const ToIndex = (str) => {
  let h = str[0] + str[1];
  let m = str[3] + str[4];
  return (m * 1 + h * 60) / RELATION;
};

const RemoveBad = (arr, first_date, second_date) => {
  let first_index = ToIndex(first_date);
  let second_index = ToIndex(second_date);
  while (first_index != second_index) {
    arr[first_index + 2] = (
      <td
        key={"timeline_cell" + current_key}
        style={{
          width: MINUTE_SIZE + "px",
          backgroundColor: "red",
          border: "0px",
        }}
      ></td>
    );
    current_key++;
    first_index++;
    if (first_index == MINUTES_IN_DAY) {
      first_index = 0;
    }
  }
};

const CreateFirstLine = (choosen_date) => {
  let tmp = [];
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: FIRST_COL_WIDTH + "px",
        backgroundColor: "yellow",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    >
      Дата
      <hr style={{ margin: "1px" }} />
      Склад
    </td>
  );
  current_key++;
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: SECOND_COL_WIDTH + "px",
        backgroundColor: "pink",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    ></td>
  );
  current_key++;
  for (let i1 = 1; i1 <= MINUTES_IN_DAY; i1++) {
    if (i1 % DATE_PERIOD == 0) {
      tmp.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: MINUTE_SIZE + "px",
            backgroundColor: "red",
            border: "0px",
          }}
        >
          <div style={{ width: MINUTE_SIZE + "px", whiteSpace: "nowrap" }}>
            <text
              style={{
                display: "inline-block",
                transform: "translate(-50%)",
              }}
            >
              {new Date(choosen_date).toLocaleDateString()}
            </text>
          </div>
        </td>
      );
      current_key++;
    } else {
      tmp.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: MINUTE_SIZE + "px",
            backgroundColor: "yellow",
            border: "0px",
          }}
        ></td>
      );
      current_key++;
    }
  }
  return tmp;
};

const CreateSecondLine = () => {
  let tmp = [];
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: FIRST_COL_WIDTH + "px",
        backgroundColor: "blue",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    ></td>
  );
  current_key++;
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: SECOND_COL_WIDTH + "px",
        backgroundColor: "grey",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    >
      Время
      <hr style={{ margin: "1px" }} />
      Тип
    </td>
  );
  current_key++;
  for (let i1 = 1; i1 <= MINUTES_IN_DAY; i1++) {
    let new_time = i1 * 15;
    if (i1 % TIME_PERIOD == 0) {
      tmp.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: MINUTE_SIZE + "px",
            backgroundColor: "red",
            border: "0px",
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            style={{
              width: MINUTE_SIZE + "px",
              whiteSpace: "nowrap",
              border: "0px",
              padding: "0px",
              margin: "0px",
            }}
          >
            <text
              style={{
                display: "inline-block",
                transform: "translate(50%)",
              }}
            >
              {Math.floor(new_time / 60) < 10 ? "0" : ""}
              {Math.floor(new_time / 60)}:
              {Math.floor(new_time % 60) < 10 ? "0" : ""}
              {new_time % 60}
            </text>
          </div>
        </td>
      );
      current_key++;
    } else {
      tmp.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: MINUTE_SIZE + "px",
            backgroundColor: "yellow",
            border: "0px",
            padding: "0px",
            margin: "0px",
          }}
        ></td>
      );
      current_key++;
    }
  }
  return tmp;
};

const AddWarehouseRow = (name) => {
  let tmp = [];
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: FIRST_COL_WIDTH + "px",
        backgroundColor: "blue",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    >
      {name}
    </td>
  );
  current_key++;
  tmp.push(
    <td
      key={"timeline_cell" + current_key}
      style={{
        width: SECOND_COL_WIDTH + "px",
        backgroundColor: "gray",
        border: "0px",
        padding: "0px",
        margin: "0px",
      }}
    ></td>
  );
  current_key++;
  for (let i1 = 1; i1 <= MINUTES_IN_DAY; i1++) {
    tmp.push(
      <td
        key={"timeline_cell" + current_key}
        style={{
          width: MINUTE_SIZE + "px",
          backgroundColor: "gray",
          border: "0px",
        }}
      ></td>
    );
    current_key++;
  }
  return tmp;
};

const TimeSlotsGraphic = (props) => {
  const [choosen_date, SetChoosenDate] = useState(null);
  console.log(choosen_date);
  const [lines, SetLines] = useState([]);

  useEffect(async () => {
    let headers = {};
    headers["Content-Type"] = "application/json";

    let data_warehouses;
    let data_areas;
    let data_ramps;
    let data_warehouse_schedules;
    let data_ramp_schedules;

    //warehouses names
    {
      const response = await fetch("/api/referenceBook/warehouse/getNames ", {
        method: "POST",
        headers: headers,
      });
      data_warehouses = await response.json();
    }
    //areas names
    {
      const response = await fetch("/api/referenceBook/areas/getNamesAndIds", {
        method: "POST",
        headers: headers,
      });
      data_areas = await response.json();
    }
    //ramps names
    {
      const response = await fetch(
        "/api/referenceBook/ramps/getNamesAndIdsAndDates",
        {
          method: "POST",
          headers: headers,
        }
      );
      data_ramps = await response.json();
    }
    // warehouse schedule
    {
      const response = await fetch(
        "/api/referenceBook/warehouseSchedules/getBreaks",
        {
          method: "POST",
          headers: headers,
        }
      );
      data_warehouse_schedules = await response.json();
    }
    // ramp schedule
    {
      const response = await fetch("/api/referenceBook/rampSchedules/getAll", {
        method: "POST",
        headers: headers,
      });
      data_ramp_schedules = await response.json();
    }

    let positions_warehouses = {};
    for (let i = 0; i < data_warehouses.data.length; i++) {
      positions_warehouses[data_warehouses.data[i].id] = i;
      data_warehouses.data[i]["all"] = [];
    }

    let positions_areas = {};
    for (let i = 0; i < data_areas.data.length; i++) {
      positions_areas[data_areas.data[i].id] = i;
    }

    let positions_ramps = {};
    for (let i = 0; i < data_ramps.data.length; i++) {
      positions_ramps[data_ramps.data[i].id] = i;
    }

    for (let i = 0; i < data_warehouse_schedules.data.length; i++) {
      data_areas.data[
        positions_areas[data_warehouse_schedules.data[i].area_id]
      ]["warehouse_schedule"] = data_warehouse_schedules.data[i];
    }

    for (let i = 0; i < data_ramp_schedules.data.length; i++) {
      console.log(data_ramp_schedules.data[i]);
      data_ramps.data[positions_ramps[data_ramp_schedules.data[i].ramp_id]][
        "ramp_schedule"
      ] = data_ramp_schedules.data[i];
    }

    for (let i = 0; i < data_ramps.data.length; i++) {
      let war_id =
        data_areas.data[positions_areas[data_ramps.data[i].area_id]]
          .warehouse_id;
      data_warehouses.data[positions_warehouses[war_id]].all.push(
        data_ramps.data[i]
      );
    }

    console.log(data_warehouses);
    console.log(data_ramps);
    console.log(data_areas);
    console.log(data_warehouse_schedules);
    console.log(data_ramp_schedules);

    data_warehouses = data_warehouses.data;
    console.log("xxxxxx");
    let tmp_lines = [];
    tmp_lines.push(CreateFirstLine(choosen_date));

    tmp_lines.push(CreateSecondLine());

    console.log(tmp_lines);
    for (let i = 0; i < data_warehouses.length; i++) {
      tmp_lines.push(AddWarehouseRow(data_warehouses[i].name_ru));
      let template = [];
      template.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: FIRST_COL_WIDTH + "px",
            backgroundColor: "pink",
            border: "0px",
            padding: "0px",
            margin: "0px",
          }}
        ></td>
      );
      current_key++;
      template.push(
        <td
          key={"timeline_cell" + current_key}
          style={{
            width: SECOND_COL_WIDTH + "px",
            backgroundColor: "cyan",
            border: "0px",
            padding: "0px",
            margin: "0px",
          }}
        ></td>
      );
      current_key++;
      for (let i1 = 1; i1 <= MINUTES_IN_DAY; i1++) {
        template.push(
          <td
            key={"timeline_cell" + current_key}
            style={{
              width: MINUTE_SIZE + "px",
              backgroundColor: "green",
              border: "0px",
            }}
          ></td>
        );
        current_key++;
      }

      for (let i1 = 0; i1 < data_warehouses[i].all.length; i1++) {
        let tmp = [];
        for (let i2 = 0; i2 < template.length; i2++) {
          tmp.push(template[i2]);
        }
        tmp[0] = (
          <td
            key={"timeline_cell" + current_key}
            style={{
              width: FIRST_COL_WIDTH + "px",
              backgroundColor: "pink",
              border: "0px",
              padding: "0px",
              margin: "0px",
            }}
          >
            {data_warehouses[i].all[i1].name_ru}
          </td>
        );
        current_key++;
        // warehouse schedule
        {
          if (
            !!data_areas.data[
              positions_areas[data_warehouses[i].all[i1].area_id]
            ].warehouse_schedule
          ) {
            RemoveBad(
              tmp,
              data_areas.data[
                positions_areas[data_warehouses[i].all[i1].area_id]
              ].warehouse_schedule.work_end,
              data_areas.data[
                positions_areas[data_warehouses[i].all[i1].area_id]
              ].warehouse_schedule.work_start
            );
            if (
              data_areas.data[
                positions_areas[data_warehouses[i].all[i1].area_id]
              ].warehouse_schedule.break_quantity >= 1
            ) {
              RemoveBad(
                tmp,
                data_areas.data[
                  positions_areas[data_warehouses[i].all[i1].area_id]
                ].warehouse_schedule.break1_start,
                data_areas.data[
                  positions_areas[data_warehouses[i].all[i1].area_id]
                ].warehouse_schedule.break1_end
              );
            }
            if (
              data_areas.data[
                positions_areas[data_warehouses[i].all[i1].area_id]
              ].warehouse_schedule.break_quantity >= 2
            ) {
              RemoveBad(
                tmp,
                data_areas.data[
                  positions_areas[data_warehouses[i].all[i1].area_id]
                ].warehouse_schedule.break2_start,
                data_areas.data[
                  positions_areas[data_warehouses[i].all[i1].area_id]
                ].warehouse_schedule.break2_end
              );
            }
          }
        }

        // ramp schedule
        {
          // work schedule
          if (!!data_warehouses[i].all[i1].ramp_schedule) {
            RemoveBad(
              tmp,
              data_warehouses[i].all[i1].ramp_schedule.work_end,
              data_warehouses[i].all[i1].ramp_schedule.work_start
            );
            // break1
            if (data_warehouses[i].all[i1].ramp_schedule.break_quantity >= 1) {
              RemoveBad(
                tmp,
                data_warehouses[i].all[i1].ramp_schedule.break1_start,
                data_warehouses[i].all[i1].ramp_schedule.break1_end
              );
            }

            // break2
            if (data_warehouses[i].all[i1].ramp_schedule.break_quantity >= 2) {
              RemoveBad(
                tmp,
                data_warehouses[i].all[i1].ramp_schedule.break2_start,
                data_warehouses[i].all[i1].ramp_schedule.break2_end
              );
            }

            // break3
            if (data_warehouses[i].all[i1].ramp_schedule.break_quantity >= 3) {
              RemoveBad(
                tmp,
                data_warehouses[i].all[i1].ramp_schedule.break3_start,
                data_warehouses[i].all[i1].ramp_schedule.break3_end
              );
            }

            // break4
            if (data_warehouses[i].all[i1].ramp_schedule.break_quantity >= 4) {
              RemoveBad(
                tmp,
                data_warehouses[i].all[i1].ramp_schedule.break4_start,
                data_warehouses[i].all[i1].ramp_schedule.break4_end
              );
            }
          }
        }

        tmp_lines.push(tmp);
      }
    }
    SetLines(tmp_lines);
  }, [choosen_date]);

  const OnChangeDateEvent = (value) => {
    SetChoosenDate(value);
  };

  console.log(lines);

  return (
    <>
      <div
        style={{
          minHeight: "calc(100%)",
          height: "calc(100%)",
          maxHeight: "calc(100%)",
          backgroundColor: "#FFFFFF",
          display: "block",
          padding: "0px 20px",
          overflowX: "scroll",
          overflowY: "scroll",
          boxSizing: "border-box",
        }}
      >
        <CustomDataPicker
          selected={choosen_date}
          dateFormat="dd.MM.yyyy"
          onChange={(value) => {
            OnChangeDateEvent(value);
          }}
          placeholderText="Choose date"
        />
        {!!choosen_date && (
          <table
            style={{
              width:
                MINUTE_SIZE * MINUTES_IN_DAY +
                FIRST_COL_WIDTH * 1 +
                SECOND_COL_WIDTH * 1 +
                "px",
              border: "0px red solid",
              borderSpacing: "0px 0px",
              tableLayout: "fixed",
            }}
          >
            {lines.map((value, index) => {
              if (index == 0) {
                return (
                  <tr
                    style={{
                      backgroundColor: "green",
                      height: FIRST_ROW_HEIGHT + "px",
                    }}
                  >
                    {value}
                  </tr>
                );
              } else if (index == 1) {
                return (
                  <tr
                    style={{
                      backgroundColor: "white",
                      height: SECOND_ROW_HEIGHT + "px",
                    }}
                  >
                    {value}
                  </tr>
                );
              } else {
                return (
                  <tr
                    style={{
                      backgroundColor: "lightblue",
                      height: ROW_SIZE + "px",
                    }}
                  >
                    {value}
                  </tr>
                );
              }
            })}
          </table>
        )}
      </div>
    </>
  );
};

export default TimeSlotsGraphic;
