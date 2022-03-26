const { Router, request } = require("express");
const express = require("express");
var mysql = require("mysql2/promise");
const router = Router();
const config = require("config");

const urlencodedParser = express.urlencoded({ extended: false });

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

router.post("/rampSchedules/getAll", async (req, res) => {
  try {
    const data = await getRampSchedulesName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getRampSchedulesName = async () => {
  let query =
    "select id, warehouse_id, area_id, ramp_id, weekday, work_start, work_end, break_quantity, break1_start, break1_end, break2_start, break2_end, break3_start, break3_end, break4_start, break4_end from ramp_schedules;";
  const result = await pool.query(query);
  return result[0];
};

module.exports = router;
