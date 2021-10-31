const { Router } = require("express");
const config = require("config");
var mysql = require("mysql2/promise");
const router = Router();

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

const getCargoTypesName = async () => {
  let query = "select cargo_name, id from cargo_types;";
  const result = await pool.query(query);
  return result[0];
};

router.post("/cargoTypes/getNames", async (req, res) => {
  console.log("Xxxxsdf4resfdxxxxx");
  try {
    const data = await getCargoTypesName();
    console.log(data);
    res.json({ data: data });
  } catch (e) {}
});

module.exports = router;
