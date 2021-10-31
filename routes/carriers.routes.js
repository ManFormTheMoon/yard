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

const getCarriersName = async () => {
  const query = `select id, name_ru from carriers;`;
  const result = await pool.query(query);
  return result[0];
};

router.post("/carriers/getNames", async (req, res) => {
  try {
    const data = await getCarriersName();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCarriers = async (filters, limit, page) => {
  console.log("ddddddddddddddddddddddddd")
  let query =
    "select id, company_name_ru, integration_id, booking_slot, blocked_time, comment from carriers";
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
  if (!!filters.booking_slot) {
    filtersQuery +=
      " and booking_slot = '" + (filters.booking_slot == "Да" ? 1 : 0) + "'";
  }
  if (!!filters.blocked_time) {
    filtersQuery +=
      " and blocked_time = '" + (filters.blocked_time == "Да" ? 1 : 0) + "'";
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
    "select COUNT(*) from carriers";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  queryAll += ";";
  console.log(query)
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/carriers/get", async (req, res) => {
  try {
    const data = await getCarriers(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getCarrier = async (id) => {
  const query = `select id, company_name_ru, integration_id, booking_slot, blocked_time, comment from carriers where id = ${id};`;
  const response = await pool.query(query);console.log(response)
  return response[0];
};

router.post("/carrier/getOne", async (req, res) => {
  try {
    const data = await getCarrier(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

router.post("/carrier/delete", async (req, res) => {
  try {
    await pool.query(deleteCarriers(req.body.arr)).catch((e) => {
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteCarriers = (arr) => {
  let query = "delete from carriers where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const addCarriers = (values) => {
  console.log(values)
  let query = `insert into carriers (company_name_ru, ${ values.integration_id == "" ? "" : "integration_id," } booking_slot, ${ values.blocked_time == "" ? "" : "blocked_time,"} comment) values (`;
  if (!!values.company_name_ru) {
    query += `"${values.company_name_ru}", `;
  }
  if (!!values.integration_id) query += `"${values.integration_id}", `;
  query += `"${values.booking_slot}", `;
  if (!!values.blocked_time) query += `"${values.blocked_time}", `;
  query += `"${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ");";
  console.log(query)
  return query;
};

router.post("/carriers/add", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {
      await res.json({ message: "bad", error: "company_name_ru" });
      
    console.log(req.body.values)
    } else {
      let gg = 0;
      await pool.query(addCarriers(req.body.values)).catch((e) => {
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

const editCarrier = (values) => {
  let query = "update carriers set";
  query += ` company_name_ru = "${values.company_name_ru}", `;
  query += `integration_id = "${values.integration_id}", `;
  query += `booking_slot = "${values.booking_slot}", `;
  query += `blocked_time = "${values.blocked_time}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  console.log(query)
  return query;
};

router.post("/carrier/edit", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {
      await res.json({ message: "bad", error: "company_name_ru" });
    } else {
      let gg = 0;
      await pool.query(editCarrier(req.body.values)).catch((e) => {
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

const groupEditCarriers = (values, checked, ids) => {
  let query = "update carriers set";
  if (values.booking_slot === 0 || values.booking_slot === 1) {
    query += ` booking_slot = ${values.booking_slot}, `;
  }
  if ( values.booking_slot === 0) {
    query += ` blocked_time = NULL, `;
  } else if (!!values.blocked_time) {
    query += ` blocked_time = "${values.blocked_time}", `;
  }
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from carriers;";
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

router.post("/carriers/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditCarriers(req.body.values, req.body.toclear, req.body.ids))
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
