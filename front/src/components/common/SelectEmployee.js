import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getEmps } from '../../lib/api/employee';
import { isEmptyNum } from '../../lib/common/numberCom';
import { isEmptyStr } from '../../lib/common/stringCom';

const initOptions = [{value: "", label: "(未選択)"}];

const SelectEmployee = (props) => {
  const { name, value, setValue, index, height, width, border, fontsize } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    handleGetEmps();
  },[])

  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      let tmpEmps = res.data.map(emp => {
        const tmpEmp = {};
        tmpEmp.value = emp.id;
        tmpEmp.label = emp.name;
        return tmpEmp;
      });
      const tmpOptions = initOptions.concat(tmpEmps);
      setOptions(tmpOptions);
    } catch (e) {
    }      
  }

  const handleChange = (selectedOption) => {
    if(isEmptyStr(name)) {
      setValue(selectedOption.value, selectedOption.label);
    } else {
      if(isEmptyNum(index)) {
        setValue(name, selectedOption.value);
      } else {
        setValue(index, name, selectedOption.value);
      }  
    }
  }

  const setSelectOption = () => {
    const targetOption = options.find((v) => v.value === value);
    return targetOption;
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      //ここでボックスの中身のスタイルをカスタマイズ
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      marginTop: 0,
      paddingLeft: 3,
      border: "0.5px solid #000",
      width: (isEmptyNum(width)) ? 150 : width,
      fontSize: (isEmptyNum(fontsize))? 11 : fontsize,
    }),
    control: () => ({
      border: (isEmptyStr(border)) ? "1px solid #000": border,
      padding: 0,
      width: (isEmptyNum(width)) ? 150 : width,
      height: (isEmptyNum(height)) ? 20 : height,
      display: "flex",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      margin: 0,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      paddingLeft: 2,
      width: (isEmptyNum(width)) ? 150 : width,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      width: (isEmptyNum(width)) ? 150 : width,
    }),
  }

  return (
    <Select 
      value={setSelectOption()}
      options={options} 
      onChange={handleChange}
      styles={customStyles}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
    />
  );
}

export default SelectEmployee;