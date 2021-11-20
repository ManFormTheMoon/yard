import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomTimePicker = (props) => {
  return (
    <>
      <DatePicker
        selected={props.selected}
        placeholderText={props.placeholderText}
        onChange={(date) => {
          props.onChange(date);
        }}
        // customInput={<ExampleCustomInput />}
        showTimeSelectOnly
        timeIntervals={1}
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        showTimeInput
      />
    </>
  );
};

export default CustomTimePicker;
