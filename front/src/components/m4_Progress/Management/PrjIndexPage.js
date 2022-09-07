// m42
import "./PrjIndexPage.css";
import { useState } from 'react';
import { getPrjsByConditional } from '../../../lib/api/project';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { formatDateZero } from '../../../lib/common/dateCom';
import SelectEmployee from "../../common/SelectEmployee";
import ProgRepIndexPage from './ProgRepIndexPage';
import { isEmpty } from "../../../lib/common/isEmpty";

const PrjIndexPage = () => {
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState([]);
  const [prjInfo, setPrjInfo] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPl, setSelectedPl] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  // プロジェクト情報取得（画面指定条件）
  const handleGetPrj = async () => {
    try {
      const res = await getPrjsByConditional(selectedStatus, selectedPl, selectedOrder);
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    } 
  }

  // PL選択時の処理
  const handleSetPl = (empid, empname) => {
    setSelectedPl(empid);
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // 表示リンククリック時の処理
  const handleLinkClick = (p) => {
    setPrjInfo({id: p.id, number: p.number, name: p.name});
  }

  // 進捗レポート終了時の処理
  const closeProgRep = () => {
    setPrjInfo({});
  }

  // 画面編集
  return (
    <div className="m42-background">
      <div className="m6-prj-index-container">
        <div className="m42-header-title">進捗管理（プロジェクト選択）</div>

        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m42-search-area">
          <div className="m42-select-title">状態：</div>
          <select 
            id="select-status" 
            name="status"
            value={selectedStatus} 
            className="m42-select-status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option key={"select-s-0"} value="">全て</option>
            <option key={"select-s-1"} value="計画未提出">計画未提出</option>
            <option key={"select-s-2"} value="計画書監査中">計画書監査中</option>
            <option key={"select-s-3"} value="計画書差戻">計画書差戻</option>
            <option key={"select-s-4"} value="PJ推進中">PJ推進中</option>
            <option key={"select-s-5"} value="完了報告書監査中">完了報告書監査中</option>
            <option key={"select-s-6"} value="完了報告書差戻">完了報告書差戻</option>
            <option key={"select-s-7"} value="完了">完了</option>
          </select>
          <div className="m42-select-title">PL：</div>
          <div className="m42-select-pl">
            <SelectEmployee
              value={selectedPl}
              setValue={handleSetPl}
              width={110}
              height={25}
            />
          </div>
          <div className="m42-select-title">並び順：</div>
          <select 
            id="select-order" 
            name="order"
            value={selectedOrder} 
            className="m42-select-order"
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option key={"select-o-0"} value="">No.</option>
            <option key={"select-o-1"} value="development_period_fr">計画開始日</option>
            <option key={"select-o-2"} value="development_period_to">計画終了日</option>
          </select>
          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SearchIcon />} 
            sx={{height:25}}
            onClick={(e) => handleGetPrj()}
            >
            表示
          </Button>
        </div>

        <table className="m42-table-hd">
          <thead>
            <tr>
              <td rowSpan="2" className="m42-th m42-number-td">No.</td>
              <td rowSpan="2" className="m42-th m42-name-td">プロジェクト名</td>
              <td rowSpan="2" className="m42-th m42-date-td">承認日</td>
              <td rowSpan="2" className="m42-th m42-plname-td">担当PL</td>
              <td rowSpan="2" className="m42-th m42-status-td">状況</td>
              <td colSpan="2" className="m42-th">計画期間</td>
              <td rowSpan="2" className="m42-th m42-link-td">進捗</td>
            </tr>
            <tr>
              <td className="m42-th m42-date-td">開始</td>
              <td className="m42-th m42-date-td">終了</td>
            </tr>
          </thead>
        </table>

        <div className="m42-frame">
          <table className="m42-table-bd">
            <tbody>
              {data.projects ? (
                data.projects.map((p,i) =>
                  <tr key={"prj-" + i}>
                    <td className="m42-number-td">{toStr(p.number)}</td>
                    <td className="m42-name-td">{toStr(p.name)}</td>
                    <td className="m42-date-td">{formatDateZero(p.approval_date, "YYYY年MM月DD日")}</td>
                    <td className="m42-plname-td">{toStr(p.pl_name)}</td>
                    <td className="m42-status-td">{toStr(p.status)}</td>
                    <td className="m42-date-td">{formatDateZero(p.development_period_fr, "YYYY年MM月DD日")}</td>
                    <td className="m42-date-td">{formatDateZero(p.development_period_to, "YYYY年MM月DD日")}</td>
                    <td className="m42-link-td">
                      <button 
                        className="link-style-btn" 
                        type="button" 
                        onClick={() => handleLinkClick(p)} >
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
      <ProgRepIndexPage prjInfo={prjInfo} closeWin={closeProgRep} />
    </div>
  )
}
export default PrjIndexPage;