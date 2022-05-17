import "./EmpShowPage.css";
import { useEffect, useState } from 'react';
import { getEmp } from '../../../lib/api/employee';
import { displayDate } from '../../../lib/common/datotostr';
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
                dep_name: "",
                div_name: ""
                }

const EmpShowPage = (props) => {
  const { showId, setShowId } = props;
  const [emp, setEmp] = useState(initEmp);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const clearEmp = () => {
    setEmp({...initEmp});
  }

  useEffect(() => {
    if(showId===""){
    } else {
      handleGetEmp(Number(showId));
    }
  },[showId]);

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
        dep_name: res.data.dep_name,
        div_name: res.data.div_name,
      })
      setMessage("");
      setMessageVar("");
    } catch (e) {
      setMessage("社員情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleBack = (e) => {
    setShowId("");
    clearEmp();
  }

  return (
    <>
      { showId ? (
      <div className="overlay">
        <div className="emp-show-container">
          <div className="header-area">
            <div className="header-title">Employee Infomation</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleBack(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}
          <div className="emp-show-area">
            <div className="title-cell">{"社員番号"}</div>
            <div className="data-cell">{emp.number}</div>
            <div className="title-cell">{"氏名（漢字）"}</div>
            <div className="data-cell">{emp.name}</div>
            <div className="title-cell">{"氏名（カナ）"}</div>
            <div className="data-cell">{emp.name2}</div>
            <div className="title-cell">{"住所"}</div>
            <div className="data-cell">{emp.address}</div>
            <div className="title-cell">{"電話番号"}</div>
            <div className="data-cell">{emp.phone}</div>
            <div className="title-cell">{"生年月日"}</div>
            <div className="data-cell">{displayDate(emp.birthday)}</div>
            <div className="title-cell">{"入社年月日"}</div>
            <div className="data-cell">{displayDate(emp.joining_date)}</div>
            <div className="title-cell">{"所属"}</div>
            <div className="data-cell">{emp.dep_name + "　" + emp.div_name}</div>
          </div>
        </div>
      </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default EmpShowPage;
