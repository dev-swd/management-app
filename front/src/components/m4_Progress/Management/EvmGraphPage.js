import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { getEvmsByConditional } from '../../../lib/api/evm';
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

const EvmGraphPage = (props) => {
  const { progId, level, phaseId, setMessage } = props;
  const [labels, setLabels] = useState([]);
  const [pv, setPv] = useState([]);
  const [ev, setEv] = useState([]);
  const [ac, setAc] = useState([]);
  const [pv_sum, setPvSum] = useState([]);
  const [ev_sum, setEvSum] = useState([]);
  const [ac_sum, setAcSum] = useState([]);


  // 初期処理
  useEffect(() => {
    if (!isEmpty(progId)) {
      handleGetEvms();
    }
  },[progId]);

  // EVM取得
  const handleGetEvms = async () => {
    try {
      const res = await getEvmsByConditional(Number(progId), level, Number(phaseId));
      // 日付配列設定
      const tmpLabels = res.data.evms.map((e,i) => {
        const dt = new Date(e.date_to);
        const y = dt.getFullYear() + "年";
        const m = ('0' + (dt.getMonth() + 1)).slice(-2) + "月";
        const d = ('0' + dt.getDate()).slice(-2) + "日";
        const tmpLabel = [d , m, y];
        return tmpLabel;
      });
      setLabels(tmpLabels);
      // PV配列設定
      const tmpPv = res.data.evms.map((e,i) => Number(e.pv));
      setPv(tmpPv);
      // EV配列設定
      const tmpEv = res.data.evms.map((e,i) => Number(e.ev));
      setEv(tmpEv);
      // AC配列設定
      const tmpAc = res.data.evms.map((e,i) => Number(e.ac));
      setAc(tmpAc);
      // 計画値配列設定
      const tmpPvSum = res.data.evms.map((e,i) => Number(e.pv_sum));
      setPvSum(tmpPvSum);
      // 出来高配列設定
      const tmpEvSum = res.data.evms.map((e,i) => Number(e.ev_sum));
      setEvSum(tmpEvSum);
      // 実績値配列設定
      const tmpAcSum = res.data.evms.map((e,i) => Number(e.ac_sum));
      setAcSum(tmpAcSum);
    } catch (e) {
      setMessage({kbn: "error", msg: "EVM取得エラー"});
    }
  }

  const graphData = {
    labels: labels,
    datasets: [
      {
        type: "line",
        yAxisID: 'y-axis-value',
        data: pv_sum,
        borderColor: "rgb(10, 145, 10)",
        label: "PV",
      },
      {
        type: "line",
        yAxisID: 'y-axis-value',
        data: ev_sum,
        borderColor: "rgb(255, 30, 144)",
        label: "EV",
      },
      {
        type: "line",
        yAxisID: 'y-axis-value',
        data: ac_sum,
        borderColor: "rgba(0, 0, 255)",
        label: "AC",
      },
      {
        type: "bar",
        yAxisID: 'y-axis-value',
        data: pv,
        backgroundColor: 'rgb(0, 255, 0, 0.8)',
        borderColor: 'white',
        borderWidth: 2,
        label: '週単位PV',
      },
      {
        type: "bar",
        yAxisID: 'y-axis-value',
        data: ev,
        backgroundColor: 'rgb(255, 30, 144, 0.4)',
        borderColor: 'white',
        borderWidth: 2,
        label: '週単位EV',
      },
      {
        type: "bar",
        yAxisID: 'y-axis-value',
        data: ac,
        backgroundColor: 'rgba(30, 144, 255, 0.4)',
        borderColor: 'white',
        borderWidth: 2,
        label: '週単位AC',
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
          text: 'Value（人日）',
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
export default EvmGraphPage;