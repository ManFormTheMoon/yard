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

const deleteSuppliers = (arr) => {
  let query = "delete from suppliers where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  pool.query(query);
};

router.post("/suppliers/delete", async (req, res) => {
  try {
    await deleteSuppliers(req.body.arr);
    res.json({});
  } catch (e) {}
});

router.post("/suppliers/getNames", async (req, res) => {
  try {
    const data = await getSuppliersName();
    res.json({ data: data });
  } catch (e) {}
});

const getSuppliersName = async () => {
  let query = "select company_name_ru from suppliers;";
  const result = await pool.query(query);
  return result[0];
};

module.exports = router;
