export const zeroPadding = (value, totalLen) => {
  if(value===undefined || value===null || value===""){
    return ""
  } else {
    return ( Array(totalLen).join('0') + value ).slice( -totalLen );
  }
}

export const isEmptyStr = (v) => {
  if(v===undefined || v===null || v.trim()==="") {
    return true;
  } else {
    return false;
  }
}