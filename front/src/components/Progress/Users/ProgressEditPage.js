import "./ProgressEditPage.css";
import { useEffect, useState } from 'react';
import { getPhases } from '../../../lib/api/phase';
import { getTasksByPhase, getTasksByProject, updateTasksActualDate } from '../../../lib/api/task';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { displayDate } from '../../../lib/common/datetostr';
import { isEmptyNum } from '../../../lib/common/numberCom';
import CustomDatePicker from "../../common/customDatePicker";
import ModalConfirm from '../../common/ModalConfirm';
import ModalMessage from '../../common/ModalMessage';

const ProgressEditPage = (props) => {
  const { prjInfo, setPrjInfo } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState("");
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [modalMsg, setModalMsg] = useState("");

  // 初期処理
  useEffect(() => {
    if (!isEmptyNum(prjInfo.id)) {
      // 工程情報取得
      handleGetPhases(prjInfo.id);
      // タスク情報取得
      handleGetTasks();
      // メッセージ初期化
      setMessage({kbn: "", msg: ""});
    }
  },[prjInfo]);

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

  const SelectPhase = () => {
    return (
      <select 
        id="select-phase" 
        name="phase"
        value={selectedPhase} 
        className="select-phase"
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

  const handleGetTasks = async () => {

    try {
      let res;
      if (selectedPhase==="") {
        // 対象プロジェクト全タスク取得
        res = await getTasksByProject(Number(prjInfo.id));
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

  const setMark = (v) => {
    if (v===true) {
      return "●";
    } else {
      return "";
    }
  }

  const handleChange = (i,name,value) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][name] = value;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirm({
      ...confirm,
      msg: "この内容で登録します。よろしいですか？",
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
      const res = await updateTasksActualDate(prjInfo.id, data);
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

  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  const handleMessageOK = () => {
    setModalMsg("");
  }

  return (
    <>
    { prjInfo ? (
      <div className="m5-prog-edit-background">
        <div className="m5-prog-edit-container">
          <div className="header-area">
            <div className="header-title">進捗入力</div>
            <button 
              className="link-style-btn link-return" 
              type="button" 
              onClick={() => setPrjInfo("")}>
              ≫戻る
            </button>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="prj-name">{"プロジェクト名：　[" + prjInfo.number + "]"  + prjInfo.name}</div>

          <div className="search-area">
            <div className="select-title">工程：</div>
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

          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<SaveAltIcon />} 
              sx={{height:25}}
              onClick={(e) => handleSubmit(e)}>
              登録
            </Button>
          </div>

          <table className="table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="header-td phase-td">工程</td>
                <td rowSpan="2" className="header-td name-td">タスク</td>
                <td rowSpan="2" className="header-td outsourcing-td">外注</td>
                <td rowSpan="2" className="header-td worker-td">担当者</td>
                <td rowSpan="2" className="header-td load-td">予定工数（人日）</td>
                <td colSpan="2" className="header-td">予定</td>
                <td colSpan="2" className="header-td">実績</td>
              </tr>
              <tr>
                <td className="header-td date-td">開始</td>
                <td className="header-td date-td">終了</td>
                <td className="header-td date-td">開始</td>
                <td className="header-td date-td">終了</td>
              </tr>
            </thead>
          </table>

          <div className="table-frame">
            <table className="table-bd">
              <tbody>
                {data.tasks ? (
                  data.tasks.map((t,i) =>
                    <tr key={"task-" + i}>
                      <td className="phase-td left-td">{t.phase_name}</td>
                      <td className="name-td left-td">{t.name}</td>
                      <td className="outsourcing-td center-td">{setMark(t.outsourcing)}</td>
                      <td className="worker-td left-td">{t.worker_name}</td>
                      <td className="load-td right-td">{t.planned_workload}</td>
                      <td className="date-td center-td">{displayDate(t.planned_periodfr)}</td>
                      <td className="date-td center-td">{displayDate(t.planned_periodto)}</td>
                      <td className="date-td center-td">
                        <CustomDatePicker 
                          selected={t.actual_periodfr || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className="date-field"
                          onChange={handleChange}
                          name="actual_periodfr"
                          index={i}
                        />
                      </td>
                      <td className="date-td center-td">
                        <CustomDatePicker 
                          selected={t.actual_periodto || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className="date-field"
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