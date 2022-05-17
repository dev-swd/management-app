import "./EmpEntryForm.css";
import Button from '@mui/material/Button'
import { integerValidator, phoneValidator } from '../../../lib/common/inputValidator.js';
import CustomDatePicker from "../../common/customDatePicker";
import SelectDivision from "../../common/SelectDivision";

const EmpEntryForm = (props) => {
  const { handleChange, handleSubmit, emp, buttonCaption } = props;
  
  return (
    <div className="emp-entry-container">
      <div className="button-area">
        <Button 
          size="small" 
          variant="contained" 
          onClick={(e) => handleSubmit(e)}
          disabled={!emp.number || !emp.name ? true : false}
        >
        {buttonCaption}
        </Button>
      </div>
      <div className="emp-entry-area">
        <div className="title-cell">
          {"社員番号"}
          <label className="required">*</label>
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="number" 
            id="number"
            maxLength="3"
            className="text-base number"
            onChange={(e) => handleChange(e.target.name,integerValidator(e))} 
            value={emp.number || ''} 
          />
        </div>
        <div className="title-cell">
          {"氏名（漢字）"}
          <label className="required">*</label>
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="name" 
            id="name" 
            maxLength="10"
            className="text-base name"
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={emp.name || ''} 
          />
        </div>
        <div className="title-cell">
          {"氏名（カナ）"}
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="name2" 
            id="name2" 
            maxLength="10"
            className="text-base name2"
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={emp.name2 || ''} 
          />
        </div>
        <div className="title-cell">
          {"住所"}
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="address" 
            id="address" 
            maxLength="40"
            className="text-base address"
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={emp.address || ''} 
          />
        </div>
        <div className="title-cell">
          {"電話番号"}
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="phone" 
            id="phone" 
            maxLength="15"
            className="text-base phone"
            onChange={(e) => handleChange(e.target.name, phoneValidator(e))} 
            value={emp.phone || ''} 
          />
        </div>
        <div className="title-cell">
          {"生年月日"}
        </div>
        <div className="data-cell">
          <CustomDatePicker 
            selected={emp.birthday || ""} 
            dateFormat="yyyy年MM月dd日" 
            className="text-base date-field"
            onChange={handleChange}
            name="birthday"
          />
        </div>
        <div className="title-cell">
          {"入社年月日"}
        </div>
        <div className="data-cell">
          <CustomDatePicker 
            selected={emp.joining_date || ""} 
            dateFormat="yyyy年MM月dd日" 
            className="text-base date-field"
            onChange={handleChange}
            name="joining_date"
          />
        </div>
        <div className="title-cell">
          {"所属"}
        </div>
        <div className="data-cell">
          <SelectDivision
            name="division_id" 
            id="division_id" 
            className="division_id" 
            value={emp.division_id} 
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default EmpEntryForm;