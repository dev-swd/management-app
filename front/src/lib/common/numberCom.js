export const isEmptyZero = (v) => {
  if(v===undefined || v===null || v==="" || v===0) {
    return true;
  } else {
    return false;
  }
}

export const isEmptyNum = (v) => {
  if(v===undefined || v===null || v==="") {
    return true;
  } else {
    return false;
  }
}