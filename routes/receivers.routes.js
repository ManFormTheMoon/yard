const { Router } = require("express");
var mysql = require("mysql2/promise");
const router = Router();
const config = require("config");

const pool = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  database: config.get("database"),
  password: config.get("password"),
  waitForConnections: true,
});

router.post("/receivers/delete", async (req, res) => {
  try {
    console.log(req.body);
    await pool.query(deleteReceivers(req.body.arr)).catch((e) => {
      console.log(e)
      res.json({ message: "bad", error: e.sqlMessage });
    });
    res.json({});
  } catch (e) {}
});

const deleteReceivers = (arr) => {
  let query = "delete from receivers where id in (";
  for (let i = 0; i < arr.length; i++) {
    query += arr[i];
    if (i + 1 != arr.length) {
      query += ", ";
    }
  }
  query += ");";
  return query;
};

const getReceiversNames = async () => {
  const query = `select id, company_name_ru from receivers;`;
  const result = await pool.query(query);
  console.log(result)
  return result[0];
};

router.post("/receivers/getNames", async (req, res) => {
  try {
    const data = await getReceiversNames();
    res.json({
      data: data,
    });
  } catch (e) {}
});

const getReceivers = async (filters, limit, page) => {
  let query =
    "select * from receivers";
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
    "select COUNT(*) from receivers";
  if (!!filtersQuery) {
    queryAll += " where ";
    queryAll += filtersQuery;
  }
  console.log(filtersQuery);
  queryAll += ";";
  const count = await pool.query(queryAll);
  return { result: result[0], count: count[0][0]["COUNT(*)"] };
};

router.post("/receivers/get", async (req, res) => {
  try {
    const data = await getReceivers(
      req.body.filters,
      req.body.limit,
      req.body.page
    );
    res.json({
      data: data,
    });
  } catch (e) {}
});

const addReceiver = (values) => {
  let query = `insert into receivers (company_name_ru,  ${
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

router.post("/receiver/add", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {

      await res.json({ message: "bad", error: "company_name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(addReceiver(req.body.values)).catch((e) => {
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

const getReceiver = async (id) => {
  const query = `select * from receivers where id = ${id};`;
  const response = await pool.query(query);
  console.log(response)
  return response[0];
};

router.post("/receivers/getOne", async (req, res) => {
  try {
    const data = await getReceiver(req.body.id);
    res.json({
      data: data,
    });
  } catch (e) {}
});

const editReceivers= (values) => {
  let query = "update receivers set";
  query += ` company_name_ru = "${values.company_name_ru}", `;
  query += `integration_id = "${values.integration_id}", `;
  query += `comment = "${values.comment}", `;
  query = query.substr(0, query.length - 2);
  query += ` where id = ${values.id};`;
  return query;
};

router.post("/receivers/edit", async (req, res) => {
  try {
    if (!req.body.values.company_name_ru) {
      await res.json({ message: "bad", error: "company_name_ru" });
    } 
    else {
      let gg = 0;
      await pool.query(editReceivers(req.body.values)).catch((e) => {
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



const groupEditReceivers = (values, checked, ids) => {
  let query = "update receivers set";
  if (!!checked.comment) {
    query += ` comment = "", `;
  } else if (!!values.comment) {
    query += ` comment = "${values.comment}", `;
  }
  if (query.substr(query.length - 3, 3) == "set") {
    return "select count(*) from receivers;";
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

router.post("/receivers/groupEdit", async (req, res) => {
  try {
    let gg = 0;
    await pool
      .query(groupEditReceivers(req.body.values, req.body.toclear, req.body.ids))
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

