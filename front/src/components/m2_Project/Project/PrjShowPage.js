// m27
import "./PrjShowPage.css";
import { useEffect, useState } from 'react';
import { getPrj } from '../../../lib/api/project';
import { formatDateZero } from '../../../lib/common/dateCom';
import Alert from "@mui/material/Alert";
import { isEmpty } from "../../../lib/common/isEmpty";

const initData = {prj: {status: "",
                        approval: "",
                        approval_name: "",
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
  const { prjId } = props;
  const [data, setData] = useState(initData);
  const [message, setMessage] = useState({ kbn: "", msg: "" });

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      handleGetPrj(prjId);
    }
  },[prjId]);

  // プロジェクト情報取得
  const handleGetPrj = async (id) => {
    try {
      const res = await getPrj(Number(id));
      // 工程情報取得
      const tmpPhases = res.data.phases.map(phase => {
        const tmpPhase = {};
        tmpPhase.id = phase.id;
        tmpPhase.project_id = phase.project_id;
        tmpPhase.number = phase.number;
        tmpPhase.name = phase.name;
        tmpPhase.planned_periodfr = phase.planned_periodfr;
        tmpPhase.planned_periodto = phase.planned_periodto;
        tmpPhase.deliverables = phase.deliverables;
        tmpPhase.criteria = phase.criteria;
        return tmpPhase; 
      });
      // リスク情報セット
      const tmpRisks = res.data.risks.map(risk => {
        const tmpRisk = {};
        tmpRisk.id = risk.id;
        tmpRisk.project_id = risk.project_id;
        tmpRisk.number = risk.number;
        tmpRisk.contents = risk.contents;
        return tmpRisk;
      });
      // 品質目標セット
      const tmpGoals = res.data.goals.map(goal => {
        const tmpGoal = {};
        tmpGoal.id = goal.id;
        tmpGoal.project_id = goal.project_id;
        tmpGoal.number = goal.number;
        tmpGoal.contents = goal.contents;
        return tmpGoal;
      });
      // メンバー情報セット
      const tmpMems = res.data.mems.map(mem => {
        const tmpMem = {};
        tmpMem.id = mem.id;
        tmpMem.project_id = mem.project_id;
        tmpMem.number = mem.number;
        tmpMem.level = mem.level;
        tmpMem.member_id = mem.member_id;
        tmpMem.member_name = mem.member_name;
        return tmpMem;
      });
      // プロジェクト情報セット
      setData({
        ...data,
        prj: {status: res.data.prj.status,
              approval: res.data.prj.approval,
              approval_name: res.data.prj.approval_name,
              approval_date: res.data.prj.approval_date,
              pl_name: res.data.prj.pl_name,
              number: res.data.prj.number,
              name: res.data.prj.name,
              make_date: res.data.prj.make_date,
              make_name: res.data.prj.make_name,
              update_date: res.data.prj.update_date,
              update_name: res.data.prj.update_name,
              company_name: res.data.prj.company_name,
              department_name: res.data.prj.department_name,
              personincharge_name: res.data.prj.personincharge_name,
              phone: res.data.prj.phone,
              fax: res.data.prj.fax,
              email: res.data.prj.email,
              development_period_fr: res.data.prj.development_period_fr,
              development_period_to: res.data.prj.development_period_to,
              scheduled_to_be_completed: res.data.prj.scheduled_to_be_completed,
              system_overview: res.data.prj.system_overview,
              development_environment: res.data.prj.development_environment,
              order_amount: toNum(res.data.prj.order_amount),
              planned_work_cost: toNum(res.data.prj.planned_work_cost),
              planned_workload: toNum(res.data.prj.planned_workload),
              planned_purchasing_cost: toNum(res.data.prj.planned_purchasing_cost),
              planned_outsourcing_cost: toNum(res.data.prj.planned_outsourcing_cost),
              planned_outsourcing_workload: toNum(res.data.prj.planned_outsourcing_workload),
              planned_expenses_cost: toNum(res.data.prj.planned_expenses_cost),
              gross_profit: toNum(res.data.prj.gross_profit),
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
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    }
  }

  // プロジェクトメンバー カンマ連結編集
  const joinMembersComma = (members) => {
    if (!isEmpty(members)) {
      if (Array.isArray(members)) {
        if (members.length>0) {
          var buf = "";
          for (let i=0; i<members.length-1; i++)
          {
            buf = buf + members[i].member_name + ", ";
          }
          buf = buf + members[members.length-1].member_name;    
          return(buf);          
        } else {
          return "";
        }  
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }
  const toNum = (v) => {
    if (isEmpty(v)) {
      return 0;
    } else {
      return Number(v);
    }
  }

  // 画面編集
  return (
    <div className="m27-container">
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      {/* セクション１ */}
      <table className="m27-sec01">
        <tr>
          <td className="m27-prj-ttl">プロジェクト計画書</td>
          <td className="m27-approval-ttl">承認</td>
          <td className="m27-approval">{formatDateZero(data.prj.approval_date, "YYYY年MM月DD日") + "　" + toStr(data.prj.approval_name)}</td>
        </tr>
      </table>

      <div className="m27-frame">

        {/* セクション２ */}
        <table className="m27-sec02">
          <tr>
            <td className="m27-sec02-ttl1">プロジェクトNo.</td>
            <td className="m27-sec02-val1">{toStr(data.prj.number)}</td>
            <td className="m27-sec02-ttl2">作　成</td>
            <td className="m27-sec02-val2">{formatDateZero(data.prj.make_date, "YYYY年MM月DD日") + "　" + toStr(data.prj.make_name)}</td>
          </tr>
          <tr>
            <td className="m27-sec02-ttl1">プロジェクト名</td>
            <td className="m27-sec02-val1">{toStr(data.prj.name)}</td>
            <td className="m27-sec02-ttl2">変　更</td>
            <td className="m27-sec02-val2">{formatDateZero(data.prj.update_date, "YYYY年MM月DD日") + "　" + toStr(data.prj.update_name)}</td>
          </tr>
        </table>

        {/* セクション３ */}
        <table className="m27-sec03">
          <tr>
            <td className="m27-sec03-ttl1" rowSpan="3">取引先</td>
            <td className="m27-sec03-val1" rowSpan="3">
              <div className="m27-sec03-innerrow">
                <div className="m27-sec03-innerttl">会社名:</div>
                <div className="m27-sec03-innerval">{toStr(data.prj.company_name)}</div>
              </div>
              <div className="m27-sec03-innerrow">
                <div className="m27-sec03-innerttl">部署名:</div>
                <div className="m27-sec03-innerval">{toStr(data.prj.department_name)}</div>
              </div>
              <div className="m27-sec03-innerrow">
                <div className="m27-sec03-innerttl">担当者:</div>
                <div className="m27-sec03-innerval">{toStr(data.prj.personincharge_name)}</div>
              </div>
            </td>
            <td className="m27-sec03-ttl2">TEL</td>
            <td className="m27-sec03-val2">{toStr(data.prj.phone)}</td>
          </tr>
          <tr>
            <td className="m27-sec03-ttl2">FAX</td>
            <td className="m27-sec03-val2">{toStr(data.prj.fax)}</td>
          </tr>
          <tr>
            <td className="m27-sec03-ttl2">E-mail</td>
            <td className="m27-sec03-val2">{toStr(data.prj.email)}</td>
          </tr>            
        </table>

        {/* セクション４ */}
        <table className="m27-sec04">
          <tr>
            <td className="m27-sec04-ttl1">開発期間</td>
            <td className="m27-sec04-val1">{formatDateZero(data.prj.development_period_fr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(data.prj.development_period_to, "YYYY年MM月DD日")}</td>
            <td className="m27-sec04-ttl2">完了予定</td>
            <td className="m27-sec04-val2">{formatDateZero(data.prj.scheduled_to_be_completed, "YYYY年MM月DD日")}</td>
          </tr>
        </table>

        {/* セクション５ */}
        <table className="m27-sec05">
          <tr>
            <td className="m27-sec05-ttl1">システム概要</td>
            <td className="m27-sec05-val1">{toStr(data.prj.system_overview)}</td>
            <td className="m27-sec05-ttl2">開発環境</td>
            <td className="m27-sec05-val2">{toStr(data.prj.development_environment)}</td>
          </tr>
        </table>

        {/* セクション６ */}
        <table className="m27-sec06">
          <tr>
            <td className="m27-sec06-ttl1">受注金額</td>
            <td className="m27-sec06-val1">{data.prj.order_amount.toLocaleString() + "円"}</td>
            <td className="m27-sec06-ttl2" rowSpan="2">計画値</td>
            <td className="m27-sec06-ttl2">作業費</td>
            <td className="m27-sec06-val2">{data.prj.planned_work_cost.toLocaleString() + "円（" + toStr(data.prj.planned_workload) + "人月）"}</td>
            <td className="m27-sec06-ttl3">仕入費</td>
            <td className="m27-sec06-val3">{data.prj.planned_purchasing_cost.toLocaleString() + "円"}</td>
          </tr>
          <tr>
            <td className="m27-sec06-ttl1">粗利見込</td>
            <td className="m27-sec06-val1">{data.prj.gross_profit.toLocaleString() + "円"}</td>
            <td className="m27-sec06-ttl2">外注費</td>
            <td className="m27-sec06-val2">{data.prj.planned_outsourcing_cost.toLocaleString() + "円（" + toStr(data.prj.planned_outsourcing_workload) + "人月）"}</td>
            <td className="m27-sec06-ttl3">経費</td>
            <td className="m27-sec06-val3">{data.prj.planned_expenses_cost.toLocaleString() + "円"}</td>
          </tr>
        </table>

        {/* セクション７ */}
        <table className="m27-sec07">
          <tr>
            <td className="m27-sec07-ttl">作業場所</td>
            <td className="m27-sec07-val">
              {toStr(data.prj.work_place_kbn) + " ： " + toStr(data.prj.work_place)} 
            </td>
          </tr>
        </table>

        {/* セクション８ */}
        <table className="m27-sec08">
          <tr>
            <td className="m27-sec08-ttl1">顧客所有物</td>
            <td className="m27-sec08-val11">{toStr(data.prj.customer_property_kbn)}</td>
            <td className="m27-sec08-val12">{toStr(data.prj.customer_property)}</td>
            <td className="m27-sec08-ttl2">顧客環境</td>
            <td className="m27-sec08-val2">{toStr(data.prj.customer_environment)}</td>
          </tr>
        </table>

        {/* セクション９ */}
        <table className="m27-sec09">
          <tr>
            <td className="m27-sec09-ttl">仕入品</td>
            <td className="m27-sec09-val1">{toStr(data.prj.purchasing_goods_kbn)}</td>
            <td className="m27-sec09-val2">{toStr(data.prj.purchasing_goods)}</td>
          </tr>
          <tr>
            <td className="m27-sec09-ttl">外部委託</td>
            <td className="m27-sec09-val1">{toStr(data.prj.outsourcing_kbn)}</td>
            <td className="m27-sec09-val2">{toStr(data.prj.outsourcing)}</td>
          </tr>
        </table>

        {/* セクション１０ */}
        <table className="m27-sec10">
          <tr>
            <td className="m27-sec10-ttl1">顧客要求仕様書</td>
            <td className="m27-sec10-val1">{toStr(data.prj.customer_requirement_kbn)}</td>
            <td className="m27-sec10-ttl2">文書名</td>
            <td className="m27-sec10-val2">{toStr(data.prj.customer_requirement)}</td>
          </tr>
        </table>

        {/* セクション１１ */}
        <table className="m27-sec11">
          <tbody>
            <tr>
              <td className="m27-sec11-ttl">受注範囲</td>
              <td className="m27-sec11-val">
                <table className="m27-phasetbl">
                  <thead>
                    <tr className="m27-phase-hdtr">
                      <td className="m27-phase-name-th m27-phase-th">工程</td>
                      <td className="m27-phase-period-th m27-phase-th">開始予定</td>
                      <td className="m27-phase-period-th m27-phase-th">終了予定</td>
                      <td className="m27-phase-deliverables-th m27-phase-th">成果物</td>
                      <td className="m27-phase-criteria-th m27-phase-th">合否判定基準</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.phases ? (
                      data.phases.map((p,i) =>
                        <tr key={"phase-" + i} className="m27-phase-bdtr">
                          <td className="m27-phase-name-td">{toStr(p.name)}</td>
                          <td className="m27-phase-period-td">{formatDateZero(p.planned_periodfr, "YYYY年MM月DD日")}</td>
                          <td className="m27-phase-period-td">{formatDateZero(p.planned_periodto, "YYYY年MM月DD日")}</td>
                          <td className="m27-phase-deliverables-td">{toStr(p.deliverables)}</td>
                          <td className="m27-phase-criteria-td">{toStr(p.criteria)}</td>
                        </tr>
                      )
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション１２ */}
        <div className="m27-sec12">
          <div className="m27-sec12-ttl">リスク</div>
          <div className="m27-sec12-val">
            <table className="m27-risktbl">
              <tbody>
                {data.risks ? (
                  data.risks.map((r,i) => 
                    <tr key={"risk-" + i}>
                      <td className="m27-risk-contents-td">{toStr(r.contents)}</td>
                    </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* セクション１３ */}
        <div className="m27-sec13">
          <div className="m27-sec13-ttl">品質目標</div>
          <div className="m27-sec13-val">
            <table className="m27-goaltbl">
              <tbody>
                {data.goals ? (
                  data.goals.map((g,i) => 
                  <tr key={"goal-" + i}>
                    <td className="m27-goal-contents-td">{toStr(g.contents)}</td>
                  </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* セクション１４ */}
        <div className="m27-sec14">
          <table className="m27-sec14-tbl">
            <tbody>
              <tr>
                <td className="m27-sec14-ttl-td" rowSpan="2">開発体制</td>
                <td className="m27-sec14-subttl-td">プロジェクトリーダー</td>
                <td className="m27-sec14-val-td">{toStr(data.prj.pl_name)}</td>
              </tr>
              <tr>
                <td className="m27-sec14-subttl-td">プロジェクトメンバー</td>
                <td className="m27-sec14-val-td">{joinMembersComma(data.mems)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* セクション１５ */}
        <table className="m27-sec15">
          <tbody>
            <tr>
              <td className="m27-sec15-ttl-td">特記事項</td>
              <td className="m27-sec15-val-td">{toStr(data.prj.remarks)}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

  );
}
export default PrjShowPage;
