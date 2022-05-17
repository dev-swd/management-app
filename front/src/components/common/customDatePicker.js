import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ja from 'date-fns/locale/ja';

registerLocale('ja', ja);

const CustomDatePicker = (props) => {
  const { selected, dateFormat, className, onChange, name, index} = props; 

  const toDate = (d) => {
    if(d===undefined || d===null || d===""){
      return "";
    } else {
      return Date.parse(d);
    }
  }

  const handleChange = (d) => {
    var year_str = d.getFullYear();
    var month_str = d.getMonth() + 1;
    var day_str = d.getDate();
    var format_str = "YYYY-MM-DD 00:00:00";
    month_str = ('0' + month_str).slice(-2);
    day_str = ('0' + day_str).slice(-2);
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);

    if(name===undefined || name===null || name===""){
      if(index===undefined || index===null || index===""){
        onChange(format_str);
      } else {
        onChange(index, format_str);
      }
    } else {
      if(index===undefined || index===null || index===""){
        onChange(name, format_str);
      } else {
        onChange(index, name, format_str);
      }
    }   
  }

  return (
    <DatePicker 
      locale="ja" 
      selected={toDate(selected)} 
      dateFormat={dateFormat} 
      className={className}
      onChange={(selected) => handleChange(selected)}
    />
  );
}

export default CustomDatePicker;
