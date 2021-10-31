const { Router } = require("express");
const express = require("express");
var mysql = require("mysql2/promise");
const router = Router();
const config = require("config");

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

const getLocalDate = (value) => {
  let d = new Date(value);
  console.log(d.toLocaleDateString());
  let arr = d.toLocaleDateString().split(".");
  arr = arr.reverse();
  return arr.join("-");
};

const getLocalTime = (value) => {
  let d = new Date(value);
  console.log(d.toLocaleTimeString());
  return d.toLocaleTimeString();
};

const getRelatedDocuments = (filters) => {
  let query = `select 
                related_documents.id,
                warehouses.name_ru as warehouse_name,
                areas.name_ru as area_name,
                ramps.name_ru as ramp_name,
                related_documents.document_number, 
                cargo_types.cargo_name as cargo_type, 
                related_documents.document_date, 
                related_documents.truck_number, 
                related_documents.semitrailer_number, 
                related_documents.driver_fio, 
                suppliers.company_name_ru as supplier_name, 
                receivers.company_name_ru as receiver_name,
                related_documents.vt_planned_start_time,
                related_documents.actual_arrival_time,
                related_documents.load_planned_start_time,
                related_documents.actual_load_start_time,
                related_documents.load_planned_finish_time,
                related_documents.actual_load_finish_time,
                related_documents.vt_planned_finish_time,
                related_documents.actual_departure_time,
                related_documents.in_the_norm,
                related_documents.deviation_from_the_standard,
                related_documents.arrived_on_time,
                related_documents.late_arrival
                from related_documents 
                join warehouses on warehouses.id = related_documents.warehouse_id
                join areas on areas.id = related_documents.area_id
                join ramps on ramps.id = related_documents.ramp_id
                join cargo_types on cargo_types.id = related_documents.cargo_type_id
                join suppliers on suppliers.id = related_documents.supplier_id
                join receivers on receivers.id = related_documents.receiver_id
              `;

  let queryFilter = "";
  if (!!filters.id) {
    queryFilter += ` and related_documents.id = '${filters.id}'`;
  }
  if (!!filters.warehouse_id) {
    queryFilter += ` and warehouses.id = '${filters.warehouse_id}'`;
  }
  if (!!filters.area_id) {
    queryFilter += ` and areas.id = '${filters.area_id}'`;
  }
  if (!!filters.ramp_id) {
    queryFilter += ` and ramps.id = '${filters.ramp_id}'`;
  }
  if (!!filters.document_number) {
    queryFilter += ` and related_documents.document_number = '${filters.document_number}'`;
  }
  if (!!filters.cargo_type_id) {
    queryFilter += ` and cargo_types.id = '${filters.cargo_type_id}'`;
  }
  if (!!filters.document_date_first) {
    queryFilter += ` and related_documents.document_date_first >= '${getLocalDate(
      filters.document_date_first
    )}'`;
  }
  if (!!filters.document_date_second) {
    queryFilter += ` and related_documents.document_date_second <= '${getLocalDate(
      filters.document_date_second
    )}'`;
  }
  if (!!filters.truck_number) {
    queryFilter += ` and related_documents.truck_number = '${filters.truck_number}'`;
  }
  if (!!filters.semitrailer_number) {
    queryFilter += ` and related_documents.semitrailer_number = '${filters.semitrailer_number}'`;
  }
  if (!!filters.driver_fio) {
    queryFilter += ` and related_documents.driver_fio = '${filters.driver_fio}'`;
  }
  if (!!filters.supplier_id) {
    queryFilter += ` and suppliers.id = '${filters.supplier_id}'`;
  }
  if (!!filters.receiver_id) {
    queryFilter += ` and receivers.id = '${filters.receiver_id}'`;
  }
  if (!!filters.vt_planned_start_time_first) {
    queryFilter += ` and related_documents.vt_planned_start_time >= '${getLocalTime(
      filters.vt_planned_start_time_first
    )}'`;
  }
  if (!!filters.vt_planned_start_time_second) {
    queryFilter += ` and related_documents.vt_planned_start_time <= '${getLocalTime(
      filters.vt_planned_start_time_second
    )}'`;
  }
  if (!!filters.actual_arrival_time_first) {
    queryFilter += ` and related_documents.actual_arrival_time >= '${getLocalTime(
      filters.actual_arrival_time_first
    )}'`;
  }
  if (!!filters.actual_arrival_time_second) {
    queryFilter += ` and related_documents.actual_arrival_time <= '${getLocalTime(
      filters.actual_arrival_time_second
    )}'`;
  }
  if (!!filters.load_planned_start_time_first) {
    queryFilter += ` and related_documents.load_planned_start_time >= '${getLocalTime(
      filters.load_planned_start_time_first
    )}'`;
  }
  if (!!filters.load_planned_start_time_second) {
    queryFilter += ` and related_documents.load_planned_start_time <= '${getLocalTime(
      filters.load_planned_start_time_second
    )}'`;
  }
  if (!!filters.actual_load_start_time_first) {
    queryFilter += ` and related_documents.actual_load_start_time >= '${getLocalTime(
      filters.actual_load_start_time_first
    )}'`;
  }
  if (!!filters.actual_load_start_time_second) {
    queryFilter += ` and related_documents.actual_load_start_time <= '${getLocalTime(
      filters.actual_load_start_time_second
    )}'`;
  }
  if (!!filters.load_planned_finish_time_first) {
    queryFilter += ` and related_documents.load_planned_finish_time >= '${getLocalTime(
      filters.load_planned_finish_time_first
    )}'`;
  }
  if (!!filters.load_planned_finish_time_second) {
    queryFilter += ` and related_documents.load_planned_finish_time <= '${getLocalTime(
      filters.load_planned_finish_time_second
    )}'`;
  }
  if (!!filters.actual_load_finish_time_first) {
    queryFilter += ` and related_documents.actual_load_finish_time >= '${getLocalTime(
      filters.actual_load_finish_time_first
    )}'`;
  }
  if (!!filters.actual_load_finish_time_second) {
    queryFilter += ` and related_documents.actual_load_finish_time <= '${getLocalTime(
      filters.actual_load_finish_time_second
    )}'`;
  }
  if (!!filters.vt_planned_finish_time_first) {
    queryFilter += ` and related_documents.vt_planned_finish_time >= '${getLocalTime(
      filters.vt_planned_finish_time_first
    )}'`;
  }
  if (!!filters.vt_planned_finish_time_second) {
    queryFilter += ` and related_documents.vt_planned_finish_time <= '${getLocalTime(
      filters.vt_planned_finish_time_second
    )}'`;
  }
  if (!!filters.actual_departure_time_first) {
    queryFilter += ` and related_documents.actual_departure_time >= '${getLocalTime(
      filters.actual_departure_time_first
    )}'`;
  }
  if (!!filters.actual_departure_time_second) {
    queryFilter += ` and related_documents.actual_departure_time <= '${getLocalTime(
      filters.actual_departure_time_second
    )}'`;
  }
  if (!!filters.in_the_norm) {
    filtersQuery +=
      " and related_documents.in_the_norm  = '" +
      (filters.in_the_norm == "Да" ? 1 : 0) +
      "'";
  }
  if (!!filters.deviation_from_the_standard_first) {
    queryFilter += ` and related_documents.deviation_from_the_standard >= '${getLocalTime(
      filters.deviation_from_the_standard_first
    )}'`;
  }
  if (!!filters.deviation_from_the_standard_second) {
    queryFilter += ` and related_documents.deviation_from_the_standard <= '${getLocalTime(
      filters.deviation_from_the_standard_second
    )}'`;
  }
  if (!!filters.arrived_on_time) {
    filtersQuery +=
      " and related_documents.arrived_on_time = '" +
      (filters.arrived_on_time == "Да" ? 1 : 0) +
      "'";
  }
  if (!!filters.late_arrival_first) {
    queryFilter += ` and related_documents.late_arrival >= '${getLocalTime(
      filters.late_arrival_first
    )}'`;
  }
  if (!!filters.late_arrival_second) {
    queryFilter += ` and related_documents.late_arrival <= '${getLocalTime(
      filters.late_arrival_second
    )}'`;
  }

  if (!!queryFilter) {
    queryFilter = queryFilter.substr(4, queryFilter.length - 4);
    query += " where " + queryFilter;
  }
  query += ";";
  return query;
};

router.post("/relatedDocuments/get", async (req, res) => {
  try {
    const data = await pool
      .query(getRelatedDocuments(req.body.filters))
      .catch((e) => {
        console.log(e);
      });
    res.json({
      data: data[0],
    });
    // console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

const addRelatedDocument = (obj) => {
  let query = `INSERT INTO related_documents
                (warehouse_id, area_id, 
                ramp_id, document_number, 
                cargo_type_id, document_date,
                truck_number, semitrailer_number, 
                driver_fio, visit_number, 
                vt_planned_start_time, actual_arrival_time,
                load_planned_start_time, actual_load_start_time, 
                load_planned_finish_time, actual_load_finish_time, 
                vt_planned_finish_time, actual_departure_time, 
                in_the_norm, deviation_from_the_standard, 
                arrived_on_time, late_arrival)
                values(${obj.warehouse_id}, ${obj.area_id},
                  ${obj.ramp_id}, ${obj.document_number},
                  ${obj.cargo_type_id}, ${obj.document_date},
                  ${obj.truck_number}, ${obj.semitrailer_number},
                  ${obj.driver_fio}, ${obj.visit_number},
                  ${obj.vt_planned_start_time}, ${obj.actual_arrival_time},
                  ${obj.load_planned_start_time}, ${obj.actual_load_start_time},
                  ${obj.load_planned_finish_time}, ${obj.actual_departure_time},
                  ${obj.in_the_norm}, ${obj.deviation_from_the_standard},
                  ${obj.arrived_on_time}, ${obj.late_arrival}
                );`;
  console.log(query);
  return query;
};

router.post("/relatedDocuments/add", async (req, res) => {
  try {
    console.log(req.body.obj);
    await pool.query(addRelatedDocument(req.body.obj)).catch((e) => {
      console.log(e);
    });
    res.json({
      message: "ok",
    });
    // console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
