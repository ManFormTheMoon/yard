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

const getParckingsName = async () => {
  const query = `select id, name_ru from parckings;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/parckings/getNames", async (req, res) => {
  try {
    const data = await getParckingsName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getParckings = async (filters, limit, page) => {
  let query =
    "select parckings.id, parckings.name_ru, warehouses.name_ru as warehouse_name, parckings.type, parckings.capacity_length, parckings.capacity_width, parckings.main, parckings.autoreserve, parckings.comment from parckings join warehouses on warehouses.id = parckings.warehouse_id";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and parckings.id = '" + filters.id + "'";
  }
  console.log('234567')
  if (!!filters.name_ru) {
    filtersQuery +=
      " and lower(parckings.name_ru) LIKE lower('%" + filters.name_ru + "%')";
  }
  if (!!filters.warehouse_name) {
    filtersQuery += " and warehouses.name_ru = '" + filters.warehouse_name + "'";
  }
  if (!!filters.type) {
    filtersQuery += " and parckings.type = '" + filters.type + "'";
  }
  if (!!filters.capacity_width) {
    filtersQuery += " and parckings.capacity_width = '" + filters.capacity_width + "'";
  }
  if (!!filters.capacity_length) {
    filtersQuery += " and parckings.capacity_length = '" + filters.capacity_length + "'";
  }
  if (!!filters.main) {
    filtersQuery +=
      " and parckings.main = '" + (filters.main == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.autoreserve) {
    filtersQuery +=
      " and parckings.autoreserve = '" + (filters.autoreserve == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(parckings.comment) LIKE lower('%" + filters.comment + "%')";
  }
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY parckings.id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {
  });
  let queryAll =
    "select COUNT(*) from parckings join warehouses on warehouses.id = parckings.warehouse_id";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  console.log(query)
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/parckings/get", async (req, res) => {
  try {
    const data = await getParckings(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getParcking = async (id) => {
    console.log(id)
  const query = `select parckings.id, parckings.name_ru, warehouses.id as warehouse_id, warehouses.name_ru as warehouse_name, parckings.type, parckings.capacity_length, parckings.capacity_width, parckings.main, parckings.autoreserve, parckings.comment from parckings join warehouses on warehouses.id = parckings.warehouse_id where parckings.id = ${id};`;
  const response = await pool.query(query);
  console.log(response[0])
  return response[0];
};

router.post("/parckings/getOne", async (req, res) => {
  try {
    const data = await getParcking(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/parcking/delete", async (req, res) => {
  try {
    await pool.query(deletParckings(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deletParckings = (arr) => {
  let query = "delete from parckings where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addParcking = (values) => {
  let query = `insert into parckings (name_ru, warehouse_id, type, capacity_length, capacity_width, main, autoreserve, comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  }
  query += `"${values.warehouse_id}", `;
  query += `"${values.type}", `;
  query += `"${values.capacity_length}", `;
  query += `"${values.capacity_width}", `;
  query += `"${values.main}", `;
  query += `"${values.autoreserve}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query)
  return query;
};

router.post("/parckings/add", async (req, res) => {
    console.log(req.body.values)
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(addParcking(req.body.values)).catch((e) => {
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
    console.log(e.sqlMessage)
  }
});

const editParcking = (values) => {
  let query = "update parckings set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `warehouse_id = "${values.warehouse_id}", `;
  query += `type = "${values.type}", `;
  query += `capacity_length = "${values.capacity_length}", `;
  query += `capacity_width = "${values.capacity_width}", `;
  query += `main = "${values.main}", `;
  query += `autoreserve = "${values.autoreserve}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query)
  return query;
};

router.post("/parckings/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(editParcking(req.body.values)).catch((e) => {
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

const groupEditParckings = (values, checked, ids) => {
  let query = "update parckings set";
  if (!!values.warehouse_id) {
    query += ` warehouse_id = ${values.warehouse_id}, `;
  }
  if (!!checked.type) {
    query += ` type = "", `;
  } else if (!!values.type) {
    query += ` type = "${values.type}", `;
  }
  if (!!checked.capacity_width) {
    query += ` capacity_width = "", `;
  } else if (!!values.capacity_width) {
    query += ` capacity_width = ${values.capacity_width}, `;
  }
  if (!!checked.capacity_length) {
    query += ` capacity_length = "", `;
  } else if (!!values.capacity_length) {
    query += ` capacity_length = ${values.capacity_length}, `;
  }
  if (values.main === 0 || values.main === 1) {
    query += ` main = ${values.main}, `;
  }
  if (values.autoreserve === 0 || values.autoreserve === 1) {
    query += ` autoreserve = ${values.autoreserve}, `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from parckings;";
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

router.post("/parckings/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditParckings(req.body.values, req.body.toclear, req.body.ids))
      .catch((e) => {
        gg = 1;
        return res.send({ message: "bad", error: e.sqlMessage });
      });
    if (gg != 1) {
      await res.json({ message: "ok" });
    }
  } catch (e) {
    res.json({ message: "bad", error: e.sqlMessage });
    console.log(e.sqlMessage)
  }
});

module.exports = router;
