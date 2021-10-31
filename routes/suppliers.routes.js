const { Router, request } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
var mysql = require("mysql2/promise");
const { route, post } = require("./suppliers.routes");
const router = Router();

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});


router.post("/suppliers/delete", async (req, res) => {
  try {
    console.log(req.body);
    await pool.query(deleteSuppliers(req.body.arr)).catch((e) => {
      console.log(e)
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteSuppliers = (arr) => {
  let query = "delete from suppliers where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const getSuppliersNames = async () => {
  const query = `select id, company_name_ru from suppliers;`;
  const result = await pool.query(query);
  console.log(result)
  return result[0];
};

router.post("/suppliers/getNames", async (req, res) => {
  try {
    const data = await getSuppliersNames();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getSuppliers = async (filters, limit, page) => {
  let query =
    "select * from suppliers";
   let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and id = '" + filters.id + "'";
  }
  if (!!filters.company_name_ru) {
    filtersQuery +=
      " and company_name_ru = '" + filters.company_name_ru + "'";
  }
  if (!!filters.integration_id) {
    filtersQuery +=
      " and integration_id = '" + filters.integration_id + "'";
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
    "select COUNT(*) from suppliers";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  console.log(filtersQuery);
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/suppliers/get", async (req, res) => {
  try {
    const data = await getSuppliers(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const addSupplier = (values) => {
  let query = `insert into suppliers (company_name_ru,  ${
    values.integration_id == "" ? "" : "integration_id,"
  } comment) values (`;
  if (!!values.company_name_ru) {
    query += `"${values.company_name_ru}", `;
  }  
  if (!!values.integration_id) query += `"${values.integration_id}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query)
  return query;
};

router.post("/supplier/add", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {

      await res.json({ message: "bad", error: "company_name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(addSupplier(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    console.log(e.sqlMessage)
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const getSupplier = async (id) => {
  const query = `select * from suppliers where id = ${id};`;
  const response = await pool.query(query);
  console.log(response)
  return response[0];
};

router.post("/suppliers/getOne", async (req, res) => {
  try {
    const data = await getSupplier(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

const editSuppliers= (values) => {
  let query = "update suppliers set";
  query += ` company_name_ru = "${values.company_name_ru}", `;
  query += `integration_id = "${values.integration_id}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  return query;
};

router.post("/suppliers/edit", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {
      await res.json({ message: "bad", error: "company_name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(editSuppliers(req.body.values)).catch((e) => {
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



const groupEditSuppliers = (values, checked, ids) => {
  let query = "update suppliers set";
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from suppliers;";
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

router.post("/suppliers/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditSuppliers(req.body.values, req.body.toclear, req.body.ids))
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

