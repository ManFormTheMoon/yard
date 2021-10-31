import React, { forwardRef } from "react";

import CustomTimePicker from "./CustomTimePicker";

const CustomTimeRangePicker = (props) => {
  return (
    <>
      <CustomTimePicker
        selected={props.firstSelected}
        onChange={props.onChangeFirst}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        style={props.style}
      />
      -
      <CustomTimePicker
        selected={props.secondSelected}
        onChange={props.onChangeSecond}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        style={props.style}
      />
    </>
  );
};

export default CustomTimeRangePicker;
