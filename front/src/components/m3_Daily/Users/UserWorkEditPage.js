// m32
import "./UserWorkEditPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isEmpty } from "../../../lib/common/isEmpty";
import { formatTime } from '../../../lib/common/timeCom';
import { formatDateZero } from '../../../lib/common/dateCom';
import { zeroPadding } from "../../../lib/common/stringCom";
import { getWorkReps, updateWorkReps } from '../../../lib/api/daily';
import { getPrjsByMem } from '../../../lib/api/project';
import { getPhases } from '../../../lib/api/phase';
import { getTasksWithoutOutsourcing } from '../../../lib/api/task'
import ModalConfirm from '../../common/ModalConfirm';
              
const UserWorkEditPage = (props) => {
  const { dailyInfo, closeWin } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [prjs, setPrjs] = useState({});
  const [preFlg,setPreFlg] = useState(1);
  const [preSum, setPreSum] = useState("");
  const [overFlg,setOverFlg] = useState(1);
  const [overSum, setOverSum] = useState("");

  // 初期処理
  useEffect(() => {
    if(!isEmpty(dailyInfo.id)){
      handleGetWorkReports();
      handleGetPrjs();
      setPreSum(formatTime(dailyInfo.prescribed_h,dailyInfo.prescribed_m));
      setOverSum(formatTime(dailyInfo.over_h,dailyInfo.over_m));
    }
  },[dailyInfo]);

  // 作業日報情報取得
  const handleGetWorkReports = async () => {
    try {
      const res = await getWorkReps(Number(dailyInfo.id));
      const tmpWorkReports = res.data.workreports.map(report => {
        const tmpReport = {}
        tmpReport.id = report.id;
        tmpReport.project_id = report.project_id;
        tmpReport.phase_id = report.phase_id;
        tmpReport.task_id = report.task_id;
        tmpReport.hour = zeroPadding(report.hour, 2);
        tmpReport.minute = zeroPadding(report.minute, 2);
        tmpReport.over_h = zeroPadding(report.over_h, 2);
        tmpReport.over_m = zeroPadding(report.over_m, 2);
        tmpReport.comments = report.comments;
        tmpReport.del = false;
        return tmpReport;
      });
      setData({
        ...data,
        workreports: tmpWorkReports,
        dailyreport: {work_prescribed_h: dailyInfo.prescribed_h,
                      work_prescribed_m: dailyInfo.prescribed_m,
                      work_over_h: dailyInfo.over_h,
                      work_over_m: dailyInfo.over_m
        }
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
    }
  }

  // プロジェクト情報取得（リストボックス用）
  const handleGetPrjs = async () => {
    try {
//      const res = await getPrjsByMem(Number(empInfo.id), dailyInfo.date);
      const res = await getPrjsByMem(Number(empInfo.id), Number(empInfo.division_id), Number(empInfo.department_id), dailyInfo.date);
      setPrjs(res.data);      
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    }
  }

  // 画面終了時の処理
  const handleClose = (e) => {
    closeWin();
    setData([]);
  }

  // 行追加ボタン押下時の処理
  const handleAddReport = () => {
    setData({
      ...data,
      workreports: [...data.workreports,
        {id: "",
          project_id: "",
          phase_id: "",
          task_id: "",
          hour: "",
          minute: "",
          over_h: "",
          over_m: "",
          comments: "",
          del: false
        }
      ],
    });
  }

  // 画面項目入力時の処理
  const handleChange = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.value;
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

  // プロジェクト変更時の処理
  const handlePrjChange = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.value;
    tmpReports[i]["phase_id"] = "";
    tmpReports[i]["task_id"] = "";
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

  // 工程変更時の処理
  const handlePhaseChange = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.value;
    tmpReports[i]["task_id"] = "";
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

  // チェックボックス変更時の処理
  const handleCheckbox = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

  // 合計項目集計
  const setSummary = (tmpReports) => {
    let pre_h = 0;
    let pre_m = 0;
    let over_h = 0;
    let over_m = 0;
    for (let j=0; j<tmpReports.length; j++) {
      if(!tmpReports[j]["del"]) {
        pre_h += Number(tmpReports[j]["hour"]);
        pre_m += Number(tmpReports[j]["minute"]);
        over_h += Number(tmpReports[j]["over_h"]);
        over_m += Number(tmpReports[j]["over_m"]);
      }
    }

    let input_val = pre_h * 60 + pre_m;
    let target_val = Number(dailyInfo.prescribed_h) * 60 + Number(dailyInfo.prescribed_m);
    if(target_val > input_val) {
      let ret_m = (target_val - input_val) % 60;
      let ret_h = (target_val - input_val - ret_m) / 60;
      setPreSum(ret_h + ":" + ('0' + ret_m).slice(-2));
      setPreFlg(1);
    } else if(target_val < input_val) {
      let ret_m = (input_val - target_val) % 60;
      let ret_h = (input_val - target_val - ret_m) / 60;
      setPreSum("-" + ret_h + ":" + ('0' + ret_m).slice(-2));
      setPreFlg(-1);
    } else {
      setPreSum("0:00");
      setPreFlg(0);
    }

    input_val = over_h * 60 + over_m;
    target_val = Number(dailyInfo.over_h) * 60 + Number(dailyInfo.over_m);
    if(target_val > input_val) {
      let ret_m = (target_val - input_val) % 60;
      let ret_h = (target_val - input_val - ret_m) / 60;
      setOverSum(ret_h + ":" + ('0' + ret_m).slice(-2));
      setOverFlg(1);
    } else if(target_val < input_val) {
      let ret_m = (input_val - target_val) % 60;
      let ret_h = (input_val - target_val - ret_m) / 60;
      setOverSum("-" + ret_h + ":" + ('0' + ret_m).slice(-2));
      setOverFlg(-1);
    } else {
      setOverSum("0:00");
      setOverFlg(0);
    }
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
      const res = await updateWorkReps(dailyInfo.id, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
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

  // プロジェクトリストボックス
  const SelectProject = (props) => {
    const { value, index, handleChange, del } = props;
    
    return (
      <select 
        id="select-project" 
        name="project_id"
        value={value} 
        className={'m32-select-project ' + (del ? 'm32-delete' : '')} 
        onChange={(e) => handleChange(index,e)}
      >
        <option key="select-prj-0" value=""></option>
        {prjs.projects ? (
          prjs.projects.map((prj,i) => (
            <option key={"select-prj-" + i} value={prj.id}>{"[" + prj.number + "]" + prj.name}</option>
          ))
        ) : (
          <></>
        )}
      </select>
    );
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
    { dailyInfo.id ? (
      <div className="overlay">
        <div className="m32-container">
          <div className="m32-header-area">
            <div className="m32-header-title">日報詳細入力</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SaveAltIcon />} 
            onClick={(e) => handleSubmit(e)}
            disabled={(preFlg===0 && overFlg===0) ? false : true}
            style={{ marginTop:20, marginLeft:20, marginBottom:20 }}
            >
            登録
          </Button>

          <div className="m32-date">{formatDateZero(dailyInfo.date, "YYYY年MM月DD日")}</div>

          <table className="m32-summary">
            <tbody>
              <tr>
                <td className="m32-summary-hd">所定時間</td>
                <td className={preFlg<0 ? "m32-minus" : ""}>{preSum}</td>
                <td className="m32-summary-hd">時間外</td>
                <td className={overFlg<0 ? "m32-minus" : ""}>{overSum}</td>
              </tr>
            </tbody>
          </table>

          <table className="m32-table-hd">
            <thead>
              <tr>
                <td className="m32-th m32-prj-td">プロジェクト</td>
                <td className="m32-th m32-phase-td">工程</td>
                <td className="m32-th m32-task-td">タスク</td>
                <td className="m32-th m32-time-td">所定時間</td>
                <td className="m32-th m32-time-td">時間外</td>
                <td className="m32-th m32-comments-td">備考</td>
                <td className="m32-th m32-del-td">削除</td>
              </tr>
            </thead>
          </table>

          <div className="m32-frame">
            <table className="m32-table-bd">
              <tbody>
                {data.workreports ? (
                  data.workreports.map((report, i) => 
                  <>
                    <tr key={"work-" + i}>
                      <td className={'m32-prj-td ' + (report.del ? 'm32-delete' : '')}>
                        <SelectProject value={report.project_id} index={i} handleChange={handlePrjChange} del={report.del} />
                      </td>
                      <td className={'m32-phase-td ' + (report.del ? 'm32-delete' : '')}>
                        <SelectPhase prjId={report.project_id} value={report.phase_id} index={i} handleChange={handlePhaseChange} del={report.del} setMessage={setMessage} />
                      </td>
                      <td className={'m32-task-td ' + (report.del ? 'm32-delete' : '')}>
                        <SelectTask phaseId={report.phase_id} value={report.task_id} index={i} handleChange={handleChange} del={report.del} setMessage={setMessage} />
                      </td>
                      <td className={'m32-time-td ' + (report.del ? 'm32-delete' : '')}>
                        <div className="m32-time-area">
                          <input 
                            type="text" 
                            name="hour" 
                            id="hour" 
                            maxLength="2"
                            className={'m32-edit-time-h ' + (report.del ? 'm32-delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={toStr(report.hour)} 
                          />
                          <div className="m32-inner-caption">{":"}</div>
                          <input 
                            type="text" 
                            name="minute" 
                            id="minute" 
                            maxLength="2"
                            className={'m32-edit-time-m ' + (report.del ? 'm32-delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={toStr(report.minute)} 
                          />
                        </div>
                      </td>
                      <td className={'m32-time-td ' + (report.del ? 'm32-delete' : '')}>
                        <div className="m32-time-area">
                          <input 
                            type="text" 
                            name="over_h" 
                            id="over_h" 
                            maxLength="2"
                            className={'m32-edit-time-h ' + (report.del ? 'm32-delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={toStr(report.over_h)} 
                          />
                          <div className="m32-inner-caption">{":"}</div>
                          <input 
                            type="text" 
                            name="over_m" 
                            id="over_m" 
                            maxLength="2"
                            className={'m32-edit-time-m ' + (report.del ? 'm32-delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={toStr(report.over_m)} 
                          />
                        </div>
                      </td>
                      <td className={'m32-comments-td ' + (report.del ? 'm32-delete' : '')}>
                        <input 
                          type="text" 
                          name="comments" 
                          id="comments" 
                          maxLength="20"
                          className={'m32-comments ' + (report.del ? 'm32-delete' : '')}
                          onChange={(e) => handleChange(i,e)} 
                          value={toStr(report.comments)} 
                        />
                      </td>
                      <td className="m32-del-td">
                        <input 
                          type="checkbox"
                          name="del"
                          id="del"
                          className="del"
                          value="del"
                          checked={report.del || false}
                          onChange={(e) => handleCheckbox(i,e)}
                        />
                      </td>
                    </tr>
                  </>                 
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>

          <div className="m32-button-area">
            <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAddReport()}>
              <AddCircleIcon sx={{ fontSize : 40 }} />
            </IconButton>
          </div>

          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />

        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  );

}
export default UserWorkEditPage;

// 工程リストボックス
const SelectPhase = (props) => {
  const { prjId, value, index, handleChange, del, setMessage } = props;
  const [phases, setPhases] = useState({});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {   
      handleGetPhases();
    } else {
      setPhases({});
    }
  },[prjId]);

  // 工程情報取得
  const handleGetPhases = async () => {
    try {
      const res = await getPhases(prjId);
      setPhases(res.data.phases);  
    } catch (e) {
      setMessage({kbn: "error", msg: "工程情報取得エラー"});
    }
  }

  // リストボックス編集
  return (
    <select 
      id="select-phase" 
      name="phase_id"
      value={value} 
      className={'m32-select-phase ' + (del ? 'm32-delete' : '')} 
      onChange={(e) => handleChange(index,e)}
    >
      <option key="select-phase-0" value=""></option>
      {phases.length ? (
        phases.map((phase,i) => (
          <option key={"select-phase-" + i} value={phase.id}>{phase.name}</option>
        ))
      ) : (
        <></>
      )}
    </select>
  );
}

// タスクリストボックス
const SelectTask = (props) => {
  const { phaseId, value, index, handleChange, del, setMessage } = props;
  const [tasks, setTasks] = useState({});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(phaseId)) {
      handleGetTasks();
    } else {
      setTasks({});
    }
  },[phaseId]);

  // タスク情報取得
  const handleGetTasks = async () => {
    try {
      const res = await getTasksWithoutOutsourcing(phaseId);
      setTasks(res.data.tasks);  
    } catch (e) {
      setMessage({kbn: "error", msg: "タスク情報取得エラー"});
    }
  }

  // リストボックス編集
  return (
    <select 
      id="select-task" 
      name="task_id"
      value={value} 
      className={'m32-select-task ' + (del ? 'm32-delete' : '')} 
      onChange={(e) => handleChange(index,e)}
    >
      <option key="select-task-0" value=""></option>
      {tasks.length ? (
        tasks.map((task,i) => (
          <option key={"select-task-" + i} value={task.id}>{task.name}</option>
        ))
      ) : (
        <></>
      )}
    </select>
  );
}
