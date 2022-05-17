import "./DepUpdatePage.css";
import { useEffect, useState } from 'react';
import { getDep, updateDep } from '../../../lib/api/department';
import DepEntryForm from './DepEntryForm';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const initDep = {code: "", name: ""}

const DepUpdatePage = (props) => {
  const { updateId, setUpdateId, handleGetDeps } = props;
  const [dep, setDep] = useState(initDep);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearDep = () => {
    setDep({...initDep});
  }

  useEffect(() => {
    if(updateId===""){
    } else {
      handleGetDep(Number(updateId));
    }
  },[updateId]);

  const handleGetDep = async (id) => {
    try {
      const res = await getDep(id);
      setDep({
        ...dep,
        ["code"]: res.data.code,
        ["name"]: res.data.name,
      })
      setMessage("");
      setMessageVar("");
    } catch (e) {
      setMessage("事業部情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (name, value) => {
    setDep({
      ...dep,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateDep(updateId,dep)
      if (res.data.status === 500) {
        setMessage("事業部情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setUpdateId("");
        handleGetDeps();
        clearDep();
      }
    } catch (e) {
      setMessage("事業部情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setUpdateId("");
    clearDep();
  }

  return (
    <>
      { updateId ? (
      <div className="overlay">
        <div className="dep-upd-container">
          <div className="header-area">
            <div className="header-title">Modify Department</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <DepEntryForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            dep={dep}
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

export default DepUpdatePage;
