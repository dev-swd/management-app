// m2e
import "./PhaseIndexPage.css";
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { getPhases, updatePhase } from '../../../lib/api/phase';
import { formatDateZero } from '../../../lib/common/dateCom';
import TaskPlanPage from "./TaskPlanPage";
import { decimalOnly } from '../../../lib/common/InputRegulation';
import ModalConfirm from '../../common/ModalConfirm';
import { isEmpty } from "../../../lib/common/isEmpty";

const initData = {prj: {number: "",
                        name: "",
                        planned_work_cost: 0,
                        planned_workload: 0,
                        planned_outsourcing_cost: 0,
                        planned_outsourcing_workload: 0},
                  phases: []
}

const PhaseIndexPage = (props) => {
  const { prjId } = props; 
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState(initData);
  const [phaseId, setPhaseId] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [changeFlg, setChangeFlg] = useState(false);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      handleGetPhases();
      setMessage({kbn: "", msg: ""});
    }
  },[prjId]);

  // 工程情報取得
  const handleGetPhases = async () => {
    try {
      const res = await getPhases(Number(prjId));
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
      setMessage({kbn: "error", msg: "工程情報取得エラー"});
    }
  }

  // 画面項目入力時の処理
  const handleChange = (i,name,value) => {
    const tmpPhases = [...data.phases];
    tmpPhases[i][name] = value;
    setData({
      ...data,
      phases: tmpPhases,
    });
    setChangeFlg(true);
  }
  
  // 作業工数集計
  const getTotalWorkLoad = () => {
    return data.phases.reduce((total,item) => {
      return (total * 100 + Number(item.planned_workload) * 100) / 100;
    },0);
  }

  // 外注工数集計
  const getTotalOutWorkLoad = () => {
    return data.phases.reduce((total,item) => {
      return (total * 100 + Number(item.planned_outsourcing_workload) * 100) / 100;
    },0);
  }

  // 保存ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "この内容で登録します。よろしいですか？",
      tag: "",
    })
  }

  // 保存確認ダイアログOKボタン押下時の処理
  const handleConfirmOK = async (dummy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updatePhase(prjId, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "タスク情報更新エラー(500)"});
      } else {
        setChangeFlg(false);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "タスク情報更新エラー"});
    }
  }

  // 保存確認ダイアログCancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // OKボタン非活性制御
  const setDisabledSubmit = () => {
    if (Number(getTotalWorkLoad()) === Number(data.prj.planned_workload) && Number(getTotalOutWorkLoad()) === Number(data.prj.planned_outsourcing_workload)) {
      return false;
    } else {
      return true;
    }
  }

  // タスク編集リンククリック時の処理
  const handleEditTasks = (phaseId) => {
    setPhaseId(phaseId);
  }

  // タスク編集リンク終了時の処理
  const handleEditTasksClose = () => {
    setPhaseId("");
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // 単価計算
  const calcUnitPrice = (price,works) => {
    if (Number(price)===0 || Number(works)===0) {
      return 0;
    } else {
      return (Number(price)/Number(works)).toLocaleString();
    }
  }

  return (
    <div className="m2e-container">
      <div className="m2e-header-title">工程編集</div>
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      <Button 
        size="small" 
        variant="contained" 
        endIcon={<SaveAltIcon />} 
        onClick={(e) => handleSubmit(e)}
        disabled={setDisabledSubmit()}
        style={{marginLeft:20}}
      >
        保存
      </Button>

      <div className="m2e-prj-name">{"[" + data.prj.number + "]" + data.prj.name}</div>
      <table className="m2e-prj">
        <tbody>
          <tr>
            <td className="m2e-prj-ttl">作業費</td>
            <td className="m2e-prj-val1">{data.prj.planned_work_cost.toLocaleString() + " 円"}</td>
            <td className="m2e-prj-ttl">作業工数</td>
            <td className="m2e-prj-val2">{data.prj.planned_workload + " 人月"}</td>
            <td className="m2e-prj-ttl">作業単価</td>
            <td className="m2e-prj-val1">{calcUnitPrice(data.prj.planned_work_cost, data.prj.planned_workload) + " 円"}</td>
          </tr>
          <tr>
            <td className="m2e-prj-ttl">外注費</td>
            <td className="m2e-prj-val1">{data.prj.planned_outsourcing_cost.toLocaleString() + " 円"}</td>
            <td className="m2e-prj-ttl">外注工数</td>
            <td className="m2e-prj-val2">{data.prj.planned_outsourcing_workload + " 人月"}</td>
            <td className="m2e-prj-ttl">外注単価</td>
            <td className="m2e-prj-val1">{calcUnitPrice(data.prj.planned_outsourcing_cost, data.prj.planned_outsourcing_workload) + " 円"}</td>
          </tr>
        </tbody>
      </table>

      <table className="m2e-table-hd">
        <thead>
          <tr>
            <td className="m2e-name-td m2e-th">工程</td>
            <td className="m2e-period-td m2e-th">開始予定</td>
            <td className="m2e-period-td m2e-th">終了予定</td>
            <td className="m2e-workload-td m2e-th">計画作業工数</td>
            <td className="m2e-outsourcing-td m2e-th">計画外注工数</td>
            <td className="m2e-task-td m2e-th"></td>
          </tr>
        </thead>        
      </table>

      <div className="m2e-table-frame">
        <table className="m2e-table">
          <tbody>
            {data.phases ? (
              data.phases.map((p,i) => 
              <tr key={"phase-" + i}>
                <td className="m2e-name-td">{toStr(p.name)}</td>
                <td className="m2e-period-td">{formatDateZero(p.planned_periodfr, "YYYY年MM月DD日")}</td>
                <td className="m2e-period-td">{formatDateZero(p.planned_periodto, "YYYY年MM月DD日")}</td>
                <td className="m2e-workload-td">
                  <input 
                    type="text" 
                    name="planned_workload" 
                    id="planned_workload" 
                    maxLength="5"
                    className="m2e-workload"
                    onChange={(e) => handleChange(i, e.target.name, decimalOnly(e.target.value))} 
                    value={toStr(p.planned_workload)} 
                  />
                  {" 人月"}
                </td>
                <td className="m2e-outsourcing-td">
                  <input 
                    type="text" 
                    name="planned_outsourcing_workload" 
                    id="planned_outsourcing_workload" 
                    maxLength="5"
                    className="m2e-outsourcing"
                    onChange={(e) => handleChange(i, e.target.name, decimalOnly(e.target.value))} 
                    value={toStr(p.planned_outsourcing_workload)} 
                  />
                  {" 人月"}
                </td>
                <td className="m2e-task-td">
                  <Button 
                    onClick={() => handleEditTasks(p.id)} 
                    sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                    disabled={changeFlg || setDisabledSubmit()}>
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
      <div className="m2e-sum-area">
        <div className="m2e-sum-title">合計</div>
        <div className={'m2e-sum ' + ((Number(getTotalWorkLoad()) === Number(data.prj.planned_workload)) ? '' : 'm2e-alert')}>
          {getTotalWorkLoad().toFixed(1) + " 人月"}
        </div>
        <div className={'m2e-sum ' + ((Number(getTotalOutWorkLoad()) === Number(data.prj.planned_outsourcing_workload)) ? '' : 'm2e-alert')}>
          {getTotalOutWorkLoad().toFixed(1) + " 人月"}
        </div>
      </div>
      <TaskPlanPage phaseId={phaseId} handleDialogClose={handleEditTasksClose} />
      <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
    </div>
  );
}

export default PhaseIndexPage;