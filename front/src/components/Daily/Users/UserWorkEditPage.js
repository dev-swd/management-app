import "./UserWorkEditPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isEmptyNum } from '../../../lib/common/numberCom';
import { formatTime } from '../../../lib/common/timetostr';
import { zeroPadding } from "../../../lib/common/stringCom";
import { getWorkReps, updateWorkReps } from '../../../lib/api/daily';
import { getPrjsByMem } from '../../../lib/api/project';
import { getPhases } from '../../../lib/api/phase';
import { getTasks } from '../../../lib/api/task'
import { displayDate } from '../../../lib/common/datetostr';
import ModalConfirm from '../../common/ModalConfirm';
              
const UserWorkEditPage = (props) => {
  const { dailyInfo, setDailyInfo, refresh } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [data, setData] = useState([]);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [prjs, setPrjs] = useState({});
  const [preFlg,setPreFlg] = useState(1);
  const [preSum, setPreSum] = useState("");
  const [overFlg,setOverFlg] = useState(1);
  const [overSum, setOverSum] = useState("");

  useEffect(() => {
    if(!isEmptyNum(dailyInfo.id)){
      handleGetWorkReports(dailyInfo.id);
      handleGetPrjs();
      setPreSum(formatTime(dailyInfo.prescribed_h,dailyInfo.prescribed_m));
      setOverSum(formatTime(dailyInfo.over_h,dailyInfo.over_m));
    }
  },[dailyInfo]);

  const handleGetWorkReports = async (id) => {
    try {
      const res = await getWorkReps(Number(id));
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
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleGetPrjs = async () => {
    try {
      const res = await getPrjsByMem(Number(empInfo.id), dailyInfo.date);
      setPrjs(res.data);      
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleClose = (e) => {
    setDailyInfo({
      ...dailyInfo,
      id: "",
      date: "",
    });
    setData([]);
  }

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

  const handleChange = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.value;
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

  const handleCheckbox = (i, e) => {
    const tmpReports = [...data.workreports];
    tmpReports[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      workreports: tmpReports,
    });
    setSummary(tmpReports);
  }

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
      const res = await updateWorkReps(dailyInfo.id, data)
      if (res.data.status === 500) {
        setMessage("日報情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setDailyInfo({
          ...dailyInfo,
          id: "",
          date: "",
        });
        refresh();
      }
    } catch (e) {
      setMessage("日報情報更新エラー");
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

  const SelectProject = (props) => {
    const { value, index, handleChange, del } = props;
    
    return (
      <select 
        id="select-project" 
        name="project_id"
        value={value} 
        className={'select-project ' + (del ? 'delete' : '')} 
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

  const SelectPhase = (props) => {
    const { prj_id, value, index, handleChange, del } = props;
    const [phases, setPhases] = useState({});

    useEffect(() => {
      if (prj_id===undefined || prj_id===null || prj_id==="") {   
      } else {
        handleGetPhases();
      }
    },[prj_id]);
  
    const handleGetPhases = async () => {
      try {
        const res = await getPhases(prj_id);
        setPhases(res.data.phases);  
      } catch (e) {
        setMessage("工程情報取得エラー");
        setMessageVar("error");
      }
    }

    return (
      <select 
        id="select-phase" 
        name="phase_id"
        value={value} 
        className={'select-phase ' + (del ? 'delete' : '')} 
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

  const SelectTask = (props) => {
    const { phase_id, value, index, handleChange, del } = props;
    const [tasks, setTasks] = useState({});

    useEffect(() => {
      if (phase_id===undefined || phase_id===null || phase_id==="") {
      } else {
        handleGetTasks();
      }
    },[phase_id]);
  
    const handleGetTasks = async () => {
      try {
        const res = await getTasks(phase_id);
        setTasks(res.data.tasks);  
      } catch (e) {
        setMessage("タスク情報取得エラー");
        setMessageVar("error");
      }
    }

    return (
      <select 
        id="select-task" 
        name="task_id"
        value={value} 
        className={'select-task ' + (del ? 'delete' : '')} 
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

  return (
    <>
    { dailyInfo.id ? (
      <div className="overlay">
        <div className="user-work-container">
          <div className="header-area">
            <div className="header-title">日報詳細入力</div>
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
              disabled={(preFlg===0 && overFlg===0) ? false : true}
              >
              登録
            </Button>
          </div>

          <div className="date-area">{displayDate(dailyInfo.date)}</div>

          <div className="work-summary-area">
            <div className="header-td">所定時間</div>
            <div className={preFlg<0 ? "minus-value" : ""}>{preSum}</div>
            <div className="header-td">時間外</div>
            <div className={overFlg<0 ? "minus-value" : ""}>{overSum}</div>
          </div>

          <table className="work-table-hd">
            <thead>
              <tr className="header-tr">
                <td className="header-td prj-td">プロジェクト</td>
                <td className="header-td phase-td">工程</td>
                <td className="header-td task-td">タスク</td>
                <td className="header-td time-td">所定時間</td>
                <td className="header-td time-td">時間外</td>
                <td className="header-td comments-td">備考</td>
                <td className="header-td del-td">削除</td>
              </tr>
            </thead>
          </table>

          <div className="work-table-frame">
            <table className="work-table">
              <tbody>
                {data.workreports ? (
                  data.workreports.map((report, i) => 
                  <>
                    <tr key={"work-" + i} className="body-tr">
                      <td className={'prj-td ' + (report.del ? 'delete' : '')}>
                        <SelectProject value={report.project_id} index={i} handleChange={handleChange} del={report.del} />
                      </td>
                      <td className={'phase-td ' + (report.del ? 'delete' : '')}>
                        <SelectPhase prj_id={report.project_id} value={report.phase_id} index={i} handleChange={handleChange} del={report.del} />
                      </td>
                      <td className={'task-td ' + (report.del ? 'delete' : '')}>
                        <SelectTask phase_id={report.phase_id} value={report.task_id} index={i} handleChange={handleChange} del={report.del} />
                      </td>
                      <td className={'time-td ' + (report.del ? 'delete' : '')}>
                        <div className="time-area">
                          <input 
                            type="text" 
                            name="hour" 
                            id="hour" 
                            maxLength="2"
                            className={'edit-time-h ' + (report.del ? 'delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={report.hour || ''} 
                          />
                          <div className="inner-caption">{":"}</div>
                          <input 
                            type="text" 
                            name="minute" 
                            id="minute" 
                            maxLength="2"
                            className={'edit-time-m ' + (report.del ? 'delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={report.minute || ''} 
                          />
                        </div>
                      </td>
                      <td className={'time-td ' + (report.del ? 'delete' : '')}>
                        <div className="time-area">
                          <input 
                            type="text" 
                            name="over_h" 
                            id="over_h" 
                            maxLength="2"
                            className={'edit-time-h ' + (report.del ? 'delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={report.over_h || ''} 
                          />
                          <div className="inner-caption">{":"}</div>
                          <input 
                            type="text" 
                            name="over_m" 
                            id="over_m" 
                            maxLength="2"
                            className={'edit-time-m ' + (report.del ? 'delete' : '')}
                            onChange={(e) => handleChange(i,e)} 
                            value={report.over_m || ''} 
                          />
                        </div>
                      </td>
                      <td className={'comments-td ' + (report.del ? 'delete' : '')}>
                        <input 
                          type="text" 
                          name="comments" 
                          id="comments" 
                          maxLength="20"
                          className={'comments ' + (report.del ? 'delete' : '')}
                          onChange={(e) => handleChange(i,e)} 
                          value={report.comments || ''} 
                        />
                      </td>
                      <td className="del-td">
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

          <div className="button-area-bottom">
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
