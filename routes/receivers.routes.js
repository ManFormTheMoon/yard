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

const getReceiversName = async () => {
  let query = "select company_name_ru, id from receivers;";
  const result = await pool.query(query);
  return result[0];
};

router.post("/receivers/getNames", async (req, res) => {
  console.log("xxxxxxxxxxxxxx");
  try {
    const data = await getReceiversName();
    console.log(data);
    res.json({ data: data });
  } catch (e) {}
});

module.exports = router;
