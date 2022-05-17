export const datetostr = (year,month,day,format) => {
  const replaceStrArray = {
    'YYYY': year,
    'Y': year,
    'MM': ('0' + (month)).slice(-2),
    'M': month,
    'DD': ('0' + (day)).slice(-2),
    'D': day,
  };

  const replaceStr = '(' + Object.keys(replaceStrArray).join('|') + ')';
  const regex = new RegExp(replaceStr, 'g');

  const ret = format.replace(regex, function (str) {
    return replaceStrArray[str];
  });

  return ret;
}

export const displayDate = (d) => {
  if(d===null || d===""){
    return "";    
  }
  const dt = new Date(d);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();

  return (year + "年" + month + "月" + date + "日");
}

export const formatDate = (d, format) => {
  if(d===undefined || d===null || d===""){
    return "";
  }
  var dt = new Date(d);
  var year_str = dt.getFullYear();
  var month_str = dt.getMonth() + 1;
  var day_str = dt.getDate();
  var format_str = format;
  month_str = ('0' + month_str).slice(-2);
  day_str = ('0' + day_str).slice(-2);
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);

  return format_str;
}

export const formatDateTime = (d, format) => {
  if(d===undefined || d===null || d===""){
    return "";
  }
  var dt = new Date(d);
  var year_str = dt.getFullYear();
  var month_str = dt.getMonth() + 1;
  var day_str = dt.getDate();
  var hour_str = dt.getHours();
  var minute_str = dt.getMinutes();
  var second_str = dt.getSeconds();
  var format_str = format;
  month_str = ('0' + month_str).slice(-2);
  day_str = ('0' + day_str).slice(-2);
  hour_str = ('0' + hour_str).slice(-2);
  minute_str = ('0' + minute_str).slice(-2);
  second_str = ('0' + second_str).slice(-2);
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  format_str = format_str.replace(/HH/g, hour_str);
  format_str = format_str.replace(/MI/g, minute_str);
  format_str = format_str.replace(/SS/g, second_str);

  return format_str;
}
