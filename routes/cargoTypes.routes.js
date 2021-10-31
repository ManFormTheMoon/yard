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

const getCargoTypesName = async () => {
  const query = `select id, cargo_name from cargo_types;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/cargoTypes/getNames", async (req, res) => {
  try {
    const data = await getCargoTypesName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCargoTypes = async (filters, limit, page) => {
  let query =
    "select cargo_types.id, cargo_types.cargo_name, areas.name_ru as area_name, cargo_types.integration_id, cargo_types.comment from cargo_types join areas on areas.id = cargo_types.area_id";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and cargo_types.id = '" + filters.id + "'";
  }
  if (!!filters.cargo_name) {
    filtersQuery +=
      " and lower(cargo_types.cargo_name) LIKE lower('%" + filters.cargo_name + "%')";
  }
  if (!!filters.area_name) {
    filtersQuery += " and areas.name_ru = '" + filters.area_name + "'";
  }
  if (!!filters.integration_id) {
    filtersQuery +=
      " and integration_id = '" + filters.integration_id + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(cargo_types.comment) LIKE lower('%" + filters.comment + "%')";
  }
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY cargo_types.id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {
  });
  let queryAll =
    "select COUNT(*) from cargo_types join areas on areas.id = cargo_types.area_id";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/cargoTypes/get", async (req, res) => {
  try {
    const data = await getCargoTypes(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    console.log("req.body.filters")
    console.log(req.body.filters)
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCargoType = async (id) => {
  const query = `select cargo_types.id, cargo_types.cargo_name, areas.id as area_id, areas.name_ru as area_name, cargo_types.integration_id, cargo_types.comment from cargo_types join areas on areas.id = cargo_types.area_id where cargo_types.id = ${id};`;
  const response = await pool.query(query);
  return response[0];
};

router.post("/cargoType/getOne", async (req, res) => {
  try {
    const data = await getCargoType(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/cargoTypes/delete", async (req, res) => {
  try {
    await pool.query(deletCargoTypes(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deletCargoTypes = (arr) => {
  let query = "delete from cargo_types where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addCargoType = (values) => {
  let query = `insert into cargo_types (cargo_name, area_id,  ${
    values.integration_id == "" ? "" : "integration_id,"
  }  comment) values (`;
  if (!!values.cargo_name) {
    query += `"${values.cargo_name}", `;
  }
  query += `"${values.area_id}", `;
  if (!!values.integration_id) query += `"${values.integration_id}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query);
  return query;
};

router.post("/cargoType/add", async (req, res) => {
  try {
    if (!req.body.values.cargo_name) {
      await res.json({ message: "bad", error: "cargo_name" });
    } else {
      let gg = 0;
      await pool.query(addCargoType(req.body.values)).catch((e) => {
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

const editCargoName = (values) => {
  let query = "update cargo_types set";
  query += ` cargo_name = "${values.cargo_name}", `;
  query += `area_id = "${values.area_id}", `;
  query += `integration_id = "${values.integration_id}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query)
  return query;
};

router.post("/cargoType/edit", async (req, res) => {
  try {
    if (!req.body.values.cargo_name) {
      await res.json({ message: "bad", error: "cargo_name" });
    } else {
      let gg = 0;
      await pool.query(editCargoName(req.body.values)).catch((e) => {
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

const groupEdiCargoTypes = (values, checked, ids) => {
  let query = "update cargo_types set";
  if (!!values.area_id) {
    query += ` area_id = ${values.area_id}, `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from cargo_types;";
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

router.post("/cargoTypes/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEdiCargoTypes(req.body.values, req.body.toclear, req.body.ids))
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
