export const zeroPadding = (value, totalLen) => {
  if(value===undefined || value===null || value===""){
    return ""
  } else {
    return ( Array(totalLen).join('0') + value ).slice( -totalLen );
  }
}

