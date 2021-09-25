import React from "react";

import gridImg from "./../../img/reference-book-buttons/grid.png";
import leftArrowImg from "./../../img/reference-book-buttons/left-arrow.png";
import rightArrowImg from "./../../img/reference-book-buttons/right-arrow.png";
import firstPageArrowImg from "./../../img/reference-book-buttons/first_page_arrow.png";
import lastPageArrowImg from "./../../img/reference-book-buttons/last_page_arrow.png";
import refreshImg from "./../../img/reference-book-buttons/refresh.png";

import { dictinary } from "../../dictinary/dictinary";

const FooterNavigation = (props) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: " 0 0 3px 3px",
        height: "40px",
        backgroundColor: "#8DA19B",
        display: "flex",
        fontSize: "1vw",
      }}
    >
      <div
        style={{
          marginLeft: "20px",
          width: "30%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={gridImg}
          style={{ height: "70%",
          width: "auto",
          cursor: "pointer" }}
          alt=""
        />
        <div 
          style={{
            color:"#FFFFFF",
            marginLeft: "6px",
          }}
          >
        {dictinary.column.ru}
        </div>
        <input
          onKeyDown={props.onPagesInputDown}
          style={{ width: "50px",
          marginLeft: "35px" }}
        />
      </div>
      <div
        style={{
          // gap: "10px",
          height: "100%",
          marginLeft: "20px",
          width: "20%",
          display: "flex",
          alignItems: "center",
        }}
        onClick={props.onReloadEvent}
      >
        <img
          src={refreshImg}
          style={{ height: "80%", cursor: "pointer" }}
          alt=""
        />
        
        <div 
          style={{
            color:"#FFFFFF",
            marginLeft: "3px",
          }}
          >
        {dictinary.refresh.ru}
        </div>
      </div>
      <div
        style={{
          width: "30%",
          height: "100%",
          marginLeft: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={firstPageArrowImg}
          style={{ height: "50%", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(1);
          }}
        />
        <img
          src={leftArrowImg}
          style={{ height: "50%", marginLeft: "30px", cursor: "pointer" }}
          onClick={() => {
            props.setCurrentPage(Math.max(props.currentPage - 1, 1));
          }}
        />
        <input
          style={{ width: "50px", margin: "0px 10px" }}
          type="number"
          value={props.currentPage}
          onChange={(event) => {
            props.setCurrentPage(event.target.value);
          }}
        />
        <img
          src={rightArrowImg}
          style={{ height: "50%", cursor: "pointer" }}
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
          style={{ height: "50%", marginLeft: "30px", cursor: "pointer" }}
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
          width: "20%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          marginLeft: "50px",
        }}
      >
        Total - {props.totalRows}
      </div>
    </div>
  );
};

export default FooterNavigation;
