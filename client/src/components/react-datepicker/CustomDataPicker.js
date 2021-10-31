import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDataPicker = (props) => {
  return (
    <>
      <DatePicker
        selected={props.selected}
        onChange={(date) => {
          console.log(date);
          props.onChange(date);
        }}
        dateFormat={props.dateFormat}
        //customInput={<ExampleCustomInput />}
        //selectsStart
        //startDate={props.startDate}
        //endDate={props.endDate}
        {...(props.isDisabled == true ? { disabled: true } : {})}
      />
    </>
  );
};

export default CustomDataPicker;
