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

// router.post("/rampsName/get", async (req, res) => {
//   try {
//     const data = await getRampsName();
//     res.json({
//       data: data,
//     });
//   } catch (e) {}
// });

// const getRampsName = async () => {
//   let query = "select name_ru from ramps;";
//   const result = await pool.query(query);
//   return { result: result[0] };
// };

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

const getTimeSlots = (filters) => {
  let query = `select time_slots_result.id,
               time_slots_result.visit_number, 
               time_slots_result.slot_start_date, 
               time_slots_result.vt_planned_start_time, 
               time_slots_result.load_planned_start_time, 
               time_slots_result.load_planned_finish_time, 
               time_slots_result.vt_planned_finish_time, 
               time_slots_result.planned_arrival_time, 
               time_slots_result.planned_departure_time, 
               time_slots_result.use_break,
               warehouses.name_ru as warehouse_name,
               areas.name_ru as area_name, 
               ramps.name_ru as ramp_name, 
               time_slots_result.stream, 
               time_slots_result.route_number,
               time_slots_result.invoice_number,
               time_slots_result.status,
               time_slots_result.actual_arrival_time,
               time_slots_result.actual_load_start_time,
               time_slots_result.actual_load_finish_time,
               time_slots_result.actual_departure_time,
               time_slots_result.visit_time,
               time_slots_result.gate2gate,
               time_slots_result.cargo,
               time_slots_result.q_ty,
               time_slots_result.unit,
               time_slots_result.truck_type,
               time_slots_result.truck_number,
               time_slots_result.trailer_number,
               time_slots_result.driver_fio,
               time_slots_result.driver_number,
               time_slots_result.fleet,
               time_slots_result.carrier_name
               from time_slots_result
               join areas on areas.id = time_slots_result.area_id
               join ramps on ramps.id = time_slots_result.ramp_id
               join warehouses on warehouses.id = time_slots_result.warehouse_id
               `;

  let queryFilter = "";
  if (!!filters.id) {
    queryFilter += ` and time_slots_result.id = '${filters.id}'`;
  }
  if (!!filters.visit_number) {
    queryFilter += ` and time_slots_result.visit_number = '${filters.visit_number}'`;
  }
  if (!!filters.slot_start_date_first) {
    queryFilter += ` and time_slots_result.slot_start_date >= '${getLocalDate(
      filters.slot_start_date_first
    )}'`;
  }
  if (!!filters.slot_start_date_second) {
    queryFilter += ` and time_slots_result.slot_start_date <= '${getLocalDate(
      filters.slot_start_date_second
    )}'`;
  }
  if (!!filters.vt_planned_start_time_first) {
    queryFilter += ` and time_slots_result.vt_planned_start_time >= '${getLocalTime(
      filters.vt_planned_start_time_first
    )}'`;
  }
  if (!!filters.vt_planned_start_time_second) {
    queryFilter += ` and time_slots_result.vt_planned_start_time <= '${getLocalTime(
      filters.vt_planned_start_time_second
    )}'`;
  }
  if (!!filters.load_planned_start_time_first) {
    queryFilter += ` and time_slots_result.load_planned_start_time >= '${getLocalTime(
      filters.load_planned_start_time_first
    )}'`;
  }
  if (!!filters.load_planned_start_time_second) {
    queryFilter += ` and time_slots_result.load_planned_start_time <= '${getLocalTime(
      filters.load_planned_start_time_second
    )}'`;
  }
  if (!!filters.load_planned_finish_time_first) {
    queryFilter += ` and time_slots_result.load_planned_finish_time >= '${getLocalTime(
      filters.load_planned_finish_time_first
    )}'`;
  }
  if (!!filters.load_planned_finish_time_second) {
    queryFilter += ` and time_slots_result.load_planned_finish_time <= '${getLocalTime(
      filters.load_planned_finish_time_second
    )}'`;
  }
  if (!!filters.vt_planned_finish_time_first) {
    queryFilter += ` and time_slots_result.vt_planned_finish_time >= '${getLocalTime(
      filters.vt_planned_finish_time_first
    )}'`;
  }
  if (!!filters.vt_planned_finish_time_second) {
    queryFilter += ` and time_slots_result.vt_planned_finish_time <= '${getLocalTime(
      filters.vt_planned_finish_time_second
    )}'`;
  }
  if (!!filters.planned_arrival_time_first) {
    queryFilter += ` and time_slots_result.planned_arrival_time >= '${getLocalTime(
      filters.planned_arrival_time_first
    )}'`;
  }
  if (!!filters.planned_arrival_time_second) {
    queryFilter += ` and time_slots_result.planned_arrival_time <= '${getLocalTime(
      filters.planned_arrival_time_second
    )}'`;
  }
  if (!!filters.planned_departure_time_first) {
    queryFilter += ` and time_slots_result.planned_departure_time <= '${getLocalTime(
      filters.planned_departure_time_first
    )}'`;
  }
  if (!!filters.planned_departure_time_second) {
    queryFilter += ` and time_slots_result.planned_departure_time <= '${getLocalTime(
      filters.planned_departure_time_second
    )}'`;
  }
  if (!!filters.use_break) {
    queryFilter += ` and time_slots_result.use_break = '${
      filters.use_break == "Да" ? 1 : 0
    }'`;
  }
  if (!!filters.area_id) {
    queryFilter += ` and areas.id = '${filters.area_id}'`;
  }
  if (!!filters.ramp_id) {
    queryFilter += ` and ramps.id = '${filters.ramp_id}'`;
  }
  if (!!filters.warehouse_id) {
    queryFilter += ` and warehouses.id = '${filters.warehouse_id}'`;
  }
  if (!!filters.stream) {
    queryFilter += ` and time_slots_result.stream = '${
      filters.stream == "Input" ? 1 : 0
    }'`;
  }
  if (!!filters.route_number) {
    queryFilter += ` and time_slots_result.route_number = '${filters.route_number}'`;
  }
  if (!!filters.invoice_number) {
    queryFilter += ` and time_slots_result.invoice_number = '${filters.invoice_number}'`;
  }
  if (!!filters.status) {
    queryFilter += ` and time_slots_result.status = '${filters.status}'`;
  }
  if (!!filters.actual_arrival_time_first) {
    queryFilter += ` and time_slots_result.actual_arrival_time >= '${getLocalTime(
      filters.actual_arrival_time_first
    )}'`;
  }
  if (!!filters.actual_arrival_time_second) {
    queryFilter += ` and time_slots_result.actual_arrival_time <= '${getLocalTime(
      filters.actual_arrival_time_second
    )}'`;
  }
  if (!!filters.actual_load_start_time_first) {
    queryFilter += ` and time_slots_result.actual_load_start_time >= '${getLocalTime(
      filters.actual_load_start_time_first
    )}'`;
  }
  if (!!filters.actual_load_start_time_second) {
    queryFilter += ` and time_slots_result.actual_load_start_time <= '${getLocalTime(
      filters.actual_load_start_time_second
    )}'`;
  }
  if (!!filters.actual_load_finish_time_first) {
    queryFilter += ` and time_slots_result.actual_load_finish_time >= '${getLocalTime(
      filters.actual_load_finish_time_first
    )}'`;
  }
  if (!!filters.actual_load_finish_time_second) {
    queryFilter += ` and time_slots_result.actual_load_finish_time <= '${getLocalTime(
      filters.actual_load_finish_time_second
    )}'`;
  }
  if (!!filters.actual_departure_time_first) {
    queryFilter += ` and time_slots_result.actual_departure_time >= '${getLocalTime(
      filters.actual_departure_time_first
    )}'`;
  }
  if (!!filters.actual_departure_time_second) {
    queryFilter += ` and time_slots_result.actual_departure_time <= '${getLocalTime(
      filters.actual_departure_time_second
    )}'`;
  }
  if (!!filters.visit_time_first) {
    queryFilter += ` and time_slots_result.visit_time >= '${getLocalTime(
      filters.visit_time_first
    )}'`;
  }
  if (!!filters.visit_time_second) {
    queryFilter += ` and time_slots_result.visit_time <= '${getLocalTime(
      filters.visit_time_second
    )}'`;
  }
  if (!!filters.cargo) {
    queryFilter += ` and time_slots_result.cargo = '${filters.cargo}'`;
  }
  if (!!filters.q_ty) {
    queryFilter += ` and time_slots_result.q_ty = '${filters.q_ty}'`;
  }
  if (!!filters.unit) {
    queryFilter += ` and time_slots_result.unit = '${filters.unit}'`;
  }
  if (!!filters.truck_type) {
    queryFilter += ` and time_slots_result.truck_type = '${filters.truck_type}'`;
  }
  if (!!filters.truck_number) {
    queryFilter += ` and time_slots_result.truck_number = '${filters.truck_number}'`;
  }
  if (!!filters.trailer_number) {
    queryFilter += ` and time_slots_result.trailer_number = '${filters.trailer_number}'`;
  }
  if (!!filters.driver_fio) {
    queryFilter += ` and time_slots_result.driver_fio = '${filters.driver_fio}'`;
  }
  if (!!filters.driver_number) {
    queryFilter += ` and time_slots_result.driver_number = '${filters.driver_number}'`;
  }
  if (!!filters.fleet) {
    queryFilter += ` and time_slots_result.fleet = '${filters.fleet}'`;
  }
  if (!!filters.carrier_name) {
    queryFilter += ` and time_slots_result.carrier_name = '${filters.carrier_name}'`;
  }
  /*if (!!filters.coupon_number) {
    queryFilter += ` and time_slots_result.coupon_number = '${filters.coupon_number}'`;
  }*/
  if (!!queryFilter) {
    queryFilter = queryFilter.substr(4, queryFilter.length - 4);
    query += " where " + queryFilter;
  }
  query += ";";
  console.log(query);
  return query;
};

router.post("/get", async (req, res) => {
  try {
    console.log(req.body);
    const data = await pool.query(getTimeSlots(req.body.filters)).catch((e) => {
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

const buildCargoIdsString = async (cargo) => {
  let query = `select area_id from cargo_types_and_areas where cargo_type_id = ${cargo};`;
  const data = await pool.query(query);
  console.log(data[0][0]);
  console.log("ff");
  let str = "(-1, ";
  for (let i = 0; i < data[0].length; i++) {
    str += data[0][i].area_id + ", ";
  }
  str = str.substring(0, str.length - 2);
  str += ")";
  console.log(str);
  return str;
};

const getTimeSlotsForUnrelatedDocuments = async (filters) => {
  let query1 = `select area_id from cargo_types_and_areas where cargo_type_id = ${filters.cargo};`;
  const data = await pool.query(query1).catch((e) => {
    console.log(e);
  });
  console.log(data[0][0]);
  console.log("ff");
  let str = "(-1, ";
  for (let i = 0; i < data[0].length; i++) {
    str += data[0][i].area_id + ", ";
  }
  str = str.substring(0, str.length - 2);
  str += ")";
  console.log(str);
  let query = `select time_slots_result.id,
                time_slots_result.visit_number, 
                time_slots_result.slot_start_date, 
                time_slots_result.vt_planned_start_time, 
                time_slots_result.load_planned_start_time, 
                time_slots_result.load_planned_finish_time, 
                time_slots_result.vt_planned_finish_time, 
                time_slots_result.planned_arrival_time, 
                time_slots_result.planned_departure_time, 
                time_slots_result.use_break,
                time_slots_result.warehouse_id,
                time_slots_result.area_id,
                time_slots_result.ramp_id,
                warehouses.name_ru as warehouse_name,
                areas.name_ru as area_name, 
                ramps.name_ru as ramp_name, 
                time_slots_result.stream, 
                time_slots_result.route_number,
                time_slots_result.invoice_number,
                time_slots_result.status,
                time_slots_result.actual_arrival_time,
                time_slots_result.actual_load_start_time,
                time_slots_result.actual_load_finish_time,
                time_slots_result.actual_departure_time,
                time_slots_result.visit_time,
                time_slots_result.gate2gate,
                time_slots_result.cargo,
                time_slots_result.q_ty,
                time_slots_result.unit,
                time_slots_result.truck_type,
                time_slots_result.truck_number,
                time_slots_result.trailer_number,
                time_slots_result.driver_fio,
                time_slots_result.driver_number,
                time_slots_result.fleet,
                time_slots_result.carrier_name
                from time_slots_result
                join areas on areas.id = time_slots_result.area_id
                join ramps on ramps.id = time_slots_result.ramp_id
                join warehouses on warehouses.id = time_slots_result.warehouse_id
                where time_slots_result.area_id in ${str} and
                time_slots_result.stream = '${filters.stream}' and 
                time_slots_result.slot_start_date >= '${filters.documentDate}';
               `;

  console.log(query);
  return query;
};

router.post("/getForUnrelatedDocuments", async (req, res) => {
  try {
    console.log(req.body);
    console.log("df");
    const data = await pool
      .query(await getTimeSlotsForUnrelatedDocuments(req.body))
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

module.exports = router;
