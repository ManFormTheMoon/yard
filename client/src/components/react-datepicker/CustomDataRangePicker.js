import React from "react";
import CustomDataPicker from "./CustomDataPicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDataRangePicker = (props) => {
  return (
    <>
      <CustomDataPicker
        selected={props.firstSelected}
        dateFormat={props.dateFormat}
        onChange={props.onChangeFirst}
        style={props.style}
      />
      -
      <CustomDataPicker
        selected={props.secondSelected}
        dateFormat={props.dateFormat}
        onChange={props.onChangeSecond}
        style={props.style}
      />
    </>
  );
};

export default CustomDataRangePicker;
