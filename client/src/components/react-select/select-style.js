export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    borderColor: "#9e9e9e",
    minHeight: "25px",
    height: "25px",
    boxShadow: state.isFocused ? null : null,
    border: "1px solid black",
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),
  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  // indicatorSeparator: (state) => ({
  //   display: "none",
  // }),
  // indicatorsContainer: (provided, state) => ({
  //   ...provided,
  //   height: "30px",
  // }),
};
