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
      setMessage("???????????????????????????????????????");
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
          {/* 1?????? */}
          <div className="prj-title-cell">???????????????????????????</div>
          <div className="title-cell">{"??????"}</div>
          <div className="data-cell">
            {displayDate(data.prj.approval_date || '')}
            {"???"}
            {data.prj.approval || ''}
          </div>
        </div>

        <div className="scroll-frame">

          <div className="prj-detail-container2">
            {/* 2?????? */}
            <div className="title-cell cell2-1">??????????????????No.</div>
            <div className="data-cell cell2-2">{data.prj.number || ''}</div>
            <div className="title-cell cell2-3">?????????</div>
            <div className="date-cell cell2-4">
              {displayDate(data.prj.make_date || '')}
              {"???"}
              {data.prj.make_name || ''}
            </div>
            {/* 3?????? */}
            <div className="title-cell cell3-1">?????????????????????</div>
            <div className="data-cell cell3-2">{data.prj.name || ''}</div>
            <div className="title-cell cell3-3">?????????</div>
            <div className="date-cell cell3-4">
              {displayDate(data.prj.update_date || '')}
              {"???"}
              {data.prj.update_name || ''}
            </div>
          </div>

          <div className="prj-detail-container3">
            {/* 4?????? */}
            <div className="title-cell-a cell4-1">?????????</div>
            <div className="data-cell cell4-2">
              <div className="inner">
                <label className="inner-title">?????????:</label>
                {data.prj.company_name || ''}
              </div>
              <div className="inner">
                <label className="inner-title">?????????:</label>
                {data.prj.department_name || ''}
              </div>
              <div className="inner">
                <label className="inner-title">????????????:</label>
                {data.prj.personincharge_name || ''}
              </div>
            </div>
            <div className="title-cell cell4-3">TEL</div>
            <div className="data-cell cell4-4">{data.prj.phone || ''}</div>
            {/* 5?????? */}
            {/* <div className="title-cell cell5-1"></div> */}
            {/* <div className="data-cell cell5-2"></div> */}
            <div className="title-cell cell5-3">FAX</div>
            <div className="data-cell cell5-4">{data.prj.fax || ''}</div>
            {/* 6?????? */}
            {/* <div className="title-cell cell6-1"></div> */}
            {/* <div className="data-cell cell6-2"></div> */}
            <div className="title-cell cell6-3">E-mail</div>
            <div className="data-cell cell6-4">{data.prj.email || ''}</div>
          </div>

          <div className="prj-detail-container4">
            {/* 7?????? */}
            <div className="title-cell cell7-1">????????????</div>
            <div className="date-cell cell7-2">
              {displayDate(data.prj.development_period_fr || '')}
              <label className="inner-caption">{"?????????"}</label>
              {displayDate(data.prj.development_period_to || '')}
            </div>
            <div className="title-cell cell7-3">????????????</div>
            <div className="date-cell cell7-4">
              {displayDate(data.prj.scheduled_to_be_completed || '')}
            </div>
          </div>

          <div className="prj-detail-container5">
            {/* 8?????? */}
            <div className="title-cell cell8-1">??????????????????</div>
            <div className="data-cell cell8-2">{data.prj.system_overview || ''}</div>
            <div className="title-cell cell8-3">????????????</div>
            <div className="data-cell cell8-4">{data.prj.development_environment || ''}</div>
          </div>

          <div className="prj-detail-container6">
            {/* 9?????? */}
            <div className="title-cell cell9-1">????????????</div>
            <div className="data-cell cell9-2">
              {Number(data.prj.order_amount || '').toLocaleString()}
              <label className="inner-caption">{"???"}</label>
            </div>
            <div className="title-cell cell9-3">?????????</div>
            <div className="title-cell cell9-4">?????????</div>
            <div className="data-cell cell9-5">
              {Number(data.prj.planned_work_cost || '').toLocaleString()}
              <label className="inner-caption">{"??????"}</label>
              {data.prj.planned_workload || ''} 
              <label className="inner-caption">{"?????????"}</label>
            </div>
            <div className="title-cell cell9-6">?????????</div>
            <div className="data-cell cell9-7">
              {Number(data.prj.planned_purchasing_cost || '').toLocaleString()}
              <label className="inner-caption">{"???"}</label>
            </div>
            {/* 10?????? */}
            <div className="title-cell cell10-1">????????????</div>
            <div className="data-cell cell10-2">
              {Number(data.prj.gross_profit || '').toLocaleString()}
              <label className="inner-caption">{"???"}</label>
            </div>
            {/* <div className="title-cell cell10-3"></div> */}
            <div className="title-cell cell10-4">?????????</div>
            <div className="data-cell cell10-5">
              {Number(data.prj.planned_outsourcing_cost || '').toLocaleString()}
              <label className="inner-caption">{"??????"}</label>
              {data.prj.planned_outsourcing_workload || ''} 
              <label className="inner-caption">{"?????????"}</label>
            </div>
            <div className="title-cell cell10-6">??????</div>
            <div className="data-cell cell10-7">
              {Number(data.prj.planned_expenses_cost || '').toLocaleString()}
              <label className="inner-caption">{"???"}</label>
            </div>
          </div>

          <div className="prj-detail-container7">
            {/* 11?????? */}
            <div className="title-cell cell11-1">????????????</div>
            <div className="data-cell cell11-2">
              {data.prj.work_place_kbn || ''}
              {"?????????"}
              {data.prj.work_place || ''} 
            </div>
            {/* <div className="title-cell cell11-3"></div> */}
            {/* <div className="data-cell cell11-4"></div> */}
            {/* <div className="title-cell cell11-5"></div> */}
            {/* <div className="data-cell cell11-6"></div> */}
            {/* 12?????? */}
            <div className="title-cell cell12-1">???????????????</div>
            <div className="radio-cell cell12-2">{data.prj.customer_property_kbn || ''}</div>
            <div className="data-cell cell12-3">{data.prj.customer_property || ''}</div>
            {/* <div className="data-cell cell12-4"></div> */}
            <div className="title-cell cell12-5">????????????</div>
            <div className="radio-cell cell12-6">{data.prj.customer_environment || ''}</div>
            {/* 13?????? */}
            <div className="title-cell cell13-1">?????????</div>
            <div className="radio-cell cell13-2">{data.prj.purchasing_goods_kbn || ''}</div>
            <div className="data-cell cell13-3">{data.prj.purchasing_goods || ''}</div>
            {/* <div className="data-cell cell13-4"></div> */}
            {/* <div className="title-cell cell13-5"></div> */}
            {/* <div className="data-cell cell13-6"></div> */}
            {/* 14?????? */}
            <div className="title-cell cell14-1">????????????</div>
            <div className="radio-cell cell14-2">{data.prj.outsourcing_kbn || ''}</div>
            <div className="data-cell cell14-3">{data.prj.outsourcing || ''}</div>
            {/* <div className="data-cell cell14-4"></div> */}
            {/* <div className="title-cell cell14-5"></div> */}
            {/* <div className="data-cell cell14-6"></div> */}
            {/* 15?????? */}
            <div className="title-cell cell15-1">?????????????????????</div>
            <div className="radio-cell cell15-2">{data.prj.customer_requirement_kbn || ''}</div>
            <div className="title-cell cell15-3">?????????</div>
            <div className="data-cell cell15-4">{data.prj.customer_requirement || ''}</div>
            {/* <div className="title-cell cell15-5"></div> */}
            {/* <div className="data-cell cell15-6"></div> */}
          </div>

          <div className="prj-detail-container8">
            <div className="title-cell">
              <div className="title">????????????</div>
            </div>
            <div className="data-cell">
              <table className="prj-detail-phases">
                <thead>
                  <tr className="header-tr">
                    <td className="header-td name-td">??????</td>
                    <td className="header-td period-td">????????????</td>
                    <td className="header-td period-td">????????????</td>
                    <td className="header-td deliverables-td">?????????</td>
                    <td className="header-td criteria-td">??????????????????</td>
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
            <div className="title-cell">?????????</div>
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
            <div className="title-cell">????????????</div>
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
            <div className="title-cell title-top">????????????</div>
            <div className="title-cell pl-title">??????????????????????????????</div>
            <div className="data-cell pl-cell">{data.prj.pl_name || ''}</div>
            {/* <div className="title-cell"></div> */}
            <div className="title-cell member-title">??????????????????????????????</div>
            <div className="data-cell member-cell">
            {data.mems ? (
              <>{joinMembersComma(data.mems)}</>
            ) : (
              <></>
            )}
            </div>
          </div>

          <div className="prj-detail-container12">
              {/* 16?????? */}
              <div className="title-cell cell16-1">????????????</div>
              <div className="data-cell cell16-2">{data.prj.remarks || ''}</div>
            </div>

        </div>

      </div>


    </div>

  );
}

export default PrjShowPage;
