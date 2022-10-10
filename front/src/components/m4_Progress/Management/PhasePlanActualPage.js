// m46
import "./PhasePlanActualPage.css";
import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { getPhase_PlanAndActual } from "../../../lib/api/phase";
import { formatDateZero } from '../../../lib/common/dateCom';
import TaskPlanActualPage from "./TaskPlanActualPage";

const PhasePlanActualPage = (props) => {
  const { progId, setMessage } = props;
  const [data, setData] = useState([]);
  const [phaseId, setPhaseId] = useState(null);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(progId)) {
      handleGetPhases();
    }
  },[progId]);

  // 工程情報取得
  const handleGetPhases = async () => {
    try {
      const res = await getPhase_PlanAndActual(Number(progId));
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "工程情報取得エラー"});
    }
  }

  // タスク詳細表示クリック時の処理
  const handleTaskPage = (phaseId) => {
    setPhaseId(phaseId);
  }

  // タスク詳細画面クローズ処理
  const closeTaskPage = () => {
    setPhaseId(null);
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
    { progId ? (
      <div className="m46-container">
        {/* テーブルヘッダ */}
        <table className="m46-table-hd">
          <thead>
            <tr>
              <td rowSpan="2" className="m46-name-hd m46-th">工程</td>
              <td colSpan="4" className="m46-th">計画値</td>
              <td colSpan="4" className="m46-th">実績値</td>
              <td rowSpan="2" className="m46-efficiency-hd m46-th">効率</td>
              <td colSpan="3" className="m46-th">実績工数（再掲）</td>
              <td rowSpan="2" className="m46-link-td m46-th">タスク</td>
            </tr>
            <tr>
              <td className="m46-period-td m46-th">開始日</td>
              <td className="m46-period-td m46-th">完了日</td>
              <td className="m46-cost-hd m46-th">作業費</td>
              <td className="m46-workload-hd m46-th">工数</td>
              <td className="m46-period-td m46-th">開始日</td>
              <td className="m46-period-td m46-th">完了日</td>
              <td className="m46-cost-hd m46-th">作業費</td>
              <td className="m46-workload-hd m46-th">工数</td>
              <td className="m46-workload-hd m46-th">時間外</td>
              <td className="m46-workload-hd m46-th">完了後</td>
              <td className="m46-workload-hd m46-th">完了後時間外</td>
            </tr>
          </thead>
        </table>

        {/* テーブル明細（スクロール） */}
        <div className="m46-table-frame">
          <table className="m46-table-bd">
            <tbody>
              {data.phases ? (
                data.phases.map((p,i) => 
                  <tr key={"phase-" + i}>
                    <td className="m46-name-td">{toStr(p.name)}</td>
                    <td className="m46-period-td">{formatDateZero(p.planned_periodfr, "YYYY年MM月DD日")}</td>
                    <td className="m46-period-td">{formatDateZero(p.planned_periodto, "YYYY年MM月DD日")}</td>
                    <td className="m46-cost-td">{Number(toNum(p.planned_cost)).toLocaleString() + " 円"}</td>
                    <td className="m46-workload-td">{Number(toNum(p.planned_workload)) + " 人月"}</td>

                    <td className="m46-period-td">{formatDateZero(p.periodfr, "YYYY年MM月DD日")}</td>
                    <td className="m46-period-td">{formatDateZero(p.periodto, "YYYY年MM月DD日")}</td>
                    <td className="m46-cost-td">{Number(toNum(p.total_cost)).toLocaleString() + " 円"}</td>
                    <td className="m46-workload-td">{Number(toNum(p.total_workload)) + " 人月"}</td>

                    <td className="m46-efficiency-td">{setPercent(p.total_workload, p.planned_workload)}</td>

                    <td className="m46-workload-td">{Number(toNum(p.overtime_workload)) + " 人月"}</td>
                    <td className="m46-workload-td">{Number(toNum(p.after_total_workload)) + " 人月"}</td>
                    <td className="m46-workload-td">{Number(toNum(p.after_overtime_workload)) + " 人月"}</td>

                    <td className="m46-link-td"><button className="link-style-btn" type="button" onClick={() => handleTaskPage(p.phase_id)}>詳細表示</button></td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
        <TaskPlanActualPage progId={progId} phaseId={phaseId} closeWin={closeTaskPage} />
      </div>
    ) : (
      <></>
    )}
    </>
  );
}
export default PhasePlanActualPage;
