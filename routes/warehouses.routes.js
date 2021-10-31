const { Router } = require("express");
const express = require("express");
var mysql = require("mysql2/promise");
const router = Router();
const config = require("config");

const urlencodedParser = express.urlencoded({ extended: false });

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

router.post("/warehouses/delete", async (req, res) => {
  try {
    console.log(req.body);
    await pool.query(deleteWarehouses(req.body.arr)).catch((e) => {
      console.log(e)
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteWarehouses = (arr) => {
  let query = "delete from warehouses where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

  const getWarehousesNames = async () => {
    const query = `select id, name_ru from warehouses;`;
    const result = await pool.query(query);
    return result[0];
  };
  
  router.post("/warehouse/getNames", async (req, res) => {
    try {
      const data = await getWarehousesNames();
      res.json({
        data: data,
      });
    } catch (e) {}
  });


const getWarehouses = async (filters, limit, page) => {
  let query =
    "select * from warehouses";
   let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and name_ru = '" + filters.name_ru + "'";
  }
  if (!!filters.integration_id) {
    filtersQuery +=
      " and integration_id = '" + filters.integration_id + "'";
  }
  if (!!filters.UTC) {
    filtersQuery += " and UTC = '" + filters.UTC + "'";
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
    console.log(e);
  });
  let queryAll =
    "select COUNT(*) from warehouses";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/warehouses/get", async (req, res) => {
  try {
    console.log(req.body.filters)
    const data = await getWarehouses(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    console.log(data)
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getWarehouse = async (id) => {
  const query = `select * from warehouses where warehouses.id = ${id};`;
  console.log(query)
  const response = await pool.query(query);
  return response[0];
};

router.post("/warehouses/getOne", async (req, res) => {
  try {
    const data = await getWarehouse(req.body.id);
    console.log(data)
    res.json({
      data: data,
    });
  } catch (e) {}
});

const addWarehouse = (values) => {
  let query = `insert into warehouses(name_ru, UTC, ${
    values.integration_id == "" ? "" : "integration_id,"
  } comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  } 
  query += `"${!!values.UTC == "" ? 0 : values.UTC}", `;
  if (!!values.integration_id) query += `"${values.integration_id}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  return query;
};

router.post("/warehouses/add", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } 
    else if (!req.body.values.UTC) {
      await res.json({ message: "bad", error: "UTC" });
    } 
    else {
      let gg = 0;
      await pool.query(addWarehouse(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await console.log("ok");
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    console.log(e.sqlMessage);
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const editWarehouse = (values) => {
  let query = "update warehouses set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `UTC = "${values.UTC}", `;
  query += ` integration_id = ${values.integration_id == "" ? "NULL" : values.integration_id}, `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query);
  return query;
};

router.post("/warehouses/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(editWarehouse(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await console.log("ok");
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    console.log(e.sqlMessage);
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const groupEditWarehouse = (values, checked, ids) => {
  let query = "update warehouses set";
  if (!!values.UTC) {
    query += ` UTC = "${values.UTC}", `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from warehouses;";
  }
  query = query.substr(0, query.length - 2);
  query += ` where id in (`;
  for (let i = 0; i < ids.length; i++) {
    query = query + ids[i] + ", ";
  }
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log("query");
  console.log(query);
  return query;
};

router.post("/warehouses/groupEdit", async (req, res) => {
  try {
    console.log(req.body);
    let gg = 0;
    await pool
      .query(groupEditWarehouse(req.body.values, req.body.toclear, req.body.ids))
      .catch((e) => {
        console.log(e);
        console.log("bad");
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
    if (gg != 1) {
      await console.log("ok");
      await res.json({ message: "ok" });
    }
  } catch (e) {
    console.log("bad11");
    console.log(e);
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

module.exports = router;
