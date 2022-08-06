import "./PrjIndexPage.css";
import { useState } from 'react';
import { getPrjsByConditional } from '../../../lib/api/project';
import { getTest } from '../../../lib/api/progressreport';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { displayDate } from '../../../lib/common/datetostr';
import SelectEmployee from "../../common/SelectEmployee";
import ProgRepIndexPage from './ProgRepIndexPage';

const PrjIndexPage = () => {
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const [data, setData] = useState([]);
  const [prjInfo, setPrjInfo] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPl, setSelectedPl] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  // プロジェクト情報取得（画面指定条件）
  const handleGetPrj = async () => {

    try {
      const res = await getPrjsByConditional(selectedStatus, selectedPl, selectedOrder);
      setData(res.data);
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    } 
  }

  const handleSetPl = (empid, empname) => {
    setSelectedPl(empid);
  }

  // test
  const test = async (id) => {
    try {
      const res = await getTest(id);
    } catch (e) {
      setMessage("進捗情報取得エラー");
      setMessageVar("error");
    } 

  }

  return (
    <div className="m6-prj-index-background">
      <div className="m6-prj-index-container">
        <div className="header-title">進捗管理（プロジェクト選択）</div>

        { message_var && <Alert severity={message_var}>{message}</Alert>}

        <div className="search-area">
          <div className="select-title">状態：</div>
          <select 
            id="select-status" 
            name="status"
            value={selectedStatus} 
            className="select-status"
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
          <div className="select-title">PL：</div>
          <div className="select-pl">
            <SelectEmployee
              value={selectedPl}
              setValue={handleSetPl}
              width={110}
              height={20}
            />
          </div>
          <div className="select-title">並び順：</div>
          <select 
            id="select-order" 
            name="order"
            value={selectedOrder} 
            className="select-order"
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
      <ProgRepIndexPage prjInfo={prjInfo} setPrjInfo={setPrjInfo} />
    </div>
  )
}
export default PrjIndexPage;