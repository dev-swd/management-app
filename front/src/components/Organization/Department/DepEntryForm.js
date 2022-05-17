import "./DepEntryForm.css";
import Button from '@mui/material/Button'
import { integerValidator } from '../../../lib/common/inputValidator.js';

const DepEntryForm = (props) => {
  const { handleChange, handleSubmit, dep, buttonCaption } = props;

  return (
    <div className="dep-entry-container">
      <div className="button-area">
        <Button size="small" variant="contained" onClick={(e) => handleSubmit(e)} disabled={!dep.code || !dep.name ? true : false}>{buttonCaption}</Button>
      </div>
      <div className="dep-entry-area">
        <div className="title-cell">
          {"コード"}
          <label className="required">*</label>
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="code" 
            id="code"
            maxLength="3"
            className="text-base code"
            onChange={(e) => handleChange(e.target.name,integerValidator(e))} 
            value={dep.code || ''} 
          />
        </div>
        <div className="title-cell">
          {"部・名称"}
          <label className="required">*</label>
        </div>
        <div className="data-cell">
          <input 
            type="text" 
            name="name" 
            id="name" 
            maxLength="20"
            className="text-base name"
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={dep.name || ''} 
          />
        </div>
      </div>
    </div>
  )
}

export default DepEntryForm;