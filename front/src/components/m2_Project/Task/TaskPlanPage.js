// m2f
import "./TaskPlanPage.css";
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getTasks, updateTasksForPlan } from '../../../lib/api/task';
import CustomDatePicker from "../../common/customDatePicker";
import SelectEmployee from "../../common/SelectEmployee";
import ModalConfirm from '../../common/ModalConfirm';
import { decimalOnly } from '../../../lib/common/InputRegulation';
import { isEmpty } from "../../../lib/common/isEmpty";
import { formatDateZero } from '../../../lib/common/dateCom';

const initData = {phase: {prj_number: "",
                          prj_name: "",
                          name: "",
                          planned_periodfr: "",
                          planned_periodto: "",
                          planned_workload: 0,
                          planned_outsourcing_workload: 0},
                  tasks: []
}

const TaskPlanPage = (props) => {
  const { phaseId, handleDialogClose } = props;
  const [data, setData] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [msgs, setMsgs] = useState([]);  

  // 初期処理
  useEffect(() => {
    if(!isEmpty(phaseId)) {
      handleGetTasks();
    }
  },[phaseId]);

  // タスク情報取得
  const handleGetTasks = async () => {
    try {
      const res = await getTasks(Number(phaseId));
      const tmpTasks = res.data.tasks.map(task => {
        const tmpTask = {};
        tmpTask.id = task.id;
        tmpTask.name = task.name;
        tmpTask.worker_id = task.worker_id;
        tmpTask.worker_name = task.workder_name;
        tmpTask.outsourcing = task.outsourcing;
        tmpTask.planned_workload = task.planned_workload;
        tmpTask.planned_periodfr = task.planned_periodfr;
        tmpTask.planned_periodto = task.planned_periodto;
        tmpTask.del = false;
        return tmpTask;
      });
      setData({
        ...data,
        phase: {prj_number: res.data.phase.prj_number,
                prj_name: res.data.phase.prj_name,
                name: res.data.phase.name,
                planned_periodfr: res.data.phase.planned_periodfr,
                planned_periodto: res.data.phase.planned_periodto,
                planned_workload: res.data.phase.planned_workload,
                planned_outsourcing_workload: res.data.phase.planned_outsourcing_workload
        },
        tasks: tmpTasks
      });
    } catch (e) {
      setMsgs([{message: "タスク情報取得エラー",
              severity: "error",}]);
    }
  }

  // 画面終了時の処理
  const handleClose = (e) => {
    handleDialogClose();
    setData(initData);
    setMsgs([]);
  }

  // タスク追加ボタン押下時の処理
  // パラメータにより先頭、中間、末尾のいずれかに追加
  const handleAddTask = (i) => {
    const tmpTask = [{id: "",
                      name: "",
                      worker_id: "",
                      worker_name: "",
                      outsourcing: false,
                      planned_workload: 0,
                      planned_periodfr: "",
                      planned_periodto: "",
                      del: false
                    }];
    
    if(i===undefined || i===null || i==="") {
      // 末尾に追加
      setData({
        ...data,
        tasks: [...data.tasks,
              {id: "",
                name: "",
                worker_id: "",
                worker_name: "",
                outsourcing: false,
                planned_workload: 0,
                planned_periodfr: "",
                planned_periodto: "",
                del: false
              }
        ],
      });
    } else if(i===0) {
      // 先頭に追加
      let _tmpTasks = tmpTask.slice();
      let tmpTasks = _tmpTasks.concat(data.tasks);
      setData({
        ...data,
        tasks: tmpTasks,
      });
    } else {
      // 中間（指定箇所）に追加
      let _tmpTasks = data.tasks.slice(0,i);
      let tmpTasks = _tmpTasks.concat(tmpTask, data.tasks.slice(i));  
      setData({
        ...data,
        tasks: tmpTasks,
      });
    }
  }

  // 画面項目入力時の処理
  const handleChange = (i,name,value) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][name] = value;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  // 画面チェックボックス変更時の処理
  const handleCheckbox = (i,e) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  // 合計工数集計(人日)
  const getTotalWorkLoad = () => {
    let wl = 0;
    data.tasks.forEach(function(task, index) {
      if(!task.del) {
        if(!task.outsourcing) {
          wl += Number(task.planned_workload);
        }  
      }
    })
    return wl;
  }

  // 合計工数集計(人月)
  const getTotalWorkLoadM = () => {
    return Math.round((getTotalWorkLoad() / 20) * 100) / 100;
  }

  // 合計外注工数集計(人日)
  const getTotalOutWorkLoad = () => {
    let wl = 0;
    data.tasks.forEach(function(task, index) {
      if(!task.del){
        if(task.outsourcing) {
          wl += Number(task.planned_workload);
        }  
      }
    })
    return wl;
  }

  // 合計外注工数集計(人月)
  const getTotalOutWorkLoadM = () => {
    return Math.round((getTotalOutWorkLoad() / 20) * 100) / 100;
  }

  // 入力チェック
  const checkInput = () => {
    let err=[];
    data.tasks.map((task,i) => {
      if(!task.del) {
        if(task.outsourcing) {
          if (isEmpty(task.name) || isEmpty(task.planned_periodfr) || isEmpty(task.planned_periodto)) {
            // いずれか未入力の場合エラー
            err[err.length] = {message: "作業名、予定日に未入力があります。（" + (i + 1) + "行目）", severity: "error",};
          }  
        } else{
          if (isEmpty(task.name) || isEmpty(task.worker_id) || isEmpty(task.planned_periodfr) || isEmpty(task.planned_periodto)) {
            // いずれか未入力の場合エラー
            err[err.length] = {message: "作業名、担当者、予定日に未入力があります。（" + (i + 1) + "行目）", severity: "error",};
          }  
        }
        if (!isEmpty(task.planned_periodfr) && !isEmpty(task.planned_periodto)) {
          if (task.planned_periodfr > task.planned_periodto) {
            // 開始＞完了の場合エラー
            err[err.length] = {message: "開始予定日・完了予定日が不正です。（開始＜完了）（" + (i + 1) + "行目）", severity: "error",};
          }
        }
      }
    });

    if (err.length > 0) {
      setMsgs(err);
      return true;
    } else {
      return false;
    }
  }

  // 保存ボタン押下時の処理
  const handleSubmit = (e) => {
    // 入力チェック
    if (!checkInput()) {
      setConfirm({
        ...confirm,
        msg: "この内容で登録します。よろしいですか？",
        tag: "",
      })  
    }
  }

  // 保存確認OKボタン押下時の処理
  const handleConfirmOK = async (dummy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateTasksForPlan(phaseId, data)
      if (res.data.status === 500) {
        setMsgs([{message: "タスク情報更新エラー(500)",
                severity: "error",}]);
      } else {
        handleClose();
      }
    } catch (e) {
      setMsgs([{message: "タスク情報更新エラー",
              severity: "error",}]);
    }
  }

  // 保存確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
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
    { phaseId ? (
      <div className="overlay">
        <div className="m2f-container">
          <div className="m2f-header-area">
            <div className="m2f-header-title">タスク編集</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          {msgs ? (
            <div>
              {msgs.map((msg,i) =>
                <Alert severity={msg.severity}>{msg.message}</Alert>
              )}
            </div>
          ) : (
            <></>
          )}

          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SaveAltIcon />} 
            onClick={(e) => handleSubmit(e)}
            disabled={!(Number(getTotalWorkLoadM()) === Number(data.phase.planned_workload)) || !(Number(getTotalOutWorkLoadM()) === Number(data.phase.planned_outsourcing_workload))}
            style={{marginTop:10, marginLeft:20}}
          >
            保存
          </Button>

          <div className="m2f-prj-name">{"[" + data.phase.prj_number + "]" + data.phase.prj_name}</div>
          
          <table className="m2f-phase">
            <tbody>
              <tr>
                <td className="m2f-phase-name-ttl">工程</td>
                <td className="m2f-phase-name-val">{toStr(data.phase.name)}</td>
                <td className="m2f-phase-period-ttl">計画期間</td>
                <td className="m2f-phase-period-val">{formatDateZero(data.phase.planned_periodfr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(data.phase.planned_periodto, "YYYY年MM月DD日")}</td>
                <td className="m2f-phase-workload-ttl">計画作業工数</td>
                <td className="m2f-phase-workload-val">{Number(toStr(data.phase.planned_workload)) + " 人月"}</td>
                <td className="m2f-phase-workload-ttl">計画外注工数</td>
                <td className="m2f-phase-workload-val">{Number(toStr(data.phase.planned_outsourcing_workload)) + " 人月"}</td>
              </tr>
            </tbody>
          </table>

          <table className="m2f-sum">
            <tbody>
              <tr>
                <td className="m2f-sum-ttl">作業工数計</td>
                <td className={'m2f-sum-val ' + ((Number(getTotalWorkLoadM()) === Number(data.phase.planned_workload)) ? '' : 'm2f-alert')}>
                  {getTotalWorkLoadM() + " 人月"}
                  {"（" + getTotalWorkLoad() + " 人日）"}
                </td>
                <td className="m2f-sum-ttl">外注工数計</td>
                <td className={'m2f-sum-val ' + ((Number(getTotalOutWorkLoadM()) === Number(data.phase.planned_outsourcing_workload)) ? '' : 'm2f-alert')}>
                  {getTotalOutWorkLoadM() + " 人月"}
                  {"（" + getTotalOutWorkLoad() + " 人日）"}
                </td>
              </tr>
            </tbody>
          </table>


          <table className="m2f-table-hd">
            <thead>
              <tr>
                <td className="m2f-th m2f-task-add-td"></td>
                <td className="m2f-th m2f-task-name-td">作業名</td>
                <td className="m2f-th m2f-task-outsourcing-td">外注</td>
                <td className="m2f-th m2f-task-worker-td">担当者</td>
                <td className="m2f-th m2f-task-workload-td">予定工数（人日）</td>
                <td className="m2f-th m2f-task-period-td">開始予定日</td>
                <td className="m2f-th m2f-task-period-td">完了予定日</td>
                <td className="m2f-th m2f-task-del-td">削除</td>
              </tr>
            </thead>
          </table>
          <div className="m2f-table-frame">
            <table className="m2f-table">
              <tbody>
                {data.tasks ? (
                  data.tasks.map((t, i) =>
                  <>
                    <tr key={"task-" + i}>
                      <td className={'m2f-task-add-td ' + (t.del ? 'm2f-delete' : '')}>
                        <button className="link-style-btn" onClick={() => handleAddTask(i)}>行挿入↑</button>
                      </td>
                      <td className={'m2f-task-name-td ' + (t.del ? 'm2f-delete' : '')}>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          maxLength="20"
                          className={'m2f-task-name ' + (t.del ? 'm2f-delete' : '')} 
                          onChange={(e) => handleChange(i, e.target.name, e.target.value)} 
                          value={toStr(t.name)} 
                        />
                      </td>
                      <td className={'m2f-task-outsourcing-td ' + (t.del ? 'm2f-delete' : '')}>
                        <input 
                          type="checkbox"
                          name="outsourcing"
                          checked={t.outsourcing || false}
                          onChange={(e) => handleCheckbox(i,e)}
                        />

                      </td>
                      <td className={'m2f-task-worker-td ' + (t.del ? 'm2f-delete' : '')}>
                        <SelectEmployee
                          name="worker_id" 
                          value={toStr(t.worker_id)} 
                          setValue={handleChange}
                          index={i}
                          width={114}
                          height={20}
                          border="0.5px solid #aaa"
                        />
                      </td>
                      <td className={'m2f-task-workload-td ' + (t.del ? 'm2f-delete' : '')}>
                        <input 
                          type="text" 
                          name="planned_workload" 
                          id="planned_workload" 
                          maxLength="5"
                          className={'m2f-task-planned_workload ' + (t.del ? 'm2f-delete' : '')}
                          onChange={(e) => handleChange(i, e.target.name, decimalOnly(e.target.value))} 
                          value={toStr(t.planned_workload)} 
                        />
                      </td>
                      <td className={'m2f-task-period-td '+ (t.del ? 'm2f-delete' : '')}>
                        <CustomDatePicker 
                          selected={toStr(t.planned_periodfr)} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'m2f-date ' + (t.del ? 'm2f-delete' : '')}
                          onChange={handleChange}
                          name="planned_periodfr"
                          index={i}
                        />
                      </td>
                      <td className={'m2f-task-period-td '+ (t.del ? 'm2f-delete' : '')}>
                        <CustomDatePicker 
                          selected={toStr(t.planned_periodto)} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'m2f-date ' + (t.del ? 'm2f-delete' : '')}
                          onChange={handleChange}
                          name="planned_periodto"
                          index={i}
                        />
                      </td>
                      <td className="m2f-task-del-td">
                        <input 
                          type="checkbox"
                          name="del"
                          checked={t.del || false}
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
          <div className="m2f-button-area">
            <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAddTask()}>
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

export default TaskPlanPage;