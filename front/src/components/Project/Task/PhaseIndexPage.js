import "./PhaseIndexPage.css";
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { getPhases, updatePhase } from '../../../lib/api/phase';
import { displayDate } from '../../../lib/common/datetostr';
import TaskPlanPage from "./TaskPlanPage";
import { decimalValidator } from '../../../lib/common/inputValidator.js';
import ModalConfirm from '../../common/ModalConfirm';

const initData = {prj: {number: "",
                        name: "",
                        planned_work_cost: 0,
                        planned_workload: 0,
                        planned_outsourcing_cost: 0,
                        planned_outsourcing_workload: 0},
                  phases: []
}

const PhaseIndexPage = (props) => {
  const { prj_id } = props; 
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [data, setData] = useState(initData);
  const [showTask, setShowTask] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [changeFlg, setChangeFlg] = useState(false);

  useEffect(() => {
    handleGetPhases(prj_id);
  },[prj_id]);

  const handleGetPhases = async (id) => {
    try {
      const res = await getPhases(Number(id));
      const tmpPhases = res.data.phases.map(phase => {
        const tmpPhase = {};
        tmpPhase.id = phase.id;
        tmpPhase.name = phase.name;
        tmpPhase.planned_periodfr = phase.planned_periodfr;
        tmpPhase.planned_periodto = phase.planned_periodto;
        tmpPhase.planned_workload = phase.planned_workload;
        tmpPhase.planned_outsourcing_workload = phase.planned_outsourcing_workload;
        return tmpPhase;
      });
      setData({
        ...data,
        prj: {number: res.data.prj.number,
              name: res.data.prj.name,
              planned_work_cost: res.data.prj.planned_work_cost,
              planned_workload: res.data.prj.planned_workload,
              planned_outsourcing_cost: res.data.prj.planned_outsourcing_cost,
              planned_outsourcing_workload: res.data.prj.planned_outsourcing_workload
        },
        phases: tmpPhases
      });
      setChangeFlg(false);
    } catch (e) {
      setMessage("工程情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (i,name,value) => {
    const tmpPhases = [...data.phases];
    tmpPhases[i][name] = value;
    setData({
      ...data,
      phases: tmpPhases,
    });
    setChangeFlg(true);
  }
  
  const getTotalWorkLoad = () => {
    return data.phases.reduce((total,item) => {
      return (total * 100 + Number(item.planned_workload) * 100) / 100;
    },0);
  }

  const getTotalOutWorkLoad = () => {
    return data.phases.reduce((total,item) => {
      return (total * 100 + Number(item.planned_outsourcing_workload) * 100) / 100;
    },0);
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
      const res = await updatePhase(prj_id, data)
      if (res.data.status === 500) {
        setMessage("タスク情報更新エラー(500)");
        setMessageVar("error");
      } else {
        handleGetPhases(prj_id);        
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
    <div className="phase-index-container">
      <div className="header-title">タスク編集</div>
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <div className="button-area">
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<SaveAltIcon />} 
          onClick={(e) => handleSubmit(e)}
          disabled={!(Number(getTotalWorkLoad()) === Number(data.prj.planned_workload)) || !(Number(getTotalOutWorkLoad()) === Number(data.prj.planned_outsourcing_workload))}>
          保存
        </Button>
      </div>

      <div className="prj-name">{"[" + data.prj.number + "]" + data.prj.name}</div>
      <div className="prj-info">
        <div className="p-title">作業費</div>
        <div className="data">{data.prj.planned_work_cost.toLocaleString() + " 円"}</div>
        <div className="p-title">作業工数</div>
        <div className="data">{data.prj.planned_workload + " 人月"}</div>
        <div className="p-title">参考単価</div>
        <div className="data">{(Number(data.prj.planned_work_cost) / Number(data.prj.planned_workload)).toLocaleString() + " 円" }</div>
        <div className="p-title">外注費</div>
        <div className="data">{data.prj.planned_outsourcing_cost.toLocaleString() + " 円"}</div>
        <div className="p-title">外注工数</div>
        <div className="data">{data.prj.planned_outsourcing_workload + " 人月"}</div>
        <div className="p-title">参考単価</div>
        <div className="data">{(Number(data.prj.planned_outsourcing_cost) / Number(data.prj.planned_outsourcing_workload)).toLocaleString() + " 円" }</div>
      </div>

      <table className="phase-table-hd">
        <thead>
          <tr className="header-tr">
            <td className="header-td name-td">工程</td>
            <td className="header-td period-td">開始予定</td>
            <td className="header-td period-td">終了予定</td>
            <td className="header-td workload-td">計画作業工数</td>
            <td className="header-td outsourcing-td">計画外注工数</td>
            <td className="header-td task-td"></td>
          </tr>
        </thead>        
      </table>

      <div className="table-frame">
        <table className="phase-table">
          <tbody>
            {data.phases ? (
              data.phases.map((phase,i) => 
              <tr key={"phase-" + i} className="body-tr">
                <td className="name-td">{phase.name}</td>
                <td className="period-td">{displayDate(phase.planned_periodfr)}</td>
                <td className="period-td">{displayDate(phase.planned_periodto)}</td>
                <td className="workload-td">
                  <input 
                    type="text" 
                    name="planned_workload" 
                    id="planned_workload" 
                    maxLength="5"
                    className="planned_workload text-base"
                    onChange={(e) => handleChange(i, e.target.name, decimalValidator(e))} 
                    value={phase.planned_workload || ''} 
                  />
                  {"人月"}
                </td>
                <td className="outsourcing-td">
                  <input 
                    type="text" 
                    name="planned_outsourcing_workload" 
                    id="planned_outsourcing_workload" 
                    maxLength="5"
                    className="planned_outsourcing_workload text-base"
                    onChange={(e) => handleChange(i, e.target.name, decimalValidator(e))} 
                    value={phase.planned_outsourcing_workload || ''} 
                  />
                  {"人月"}
                </td>
                <td className="task-td">
                  <Button 
                    onClick={() => setShowTask(phase.id)} 
                    sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                    disabled={changeFlg || !(Number(getTotalWorkLoad()) === Number(data.prj.planned_workload)) || !(Number(getTotalOutWorkLoad()) === Number(data.prj.planned_outsourcing_workload))}>
                    タスク編集
                  </Button>
                </td>
              </tr>
              )
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
      <div className="sum-area">
        <div className="sum-title">合計</div>
        <div className={'sum ' + ((Number(getTotalWorkLoad()) === Number(data.prj.planned_workload)) ? '' : 'err-field')}>
          {getTotalWorkLoad().toFixed(1) + " 人月"}
        </div>
        <div className={'sum ' + ((Number(getTotalOutWorkLoad()) === Number(data.prj.planned_outsourcing_workload)) ? '' : 'err-field')}>
          {getTotalOutWorkLoad().toFixed(1) + " 人月"}
        </div>
      </div>
      <TaskPlanPage phaseId={showTask} setPhaseId={setShowTask} handleGetPhases={handleGetPhases} />
      <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
    </div>
  );
}

export default PhaseIndexPage;