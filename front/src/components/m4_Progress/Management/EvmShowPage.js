// m45
import "./EvmShowPage.css";
import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { getEvmsByConditional } from '../../../lib/api/evm';
import { formatDateZero } from '../../../lib/common/dateCom';

const EvmShowPage = (props) => {
  const { progId, level, phaseId, setMessage } = props;
  const [data, setData] = useState([]);
  const [ys, setYs] = useState([]);
  const [ms, setMs] = useState([]);

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
      setData(res.data);
      setYs(setGroupY(res.data));
      setMs(setGroupM(res.data));
    } catch (e) {
      setMessage({kbn: "error", msg: "EVM取得エラー"});
    }
  }

  // ヘッダ年の集計
  const setGroupY = (pEvm) => {
    const ys = pEvm.evms.map((e,i) => {
      const tmpY = {};
      tmpY.y = formatDateZero(e.date_to,"YYYY年");
      return tmpY;
    });
    const group = ys.reduce((result, current) => {
      const element = result.find((p) => p.y === current.y);
      if (element) {
        // 同じものならインクリメント
        element.count ++;
      } else {
        // 異なるものなら初期セット（コントロールブレーク）
        result.push({
          y: current.y,
          count: 1
        });
      }
      return result;
    }, []);
    return group;
  }

  // ヘッダ月の集計
  const setGroupM = (pEvm) => {
    const ms = pEvm.evms.map((e,i) => {
      const tmpM = {};
      tmpM.m = formatDateZero(e.date_to,"MM月");
      return tmpM;
    });
    const group = ms.reduce((result, current) => {
      const element = result.find((p) => p.m === current.m);
      if (element) {
        // 同じものならインクリメント
        element.count ++;
      } else {
        // 異なるものなら初期セット（コントロールブレーク）
        result.push({
          m: current.m,
          count: 1
        });
      }
      return result;
    }, []);
    return group;
  }

  // パーセント計算（小数点以下第２位四捨五入）
  const setPercent = (v1, v2) => {
    return Math.round((v1 / v2) * 10000) / 100;
  }

  // 画面編集
  return (
    <>
    { progId ? (
      <div className="m45-container">
        { data.evms ? (
          <div className="m45-main">
            <div className="m45-left">
              <table className="m45-table-l">
                <tbody>
                  {/* 日付エリア */}
                  <tr>
                    <td rowSpan="3" colSpan="2" className="m45-th">日付</td>
                  </tr>
                  <tr>
                  </tr>
                  <tr>
                  </tr>
                  {/* 進捗率エリア */}
                  <tr>
                    <td rowSpan="3" className="m45-th m45-title1-td">{`進捗率\n(%)`}</td>
                    <td className="m45-th m45-title2-td">計画</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">出来高</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">実績</td>
                  </tr>
                  {/* 累積EVMエリア */}
                  <tr>
                    <td rowSpan="10" className="m45-th m45-title1-td">{`EVM\n計測値\n(累積)`}</td>
                    <td className="m45-th m45-title2-td">PV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">EV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">AC</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">SV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">CV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">SPI</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">CPI</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">ETC</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">EAC</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">VAC</td>
                  </tr>
                  {/* 週単位EVMエリア */}
                  <tr>
                    <td rowSpan="7" className="m45-th m45-title1-td">{`EVM\n計測値\n(週単位)`}</td>
                    <td className="m45-th m45-title2-td">PV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">EV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">AC</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">SV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">CV</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">SPI</td>
                  </tr>
                  <tr>
                    <td className="m45-th m45-title2-td">CPI</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="m45-right">
              <table className="m45-table-r" width={data.evms.length * 60}>
                <tbody>
                  {/* 日付エリア */}
                  <tr>
                    { ys.map((y,i) =>
                      <td colSpan={y.count} className="m45-th m45-date-td">{y.y}</td>
                    )}
                  </tr>
                  <tr>
                    { ms.map((m,i) => 
                      <td colSpan={m.count} className="m45-th m45-date-td">{m.m}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) =>
                      <td className="m45-th m45-date-td">{formatDateZero(e.date_to,"DD日")}</td>
                    )}
                  </tr>                  
                  {/* 進捗率エリア */}
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{setPercent(e.pv_sum, e.bac)}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{setPercent(e.ev_sum, e.bac)}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{setPercent(e.ac_sum, e.bac)}</td>
                    )}
                  </tr>
                  {/* 累積EVMエリア */}
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.pv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.ev_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.ac_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.sv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.cv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.spi_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.cpi_sum}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.etc}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.eac}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.vac}</td>
                    )}
                  </tr>
                  {/* 週単位EVMエリア */}
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.pv}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.ev}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.ac}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.sv}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.cv}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.spi}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) => 
                      <td className="m45-value-td">{e.cpi}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <></>
    )}
    </>
  )

}
export default EvmShowPage;