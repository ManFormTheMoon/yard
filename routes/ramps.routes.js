const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
var mysql = require("mysql2/promise");
const router = Router();

const urlencodedParser = express.urlencoded({ extended: false });

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});


router.post("/rampsName/get", async (req, res) => {
  try {
    const data = await getRampsName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getRampsName = async() =>{
  let query = "select name_ru from ramps;"
  const result = await pool.query(query);
  return { result: result[0]};
};

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

const addRamp = (values) => {
  let query =
    "insert into ramps(name_ru, stream, blocked, area_id, capacity, unit, autoset, used_for_slot, trasnport_type_id, object_map, orientation, comment) values (";
  query += `"${values.name_ru}", `;
  query += `"${values.stream}", `;
  query += `"${values.blocked}", `;
  query += `"${values.area_id}", `;
  query += `"${!!values.capacity == "" ? 0 : values.capacity}", `;
  query += `"${values.unit}", `;
  query += `"${values.autoset}", `;
  query += `"${values.used_for_slot}", `;
  query += `"${values.trasnport_type_id}", `;
  query += `"${values.object_map}", `;
  query += `"${values.orientation}", `;
  query += `"${values.comment}", `;

  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query);
  return query;
};

router.post("/ramps/add", async (req, res) => {
  try {
    console.log(req.body);
    let gg = 0;
    await pool.query(addRamp(req.body.values)).catch((e) => {
      console.log(e);
      console.log("bad");
      gg = 1;
      return res.send({ message: "bad" });
    });
    if (gg != 1) {
      await console.log("ok");
      await res.json({ message: "ok" });
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    res.json({ message: "bad" });
  }
});

const editRamp = (values) => {
  let query = "update ramps set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `stream = "${values.stream}", `;
  query += `blocked = "${values.blocked}", `;
  query += `area_id = "${values.area_id}", `;
  query += `capacity = "${values.capacity}", `;
  query += `unit = "${values.unit}", `;
  query += `autoset = "${values.autoset}", `;
  query += `used_for_slot = "${values.used_for_slot}", `;
  query += `trasnport_type_id = "${values.trasnport_type_id}", `;
  query += `object_map = "${values.object_map}", `;
  query += `orientation = "${values.orientation}", `;
  query += `comment = "${values.comment}", `;

  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query);
  return query;
};

router.post("/ramps/edit", async (req, res) => {
  try {
    console.log(req.body);
    let gg = 0;
    await pool.query(editRamp(req.body.values)).catch((e) => {
      console.log(e);
      console.log("bad");
      gg = 1;
      return res.send({ message: "bad" });
    });
    if (gg != 1) {
      await console.log("ok");
      await res.json({ message: "ok" });
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    res.json({ message: "bad" });
  }
});

const groupEditRamp = (values, checked, ids) => {
  let query = "update ramps set";
  if (!!checked.name_ru) {
    query += ` name_ru = "", `;
  } else if (!!values.name_ru) {
    query += ` name_ru = "${values.name_ru}", `;
  }
  if (!!checked.stream) {
    query += ` stream = "", `;
  } else if (!!values.stream) {
    query += ` stream = "${values.stream}", `;
  }
  if (values.blocked === 0 || values.blocked === 1) {
    query += ` blocked = ${values.blocked}, `;
  }
  if (!!values.area_id) {
    query += ` area_id = "${values.area_id}", `;
  }
  if (!!checked.capacity) {
    query += ` capacity = 0, `;
  } else if (!!values.capacity) {
    query += ` capacity = ${values.capacity == "" ? 0 : values.capacity}, `;
  }
  if (!!checked.unit) {
    query += ` unit = "", `;
  } else if (!!values.unit) {
    query += ` unit = ${values.unit}, `;
  }
  if (values.autoset === 0 || values.autoset === 1) {
    query += `autoset = ${values.autoset}, `;
  }
  if (values.used_for_slot === 0 || values.used_for_slot === 1) {
    query += `used_for_slot = ${values.used_for_slot}, `;
  }
  if (!!values.trasnport_type_id) {
    query += `trasnport_type_id = ${values.trasnport_type_id}, `;
  }
  if (values.object_map === 0 || values.object_map === 1) {
    query += `object_map = ${values.object_map}, `;
  }
  if (!!checked.orientation) {
    query += ` orientation = "", `;
  } else if (!!values.orientation) {
    query += ` orientation = "${values.orientation}", `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from ramps;";
  }
  query = query.substr(0, query.length - 2);
  query += ` where id in (`;
  for (let i = 0; i < ids.length; i++) {
    query = query + ids[i] + ", ";
  }
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query);
  return query;
};

router.post("/ramps/groupEdit", async (req, res) => {
  try {
    console.log(req.body);
    let gg = 0;
    await pool
      .query(groupEditRamp(req.body.values, req.body.toclear, req.body.ids))
      .catch((e) => {
        console.log(e);
        console.log("bad");
        gg = 1;
        return res.send({ message: "bad" });
      });
    if (gg != 1) {
      await console.log("ok");
      await res.json({ message: "ok" });
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    res.json({ message: "bad" });
  }
});

module.exports = router;
