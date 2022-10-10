import { useEffect, useState } from "react";
import { isEmpty } from "../../../lib/common/isEmpty";
import { getPhase_PlanAndActual } from "../../../lib/api/phase";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const PhasesGraphPage = (props) => {
  const { progId, kbn, setMessage } = props;
  const [labels, setLabels] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [actualLabel, setActualLabel] = useState("実績");
  const [plannedLabel, setPlannedLabel] = useState("計画");
  const [leftText, setLeftText] = useState("");

  // 初期処理
  useEffect(() => {
    if (kbn==="cost") {
      setLeftText("円");
      setPlannedLabel("計画作業費");
      setActualLabel("実績作業費");
    } else {
      setLeftText("人月");
      setPlannedLabel("計画工数");
      setActualLabel("実績工数");
    }
    if (!isEmpty(progId)) {
      handleGetPhases();
    }
  },[kbn]);

  // 工程情報取得
  const handleGetPhases = async () => {
    try {
      const res = await getPhase_PlanAndActual(Number(progId));
      // 横軸ラベル（工程名）
      const tmpLabels = res.data.phases.map((p,i) => p.name);
      setLabels(tmpLabels);
      // 計画工数
      let tmpPlanData;
      if (kbn==="cost") {
        // コスト表示
        tmpPlanData = res.data.phases.map((p,i) => Number(p.planned_cost));
      } else {
        // 工数表示
        tmpPlanData = res.data.phases.map((p,i) => Number(p.planned_workload));
      }
      setPlanData(tmpPlanData);
      // 実績工数
      let tmpActualData;
      if (kbn==="cost") {
        // コスト表示
        tmpActualData = res.data.phases.map((p,i) => Number(p.total_cost));
      } else {
        // 工数表示
        tmpActualData = res.data.phases.map((p,i) => Number(p.total_workload));
      }
      setActualData(tmpActualData);
    } catch (e) {
      setMessage({kbn: "error", msg: "工程情報取得エラー"});
    }
  }

  const graphData = {
    labels: labels,
    datasets: [
      {
        type: "bar",
        yAxisID: 'y-axis-value',
        data: planData,
        backgroundColor: 'rgb(0, 255, 0, 0.8)',
        borderColor: 'white',
        borderWidth: 2,
        label: plannedLabel,
      },
      {
        type: "bar",
        yAxisID: 'y-axis-value',
        data: actualData,
        backgroundColor: 'rgb(255, 30, 144, 0.4)',
        borderColor: 'white',
        borderWidth: 2,
        label: actualLabel,
      },
    ],
  };

  const graphOption = {
    maintainAspectRatio: false,
    scales: {
      "y-axis-value": {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: leftText,
        },
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return `${value}`;
          },
        },
      },
    },
  };

  return (
    <>
    { progId ? (
      <Chart 
        data={graphData}
        options={graphOption}
        height={"500"}
      />
    ) : (
      <></>
    )}
    </>
  );
}
export default PhasesGraphPage;
