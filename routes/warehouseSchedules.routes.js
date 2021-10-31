const { Router, request } = require("express");
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

router.post("/warehouseSchedulesName/get", async (req, res) => {
  try {
    const data = await getWarehouseSchedulesName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getWarehouseSchedulesName = async () => {
  let query = "select id, name_ru from warehouse_schedules;";
  const result = await pool.query(query);
  return { result: result[0] };
};

const getWarehouseSchedules = async (filters, limit, page) => {
  let query =
    "select warehouse_schedules.id, warehouse_schedules.team_name, areas.name_ru as area_name, warehouse_schedules.work_start, warehouse_schedules.break_quantity, warehouse_schedules.break1_start, warehouse_schedules.break1_end, warehouse_schedules.break2_start, warehouse_schedules.break2_end, warehouses.name_ru as warehouse_name, warehouse_schedules.comment from warehouse_schedules join areas on areas.id = warehouse_schedules.area_id join warehouses on warehouses.id = warehouse_schedules.warehouse_id";
  let filtersQuery = "";
  if (!!filters.id) {
    filtersQuery += " and warehouse_schedules.id = '" + filters.id + "'";
  }
  if (!!filters.team_name) {
    filtersQuery +=
      " and lower(warehouse_schedules.team_name) LIKE lower('%" + filters.team_name + "%')";
  }
  if (!!filters.stream) {
    filtersQuery +=
      " and lower(warehouse_schedules.stream) = lower('" + filters.stream + "')";
  }
  if (!!filters.area_name) {
    filtersQuery += " and areas.name_ru = '" + filters.area_name + "'";
  }
  if (!!filters.warehouse_name) {
    filtersQuery += " and warehouses.name_ru = '" + filters.warehouse_name + "'";
  }
  if (!!filters.work_start) {
    filtersQuery +=
      " and warehouse_schedules.work_start = '" + filters.work_start + "'";
  }
  if (!!filters.break_quantity) {
    filtersQuery += " and warehouse_schedules.break_quantity = '" + filters.break_quantity + "'";
  }
  if (!!filters.break1_start) {
    filtersQuery += " and warehouse_schedules.break1_start = '" + filters.break1_start + "'";
  }
  if (!!filters.break1_end) {
    filtersQuery += " and warehouse_schedules.break1_end = '" + filters.break1_end + "'";
  }
  if (!!filters.break2_start) {
    filtersQuery += " and warehouse_schedules.break2_start = '" + filters.break2_start + "'";
  }
  if (!!filters.break2_end) {
    filtersQuery += " and warehouse_schedules.break2_end = '" + filters.break2_end + "'";
  }
  if (!!filters.comment) {
    filtersQuery +=
      " and lower(warehouse_schedules.comment) LIKE lower('%" + filters.comment + "%')";
  }
  console.log(filtersQuery);
  if (!!filtersQuery) {
    filtersQuery = filtersQuery.substr(4, filtersQuery.length - 4);
  }
  if (!!filtersQuery) {
    query += " where ";
    query += filtersQuery;
  }
  query +=
    " ORDER BY warehouse_schedules.id LIMIT " + (page - 1) * limit + ", " + limit + ";";
  const result = await pool.query(query).catch((e) => {
    console.log(e);
  });
  let queryAll =
    "select COUNT(*) from warehouse_schedules join areas on areas.id = warehouse_schedules.area_id join warehouses on warehouses.id = warehouse_schedules.warehouse_id";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/warehouseSchedules/get", async (req, res) => {
  try {
    const data = await getWarehouseSchedules(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getWarehouseSchedule = async (id) => {
  const query = `select warehouse_schedules.id, warehouse_schedules.team_name, warehouse_schedules.area_id, warehouse_schedules.warehouse_id, areas.name_ru as area_name, warehouse_schedules.work_start, warehouse_schedules.break_quantity, warehouse_schedules.break1_start, warehouse_schedules.break1_end, warehouse_schedules.break2_start, warehouse_schedules.break2_end, warehouses.name_ru as warehouse_name, warehouse_schedules.comment from warehouse_schedules join areas on areas.id = warehouse_schedules.area_id join warehouses on warehouses.id = warehouse_schedules.warehouse_id where warehouse_schedules.id = ${id};`;
  const response = await pool.query(query);
  console.log(query)
  return response[0];
};

router.post("/warehouseSchedules/getOne", async (req, res) => {
  try {
    console.log(req.body.id)
    const data = await getWarehouseSchedule(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/warehouseSchedules/delete", async (req, res) => {
  try {
    console.log(req.body);
    await pool.query(deleteWarehouseSchedules(req.body.arr)).catch((e) => {
      console.log(e)
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteWarehouseSchedules = (arr) => {
  let query = "delete from warehouse_schedules where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};


const addWarehouseSchedules = (values) => {
  let query = `insert into warehouse_schedules(team_name, area_id, warehouse_id, work_start, break_quantity, 
    ${
      values.break1_start == "" ? "" : "break1_start,"
    } 
     break1_end, break2_start, break2_end, comment ) values (`;
  if (!!values.team_name) {
    query += `"${values.team_name}", `;
  }
  query += `"${values.area_id}", `;
  query += `"${values.warehouse_id}", `;
  query += `"${values.work_start}", `;
  query += `"${values.break_quantity}", `;
  query += `"${values.break1_start}", `;
  query += `"${values.break1_end}", `;
  query += `"${values.break2_start}", `;
  query += `"${values.break2_end}", `;
  query += `"${values.comment}", `;

  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query);
  return query;
};

router.post("/warehouseSchedules/add", async (req, res) => {
  try {
    if (!req.body.values.team_name) {
      console.log("bad");
      await res.json({ message: "bad", error: "team_name" });
    } else if (!req.body.values.break1_end || !req.body.values.break1_start || ((!req.body.values.break2_end || !req.body.values.break2_start) & req.body.values.break_quantity == 2)) {
      await res.json({ message: "bad", error: "time" });
    } else {
      let gg = 0;
      await pool.query(addWarehouseSchedules(req.body.values)).catch((e) => {
        console.log(e);
        console.log("bad");
        console.log(e.sqlMessage);
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

const editWarehouseSchedule = (values) => {
  let query = "update warehouse_schedules set";
  query += ` team_name = "${values.team_name}", `;
  query += `area_id = "${values.area_id}", `;
  query += `warehouse_id = "${values.warehouse_id}", `;
  query += `work_start = "${values.work_start}", `;
  query += `break_quantity = "${values.break_quantity}", `;
  query += `break1_start = "${values.break1_start}", `;
  query += `break1_end = "${values.break1_end}", `;

  if (values.break_quantity == 1) {
    query += ` break2_start = "", `;
  } else {
    query += ` break2_start = ${values.break2_start}, `;
  }
  if (values.break_quantity == 1) {
    query += ` break2_end = "", `;
  } else {
    query += ` break2_end = ${values.break2_end}, `;
  };
  query += `comment = "${values.comment}", `;

  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query);
  return query;
};

router.post("/warehouseSchedules/edit", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.values.team_name) {
      console.log("bad");
      await res.json({ message: "bad", error: "team_name" });
    } else {
      let gg = 0;
      await pool.query(editWarehouseSchedule(req.body.values)).catch((e) => {
        console.log(e);
        console.log("bad");
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
    res.json({ message: "bad", error: e.sqlMessage });
  }
});

const groupEditRamp = (values, checked, ids) => {
  let query = "update warehouse_schedules set";
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = ${values.comment}, `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from warehouse_schedules;";
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

router.post("/warehouseSchedules/groupEdit", async (req, res) => {
  try {
    console.log(req.body);
    let gg = 0;
    await pool
      .query(groupEditRamp(req.body.values, req.body.toclear, req.body.ids))
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
