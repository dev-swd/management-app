import "./DivUpdatePage.css";
import { useEffect, useState } from 'react';
import { getDiv, updateDiv } from '../../../lib/api/division';
import { integerValidator } from '../../../lib/common/inputValidator.js';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'

const initDiv = {code: "", name: "", dep_name: ""}

const DivUpdatePage = (props) => {
  const { updateId, setUpdateId, handleGetDivs } = props;
  const [div, setDiv] = useState(initDiv);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearDiv = () => {
    setDiv({...initDiv});
  }

  useEffect(() => {
    if(updateId===""){
    } else {
      handleGetDiv(Number(updateId));
    }
  },[updateId]);

  const handleGetDiv = async (id) => {
    try {
      const res = await getDiv(id);
      setDiv({
        ...div,
        code: res.data.code,
        name: res.data.name,
        dep_name: res.data.dep_name
      })
      setMessage("");
      setMessageVar("");
    } catch (e) {
      setMessage("課情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (name, value) => {
    setDiv({
      ...div,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateDiv(updateId,div)
      if (res.data.status === 500) {
        setMessage("課情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setUpdateId("");
        handleGetDivs();
        clearDiv();
      }
    } catch (e) {
      setMessage("課情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setUpdateId("");
    clearDiv();
  }

  return (
    <>
      { updateId ? (
      <div className="overlay">
        <div className="div-upd-container">
          <div className="header-area">
            <div className="header-title">Modify Division</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <div className="div-upd-form">
            <div className="button-area">
              <Button 
                size="small" 
                variant="contained" 
                onClick={(e) => handleSubmit(e)}
                disabled={!div.code || !div.name ? true : false}
                >
                更新
              </Button>
            </div>
            <div className="div-upd-area">
              <div className="title-cell">
                {"事業部"}
              </div>
              <div className="data-cell">{div.dep_name || ''}</div>
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

export default DivUpdatePage;