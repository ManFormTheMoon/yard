const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var mysql = require("mysql2/promise");
const router = Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "yard",
  password: "Vika08032015",
  waitForConnections: true,
});

const getRamps = async (filters, limit, page) => {
  let query = "select * from ramps";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and lower(name_ru) LIKE lower('%" + filters.name_ru + "%')";
  }
  if (!!filters.stream) {
    filtersQuery += " and lower(stream) = lower('" + filters.stream + "')";
  }
  if (!!filters.blocked) {
    filtersQuery +=
      " and blocked = '" + (filters.blocked == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.area_id) {
    filtersQuery += " and area_id = '" + filters.area_id + "'";
  }
  if (!!filters.capacity) {
    filtersQuery += " and capacity = '" + filters.capacity + "'";
  }
  if (!!filters.unit) {
    filtersQuery += " and unit = '" + filters.unit + "'";
  }
  if (!!filters.autoset) {
    filtersQuery +=
      " and autoset = '" + (filters.autoset == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.used_for_slot) {
    filtersQuery +=
      " and used_for_slot = '" + (filters.used_for_slot == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.transport_type_id) {
    filtersQuery +=
      " and transport_type_id = '" + filters.transport_type_id + "'";
  }
  if (!!filters.object_map) {
    filtersQuery +=
      " and object_map = '" + (filters.object_map == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.orientation) {
    filtersQuery +=
      " and lower(orientation) = lower('" + filters.orientation + "')";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(comment) LIKE lower('%" + filters.comment + "%')";
  }

  console.log(filtersQuery);
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  console.log(filtersQuery);
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query += " ORDER BY id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  console.log(query);
  const result = await pool.query(query);
  let queryAll = "select COUNT(*) from ramps";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  console.log(queryAll);
  const count = await pool.query(queryAll);
  //console.log(count);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/ramps/get", async (req, res) => {
  try {
    //console.log(req.body);
    const data = await getRamps(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    //console.log(req.body.page);
    res.json({
      data: data,
    });
  } catch (e) {}
});

const deleteRamps = (arr) => {
  let query = "delete from ramps where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  console.log(query);
  pool.query(query);
};

router.post("/ramps/delete", async (req, res) => {
  try {
    console.log(req.body);
    await deleteRamps(req.body.arr);
    res.json({});
  } catch (e) {}
});
module.exports = router;
