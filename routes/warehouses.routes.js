const { Router } = require("express");
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

const getWarehousesName = async () => {
  let query = "select name_ru, id from warehouses;";
  console.log(query);
  const result = await pool.query(query);
  return result[0];
};
router.post("/warehouses/getNames", async (req, res) => {
  try {
    const data = await getWarehousesName();
    console.log(data);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
    res.json({ data: data });
  } catch (e) {}
});

module.exports = router;
