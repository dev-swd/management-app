// m33
import "./EmpSelectPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import Alert from "@mui/material/Alert";
import { isEmpty } from '../../../lib/common/isEmpty';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { getDivsByApproval } from '../../../lib/api/division';
import { getEmpsByApproval, getEmpsByDivision } from '../../../lib/api/employee';
import DailyIndexPage from "./DailyIndexPage";

const DailySelectPage = () => {
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [divs, setDivs] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState("all");
  const [emps, setEmps] = useState([]);
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [leftLock, setLeftLock] = useState(false);

  // 初期処理
  useEffect(() => {
    if(!(isEmpty(empInfo.id))) {
      handleGetDivs();
    }
  },[empInfo]);

  // 課情報取得
  const handleGetDivs = async () => {
    try {
      const res = await getDivsByApproval(Number(empInfo.id));
      setDivs(res.data.divs);
    } catch (e) {
      setMessage({kbn: "error", msg: "課情報取得エラー"});
    }
  }

  // 社員情報取得
  const handleGetEmps = async () => {
    setEmpId("");
    setEmpName("");
    try {
      if(selectedDiv==="all"){
        // 承認対象全社員
        const res = await getEmpsByApproval(Number(empInfo.id));
        setEmps(res.data.emps);
      } else {
        // 選択部門の社員
        const res = await getEmpsByDivision(Number(selectedDiv));
        setEmps(res.data.emps);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
    }
  }

  // 表示リンククリック時の処理
  const handleClickLink = (emp) => {
    setEmpId(emp.id);
    setEmpName(emp.name);
    setLeftLock(true);
  }

  // 勤怠一覧画面終了時の処理
  const closeDailyIndex = () => {
    setEmpId("");
    setEmpName("");
    setLeftLock(false);
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // 画面編集
  return (
    <div className="m33-background">
      <div className="m33-container">
        <div className="m33-header-title">勤怠承認（社員選択）</div>
        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m33-main">

          <div className="m33-left">
          {/* 左コンテナ */}

            <div className="m33-search-area">
              <select 
                id="select-division"
                name="division_id"
                value={selectedDiv}
                className="m33-select-division"
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
                disabled={leftLock}
                onClick={(e) => handleGetEmps()}>
                選択
              </Button>            
            </div>

            <table className="m33-table-hd">
              <thead>
                <tr>
                  <td className="m33-th m33-divname-td">所属</td>
                  <td className="m33-th m33-number-td">社員番号</td>
                  <td className="m33-th m33-name-td">氏名</td>
                  <td className="m33-th m33-link-td">日報</td>
                </tr>
              </thead>
            </table>
            <div className="m33-frame">
              <table className="m33-table-bd">
                <tbody>
                  {emps ? (
                    emps.map((emp,i) =>
                      <tr key={"emp-" + i}>
                        <td className="m33-divname-td">{toStr(emp.dep_name) + " " + toStr(emp.div_name)}</td>
                        <td className="m33-number-td">{toStr(emp.number)}</td>
                        <td className="m33-name-td">{toStr(emp.name)}</td>
                        <td className="m33-link-td">
                          { leftLock ?
                            <div className="m33-link-disabled">表示</div>                        
                          :
                            <button 
                              className="link-style-btn" 
                              type="button" 
                              onClick={() => handleClickLink(emp)}>
                              表示
                            </button>
                          }
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
          {/* 可変コンテナ */}
          <DailyIndexPage empId={empId} empName={empName} closeDaily={closeDailyIndex}/>

        </div>

      </div>
    </div>
  );

}

export default DailySelectPage;