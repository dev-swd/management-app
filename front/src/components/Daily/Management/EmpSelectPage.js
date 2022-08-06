import "./EmpSelectPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import Alert from "@mui/material/Alert";
import { isEmptyNum } from '../../../lib/common/numberCom';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { getDivsByApproval } from '../../../lib/api/division';
import { getEmpsByApproval, getEmpsByDivision } from '../../../lib/api/employee';
import DailyIndexPage from "./DailyIndexPage";

const DailySelectPage = () => {
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const [divs, setDivs] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState("all");
  const [emps, setEmps] = useState([]);
  const [empId, setEmpId] = useState("");

  useEffect(() => {
    if(!(isEmptyNum(empInfo.id))) {
      handleGetDivs();
    }
  },[empInfo]);

  const handleGetDivs = async () => {
    try {
      const res = await getDivsByApproval(Number(empInfo.id));
      setDivs(res.data.divs);
    } catch (e) {
      setMessage("課情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleGetEmps = async () => {
    try {
      if(selectedDiv==="all"){
        const res = await getEmpsByApproval(Number(empInfo.id));
        setEmps(res.data.emps);
      } else {
        const res = await getEmpsByDivision(Number(selectedDiv));
        setEmps(res.data.emps);
      }
    } catch (e) {
      setMessage("社員情報取得エラー");
      setMessageVar("error");
    }
  }

  return (
    <div className="emp-select-background">
      <div className="emp-select-container">
        <div className="header-area">
          <div className="header-title">勤怠承認（社員選択）</div>
        </div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}

        <div className="search-area">
          <select 
            id="select-division"
            name="division_id"
            value={selectedDiv}
            className={'select-division'}
            onChange={(e) => setSelectedDiv(e.target.value)}
          >
            <option key="select-div-0" value="all">全て</option>
            {divs ? (
              divs.map((div,i) => (
                <option key={"select-div-" + i} value={div.id}>{div.dep_name + " " + div.name}</option>
              ))
            ) : (
              <></>
            )}
          </select>
          <Button
            size="small" 
            variant="contained" 
            endIcon={<SearchIcon />} 
            sx={{height:25}}
            onClick={(e) => handleGetEmps()}>
            選択
          </Button>            
        </div>

        <table className="emps-table-hd">
          <thead>
            <tr className="header-tr">
              <td className="header-td div-name-td">所属</td>
              <td className="header-td number-td">社員番号</td>
              <td className="header-td name-td">氏名</td>
              <td className="header-td link-td">日報</td>
            </tr>
          </thead>
        </table>
        <div className="emps-table-frame">
          <table className="emps-table">
            <tbody>
              {emps ? (
                emps.map((emp,i) =>
                  <tr key={"emp-" + i} className="body-tr">
                    <td className="div-name-td">{emp.dep_name + " " + emp.div_name}</td>
                    <td className="number-td">{emp.number}</td>
                    <td className="name-td">{emp.name}</td>
                    <td className="link-td">
                      <button 
                        className="link-style-btn link-index" 
                        type="button" 
                        onClick={() => setEmpId(emp.id)}>
                        表示
                      </button>
                    </td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DailyIndexPage empId={empId} setEmpId={setEmpId}/>
    </div>
  );

}

export default DailySelectPage;