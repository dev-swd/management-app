// m41
import "./ProgressEditPage.css";
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPhases } from '../../../lib/api/phase';
import { getTasksByPhase, getTasksByProject, updateTasksActualDate } from '../../../lib/api/task';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { formatDateZero } from '../../../lib/common/dateCom';
import { isEmpty } from '../../../lib/common/isEmpty';
import CustomDatePicker from "../../common/customDatePicker";
import ModalConfirm from '../../common/ModalConfirm';
import ModalMessage from '../../common/ModalMessage';

const ProgressEditPage = () => {
  const location = useLocation();
  const params = location.state;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState("");
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [modalMsg, setModalMsg] = useState("");

  // 初期処理
  useEffect(() => {
    if (!isEmpty(params.id)) {
      // 工程情報取得
      handleGetPhases(params.id);
      // タスク情報取得
      handleGetTasks();
      // メッセージ初期化
      setMessage({kbn: "", msg: ""});
    }
  },[params]);

  // 工程情報取得
  const handleGetPhases = async (id) => {
    try {
      const res = await getPhases(Number(id));
      const tmpPhases = res.data.phases.map(phase => {
        const tmpPhase = {};
        tmpPhase.id = phase.id;
        tmpPhase.name = phase.name;
        return tmpPhase;
      });
      setPhases({
        phases: tmpPhases
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "工程情報取得エラー"});
    }
  }

  // 絞り込み条件の工程リスト編集
  const SelectPhase = () => {
    return (
      <select 
        id="select-phase" 
        name="phase"
        value={selectedPhase} 
        className="m41-select-phase"
        onChange={(e) => setSelectedPhase(e.target.value)}
      >
        <option key={"select-p-all"} value="">全て</option>
        { phases.phases ? (
          phases.phases.map((p,i) => (
            <option key={"select-p-" + i} value={p.id}>{p.name}</option>
          ))
        ) : (
          <></>
        )}
      </select>
    )
  }

  // タスク情報取得
  const handleGetTasks = async () => {

    try {
      let res;
      if (isEmpty(selectedPhase)) {
        // 対象プロジェクト全タスク取得
        res = await getTasksByProject(Number(params.id));
      } else {
        // 選択工程のタスク取得
        res = await getTasksByPhase(Number(selectedPhase));
      }
      const tmpTasks = res.data.tasks.map(t => {
        const tmpTask = {};
        tmpTask.id = t.id;
        tmpTask.phase_name = t.phase_name;
        tmpTask.name = t.name;
        tmpTask.worker_id = t.worker_id;
        tmpTask.worker_name = t.worker_name;
        tmpTask.outsourcing = t.outsourcing;
        tmpTask.planned_workload = t.planned_workload;
        tmpTask.planned_periodfr = t.planned_periodfr;
        tmpTask.planned_periodto = t.planned_periodto;
        tmpTask.actual_periodfr = t.actual_periodfr;
        tmpTask.actual_periodto = t.actual_periodto;
        return tmpTask;
      });
      setData({
        ...data,
        tasks: tmpTasks
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "タスク情報取得エラー"});
    }
  }

  // 外注マーキング
  const setMark = (v) => {
    if (v===true) {
      return "●";
    } else {
      return "";
    }
  }

  // 項目入力時の処理
  const handleChange = (i,name,value) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][name] = value;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirm({
      ...confirm,
      msg: "この内容で登録します。よろしいですか？",
      tag: "",
    })
  }

  // 登録確認OKボタン押下時の処理
  const handleConfirmOK = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateTasksActualDate(params.id, data);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "タスク情報更新エラー(500)"});
      } else {
        setModalMsg("登録しました。");
        // メッセージ初期化
        setMessage({kbn: "", msg: ""});        
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "タスク情報更新エラー"});
    }
  }

  // 登録確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 登録完了メッセージOKボタン押下時の処理
  const handleMessageOK = () => {
    setModalMsg("");
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
    { params ? (
      <div className="m41-background">
        <div className="m5-prog-edit-container">
          <div className="m41-header-area">
            <div className="m41-header-title">進捗入力</div>
            <Button component={Link} to="/progress/user" sx={{fontSize:14, fontFamily:"sans-serif", textTransform: 'none'}}>≫戻る</Button>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="m41-prj-name">{"プロジェクト名：　[" + params.number + "]"  + params.name}</div>

          <div className="m41-search-area">
            <div className="m41-select-title">工程：</div>
            <SelectPhase />
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<SearchIcon />} 
              sx={{height:25}}
              onClick={(e) => handleGetTasks()}
              >
              表示
            </Button>
          </div>

          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SaveAltIcon />} 
            style={{height:25, marginTop:20, marginLeft:20}}
            onClick={(e) => handleSubmit(e)}>
            登録
          </Button>

          <table className="m41-table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="m41-th m41-phase-td">工程</td>
                <td rowSpan="2" className="m41-th m41-name-td">タスク</td>
                <td rowSpan="2" className="m41-th m41-outsourcing-td">外注</td>
                <td rowSpan="2" className="m41-th m41-worker-td">担当者</td>
                <td rowSpan="2" className="m41-th m41-load-th">予定工数（人日）</td>
                <td colSpan="2" className="m41-th">予定</td>
                <td colSpan="2" className="m41-th">実績</td>
              </tr>
              <tr>
                <td className="m41-th m41-date-td">開始</td>
                <td className="m41-th m41-date-td">終了</td>
                <td className="m41-th m41-date-td">開始</td>
                <td className="m41-th m41-date-td">終了</td>
              </tr>
            </thead>
          </table>

          <div className="m41-frame">
            <table className="m41-table-bd">
              <tbody>
                {data.tasks ? (
                  data.tasks.map((t,i) =>
                    <tr key={"task-" + i}>
                      <td className="m41-phase-td">{toStr(t.phase_name)}</td>
                      <td className="m41-name-td">{toStr(t.name)}</td>
                      <td className="m41-outsourcing-td">{setMark(t.outsourcing)}</td>
                      <td className="m41-worker-td">{toStr(t.worker_name)}</td>
                      <td className="m41-load-td">{toStr(t.planned_workload)}</td>
                      <td className="m41-date-td">{formatDateZero(t.planned_periodfr, "YYYY年MM月DD日")}</td>
                      <td className="m41-date-td">{formatDateZero(t.planned_periodto, "YYYY年MM月DD日")}</td>
                      <td className="m41-date-td">
                        <CustomDatePicker 
                          selected={toStr(t.actual_periodfr)} 
                          dateFormat="yyyy年MM月dd日" 
                          className="m41-date"
                          onChange={handleChange}
                          name="actual_periodfr"
                          index={i}
                        />
                      </td>
                      <td className="m41-date-td">
                        <CustomDatePicker 
                          selected={toStr(t.actual_periodto)} 
                          dateFormat="yyyy年MM月dd日" 
                          className="m41-date"
                          onChange={handleChange}
                          name="actual_periodto"
                          index={i}
                        />
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
        <ModalMessage modalMsg={modalMsg} handleOk={handleMessageOK} />
      </div>
    ) : (
      <></>
    )}
    </>

  );
}
export default ProgressEditPage;