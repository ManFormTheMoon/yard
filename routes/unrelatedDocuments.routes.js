const { Router } = require("express");
const express = require("express");
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

const getLocalDate = (value) => {
  let d = new Date(value);
  console.log(d.toLocaleDateString());
  let arr = d.toLocaleDateString().split(".");
  arr = arr.reverse();
  return arr.join("-");
};

const getLocalTime = (value) => {
  let d = new Date(value);
  console.log(d.toLocaleTimeString());
  return d.toLocaleTimeString();
};

const getUnrelatedDocuments = (filters) => {
  let query = `select 
                unrelated_documents.id,
                unrelated_documents.document_number, 
                warehouses.name_ru as warehouse_name,
                unrelated_documents.warehouse_id,
                cargo_types.cargo_name as cargo_type, 
                unrelated_documents.document_date, 
                unrelated_documents.truck_number, 
                unrelated_documents.semitrailer_number, 
                unrelated_documents.driver_fio, 
                suppliers.company_name_ru as supplier_name, 
                unrelated_documents.supplier_id,
                receivers.company_name_ru as receiver_name 
                from unrelated_documents 
                join warehouses on warehouses.id = unrelated_documents.warehouse_id
                join cargo_types on cargo_types.id = unrelated_documents.cargo_type_id
                join suppliers on suppliers.id = unrelated_documents.supplier_id
                join receivers on receivers.id = unrelated_documents.receiver_id
              `;

  let queryFilter = "";
  if (!!filters.id) {
    queryFilter += ` and unrelated_documents.id = '${filters.id}'`;
  }
  if (!!filters.document_number) {
    queryFilter += ` and unrelated_documents.document_number = '${filters.document_number}'`;
  }
  if (!!filters.warehouse_id) {
    queryFilter += ` and warehouses.id = '${filters.warehouse_id}'`;
  }
  if (!!filters.document_date_first) {
    queryFilter += ` and unrelated_documents.document_date_first >= '${getLocalDate(
      filters.document_date_first
    )}'`;
  }
  if (!!filters.document_date_second) {
    queryFilter += ` and unrelated_documents.document_date_second <= '${getLocalDate(
      filters.document_date_second
    )}'`;
  }
  if (!!filters.cargo_type_id) {
    queryFilter += ` and cargo_types.id = '${filters.cargo_type_id}'`;
  }
  if (!!filters.truck_number) {
    queryFilter += ` and unrelated_documents.truck_number = '${filters.truck_number}'`;
  }
  if (!!filters.semitrailer_number) {
    queryFilter += ` and unrelated_documents.semitrailer_number = '${filters.semitrailer_number}'`;
  }
  if (!!filters.driver_fio) {
    queryFilter += ` and unrelated_documents.driver_fio = '${filters.driver_fio}'`;
  }
  if (!!filters.cargo_type_id) {
    queryFilter += ` and cargo_types.id = '${filters.cargo_type_id}'`;
  }
  if (!!filters.supplier_id) {
    queryFilter += ` and suppliers.id = '${filters.supplier_id}'`;
  }
  if (!!filters.receiver_id) {
    queryFilter += ` and receivers.id = '${filters.receiver_id}'`;
  }
  if (!!queryFilter) {
    queryFilter = queryFilter.substr(4, queryFilter.length - 4);
    query += " where " + queryFilter;
  }
  query += ";";
  return query;
};

router.post("/unrelatedDocuments/get", async (req, res) => {
  try {
    const data = await pool
      .query(getUnrelatedDocuments(req.body.filters))
      .catch((e) => {
        console.log(e);
      });
    res.json({
      data: data[0],
    });
    // console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

const getUnrelatedDocumentOne = (filters) => {
  let query = `select 
                unrelated_documents.id,
                unrelated_documents.warehouse_id,
                warehouses.name_ru as warehouse_name,
                unrelated_documents.cargo_type_id,
                cargo_types.cargo_name as cargo_type, 
                unrelated_documents.document_number, 
                unrelated_documents.document_date, 
                unrelated_documents.truck_number, 
                unrelated_documents.semitrailer_number, 
                unrelated_documents.driver_fio, 
                suppliers.company_name_ru as supplier_name, 
                receivers.company_name_ru as receiver_name 
                from unrelated_documents 
                join warehouses on warehouses.id = unrelated_documents.warehouse_id
                join cargo_types on cargo_types.id = unrelated_documents.cargo_type_id
                join suppliers on suppliers.id = unrelated_documents.supplier_id
                join receivers on receivers.id = unrelated_documents.receiver_id where unrelated_documents.id = ${filters.documentId};
              `;
  return query;
};

router.post("/unrelatedDocuments/getOneForConnect", async (req, res) => {
  try {
    const data = await pool
      .query(getUnrelatedDocumentOne(req.body))
      .catch((e) => {
        console.log(e);
      });
    res.json({
      data: data[0],
    });
    // console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
