const FormateDate = (date) => {
    let temp = date.substr(0, 10);
    let result = temp.substr(8, 2) + "." + temp.substr(5, 2) + "." + temp.substr(0, 4);
    return result;
    } 
export default FormateDate