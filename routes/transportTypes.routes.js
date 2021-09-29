const { Router } = require("express");
const express = require("express");
var mysql = require("mysql2/promise");
const router = Router();

const urlencodedParser = express.urlencoded({ extended: false });

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "yard",
  password: "ilya13524",
  waitForConnections: true,
});

const getTransportTypesNames = async () => {
  const query = `select id, name_ru from transport_types;`;

  const result = await pool.query(query);

  return result[0];
};

router.post("/transportType/getNames", async (req, res) => {
  try {
    const data = await getTransportTypesNames();
    res.json({
      data: data,
    });
  } catch (e) {}
});

module.exports = router;
