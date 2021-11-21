import React, { forwardRef } from "react";
import { dictinary } from "../../dictinary/dictinary.js";

import CustomTimePicker from "./CustomTimePicker";



const CustomTimeRangePicker = (props) => {
  return (
    <>
      <CustomTimePicker
        selected={props.firstSelected}
        onChange={props.onChangeFirst}
        showTimeSelectOnly
        timeIntervals={15}
        placeholderText={dictinary.enterStartTime.ru}
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        showTimeInput
        style={props.style}
      />
      <div style={{ marginTop: "5px"}}>
        <CustomTimePicker
          selected={props.secondSelected}
          onChange={props.onChangeSecond}
          showTimeSelect
          placeholderText={dictinary.enterEndTime.ru}
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          style={props.style}
        />
      </div>
    </>
  );
};

export default CustomTimeRangePicker;
