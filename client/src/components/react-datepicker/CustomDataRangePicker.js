import React from "react";
import CustomDataPicker from "./CustomDataPicker";
import { dictinary } from "../../dictinary/dictinary.js";

import "react-datepicker/dist/react-datepicker.css";



const CustomDataRangePicker = (props) => {
  return (
    <>
      <CustomDataPicker
        selected={props.firstSelected}
        dateFormat={props.dateFormat}
        onChange={props.onChangeFirst}
        placeholderText={dictinary.enterStartDate.ru}
        style={props.style}
      />
      <div>
        <CustomDataPicker
          selected={props.secondSelected}
          dateFormat={props.dateFormat}
          onChange={props.onChangeSecond}
          style={props.style}
          placeholderText={dictinary.enterEndDate.ru}
        />
      </div>
    </>
  );
};

export default CustomDataRangePicker;
