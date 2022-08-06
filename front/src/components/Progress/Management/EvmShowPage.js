import "./EvmShowPage.css";
import { useState, useEffect } from 'react';
import { isEmptyNum } from '../../../lib/common/numberCom';
import { getEvmsByConditional } from '../../../lib/api/evm';
import { formatDate } from "../../../lib/common/datetostr";

const EvmShowPage = (props) => {
  const { progId, level, phaseId, setMessage } = props;
  const [data, setData] = useState([]);
  const [yms, setYms] = useState([]);

  // 初期処理
  useEffect(() => {
    if (!isEmptyNum(progId)) {
      handleGetEvms();
    }
  },[progId]);

  // EVM取得
  const handleGetEvms = async () => {
    try {
      const res = await getEvmsByConditional(Number(progId), level, Number(phaseId));
      setData(res.data);
      setYms(setGroupYm(res.data));
} catch (e) {
      setMessage({kbn: "error", msg: "EVM取得エラー"});
    }
  }

  const setGroupYm = (pEvms) => {
    const yms = pEvms.evms.map((e,i) => {
      const tmpYm = {};
      tmpYm.ym = formatDate(e.date_fr,"YYYY年MM月");
      return tmpYm;
    });

    const group = yms.reduce((result, current) => {
      const element = result.find((p) => p.ym === current.ym);
      if (element) {
        // 同じものならインクリメント
        element.count ++;
      } else {
        // 異なるものなら初期セット（コントロールブレーク）
        result.push({
          ym: current.ym,
          count: 1
        });
      }
      return result;
    }, []);

    console.log(group);
    return group;
  }

  const setPercent = (v1, v2) => {
    return Math.round((v1 / v2) * 100) / 100;
  }

  return (
    <>
    { progId ? (
      <div className="m6-evm-show-container">
        { data.evms ? (
          <>
            <div className="evm-table-frame">
              <table className="evm-table">
                <tbody>
                  {/* 進捗率エリア */}
                  <tr>
                    <td rowSpan="5" className="header-td title1-td">{`進捗率\n(%)`}</td>
                    <td rowSpan="2" className="header-td title2-td">日付</td>
                    { yms.map((y,i) => 
                      <td colSpan={y.count} className="header-td date-td">{y.ym}</td>
                    )}
                  </tr>
                  <tr>
                    { data.evms.map((e,i) =>
                      <td className="header-td date-td">{formatDate(e.date_to,"DD日")}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">計画</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{setPercent(e.pv_sum, e.bac)}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">出来高</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{setPercent(e.ev_sum, e.bac)}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">実績</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{setPercent(e.ac_sum, e.bac)}</td>
                    )}
                  </tr>

                  {/* 累積EVMエリア */}
                  <tr>
                    <td rowSpan="10" className="header-td title1-td">{`EVM\n計測値\n(累積)`}</td>
                    <td className="header-td title2-td">PV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.pv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">EV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.ev_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">AC</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.ac_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">SV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.sv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">CV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.cv_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">SPI</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.spi_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">CPI</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.cpi_sum}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">ETC</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.etc}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">EAC</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.eac}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">VAC</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.vac}</td>
                    )}
                  </tr>

                  {/* 週単位EVMエリア */}
                  <tr>
                    <td rowSpan="7" className="header-td title1-td">{`EVM\n計測値\n(週単位)`}</td>
                    <td className="header-td title2-td">PV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.pv}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">EV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.ev}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">AC</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.ac}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">SV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.sv}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">CV</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.cv}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">SPI</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.spi}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="header-td title2-td">CPI</td>
                    { data.evms.map((e,i) => 
                      <td className="value-td">{e.cpi}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
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