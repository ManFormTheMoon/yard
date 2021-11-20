import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru"; 
registerLocale("ru", ru); 

const CustomDataPicker = (props) => {
  return (
    <>
      <DatePicker
        selected={props.selected}
        placeholderText={props.placeholderText}
        locale={ru}
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
