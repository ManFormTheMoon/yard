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

const getAreasName = async () => {
  const query = `select id, name_ru from areas;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/areas/getNames", async (req, res) => {
  try {
    const data = await getAreasName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getAreasNameAndIds = async () => {
  const query = `select id, name_ru, warehouse_id from areas;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/areas/getNamesAndIds", async (req, res) => {
  try {
    const data = await getAreasNameAndIds();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getAreas = async (filters, limit, page) => {
  let query =
    "select areas.id, areas.name_ru, warehouses.name_ru as warehouse_name, areas.object_map, areas.comment from areas join warehouses on warehouses.id = areas.warehouse_id";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and areas.id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and lower(areas.name_ru) LIKE lower('%" + filters.name_ru + "%')";
  }
  if (!!filters.warehouse_name) {
    filtersQuery +=
      " and warehouses.name_ru = '" + filters.warehouse_name + "'";
  }
  if (!!filters.object_map) {
    filtersQuery +=
      " and areas.object_map = '" + (filters.object_map == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(areas.comment) LIKE lower('%" + filters.comment + "%')";
  }
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY areas.id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {});
  let queryAll =
    "select COUNT(*) from areas join warehouses on warehouses.id = areas.warehouse_id";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/areas/get", async (req, res) => {
  try {
    const data = await getAreas(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getArea = async (id) => {
  const query = `select areas.id, areas.name_ru, warehouses.name_ru as warehouse_name, areas.object_map, areas.comment from areas join warehouses on areas.warehouse_id = warehouses.id where areas.id = ${id};`;
  const response = await pool.query(query);
  return response[0];
};

router.post("/areas/getOne", async (req, res) => {
  try {
    const data = await getArea(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/area/delete", async (req, res) => {
  try {
    await pool.query(deletAreas(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deletAreas = (arr) => {
  let query = "delete from areas where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addArea = (values) => {
  let query = `insert into areas(name_ru, warehouse_id, object_map, comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  }
  query += `"${values.warehouse_id}", `;
  query += `"${values.object_map}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  return query;
};

router.post("/areas/add", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(addArea(req.body.values)).catch((e) => {
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

const editArea = (values) => {
  let query = "update areas set";
  query += ` name_ru = "${values.name_ru}", `;
  query += `warehouse_id = "${values.warehouse_id}", `;
  query += `object_map = "${values.object_map}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  return query;
};

router.post("/areas/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(editArea(req.body.values)).catch((e) => {
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

const groupEditArea = (values, checked, ids) => {
  let query = "update areas set";
  if (!!values.warehouse_id) {
    query += ` warehouse_id = ${values.warehouse_id}, `;
  }
  if (values.object_map === 0 || values.object_map === 1) {
    query += ` object_map = ${values.object_map}, `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from areas;";
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

router.post("/areas/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditArea(req.body.values, req.body.toclear, req.body.ids))
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
