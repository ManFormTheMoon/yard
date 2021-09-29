import React, { useState } from "react";

import gridImg from "./../../img/reference-book-buttons/grid.png";
import leftArrowImg from "./../../img/reference-book-buttons/left-arrow.png";
import rightArrowImg from "./../../img/reference-book-buttons/right-arrow.png";
import firstPageArrowImg from "./../../img/reference-book-buttons/first_page_arrow.png";
import lastPageArrowImg from "./../../img/reference-book-buttons/last_page_arrow.png";
import refreshImg from "./../../img/reference-book-buttons/refresh.png";

const FooterNavigation = (props) => {
  const onChangeRowsCountEvent = (event) => {
    props.setInputRowValue(event.target.value);
  };
  return (
    <div
      style={{
        width: "100%",
        borderRadius: " 0 0 3px 3px",
        height: "50px",
        backgroundColor: "#8DA19B",
        display: "flex",
      }}
    >
      <div
        style={{
          marginLeft: "20px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        <img
          src={gridImg}
          style={{ height: "80%", cursor: "pointer" }}
          alt=""
        />
        Столбцы
        <input
          type="number"
          min="0"
          onKeyDown={props.onPagesInputDown}
          value={props.inputRowValue}
          onChange={onChangeRowsCountEvent}
          style={{ width: "50px", marginLeft: "30px" }}
        />
      </div>
      <div
        style={{
          height: "100%",
          marginLeft: "30px",
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
        }}
        onClick={props.onReloadEvent}
      >
        <img
          src={refreshImg}
          style={{ height: "80%", cursor: "pointer" }}
          alt=""
        />
        Обновить
      </div>
      <div
        style={{
          height: "100%",
          marginLeft: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={firstPageArrowImg}
          style={{ height: "60%", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(1);
          }}
        />
        <img
          src={leftArrowImg}
          style={{ height: "60%", marginLeft: "30px", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(Math.max(props.currentPage - 1, 1));
          }}
        />
        Страница
        <input
          style={{ width: "50px", margin: "0px 10px" }}
          type="number"
          value={props.currentPage}
          onChange={(event) => {
            props.setCurrentPage(event.target.value);
          }}
        />
        из{" "}
        {Math.floor(
          (props.totalRows + 1 * props.rowsOnPageCount - 1) /
            (props.rowsOnPageCount * 1)
        )}
        <img
          src={rightArrowImg}
          style={{ height: "60%", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(
              Math.min(
                props.currentPage + 1,
                Math.floor(
                  (props.totalRows + 1 * props.rowsOnPageCount - 1) /
                    (props.rowsOnPageCount * 1)
                )
              )
            );
          }}
        />
        <img
          src={lastPageArrowImg}
          style={{ height: "60%", marginLeft: "30px", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(
              Math.floor(
                (props.totalRows + 1 * props.rowsOnPageCount - 1) /
                  (props.rowsOnPageCount * 1)
              )
            );
          }}
        />
      </div>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          marginLeft: "50px",
        }}
      >
        Отображено записей с{" "}
        {(props.currentPage - 1) * props.rowsOnPageCount + 1} по{" "}
        {Math.min(props.currentPage * props.rowsOnPageCount, props.totalRows)}.
        Всего {props.totalRows}
      </div>
    </div>
  );
};

export default FooterNavigation;
