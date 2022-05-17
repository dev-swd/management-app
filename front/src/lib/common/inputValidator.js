export const integerValidator = (e) => {
  let validated = "";
  Array.prototype.forEach.call(e.target.value, function(c) {
    if (c.match(/[\d]/)) {
      validated += c;
    }
  });
  return validated;
}

export const decimalValidator = (e) => {
  let validated = "";
  let cnt = 0;
  Array.prototype.forEach.call(e.target.value, function(c) {
    if (c.match(/[\d\.]/)) {
      if(c==="."){
        if(cnt===0){
          validated += c;
        }
        cnt += 1;
      } else if(c==="0") {
        if(validated!=="0") {
          validated += c;
        }
      } else {
        validated += c;
      }
    }
  });
  return validated;
}

export const phoneValidator = (e) => {
  let validated = "";
  Array.prototype.forEach.call(e.target.value, function(c) {
    if (
      c.match(/[\d\-]/)
    ) {
      validated += c;
    }
  });
  return validated;
}

export const hankakuValidator = (e) => {
  let validated = "";
  Array.prototype.forEach.call(e.target.value, function(c) {
    if (
      c.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/)
    ) {
      validated += c;
    }
  });
  return validated;
}

/*
export const kanaValidator = (e) => {
  let validated = "";
  Array.prototype.forEach.call(e.target.value, function(c) {
    if (
      c.match(/[ァ-ヴ]/)
    ) {
      validated += c;
    }
  });
  return validated;
}
*/
