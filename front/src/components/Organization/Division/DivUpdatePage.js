import "./DivUpdatePage.css";
import { useEffect, useState } from 'react';
import { getDiv, updateDiv } from '../../../lib/api/division';
import { integerValidator } from '../../../lib/common/inputValidator.js';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SelectEmployee from "../../common/SelectEmployee";
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';

const initData = {div: {code: "", name: "", dep_name: ""}, auths: []}
const initEmp = {id: "", name: ""}

const DivUpdatePage = (props) => {
  const { updateId, setUpdateId, handleGetDivs } = props;
  const [data, setData] = useState(initData)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [emp, setEmp] = useState(initEmp);

  const clearData = () => {
    setData({...initData});
    setMessage("");
    setMessageVar("");
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
      const tmpAuths = res.data.auths.map(auth => {
        const tmpAuth = {};
        tmpAuth.id = auth.id;
        tmpAuth.emp_id = auth.employee_id;
        tmpAuth.emp_name = auth.emp_name;
        tmpAuth.del = false;
        return tmpAuth;
      });
      setData({
        ...data,
        div: {...data.div,
          code: res.data.div.code,
          name: res.data.div.name,
          dep_name: res.data.div.dep_name
        },
        auths: tmpAuths
      })
      setMessage("");
      setMessageVar("");
    } catch (e) {
      setMessage("課情報取得エラー");
      setMessageVar("error");
    }
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
      const res = await updateDiv(updateId,data)
      if (res.data.status === 500) {
        setMessage("課情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setUpdateId("");
        handleGetDivs();
        clearData();
      }
    } catch (e) {
      setMessage("課情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setUpdateId("");
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
    const tempAuths = [...data.div.auths];
    tempAuths[i]["del"] = value;
    setData({
      ...data,
      div: {...data.div,
        auths: tempAuths,
      }
    })
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
                disabled={!data.div.code || !data.div.name ? true : false}
                >
                更新
              </Button>
            </div>
            <div className="div-upd-area">
              <div className="title-cell">
                {"事業部"}
              </div>
              <div className="data-cell">{data.div.dep_name || ''}</div>
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

export default DivUpdatePage;