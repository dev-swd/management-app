import "./PrjNewPage.css";
import { useState } from 'react';
import { createPrj } from '../../lib/api/project';
import SelectEmployee from "../common/SelectEmployee";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import CustomDatePicker from "../common/customDatePicker";
import { formatDate } from "../../lib/common/datetostr";

const initDate = new Date();
const initDatestr = formatDate(initDate, "YYYY-MM-DD 00:00:00");
const initPrj = {status: "計画未提出",
                  approval_date: initDatestr,
                  approval: "",
                  number: "",
                  name: "", 
                  pl_id: ""
                  }

const PrjNewPage = (props) => {
  const { showFlg, setShowModal, handleGetPrjs } = props;
  const [prj, setPrj] = useState(initPrj);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearPrj = () => {
    setPrj({...initPrj});
  }

  const handleChange = (name, value) => {
    setPrj({
      ...prj,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPrj(prj)
      if (res.data.status === 500) {
        setMessage("プロジェクト情報登録エラー(500)");
        setMessageVar("error");
      } else {
        setShowModal(false);
        handleGetPrjs();
        clearPrj();
      }
    } catch (e) {
      setMessage("プロジェクト情報登録エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setShowModal(false);
    clearPrj();
  }  

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="prj-new-container">
          <div className="header-area">
            <div className="header-title">New Project</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <div className="prj-new-form">
            <div className="button-area">
              <Button size="small" 
                variant="contained" 
                onClick={(e) => handleSubmit(e)}
                disabled={!prj.number || !prj.name || !prj.pl_id || !prj.approval_date || !prj.approval ? true : false}
              >
                登録
              </Button>
            </div>
            <div className="prj-new-area">
              <div className="title-cell">
                {"プロジェクトNo."}
                <label className="required">*</label>
              </div>
              <div className="data-cell">
                <input 
                  type="text" 
                  name="number" 
                  id="number" 
                  maxLength="6"
                  className="text-base number"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={prj.number || ''} 
                />
              </div>
              <div className="title-cell">
                {"プロジェクト名"}
                <label className="required">*</label>
              </div>
              <div className="data-cell">
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  maxLength="25"
                  className="text-base name" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={prj.name || ''} 
                />
              </div>
              <div className="title-cell">
                {"PL"}
                <label className="required">*</label>
              </div> 
              <div className="data-cell">
                <SelectEmployee
                  name="pl_id" 
                  value={prj.pl_id || ''} 
                  setValue={handleChange}
                />
              </div>
              <div className="title-cell">
                {"承認日"}
                <label className="required">*</label>
              </div>
              <div className="data-cell">
                <CustomDatePicker 
                  selected={prj.approval_date || ''} 
                  dateFormat="yyyy年MM月dd日" 
                  className="text-base date-field"
                  onChange={handleChange}
                  name="approval_date"
                />
              </div>
              <div className="title-cell">
                {"承認者"}
                <label className="required">*</label>
              </div>
              <div className="data-cell">
                <input 
                  type="text" 
                  name="approval" 
                  id="approval" 
                  maxLength="10" 
                  className="text-base approval"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={prj.approval || ''} 
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

export default PrjNewPage;