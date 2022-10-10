// m16
import './EmpAllPage.css';
import { useEffect, useState } from 'react';
import { isEmpty } from "../../../lib/common/isEmpty";
import { getEmps } from '../../../lib/api/employee';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordIcon from '@mui/icons-material/Password';
import PwdResetPage from './PwdResetPage';
import AuthEditPage from './AuthEditPage';

const EmpAllPage = (props) => {
  const { showFlg, closeAllEmp, setMessage } = props;
  const [data, setData] = useState([]);
  const [resetId, setResetId] = useState("");
  const [empId, setEmpId] = useState("");

  // 初期処理
  useEffect(() => {
    if (showFlg!==0) {
      handleGetEmps();
    }
  }, [showFlg]);

  // 全社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      const tmpEmps = res.data.emps.map(e => {
        const tmpEmp = {};
        tmpEmp.id = e.id;
        tmpEmp.number = e.number;
        tmpEmp.name = e.name;
        tmpEmp.department_id = e.department_id;
        tmpEmp.dep_code = e.dep_code;
        tmpEmp.dep_name = e.dep_name;
        tmpEmp.division_id = e.division_id;
        tmpEmp.div_code = e.div_code;
        tmpEmp.div_name = e.div_name;
        tmpEmp.devise_name = e.devise_name;
        return tmpEmp;
      });
      setData({
        ...data,
        emps: tmpEmps
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
    }
  }

  // 画面終了時の処理
  const handleClose = () => {
    closeAllEmp();
    setData([]);
    setMessage({kbn: "", msg: ""});
  }
  
  // 所属名編集
  const setOrgName = (e) => {
    if (isEmpty(e.division_id)) {
      return "";
    } else {
      if (e.div_code==="dep") {
        return e.dep_name;
      } else {
        return e.dep_name + "　" + e.div_name;
      }
    }
  }

  // ユーザ情報変更押下時の処理
  const handleSettings = (empId) => {
    setEmpId(empId);
  }

  // ユーザ情報変更画面クローズ処理
  const closeSettings = () => {
    setEmpId("");
  }

  // ログインユーザリセット押下時の処理
  const handleReset = (empId) => {
    setResetId(empId);
  }

  // ログインユーザリセット画面クローズ処理
  const closeReset = () => {
    setResetId();
    handleGetEmps();
  }

  // 画面編集
  return (
    <>
      { showFlg ? (
        <div className="m16-allemp-container">
          <div className="m16-header-area">
            <div className="m16-header-title">{"全社員"}</div>
            <button 
              className="link-style-btn m16-link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>

          {/* 社員一覧 */}
          <table className="m16-emps-table-hd">
            <thead>
              <tr>
                <td className="m16-number-td">社員番号</td>
                <td className="m16-name-td">氏名</td>
                <td className="m16-org-td">所属</td>
                <td className="m16-devise-name-td">UserName</td>
                <td className="m16-setting-td">システム権限</td>
                <td className="m16-devise-reset-td">パスワード</td>
              </tr>
            </thead>
          </table>
          <table className="m16-emps-table">
            <tbody>
              {data.emps ? (
                data.emps.map((e,i) => 
                  <tr key={"emp-" + i}>
                    <td className="m16-number-td">{e.number}</td>
                    <td className="m16-name-td">{e.name}</td>
                    <td className="m16-org-td">{setOrgName(e)}</td>
                    <td className="m16-devise-name-td">{e.devise_name}</td>
                    <td className="m16-setting-td">
                      <IconButton size="small" onClick={() => handleSettings(e.id)}>
                        <SettingsIcon fontSize='small' />
                      </IconButton>
                    </td>
                    <td className="m16-devise-reset-td">
                      <IconButton size="small" onClick={() => handleReset(e.id)}>
                        <PasswordIcon fontSize='small' />
                      </IconButton>
                    </td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
          <PwdResetPage empId={resetId} closeReset={closeReset} />
          <AuthEditPage empId={empId} closeEdit={closeSettings} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default EmpAllPage;
