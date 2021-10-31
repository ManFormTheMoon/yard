import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomTimePicker = (props) => {
  return (
    <>
      <DatePicker
        selected={props.selected}
        onChange={(date) => {
          props.onChange(date);
        }}
        // customInput={<ExampleCustomInput />}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
      />
    </>
  );
};

export default CustomTimePicker;
