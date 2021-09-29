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

  const deleteWarehouse = (arr) => {
    let query = "delete from warehouses where id in (";
    for (let i = 0; i < arr.length; i++) {
      query += arr[i];
      if (i + 1 != arr.length) {
        query += ", ";
      }
    }
    query += ");";
    pool.query(query);
  };
  
  router.post("/warehouses/delete", async (req, res) => {
    try {
      await deleteWarehouse(req.body.arr);
      res.json({});
    } catch (e) {}
  });
  

router.post("/warehousesName/get"), async (res, req) =>{
    try{
        const data= await getWarehousesName()
        res.json({});
    } catch (e) {}
};

const getWarehousesName = async() => {
    let query ="select name_ru from warehouses:"
    const result = await pool.query(query);
    return { result: result[0] }
};
