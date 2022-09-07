// m43
import "./ProgRepIndexPage.css";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../App';
import { createProgReport } from '../../../lib/api/progressreport';
import { getProgsByProject } from '../../../lib/api/progressreport';
import { isEmpty } from '../../../lib/common/isEmpty';
import { formatDateZero } from '../../../lib/common/dateCom';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ModalConfirm from '../../common/ModalConfirm';
import ModalLoading from '../../common/ModalLoading';
import ProgRepDetailPage from './ProgRepDetailPage';

const wday = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const outsourcing = ["そのまま集計", "除外して集計", "PVで見做し集計", "EVで見做し集計"];

const ProgRepIndexPage = (props) => {
  const { prjInfo, closeWin } = props;
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
    if (!isEmpty(prjInfo.id)) {
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

  // レポート作成ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "進捗レポートを作成します。よろしいですか？",
      tag: "",
    })
  }

  // 確認OKボタン押下時の処理
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

  // レポート作成パラメータ
  const setParam = {
    make_id: empInfo.id,
    totaling_day: selectedWDay,
    outsourcing: selectedOut,
  }

  // 確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 画面終了時の処理
  const handleClose = () => {
    closeWin();
  }

  // 表示リンククリック時の処理
  const hancleClickLink = (progId) => {
    setProgId(progId);
  }

  // 進捗レポート終了時の処理
  const closeProgRep = () => {
    setProgId("");
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
    <>
    { prjInfo.id ? (
      <div className="m43-background">
        <div className="m6-prog-index-container">
          <div className="m43-header-area">
            <div className="m43-header-title">進捗レポート</div>
            <button 
              className="link-style-btn m43-link-return" 
              type="button" 
              onClick={() => handleClose()}>
              ≫戻る
            </button>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="m43-prj-name">{"プロジェクト名：　[" + prjInfo.number + "]"  + prjInfo.name}</div>

          <div className="m43-input-area">
            <div className="m43-title">EVM計測曜日：</div>
            <div className="m43-value">
              <select 
                id="select-wday" 
                name="wday"
                value={selectedWDay} 
                className="m43-select-wday"
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
            <div className="m43-title">外注タスクの取扱：</div>
            <div className="m43-value">
              <select 
                id="select-out" 
                name="out"
                value={selectedOut} 
                className="m43-select-out"
                onChange={(e) => setSelectedOut(e.target.value)}
              >
                { outsourcing.map((o,i) => (
                    <option key={"select-o-" + i} value={i}>{o}</option>
                ))}
              </select>
            </div>
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<SaveAltIcon />} 
              sx={{height:25}}
              onClick={(e) => handleSubmit(e)}>
              レポート作成
            </Button>
          </div>

          <table className="m43-table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="m43-th m43-date-td">作成日</td>
                <td rowSpan="2" className="m43-th m43-make-td">作成者</td>
                <td rowSpan="2" className="m43-th m43-wday-th">{`EVM\n計測曜日`}</td>
                <td rowSpan="2" className="m43-th m43-outsourcing-td">外注タスクの取扱</td>
                <td colSpan="2" className="m43-th">開発期間（計画）</td>
                <td rowSpan="2" className="m43-th m43-link-td">レポート</td>
              </tr>
              <tr>
                <td className="m43-th m43-date-td">開始</td>
                <td className="m43-th m43-date-td">終了</td>
              </tr>
            </thead>
          </table>

          <div className="m43-frame">
            <table className="m43-table-bd">
              <tbody>
                {data.progs ? (
                  data.progs.map((p,i) =>
                    <tr key={"prog-" + i}>
                      <td className="m43-date-td">{formatDateZero(p.created_at, "YYYY年MM月DD日")}</td>
                      <td className="m43-make-td">{toStr(p.make_name)}</td>
                      <td className="m43-wday-td">{wday[toStr(p.totaling_day)]}</td>
                      <td className="m43-outsourcing-td">{outsourcing[toStr(p.outsourcing)]}</td>
                      <td className="m43-date-td">{formatDateZero(p.development_period_fr, "YYYY年MM月DD日")}</td>
                      <td className="m43-date-td">{formatDateZero(p.development_period_to, "YYYY年MM月DD日")}</td>
                      <td className="m43-link-td">
                        <button 
                          className="link-style-btn" 
                          type="button" 
                          onClick={() => hancleClickLink(p.id)} >
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
        <ProgRepDetailPage progId={progId} closeWin={closeProgRep} />
      </div>
    ) : (
      <></>
    )}
    </>
  )

}
export default ProgRepIndexPage;