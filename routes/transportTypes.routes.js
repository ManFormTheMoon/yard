const { Router, request } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
var mysql = require("mysql2/promise");
const { route, post } = require("./transportTypes.routes");
const router = Router();

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});


router.post("/transportType/delete", async (req, res) => {
  try {
    console.log(req.body);
    await pool.query(deleteTransportTypes(req.body.arr)).catch((e) => {
      console.log(e)
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteTransportTypes = (arr) => {
  let query = "delete from transport_types where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const getTransportTypesNames = async () => {
  const query = `select id, name_ru from transport_types;`;
  const result = await pool.query(query);
  console.log(result)
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

const getTransportTypes = async (filters, limit, page) => {
  let query =
    "select * from transport_types";
   let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and name_ru = '" + filters.name_ru + "'";
  }
  if (!!filters.capacity) {
    filtersQuery +=
      " and capacity = '" + filters.capacity + "'";
  }
  if (!!filters.unit) {
    filtersQuery += " and unit = '" + filters.unit + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(comment) LIKE lower('%" + filters.comment + "%')";
  }
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {
  });
  let queryAll =
    "select COUNT(*) from transport_types";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/transportTypes/get", async (req, res) => {
  try {
    const data = await getTransportTypes(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const addTransportType = (values) => {
  let query = `insert into transport_types(name_ru, capacity, unit, comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  }  
  query += `"${!!values.capacity == "" ? 0 : values.capacity}", `;
  query += `"${values.unit}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  return query;
};

router.post("/transportType/add", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(addTransportType(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const getTransportType = async (id) => {
  const query = `select * from transport_types where id = ${id};`;
  const response = await pool.query(query);
  return response[0];
};

router.post("/transportTypes/getOne", async (req, res) => {
  try {
    const data = await getTransportType(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

const editTransportTypes= (values) => {
  let query = "update transport_types set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `capacity = "${values.capacity}", `;
  query += `unit = "${values.unit}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  return query;
};

router.post("/transportTypes/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(editTransportTypes(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
  }
});



const groupEditTransportTypes = (values, checked, ids) => {
  let query = "update transport_types set";
  if (!!checked.capacity) {
    query += ` capacity = 0, `;
  } else if (!!values.capacity) {
    query += ` capacity = ${values.capacity == "" ? 0 : values.capacity}, `;
  }
  if (!!checked.unit) {
    query += ` unit = "", `;
  } else if (!!values.unit) {
    query += ` unit = "${values.unit}", `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from transport_types;";
  }
  query = query.substr(0, query.length - 2);
  query += ` where id in (`;
  for (let i = 0; i < ids.length; i++) {
    query = query + ids[i] + ", ";
  }
  query = query.substr(0, query.length - 2);
  query += ");";
  return query;
};

router.post("/transportTypes/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditTransportTypes(req.body.values, req.body.toclear, req.body.ids))
      .catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
    if (gg != 1) {
      await console.log("ok");
      await res.json({ message: "ok" });
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

module.exports = router;

