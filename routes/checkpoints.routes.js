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

const getCheckpointsName = async () => {
  const query = `select id, name_ru from checkpoints;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/checkpoints/getNames", async (req, res) => {
  try {
    const data = await getCheckpointsName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCheckpoints = async (filters, limit, page) => {
  let query =
    "select id, name_ru, integration_id, object_map, comment from checkpoints";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and id = '" + filters.id + "'";
  }
  if (!!filters.name_ru) {
    filtersQuery +=
      " and lower(name_ru) LIKE lower('%" + filters.name_ru + "%')";
  }
  if (!!filters.integration_id) {
    filtersQuery += " and integration_id = '" + filters.integration_id + "'";
  }
  if (!!filters.object_map) {
    filtersQuery +=
      " and object_map = '" + (filters.object_map == "Да" ? 1 : 0) + "'";
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
    "select COUNT(*) from checkpoints";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/checkpoints/get", async (req, res) => {
  try {
    const data = await getCheckpoints(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCheckpointOne = async (id) => {
  const query = `select id, name_ru, integration_id, object_map, comment from checkpoints where id = ${id};`;
  const response = await pool.query(query);
  return response[0];
};

router.post("/checkpoint/getOne", async (req, res) => {
  try {
    const data = await getCheckpointOne(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/checkpoint/delete", async (req, res) => {
  try {
    await pool.query(deleteCheckpoints(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteCheckpoints = (arr) => {
  let query = "delete from checkpoints where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addCheckpoint = (values) => {
  let query = `insert into checkpoints (name_ru,  ${
    values.integration_id == "" ? "" : "integration_id,"
  } object_map, comment) values (`;
  if (!!values.name_ru) {
    query += `"${values.name_ru}", `;
  }
  if (!!values.integration_id) query += `"${values.integration_id}", `;
  query += `"${values.object_map}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  return query;
};

router.post("/checkpoints/add", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
      
    console.log(req.body.values)
    } else {
      let gg = 0;
      await pool.query(addCheckpoint(req.body.values)).catch((e) => {
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
    console.log(e)
  }
});

const editCheckpoint = (values) => {
  let query = "update checkpoints set";
  query += ` name_ru = "${values.name_ru}", `;
  query += ` integration_id = ${values.integration_id == "" ? "NULL" : values.integration_id}, `;
  query += `object_map = "${values.object_map}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query)
  return query;
};

router.post("/checkpoint/edit", async (req, res) => {
  try {
    if (!req.body.values.name_ru) {
      await res.json({ message: "bad", error: "name_ru" });
    } else {
      let gg = 0;
      await pool.query(editCheckpoint(req.body.values)).catch((e) => {
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

const groupEditCheckpoint = (values, checked, ids) => {
  let query = "update checkpoints set";
  if (values.object_map === 0 || values.object_map === 1) {
    query += ` object_map = ${values.object_map}, `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from checkpoints;";
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

router.post("/checkpoints/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditCheckpoint(req.body.values, req.body.toclear, req.body.ids))
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
