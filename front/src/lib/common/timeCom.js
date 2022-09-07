export const formatTime = (h,m) => {
  if (h===undefined || h===null || h==="" || m===undefined || m===null || m==="") {
    return "";
  }
  var hh = ('0' + h).slice(-2);
  var mm = ('0' + m).slice(-2);
  return hh + ":" + mm;
}
