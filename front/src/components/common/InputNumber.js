import React, { useState, useEffect } from 'react';
import { integerOnly } from '../../lib/common/InputRegulation';

const InputNumber = (props) => {
  const { name, id, maxLength, className, toValue, procChange, index } = props;
  const [value, setValue] = useState('');
  const [isFocus, setFocus] = useState(false);
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);
  const handleChange = (e, v) => {
    setValue(v);
    if(index===undefined || index===null){
      procChange(e.target.name, v);
    }else{
      procChange(index, e.target.name, v);
    }
  }
  const isBlank = value === '';
  const isValid = /^[-]?(\d+)[.]?(\d+)?$/.test(value);
  const displayValue = (() => {
    if (isFocus || !isValid) {
      return value;
    }
    if (isValid) {
      return (+value).toLocaleString();
    }
    return '';
  })();
/*
  const displayStyle = {
    textAlign: 'right',
    backgroundColor: isValid || isBlank ? '#FFF' : '#FFBEDA'
  }
*/
  useEffect(() => {
    setValue(toValue);
  },[toValue]);

  return (
    <input
      name={name}
      id={id}
      maxLength={maxLength}
      className={className}
      type="text"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={(e) => handleChange(e, integerOnly(e.target.value))}
      value={displayValue}
/*
      style={displayStyle}
*/
    />
  );
}

export default InputNumber;