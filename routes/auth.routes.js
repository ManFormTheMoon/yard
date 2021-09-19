const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var mysql = require("mysql2/promise");
const router = Router();

var a ='0';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "yard",
  password: "Vika08032015",
  waitForConnections: true,
});
const getUser = async (login, password) => {
  const result = await pool.query(
    "select * from users where `login` = '" +
      login +
      "' AND `password` = '" +
      password +
      "';"
  );
  return result[0];
};

router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const data = await getUser(login, password);

    if (data.length == 0) {
      return res.status(400).json({ message: "Неверные данные" });
    }
    console.log(data);
    const token = jwt.sign(
      { userId: data[0].id, userRole: "123" },
      config.get("jwtSecret"),
      { expiresIn: 5000 }
    );
    res.json({
      token,
      userId: data[0].id,
      userRole: "123",
      userName: data[0].first_name,
      userLastName: data[0].last_name,
    });
  } catch (e) {}
});

module.exports = router;
