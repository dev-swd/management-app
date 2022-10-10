// m47
import "./TaskPlanActualPage.css";
import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { getTask_PlanAndActual } from "../../../lib/api/task";
import { formatDateZero } from '../../../lib/common/dateCom';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const TaskPlanActualPage = (props) => {
  const { progId, phaseId, closeWin } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });

  // 初期処理
  useEffect(() => {
    if (!isEmpty(phaseId)) {
      handleGetTasks();
    }
  },[phaseId]);

  // タスク情報取得
  const handleGetTasks = async () => {
    try {
      const res = await getTask_PlanAndActual(Number(progId), Number(phaseId));
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "タスク情報取得エラー"});
    }
  }

  // 画面終了時の処理
  const handleClose = () => {
    setMessage("");
    closeWin();
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // null／undefined対策
  const toNum = (v) => {
    if (isEmpty(v)) {
      return 0;
    } else {
      return v;
    }
  }

  // パーセント計算
  const setPercent = (v1, v2) => {
    const _v1 = Number(toNum(v1));
    const _v2 = Number(toNum(v2));
    if (_v2===0) {
      return "No Calc"
    } else {
      return Math.round((_v1 / _v2) * 10000) / 100 + " %";
    }
  }

  // 画面編集
  return (
    <>
    { phaseId ? (
      <div className="overlay">
        <div className="m47-container">
          <div className="m47-header-area">
            <div className="m47-header-title">進捗レポート</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose()}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          {/* テーブルヘッダ */}
          <table className="m47-table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="m47-name-hd m47-th">タスク</td>
                <td rowSpan="2" className="m47-worker-td m47-th">担当者</td>
                <td colSpan="3" className="m47-th">計画値</td>
                <td colSpan="3" className="m47-th">実績値</td>
                <td rowSpan="2" className="m47-efficiency-hd m47-th">効率</td>
                <td colSpan="3" className="m47-th">実績工数（再掲）</td>
              </tr>
              <tr>
                <td className="m47-period-td m47-th">開始日</td>
                <td className="m47-period-td m47-th">完了日</td>
                <td className="m47-workload-hd m47-th">工数</td>

                <td className="m47-period-td m47-th">開始日</td>
                <td className="m47-period-td m47-th">完了日</td>
                <td className="m47-workload-hd m47-th">工数</td>
                <td className="m47-workload-hd m47-th">時間外</td>
                <td className="m47-workload-hd m47-th">完了後</td>
                <td className="m47-workload-hd m47-th">完了後時間外</td>
              </tr>
            </thead>
          </table>

          {/* テーブル明細（スクロール） */}
          <div className="m47-table-frame">
            <table className="m47-table-bd">
              <tbody>
                {data.tasks ? (
                  data.tasks.map((t,i) => 
                    <tr key={"phase-" + i}>
                      <td className="m47-name-td">{toStr(t.task_name)}</td>
                      <td className="m47-worker-td">{toStr(t.worker_name)}</td>
                      <td className="m47-period-td">{formatDateZero(t.planned_periodfr, "YYYY年MM月DD日")}</td>
                      <td className="m47-period-td">{formatDateZero(t.planned_periodto, "YYYY年MM月DD日")}</td>
                      <td className="m47-workload-td">{Number(toNum(t.planned_workload)) + " 人日"}</td>

                      <td className="m47-period-td">{formatDateZero(t.actual_periodfr, "YYYY年MM月DD日")}</td>
                      <td className="m47-period-td">{formatDateZero(t.actual_periodto, "YYYY年MM月DD日")}</td>
                      <td className="m47-workload-td">{Number(toNum(t.total_workload)) + " 人日"}</td>

                      <td className="m47-efficiency-td">{setPercent(t.total_workload, t.planned_workload)}</td>

                      <td className="m47-workload-td">{Number(toNum(t.overtime_workload)) + " 人日"}</td>
                      <td className="m47-workload-td">{Number(toNum(t.after_total_workload)) + " 人日"}</td>
                      <td className="m47-workload-td">{Number(toNum(t.after_overtime_workload)) + " 人日"}</td>

                    </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  );
}
export default TaskPlanActualPage;
