import "./PrjShowPage.css";
import { useEffect, useState } from 'react';
import { getPrj } from '../../../lib/api/project';
import { toDate } from "../../../lib/common/ToDate";
import Alert from "@mui/material/Alert";
import { displayDate } from '../../../lib/common/datotostr';

const initData = {prj: {status: "",
                        approval: "",
                        approval_date: "",
                        pl_name: "",
                        number: "",
                        name: "",
                        make_date: "",
                        make_name: "",
                        update_date: "",
                        update_name: "",
                        company_name: "",
                        department_name: "",
                        personincharge_name: "",
                        phone: "",
                        fax: "",
                        email: "",
                        development_period_fr: "",
                        development_period_to: "",
                        scheduled_to_be_completed: "",
                        system_overview: "",
                        development_environment: "",
                        order_amount: 0,
                        planned_work_cost: 0,
                        planned_workload: 0,
                        planned_purchasing_cost: 0,
                        planned_outsourcing_cost: 0,
                        planned_outsourcing_workload: 0,
                        planned_expenses_cost: 0,
                        gross_profit: 0,
                        work_place_kbn: "",
                        work_place: "",
                        customer_property_kbn: "",
                        customer_property: "",
                        customer_environment: "",
                        purchasing_goods_kbn: "",
                        purchasing_goods: "",
                        outsourcing_kbn: "",
                        outsourcing: "",
                        customer_requirement_kbn: "",
                        customer_requirement: "",
                        remarks: ""},
                      phases: [],
                      risks: [],
                      goals: [],
                      mems: []
                      }

const PrjShowPage = (props) => {
  const { prj_id } = props;
  const [data, setData] = useState(initData);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  useEffect(() => {
    handleGetPrj(prj_id);
  },[prj_id]);

  const handleGetPrj = async (id) => {
    try {
      const res = await getPrj(Number(id));
      const tmpPhases = res.data.phases.map(phase => {
        const tmpPhase = {};
        tmpPhase.id = phase.id;
        tmpPhase.project_id = phase.project_id;
        tmpPhase.number = phase.number;
        tmpPhase.name = phase.name;
        tmpPhase.planned_periodfr = toDate(phase.planned_periodfr);
        tmpPhase.planned_periodto = toDate(phase.planned_periodto);
        tmpPhase.deliverables = phase.deliverables;
        tmpPhase.criteria = phase.criteria;
        tmpPhase.del = ""; 
        return tmpPhase; 
      });
      const tmpRisks = res.data.risks.map(risk => {
        const tmpRisk = {};
        tmpRisk.id = risk.id;
        tmpRisk.project_id = risk.project_id;
        tmpRisk.number = risk.number;
        tmpRisk.contents = risk.contents;
        tmpRisk.del = "";
        return tmpRisk;
      });
      const tmpGoals = res.data.goals.map(goal => {
        const tmpGoal = {};
        tmpGoal.id = goal.id;
        tmpGoal.project_id = goal.project_id;
        tmpGoal.number = goal.number;
        tmpGoal.contents = goal.contents;
        tmpGoal.del = "";
        return tmpGoal;
      });
      const tmpMems = res.data.mems.map(mem => {
        const tmpMem = {};
        tmpMem.id = mem.id;
        tmpMem.project_id = mem.project_id;
        tmpMem.number = mem.number;
        tmpMem.level = mem.level;
        tmpMem.member_id = mem.member_id;
        tmpMem.member_name = mem.member_name;
        tmpMem.del = false;
        return tmpMem;
      });
      setData({
        ...data,
        prj: {status: res.data.prj.status,
              approval: res.data.prj.approval,
              approval_date: toDate(res.data.prj.approval_date),
              pl_name: res.data.prj.pl_name,
              number: res.data.prj.number,
              name: res.data.prj.name,
              make_date: toDate(res.data.prj.make_date),
              make_name: res.data.prj.make_name,
              update_date: toDate(res.data.prj.update_date),
              update_name: res.data.prj.update_name,
              company_name: res.data.prj.company_name,
              department_name: res.data.prj.department_name,
              personincharge_name: res.data.prj.personincharge_name,
              phone: res.data.prj.phone,
              fax: res.data.prj.fax,
              email: res.data.prj.email,
              development_period_fr: toDate(res.data.prj.development_period_fr),
              development_period_to: toDate(res.data.prj.development_period_to),
              scheduled_to_be_completed: toDate(res.data.prj.scheduled_to_be_completed),
              system_overview: res.data.prj.system_overview,
              development_environment: res.data.prj.development_environment,
              order_amount: Number(res.data.prj.order_amount),
              planned_work_cost: Number(res.data.prj.planned_work_cost),
              planned_workload: Number(res.data.prj.planned_workload),
              planned_purchasing_cost: Number(res.data.prj.planned_purchasing_cost),
              planned_outsourcing_cost: Number(res.data.prj.planned_outsourcing_cost),
              planned_outsourcing_workload: Number(res.data.prj.planned_outsourcing_workload),
              planned_expenses_cost: Number(res.data.prj.planned_expenses_cost),
              gross_profit: Number(res.data.prj.gross_profit),
              work_place_kbn: res.data.prj.work_place_kbn,
              work_place: res.data.prj.work_place,
              customer_property_kbn: res.data.prj.customer_property_kbn,
              customer_property: res.data.prj.customer_property,
              customer_environment: res.data.prj.customer_environment,
              purchasing_goods_kbn: res.data.prj.purchasing_goods_kbn,
              purchasing_goods: res.data.prj.purchasing_goods,
              outsourcing_kbn: res.data.prj.outsourcing_kbn,
              outsourcing: res.data.prj.outsourcing,
              customer_requirement_kbn: res.data.prj.customer_requirement_kbn,
              customer_requirement: res.data.prj.customer_requirement,
              remarks: res.data.prj.remarks
        },
        phases: tmpPhases,
        risks: tmpRisks,
        goals: tmpGoals,
        mems: tmpMems,
      });
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    }
  }

  const joinMembersComma = (members) => {
    if (Array.isArray(members)) {
      if (members.length>0) {
        var buf = "";
        for (let i=0; i<members.length-1; i++)
        {
          buf = buf + members[i].member_name + ", ";
        }
        buf = buf + members[members.length-1].member_name;    
        return(buf);          
      }  
    }
  }

  return (
    <div className="prj-show-container">
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <div className="prj-detail-container">
        <div className="prj-detail-container1">
          {/* 1行目 */}
          <div className="prj-title-cell">プロジェクト計画書</div>
          <div className="title-cell">{"承認"}</div>
          <div className="data-cell">
            {displayDate(data.prj.approval_date || '')}
            {"　"}
            {data.prj.approval || ''}
          </div>
        </div>

        <div className="scroll-frame">

          <div className="prj-detail-container2">
            {/* 2行目 */}
            <div className="title-cell cell2-1">プロジェクトNo.</div>
            <div className="data-cell cell2-2">{data.prj.number || ''}</div>
            <div className="title-cell cell2-3">作　成</div>
            <div className="date-cell cell2-4">
              {displayDate(data.prj.make_date || '')}
              {"　"}
              {data.prj.make_name || ''}
            </div>
            {/* 3行目 */}
            <div className="title-cell cell3-1">プロジェクト名</div>
            <div className="data-cell cell3-2">{data.prj.name || ''}</div>
            <div className="title-cell cell3-3">変　更</div>
            <div className="date-cell cell3-4">
              {displayDate(data.prj.update_date || '')}
              {"　"}
              {data.prj.update_name || ''}
            </div>
          </div>

          <div className="prj-detail-container3">
            {/* 4行目 */}
            <div className="title-cell-a cell4-1">取引先</div>
            <div className="data-cell cell4-2">
              <div className="inner">
                <label className="inner-title">会社名:</label>
                {data.prj.company_name || ''}
              </div>
              <div className="inner">
                <label className="inner-title">部署名:</label>
                {data.prj.department_name || ''}
              </div>
              <div className="inner">
                <label className="inner-title">担当者名:</label>
                {data.prj.personincharge_name || ''}
              </div>
            </div>
            <div className="title-cell cell4-3">TEL</div>
            <div className="data-cell cell4-4">{data.prj.phone || ''}</div>
            {/* 5行目 */}
            {/* <div className="title-cell cell5-1"></div> */}
            {/* <div className="data-cell cell5-2"></div> */}
            <div className="title-cell cell5-3">FAX</div>
            <div className="data-cell cell5-4">{data.prj.fax || ''}</div>
            {/* 6行目 */}
            {/* <div className="title-cell cell6-1"></div> */}
            {/* <div className="data-cell cell6-2"></div> */}
            <div className="title-cell cell6-3">E-mail</div>
            <div className="data-cell cell6-4">{data.prj.email || ''}</div>
          </div>

          <div className="prj-detail-container4">
            {/* 7行目 */}
            <div className="title-cell cell7-1">開発期間</div>
            <div className="date-cell cell7-2">
              {displayDate(data.prj.development_period_fr || '')}
              <label className="inner-caption">{"　〜　"}</label>
              {displayDate(data.prj.development_period_to || '')}
            </div>
            <div className="title-cell cell7-3">完了予定</div>
            <div className="date-cell cell7-4">
              {displayDate(data.prj.scheduled_to_be_completed || '')}
            </div>
          </div>

          <div className="prj-detail-container5">
            {/* 8行目 */}
            <div className="title-cell cell8-1">システム概要</div>
            <div className="data-cell cell8-2">{data.prj.system_overview || ''}</div>
            <div className="title-cell cell8-3">開発環境</div>
            <div className="data-cell cell8-4">{data.prj.development_environment || ''}</div>
          </div>

          <div className="prj-detail-container6">
            {/* 9行目 */}
            <div className="title-cell cell9-1">受注金額</div>
            <div className="data-cell cell9-2">
              {Number(data.prj.order_amount || '').toLocaleString()}
              <label className="inner-caption">{"円"}</label>
            </div>
            <div className="title-cell cell9-3">計画値</div>
            <div className="title-cell cell9-4">作業費</div>
            <div className="data-cell cell9-5">
              {Number(data.prj.planned_work_cost || '').toLocaleString()}
              <label className="inner-caption">{"円（"}</label>
              {data.prj.planned_workload || ''} 
              <label className="inner-caption">{"人月）"}</label>
            </div>
            <div className="title-cell cell9-6">仕入費</div>
            <div className="data-cell cell9-7">
              {Number(data.prj.planned_purchasing_cost || '').toLocaleString()}
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* 10行目 */}
            <div className="title-cell cell10-1">粗利見込</div>
            <div className="data-cell cell10-2">
              {Number(data.prj.gross_profit || '').toLocaleString()}
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* <div className="title-cell cell10-3"></div> */}
            <div className="title-cell cell10-4">外注費</div>
            <div className="data-cell cell10-5">
              {Number(data.prj.planned_outsourcing_cost || '').toLocaleString()}
              <label className="inner-caption">{"円（"}</label>
              {data.prj.planned_outsourcing_workload || ''} 
              <label className="inner-caption">{"人月）"}</label>
            </div>
            <div className="title-cell cell10-6">経費</div>
            <div className="data-cell cell10-7">
              {Number(data.prj.planned_expenses_cost || '').toLocaleString()}
              <label className="inner-caption">{"円"}</label>
            </div>
          </div>

          <div className="prj-detail-container7">
            {/* 11行目 */}
            <div className="title-cell cell11-1">作業場所</div>
            <div className="data-cell cell11-2">
              {data.prj.work_place_kbn || ''}
              {"　：　"}
              {data.prj.work_place || ''} 
            </div>
            {/* <div className="title-cell cell11-3"></div> */}
            {/* <div className="data-cell cell11-4"></div> */}
            {/* <div className="title-cell cell11-5"></div> */}
            {/* <div className="data-cell cell11-6"></div> */}
            {/* 12行目 */}
            <div className="title-cell cell12-1">顧客所有物</div>
            <div className="radio-cell cell12-2">{data.prj.customer_property_kbn || ''}</div>
            <div className="data-cell cell12-3">{data.prj.customer_property || ''}</div>
            {/* <div className="data-cell cell12-4"></div> */}
            <div className="title-cell cell12-5">顧客環境</div>
            <div className="radio-cell cell12-6">{data.prj.customer_environment || ''}</div>
            {/* 13行目 */}
            <div className="title-cell cell13-1">仕入品</div>
            <div className="radio-cell cell13-2">{data.prj.purchasing_goods_kbn || ''}</div>
            <div className="data-cell cell13-3">{data.prj.purchasing_goods || ''}</div>
            {/* <div className="data-cell cell13-4"></div> */}
            {/* <div className="title-cell cell13-5"></div> */}
            {/* <div className="data-cell cell13-6"></div> */}
            {/* 14行目 */}
            <div className="title-cell cell14-1">外部委託</div>
            <div className="radio-cell cell14-2">{data.prj.outsourcing_kbn || ''}</div>
            <div className="data-cell cell14-3">{data.prj.outsourcing || ''}</div>
            {/* <div className="data-cell cell14-4"></div> */}
            {/* <div className="title-cell cell14-5"></div> */}
            {/* <div className="data-cell cell14-6"></div> */}
            {/* 15行目 */}
            <div className="title-cell cell15-1">顧客要求仕様書</div>
            <div className="radio-cell cell15-2">{data.prj.customer_requirement_kbn || ''}</div>
            <div className="title-cell cell15-3">文書名</div>
            <div className="data-cell cell15-4">{data.prj.customer_requirement || ''}</div>
            {/* <div className="title-cell cell15-5"></div> */}
            {/* <div className="data-cell cell15-6"></div> */}
          </div>

          <div className="prj-detail-container8">
            <div className="title-cell">
              <div className="title">受注範囲</div>
            </div>
            <div className="data-cell">
              <table className="prj-detail-phases">
                <thead>
                  <tr className="header-tr">
                    <td className="header-td name-td">工程</td>
                    <td className="header-td period-td">開始予定</td>
                    <td className="header-td period-td">終了予定</td>
                    <td className="header-td deliverables-td">成果物</td>
                    <td className="header-td criteria-td">合否判定基準</td>
                  </tr>
                </thead>
                <tbody>
                  {data.phases ? (
                    data.phases.map((phase, i) => 
                    <tr key={"phase-" + i} className="body-tr">
                      <td className="name-td">{phase.name || ''}</td>
                      <td className="period-td">{displayDate(phase.planned_periodfr || '')}</td>
                      <td className="period-td">{displayDate(phase.planned_periodto || '')}</td>
                      <td className="deliverables-td">{phase.deliverables || ''}</td>
                      <td className="criteria-td">{phase.criteria || ''}</td>
                    </tr>
                    )
                  ) : (
                    <></>
                  )}
                  </tbody>
              </table>
            </div>
          </div>

          <div className="prj-detail-container9">
            <div className="title-cell">リスク</div>
            <div className="data-cell">
              <table className="prj-detail-risks">
                <tbody>
                  {data.risks ? (
                    data.risks.map((risk, i) => 
                    <tr key={"risk-" + i} className="body-tr">
                      <td className="contents">{risk.contents || ''}</td>
                    </tr>
                    )
                  ) : (
                    <></>
                  )}
                  </tbody>
              </table>
            </div>
          </div>

          <div className="prj-detail-container10">
            <div className="title-cell">品質目標</div>
            <div className="data-cell">
              <table className="prj-detail-goals">
                <tbody>
                  {data.goals ? (
                    data.goals.map((goal, i) => 
                    <tr key={"goal-" + i} className="body-tr">
                      <td className="contents">{goal.contents || ''}</td>
                    </tr>
                    )
                  ) : (
                    <></>
                  )}
                  </tbody>
              </table>
            </div>
          </div>

          <div className="prj-detail-container11">
            <div className="title-cell title-top">開発体制</div>
            <div className="title-cell pl-title">プロジェクトリーダー</div>
            <div className="data-cell pl-cell">{data.prj.pl_name || ''}</div>
            {/* <div className="title-cell"></div> */}
            <div className="title-cell member-title">プロジェクトメンバー</div>
            <div className="data-cell member-cell">
            {data.mems ? (
              <>{joinMembersComma(data.mems)}</>
            ) : (
              <></>
            )}
            </div>
          </div>

          <div className="prj-detail-container12">
              {/* 16行目 */}
              <div className="title-cell cell16-1">特記事項</div>
              <div className="data-cell cell16-2">{data.prj.remarks || ''}</div>
            </div>

        </div>

      </div>


    </div>

  );
}

export default PrjShowPage;
