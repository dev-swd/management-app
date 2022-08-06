import "./DivNewPage.css";
import { useState } from 'react';
import{ updateDiv } from '../../../lib/api/division';
import SelectDepartment from "../../common/SelectDepartment";
import { integerValidator } from '../../../lib/common/inputValidator.js';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SelectEmployee from "../../common/SelectEmployee";
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';

const initData = {div: {id: "", department_id: "", code: "", name: ""}, auths: []}
const initEmp = {id: "", name: ""}

const DivNewPage = (props) => {
  const { showFlg, setShowModal, handleGetDivs } = props;
  const [data, setData] = useState(initData);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [emp, setEmp] = useState(initEmp);

  const clearData = () => {
    setData({...initData});
  }

  const handleChange = (name, value) => {
    setData({
      ...data,
      div: {...data.div,
        [name]: value
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateDiv(null,data)
      if (res.data.status === 500) {
        setMessage("課情報登録エラー(500)");
        setMessageVar("error");
      } else {
        setShowModal(false);
        handleGetDivs();
        clearData();
      }
    } catch (e) {
      setMessage("課情報登録エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setShowModal(false);
    clearData();
  }  

  const handleSetEmp = (empid, empname) => {
    setEmp({id: empid, name: empname});
  }

  const handleAdd = (e) =>{
    if(emp.id!=="") {
      setData({
        ...data,
        auths: [...data.auths,
          {id: "",
            emp_id: emp.id,
            emp_name: emp.name,
            del: false
          }
        ],
      });
      setEmp(initEmp);
    }
  }

  const handleDelAuth = (i, value) => {
    const tempAuths = [...data.auths];
    tempAuths[i]["del"] = value;
    setData({
      ...data,
      auths: tempAuths,
    });
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
                disabled={!data.div.department_id || !data.div.code || !data.div.name ? true : false}
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
                  value={data.div.department_id} 
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
                  value={data.div.code || ''} 
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
                  value={data.div.name || ''} 
                />
              </div>
              <div className="title-cell">
                {"承認者"}
              </div>
              <div className="auth-container">
                <div className="auth-add">
                  <SelectEmployee
                    value={emp.id}
                    setValue={handleSetEmp}
                    width={110}
                    height={20}
                  />
                  <Button size="small" onClick={(e) => handleAdd(e)}>追加</Button>
                </div>
                <div className="auth-chips">
                {data.auths ? (
                  data.auths.map((auth, i) =>
                    <>
                    {auth.del ? (
                      <Chip 
                        label={auth.emp_name || ''}
                        color="error"
                        size="small"
                        sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                        deleteIcon={<DoneIcon />}
                        onDelete={() => handleDelAuth(i,false)}
                      />  
                    ) : (
                      <Chip
                        label={auth.emp_name || ''}
                        variant="outlined"
                        size="small"
                        sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                        onDelete={() => handleDelAuth(i,true)}
                      />  
                    )}
                    </>
                  )
                ) : (
                  <></>
                )}
                </div>
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