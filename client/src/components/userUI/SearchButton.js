import React from "react";
import search from "../../img/reference-book-buttons/search.png";

const SearchButton = (props) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "2px 5px 2px 5px",
        border: "1.8px #4BC2AA solid",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        fontSize: "14px",
        height: "37px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        ...props.style,
      }}
      onClick={props.onSearchClick}
    >
      <img src={search} alt="" style={{ height: "95%", marginRight: "5px" }} />
      {props.children}
    </div>
  );
};

export default SearchButton;
