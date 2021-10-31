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

const getIncomingTypesName = async () => {
  const query = `select id, name_ru from incoming_types;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/incomingTypes/getNames", async (req, res) => {
  try {
    const data = await getIncomingTypesName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getIncomingTypes = async (filters, limit, page) => {
  let query =
    "select incoming_types.id, incoming_types.name_ru, warehouses.name_ru as warehouse_name, incoming_types.autoenter, incoming_types.comment from incoming_types join warehouses on warehouses.id = incoming_types.warehouse_id";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and incoming_types.id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and lower(incoming_types.name_ru) LIKE lower('%" + filters.name_ru + "%')";
  }
  if (!!filters.warehouse_name) {
    filtersQuery += " and warehouses.name_ru = '" + filters.warehouse_name + "'";
  }
  if (!!filters.autoenter) {
    filtersQuery +=
      " and incoming_types.autoenter = '" + (filters.autoenter == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(incoming_types.comment) LIKE lower('%" + filters.comment + "%')";
  }
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY incoming_types.id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {
  });
  let queryAll =
    "select COUNT(*) from incoming_types join warehouses on warehouses.id = incoming_types.warehouse_id";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/incomingTypes/get", async (req, res) => {
  try {
    const data = await getIncomingTypes(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getIncomingType = async (id) => {
  const query = `select incoming_types.id, incoming_types.name_ru, warehouses.name_ru as warehouse_name, incoming_types.autoenter, incoming_types.comment from incoming_types join warehouses on incoming_types.warehouse_id = warehouses.id where incoming_types.id = ${id};`;
  const response = await pool.query(query);
  return response[0];
};

router.post("/incomingTypes/getOne", async (req, res) => {
  try {
    const data = await getIncomingType(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/incomingType/delete", async (req, res) => {
  try {
    await pool.query(deletIncomingTypes(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deletIncomingTypes = (arr) => {
  let query = "delete from incoming_types where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addIncomingType = (values) => {
  let query = `insert into incoming_types(name_ru, warehouse_id, autoenter, comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  }
  query += `"${values.warehouse_id}", `;
  query += `"${values.autoenter}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";

  return query;
};

router.post("/incomingTypes/add", async (req, res) => {
    console.log("va")
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(addIncomingType(req.body.values)).catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
      if (gg != 1) {
        await console.log("ok");
        await res.json({ message: "ok" });
      }
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const editIncomingType = (values) => {
  let query = "update incoming_types set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `warehouse_id = "${values.warehouse_id}", `;;
  query += `autoenter = "${values.autoenter}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  return query;
};

router.post("/incomingTypes/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(editIncomingType(req.body.values)).catch((e) => {
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

const groupEditIncomingType = (values, checked, ids) => {
  let query = "update incoming_types set";
  if (!!values.warehouse_id) {
    query += ` warehouse_id = ${values.warehouse_id}, `;
  }
  if (values.autoenter === 0 || values.autoenter === 1) {
    query += ` autoenter = ${values.autoenter}, `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from incoming_types;";
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

router.post("/incomingTypes/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditIncomingType(req.body.values, req.body.toclear, req.body.ids))
      .catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
    if (gg != 1) {
      await res.json({ message: "ok" });
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

module.exports = router;
