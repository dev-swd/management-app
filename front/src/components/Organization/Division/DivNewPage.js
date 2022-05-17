import "./DivNewPage.css";
import { useState } from 'react';
import{ createDiv } from '../../../lib/api/division';
import SelectDepartment from "../../common/SelectDepartment";
import { integerValidator } from '../../../lib/common/inputValidator.js';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'

const initDiv = {department_id: "", code: "", name: ""}

const DivNewPage = (props) => {
  const { showFlg, setShowModal, handleGetDivs } = props;
  const [div, setDiv] = useState(initDiv);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearDiv = () => {
    setDiv({...initDiv});
  }

  const handleChange = (name, value) => {
    setDiv({
      ...div,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createDiv(div)
      if (res.data.status === 500) {
        setMessage("課情報登録エラー(500)");
        setMessageVar("error");
      } else {
        setShowModal(false);
        handleGetDivs();
        clearDiv();
      }
    } catch (e) {
      setMessage("課情報登録エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setShowModal(false);
    clearDiv();
  }  

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="div-new-container">
          <div className="header-area">
            <div className="header-title">New Division</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <div className="div-new-form">
            <div className="button-area">
              <Button 
                size="small" 
                variant="contained" 
                onClick={(e) => handleSubmit(e)}
                disabled={!div.department_id || !div.code || !div.nmae ? true : false}
              >
                登録
              </Button>
            </div>
            <div className="div-new-area">
              <div className="title-cell">
                {"事業部"}
                <label className="required">*</label>
              </div>
              <div className="data-cell">
                <SelectDepartment
                  name="department_id" 
                  id="department_id" 
                  className="department_id" 
                  value={div.department_id} 
                  handleChange={handleChange}
                />
              </div>
              <div className="title-cell">
                {"課コード"}
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
                  value={div.code || ''} 
                />
              </div>
              <div className="title-cell">
                {"課・名称"}
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
                  value={div.name || ''} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default DivNewPage;