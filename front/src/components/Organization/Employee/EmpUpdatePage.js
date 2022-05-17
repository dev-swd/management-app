import "./EmpUpdatePage.css";
import { useEffect, useState } from 'react';
import { getEmp, updateEmp } from '../../../lib/api/employee';
import EmpEntryForm from './EmpEntryForm';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const initEmp = {number: "",
                  name: "",
                  name2: "",
                  birthday: "",
                  address: "",
                  phone: "",
                  joining_date: "",
                  division_id: ""
}

const EmpUpdatePage = (props) => {
  const { updateId, setUpdateId, handleGetEmps } = props;
  const [emp, setEmp] = useState(initEmp);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearEmp = () => {
    setEmp({...initEmp});
  }

  useEffect(() => {
    if(updateId===""){
    } else {
      handleGetEmp(Number(updateId));
    }
  },[updateId]);

  const handleGetEmp = async (id) => {
    try {
      const res = await getEmp(id);
      setEmp({
        ...emp,
        number: res.data.number,
        name: res.data.name,
        name2: res.data.name2,
        birthday: res.data.birthday,
        address: res.data.address,
        phone: res.data.phone,
        joining_date: res.data.joining_date,
        division_id: res.data.division_id
      })
      setMessage("");
      setMessageVar("");
    } catch (e) {
      setMessage("社員情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (name, value) => {
    setEmp({
      ...emp,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateEmp(updateId,emp)
      if (res.data.status === 500) {
        setMessage("社員情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setUpdateId("");
        handleGetEmps();
        clearEmp();
      }
    } catch (e) {
      setMessage("社員情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setUpdateId("");
    clearEmp();
  }

  return (
    <>
      { updateId ? (
      <div className="overlay">
        <div className="emp-upd-container">
          <div className="header-area">
            <div className="header-title">Modify Employee</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <EmpEntryForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            emp={emp}
            buttonCaption='更新'
          />
        </div>
      </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default EmpUpdatePage;