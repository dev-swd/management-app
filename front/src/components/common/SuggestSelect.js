import Select from 'react-select';
import { isEmpty } from "../../lib/common/isEmpty";

const SuggestSelect = (props) => {
  const { selected, setSelected, options, width, height, fontSize, border } = props;

  // リストボックス選択時の処理
  const handleChange = (selectedOption) => {
    if (isEmpty(selectedOption.value)) {
      setSelected("");
    } else {
      setSelected(selectedOption.value)
    }
  }

  // リストボックス選択
  const setSelectOption = () => {
    const selectOption = options.find((o) => o.value === selected);
    return selectOption;
  }

  // Style設定
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
      width: (isEmpty(width)) ? 150 : width,
      fontSize: (isEmpty(fontSize))? 11 : fontSize,
    }),
    control: () => ({
      border: (isEmpty(border)) ? "1px solid #000": border,
      padding: 0,
      width: (isEmpty(width)) ? 150 : width,
      height: (isEmpty(height)) ? 20 : height,
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
      width: (isEmpty(width)) ? 150 : width,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      width: (isEmpty(width)) ? 150 : width,
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
export default SuggestSelect;
