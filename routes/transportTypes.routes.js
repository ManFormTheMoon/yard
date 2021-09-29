const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
var mysql = require("mysql2/promise");
const { route, post } = require("./ramps.routes");
const router = Router();

const pool = mysql.createPool({
    host: config.get("host"),
    user: config.get("user"),
    database: config.get("database"),
    password: config.get("password"),
    waitForConnections: true,
  });

  router.post("/transportTypes/delete"), async (req, res) => {
      try{
          await deleteTransportTypes(req.data.arr);
          res.json({}) 
      } catch (e) {}
  };

  const deleteTransportTypes = (arr) =>{
    let query = "delete from transport_types where id in (";
    for (let i = 0; i < arr.length; i++) {
      query += arr[i];
      if (i + 1 != arr.length) {
        query += ", ";
      }
    }
    query += ");";
    pool.query(query);
  };
