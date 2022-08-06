import "./PrjIndexPage.css";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../App';
import { getPrjsByMemRunning } from '../../../lib/api/project';
import Alert from "@mui/material/Alert";
import { displayDate } from '../../../lib/common/datetostr';
import ProgressEditPage from './ProgressEditPage';

const PrjIndexPage = () => {
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const [data, setData] = useState([]);
  const [prjInfo, setPrjInfo] = useState("");

  // 初期処理
  useEffect(() => {
    handleGetPrj();
  },[]);

  // プロジェクト情報取得（開発期間中の参画プロジェクト）
  const handleGetPrj = async () => {
    try {
      const res = await getPrjsByMemRunning(empInfo.id);
      setData(res.data);
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    } 
  }

  return (
    <div className="m5-prj-index-background">
      <div className="m5-prj-index-container">
        <div className="header-title">進捗入力（プロジェクト選択）</div>

        { message_var && <Alert severity={message_var}>{message}</Alert>}

        <table className="table-hd">
          <thead>
            <tr>
              <td rowSpan="2" className="header-td number-td">No.</td>
              <td rowSpan="2" className="header-td name-td">プロジェクト名</td>
              <td rowSpan="2" className="header-td date-td">承認日</td>
              <td rowSpan="2" className="header-td plname-td">担当PL</td>
              <td rowSpan="2" className="header-td status-td">状況</td>
              <td colSpan="2" className="header-td">計画期間</td>
              <td rowSpan="2" className="header-td link-td">進捗</td>
            </tr>
            <tr>
              <td className="header-td date-td">開始</td>
              <td className="header-td date-td">終了</td>
            </tr>
          </thead>
        </table>

        <div className="table-frame">
          <table className="table-bd">
            <tbody>
              {data.projects ? (
                data.projects.map((p,i) =>
                  <tr key={"prj-" + i}>
                    <td className="number-td center-td">{p.number}</td>
                    <td className="name-td left-td">{p.name}</td>
                    <td className="date-td center-td">{displayDate(p.approval_date)}</td>
                    <td className="plname-td left-td">{p.pl_name}</td>
                    <td className="status-td center-td">{p.status}</td>
                    <td className="date-td center-td">{displayDate(p.development_period_fr)}</td>
                    <td className="date-td center-td">{displayDate(p.development_period_to)}</td>
                    <td className="link-td center-td">
                      <button 
                        className="link-style-btn link-detail" 
                        type="button" 
                        onClick={() => setPrjInfo({id: p.id, number: p.number, name: p.name})} >
                        入力
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
      <ProgressEditPage prjInfo={prjInfo} setPrjInfo={setPrjInfo} />
    </div>
  )
}
export default PrjIndexPage;