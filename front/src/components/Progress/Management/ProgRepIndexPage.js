import "./ProgRepIndexPage.css";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../App';
import { createProgReport } from '../../../lib/api/progressreport';
import { getProgsByProject } from '../../../lib/api/progressreport';
import { isEmptyNum } from '../../../lib/common/numberCom';
import { displayDate } from "../../../lib/common/datetostr";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ModalConfirm from '../../common/ModalConfirm';
import ModalLoading from '../../common/ModalLoading';
import ProgRepDetailPage from './ProgRepDetailPage';

const wday = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const outsourcing = ["そのまま集計", "除外して集計", "PVで見做し集計", "EVで見做し集計"];

const ProgRepIndexPage = (props) => {
  const { prjInfo, setPrjInfo } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [selectedWDay, setSelectedWDay] = useState("5");  //初期値=金曜
  const [selectedOut, setSelectedOut] = useState("0");  //初期値=そのまま
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [loading, setLoading] = useState(false);
  const [progId, setProgId] = useState("");

  // 初期処理
  useEffect(() => {
    setSelectedWDay("5");
    setSelectedOut("0");
    // メッセージ初期化
    setMessage({kbn: "", msg: ""});        
    if (!isEmptyNum(prjInfo.id)) {
      handleGetProgs(prjInfo.id);
    }
  },[prjInfo]);

  // 進捗レポート取得
  const handleGetProgs = async (id) => {
    try {
      const res = await getProgsByProject(Number(id));
      const tmpProgs = res.data.progs.map(p => {
        const tmpProg = {};
        tmpProg.id = p.id;
        tmpProg.make_name = p.make_name;
        tmpProg.totaling_day = p.totaling_day;
        tmpProg.outsourcing = p.outsourcing;
        tmpProg.development_period_fr = p.development_period_fr
        tmpProg.development_period_to = p.development_period_to
        tmpProg.created_at = p.created_at;
        return tmpProg;
      });
      setData({
        progs: tmpProgs
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "進捗レポート取得エラー"});
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirm({
      ...confirm,
      msg: "進捗レポートを作成します。よろしいですか？",
      tag: "",
    })
  }

  const handleConfirmOK = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      // loading ON
      setLoading(true);
      const res = await createProgReport(prjInfo.id, setParam);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "進捗レポート作成エラー(500)"});
        // loading OFF
        setLoading(false);
      } else {
        // loading OFF
        setLoading(false);
        handleGetProgs(prjInfo.id);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "進捗レポート作成エラー"});
      // loading OFF
      setLoading(false);
    }
  }

  // パラメータ
  const setParam = {
    make_id: empInfo.id,
    totaling_day: selectedWDay,
    outsourcing: selectedOut,
  }

  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  return (
    <>
    { prjInfo ? (
      <div className="m6-prog-index-background">
        <div className="m6-prog-index-container">
          <div className="header-area">
            <div className="header-title">進捗レポート</div>
            <button 
              className="link-style-btn link-return" 
              type="button" 
              onClick={() => setPrjInfo("")}>
              ≫戻る
            </button>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="prj-name">{"プロジェクト名：　[" + prjInfo.number + "]"  + prjInfo.name}</div>

          <div className="input-area">
            <div className="title">EVM計測曜日：</div>
            <div className="value">
              <select 
                id="select-wday" 
                name="wday"
                value={selectedWDay} 
                className="select-wday"
                onChange={(e) => setSelectedWDay(e.target.value)}
              >
                { wday ? (
                  wday.map((w,i) => (
                    <option key={"select-w-" + i} value={i}>{w}</option>
                  ))
                ) : (
                  <></>
                )}
              </select>
            </div>
            <div className="title">外注タスクの取扱：</div>
            <div className="value">
              <select 
                id="select-out" 
                name="out"
                value={selectedOut} 
                className="select-out"
                onChange={(e) => setSelectedOut(e.target.value)}
              >
                { outsourcing.map((o,i) => (
                    <option key={"select-o-" + i} value={i}>{o}</option>
                ))}
              </select>
            </div>
            <div className="button-area">
              <Button 
                size="small" 
                variant="contained" 
                endIcon={<SaveAltIcon />} 
                sx={{height:25}}
                onClick={(e) => handleSubmit(e)}>
                レポート作成
              </Button>
            </div>
          </div>

          <table className="table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="header-td date-td">作成日</td>
                <td rowSpan="2" className="header-td make-td">作成者</td>
                <td rowSpan="2" className="header-td wday-td">{`EVM\n計測曜日`}</td>
                <td rowSpan="2" className="header-td outsourcing-td">外注タスクの取扱</td>
                <td colSpan="2" className="header-td">開発期間（計画）</td>
                <td rowSpan="2" className="header-td link-td">レポート</td>
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
                {data.progs ? (
                  data.progs.map((p,i) =>
                    <tr key={"prog-" + i}>
                      <td className="date-td center-td">{displayDate(p.created_at)}</td>
                      <td className="make-td left-td">{p.make_name}</td>
                      <td className="wday-td center-td">{wday[p.totaling_day]}</td>
                      <td className="outsourcing-td center-td">{outsourcing[p.outsourcing]}</td>
                      <td className="date-td center-td">{displayDate(p.development_period_fr)}</td>
                      <td className="date-td center-td">{displayDate(p.development_period_to)}</td>
                      <td className="link-td center-td">
                        <button 
                          className="link-style-btn link-detail" 
                          type="button" 
                          onClick={() => setProgId(p.id)} >
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
        <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
        <ModalLoading loading={loading} />
        <ProgRepDetailPage progId={progId} setProgId={setProgId} />
      </div>
    ) : (
      <></>
    )}
    </>
  )

}
export default ProgRepIndexPage;