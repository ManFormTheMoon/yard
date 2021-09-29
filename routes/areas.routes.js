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
    console.log("xxxx");
    //console.log(data);
  } catch (e) {}
});

module.exports = router;
