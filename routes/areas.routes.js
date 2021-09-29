const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
var mysql = require("mysql2/promise");
const { route } = require("./ramps.routes");
const router = Router();

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

const getAreasNames = async () => {
  const query = `select id, name_ru from areas;`;

  const result = await pool.query(query);

  return result[0];
};

router.post("/areas/getNames", async (req, res) => {
  try {
    const data = await getAreasNames();
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/areas/delete"),
  async (req, res) => {
    try {
      await deleteArears(req.body.arr);
      res.json({});
    } catch (e) {}
  };

const deleteArears = (arr) => {
  let query = "delete from areas where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  pool.query(query);
};

module.exports = router;
