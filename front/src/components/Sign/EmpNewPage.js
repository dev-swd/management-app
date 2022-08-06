import "./EmpNewPage.css";
import { useState, useContext } from "react";
import{ createEmp } from '../../lib/api/employee';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../App";
import Alert from "@mui/material/Alert";
import EmpEntryForm from "../Organization/Employee/EmpEntryForm";
import { formatDate } from "../../lib/common/datetostr";
import { setAuhority } from "../../lib/authority";

const initDate = new Date();
const initDatestr = formatDate(initDate, "YYYY-MM-DD 00:00:00");
const initEmp = {number: "",
                  name: "",
                  name2: "",
                  birthday: initDatestr,
                  address: "",
                  phone: "",
                  joining_date: initDatestr,
                  division_id: "",
                  devise_id: "",
                  authority: "normal"}

const EmpNewPage = () => {
  const { currentUser, setEmpInfo, setAuthInfo } = useContext(AuthContext)
  const [emp, setEmp] = useState(initEmp);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setEmp({
      ...emp,
      devise_id: currentUser.id,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createEmp(emp)
      if (res.data.status === 500) {
        setMessage("社員情報登録エラー(500)");
        setMessageVar("error");
      } else {
        setEmpInfo(res.data.emp);
        // 権限情報設定
        setAuthInfo(setAuhority(res.data.emp.authority));

        navigate(`/`);
      }
    } catch (e) {
      setMessage("社員情報登録エラー");
      setMessageVar("error");
    }
  }

  return (
    <div className="background">
      <div className="emp-new-container">
        <div className="header-title">社員情報登録</div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <EmpEntryForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          emp={emp}
          buttonCaption='登録'
        />
      </div>
    </div>
  );
}

export default EmpNewPage;
