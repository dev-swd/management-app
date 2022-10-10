// m17
import './EmpNotAssignPage.css';
import { useEffect, useState } from 'react';
import { getEmpsByNotAssign } from '../../../lib/api/employee';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordIcon from '@mui/icons-material/Password';
import PwdResetPage from './PwdResetPage';
import AuthEditPage from './AuthEditPage';

const EmpNotAssignPage = (props) => {
  const { showFlg, closeNotAssign, setMessage } = props;
  const [data, setData] = useState([]);
  const [resetId, setResetId] = useState("");
  const [empId, setEmpId] = useState("");

  // 初期処理
  useEffect(() => {
    if (showFlg!==0) {
      handleGetEmps();
    }
  }, [showFlg]);

  // 未所属の社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmpsByNotAssign();
      const tmpEmps = res.data.emps.map(e => {
        const tmpEmp = {};
        tmpEmp.id = e.id;
        tmpEmp.number = e.number;
        tmpEmp.name = e.name;
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
    closeNotAssign();
    setData([]);
    setMessage({kbn: "", msg: ""});
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
        <div className="m17-notassign-container">
          <div className="m17-header-area">
            <div className="m17-header-title">{"未所属の社員"}</div>
            <button 
              className="link-style-btn m17-link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>

          {/* 社員一覧 */}
          <table className="m17-emps-table-hd">
            <thead>
              <tr>
                <td className="m17-number-td">社員番号</td>
                <td className="m17-name-td">氏名</td>
                <td className="m17-devise-name-td">UserName</td>
                <td className="m17-setting-td">システム権限</td>
                <td className="m17-devise-reset-td">パスワード</td>
              </tr>
            </thead>
          </table>
          <table className="m17-emps-table">
            <tbody>
              {data.emps ? (
                data.emps.map((e,i) => 
                  <tr key={"emp-" + i}>
                    <td className="m17-number-td">{e.number}</td>
                    <td className="m17-name-td">{e.name}</td>
                    <td className="m17-devise-name-td">{e.devise_name}</td>
                    <td className="m17-setting-td">
                      <IconButton size="small" onClick={() => handleSettings(e.id)}>
                        <SettingsIcon fontSize='small' />
                      </IconButton>
                    </td>
                    <td className="m17-devise-reset-td">
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
export default EmpNotAssignPage;
