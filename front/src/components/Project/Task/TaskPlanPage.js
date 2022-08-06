import "./TaskPlanPage.css";
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getTasks, updateTasksForPlan } from '../../../lib/api/task';
import { displayDate } from '../../../lib/common/datetostr';
import CustomDatePicker from "../../common/customDatePicker";
import SelectEmployee from "../../common/SelectEmployee";
import ModalConfirm from '../../common/ModalConfirm';
import { decimalValidator } from '../../../lib/common/inputValidator.js';

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
  const { phaseId, setPhaseId } = props;
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [data, setData] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  useEffect(() => {
    if(phaseId===""){
    } else {
      handleGetTasks(phaseId);
    }
  },[phaseId]);

  const handleGetTasks = async (id) => {
    try {
      const res = await getTasks(Number(id));
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
      setMessage("タスク情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleClose = (e) => {
    setPhaseId("");
    setData(initData);
  }

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
      let _tmpTasks = tmpTask.slice();
      let tmpTasks = _tmpTasks.concat(data.tasks);
      setData({
        ...data,
        tasks: tmpTasks,
      });
    } else {
      let _tmpTasks = data.tasks.slice(0,i);
      let tmpTasks = _tmpTasks.concat(tmpTask, data.tasks.slice(i));  
      setData({
        ...data,
        tasks: tmpTasks,
      });
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

  const handleCheckbox = (i,e) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

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

  const getTotalWorkLoadM = () => {
    return Math.round((getTotalWorkLoad() / 20) * 100) / 100;
  }

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

  const getTotalOutWorkLoadM = () => {
    return Math.round((getTotalOutWorkLoad() / 20) * 100) / 100;
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
      const res = await updateTasksForPlan(phaseId, data)
      if (res.data.status === 500) {
        setMessage("タスク情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setPhaseId("");
      }
    } catch (e) {
      setMessage("タスク情報更新エラー");
      setMessageVar("error");
    }
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
    { phaseId ? (
      <div className="overlay">
        <div className="task-plan-container">
          <div className="header-area">
            <div className="header-title">タスク編集</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message_var && <Alert severity={message_var}>{message}</Alert>}

          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<SaveAltIcon />} 
              onClick={(e) => handleSubmit(e)}
              disabled={!(Number(getTotalWorkLoadM()) === Number(data.phase.planned_workload)) || !(Number(getTotalOutWorkLoadM()) === Number(data.phase.planned_outsourcing_workload))}>
              保存
            </Button>
          </div>

          <div className="prj-name">{"[" + data.phase.prj_number + "]" + data.phase.prj_name}</div>
          <div className="phase-info">
            <div className="name-t">工程</div>
            <div className="name">{data.phase.name}</div>
            <div className="period-t">計画期間</div>
            <div className="period">{displayDate(data.phase.planned_periodfr) + "〜" + displayDate(data.phase.planned_periodto)}</div>
            <div className="workload-t">計画作業工数</div>
            <div className="workload">{Number(data.phase.planned_workload) + " 人月"}</div>
            <div className="workload-t">計画外注工数</div>
            <div className="workload">{Number(data.phase.planned_outsourcing_workload) + " 人月"}</div>
          </div>

          <div className="sum-area">
            <div className="task-sum-title ttl1">作業工数計</div>
            <div className={'task-sum ' + ((Number(getTotalWorkLoadM()) === Number(data.phase.planned_workload)) ? '' : 'err-field')}>
              {getTotalWorkLoadM() + " 人月"}
            </div>
            <div className="task-sum-title ttl2">外注工数計</div>
            <div className={'task-sum ' + ((Number(getTotalOutWorkLoadM()) === Number(data.phase.planned_outsourcing_workload)) ? '' : 'err-field')}>
              {getTotalOutWorkLoadM() + " 人月"}
            </div>
            <div className="task-sum">
              {getTotalWorkLoad() + " 人日"}
            </div>
            <div className="task-sum">
              {getTotalOutWorkLoad() + " 人日"}
            </div>
          </div>

          <table className="task-table-hd">
            <thead>
              <tr className="header-tr">
                <td className="header-td add-td"></td>
                <td className="header-td name-td">作業名</td>
                <td className="header-td outsourcing-td">外注</td>
                <td className="header-td worker-td">担当者</td>
                <td className="header-td workload-td">予定工数（人日）</td>
                <td className="header-td period-td">開始予定日</td>
                <td className="header-td period-td">完了予定日</td>
                <td className="header-td del-td">削除</td>
              </tr>
            </thead>
          </table>
          <div className="table-frame">
            <table className="task-table">
              <tbody>
                {data.tasks ? (
                  data.tasks.map((task, i) =>
                  <>
                    <tr key={"task-" + i} className="body-tr">
                      <td className={'add-td ' + (task.del ? 'delete' : '')}>
                        <Button onClick={() => handleAddTask(i)} sx={{height:20, fontSize: 11, fontFamily: 'sans-serif'}} >行挿入↑</Button>
                      </td>
                      <td className={'name-td ' + (task.del ? 'delete' : '')}>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          maxLength="10"
                          className={'text-base name ' + (task.del ? 'delete' : '')} 
                          onChange={(e) => handleChange(i, e.target.name, e.target.value)} 
                          value={task.name || ''} 
                        />
                      </td>
                      <td className={'outsourcing-td ' + (task.del ? 'delete' : '')}>
                        <input 
                          type="checkbox"
                          name="outsourcing"
                          id="outsourcing"
                          className="outsourcing"
                          value="outsourcing"
                          checked={task.outsourcing || false}
                          onChange={(e) => handleCheckbox(i,e)}
                        />

                      </td>
                      <td className={'worker-td ' + (task.del ? 'delete' : '')}>
                        <SelectEmployee
                          name="worker_id" 
                          value={task.worker_id || ''} 
                          setValue={handleChange}
                          index={i}
                          width={120}
                          height={25}
                          border="none"
                        />
                      </td>
                      <td className={'workload-td ' + (task.del ? 'delete' : '')}>
                        <input 
                          type="text" 
                          name="planned_workload" 
                          id="planned_workload" 
                          maxLength="5"
                          className={'planned_workload text-base ' + (task.del ? 'delete' : '')}
                          onChange={(e) => handleChange(i, e.target.name, decimalValidator(e))} 
                          value={task.planned_workload || ''} 
                        />
                      </td>
                      <td className={'period-td '+ (task.del ? 'delete' : '')}>
                        <CustomDatePicker 
                          selected={task.planned_periodfr || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'text-base date-field ' + (task.del ? 'delete' : '')}
                          onChange={handleChange}
                          name="planned_periodfr"
                          index={i}
                        />
                      </td>
                      <td className={'period-td '+ (task.del ? 'delete' : '')}>
                        <CustomDatePicker 
                          selected={task.planned_periodto || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'text-base date-field ' + (task.del ? 'delete' : '')}
                          onChange={handleChange}
                          name="planned_periodto"
                          index={i}
                        />
                      </td>
                      <td className="del-td">
                        <input 
                          type="checkbox"
                          name="del"
                          id="del"
                          className="del"
                          value="del"
                          checked={task.del || false}
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
          <div className="button-area-bottom">
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