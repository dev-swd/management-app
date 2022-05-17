import "./DepNewPage.css";
import { useState } from 'react';
import{ createDep } from '../../../lib/api/department';
import DepEntryForm from "./DepEntryForm";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const initDep = {code: "", name: ""}

const DepNewPage = (props) => {
  const { showFlg, setShowModal, handleGetDeps } = props;
  const [dep, setDep] = useState(initDep);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearDep = () => {
    setDep({...initDep});
  }

  const handleChange = (name, value) => {
    setDep({
      ...dep,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createDep(dep)
      if (res.data.status === 500) {
        setMessage("事業部情報登録エラー(500)");
        setMessageVar("error");
      } else {
        setShowModal(false);
        handleGetDeps();
        clearDep();
      }
    } catch (e) {
      setMessage("事業部情報登録エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setShowModal(false);
    clearDep();
  }  

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="dep-new-container">
          <div className="header-area">
            <div className="header-title">New Department</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <DepEntryForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            dep={dep}
            buttonCaption='登録'
          />
        </div>
      </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default DepNewPage;