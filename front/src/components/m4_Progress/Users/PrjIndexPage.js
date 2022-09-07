// m40
import "./PrjIndexPage.css";
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { getPrjsByMemRunning } from '../../../lib/api/project';
import Alert from "@mui/material/Alert";
import { formatDateZero } from '../../../lib/common/dateCom';
import { isEmpty } from "../../../lib/common/isEmpty";

const PrjIndexPage = () => {
  const navigate = useNavigate();
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState([]);

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
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    } 
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
    <div className="m40-background">
      <div className="m5-prj-index-container">
        <div className="m40-header-title">進捗入力（プロジェクト選択）</div>

        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <table className="m40-table-hd">
          <thead>
            <tr>
              <td rowSpan="2" className="m40-th m40-number-td">No.</td>
              <td rowSpan="2" className="m40-th m40-name-td">プロジェクト名</td>
              <td rowSpan="2" className="m40-th m40-date-td">承認日</td>
              <td rowSpan="2" className="m40-th m40-plname-td">担当PL</td>
              <td rowSpan="2" className="m40-th m40-status-td">状況</td>
              <td colSpan="2" className="m40-th">計画期間</td>
              <td rowSpan="2" className="m40-th m40-link-td">進捗</td>
            </tr>
            <tr>
              <td className="m40-th date-td">開始</td>
              <td className="m40-th date-td">終了</td>
            </tr>
          </thead>
        </table>

        <div className="m40-frame">
          <table className="m40-table-bd">
            <tbody>
              {data.projects ? (
                data.projects.map((p,i) =>
                  <tr key={"prj-" + i}>
                    <td className="m40-number-td">{toStr(p.number)}</td>
                    <td className="m40-name-td">{toStr(p.name)}</td>
                    <td className="m40-date-td">{formatDateZero(p.approval_date, "YYYY年MM月DD日")}</td>
                    <td className="m40-plname-td">{toStr(p.pl_name)}</td>
                    <td className="m40-status-td">{toStr(p.status)}</td>
                    <td className="m40-date-td">{formatDateZero(p.development_period_fr, "YYYY年MM月DD日")}</td>
                    <td className="m40-date-td">{formatDateZero(p.development_period_to, "YYYY年MM月DD日")}</td>
                    <td className="m40-link-td">
                      <button 
                        className="link-style-btn" 
                        type="button" 
                        onClick={() => navigate(`/progress/user/edit`,{state: {id: p.id, number: p.number, name: p.name}})} >
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
    </div>
  )
}
export default PrjIndexPage;