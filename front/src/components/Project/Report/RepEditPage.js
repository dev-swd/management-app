
import "./RepEditPage.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRep, updateRep } from '../../../lib/api/report';
import { displayDate, formatDate } from '../../../lib/common/datetostr';
import { integerValidator } from '../../../lib/common/inputValidator.js';
import SelectEmployee from "../../common/SelectEmployee";
import CustomDatePicker from "../../common/customDatePicker";
import InputNumber from '../../common/InputNumber';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import ModalConfirm from '../../common/ModalConfirm';

const initDate = new Date();
const initDatestr = formatDate(initDate, "YYYY-MM-DD 00:00:00");
const initData = {prj: {status: ""},
                  rep: {id: "",
                        approval: "",
                        approval_date: "",
                        make_date: initDatestr,
                        make_id: "",
                        delivery_date: initDatestr,
                        actual_work_cost: "",
                        actual_workload: "",
                        actual_purchasing_cost: "",
                        actual_outsourcing_cost: "",
                        actual_outsourcing_workload: "",
                        actual_expenses_cost: "",
                        gross_profit: "",
                        customer_property_accept_result: "良好",
                        customer_property_accept_remarks: "",
                        customer_property_used_result: "良好",
                        customer_property_used_remarks: "",
                        purchasing_goods_accept_result: "良好",
                        purchasing_goods_accept_remarks: "",
                        outsourcing_evaluate1: "",
                        outsourcing_evaluate_remarks1: "",
                        outsourcing_evaluate2: "",
                        outsourcing_evaluate_remarks2: "",
                        communication_count: "",
                        meeting_count: "",
                        phone_count: "",
                        mail_count: "",
                        fax_count: "",
                        design_changes_count: "",
                        specification_change_count: "",
                        design_error_count: "",
                        others_count: "",
                        improvement_count: "",
                        corrective_action_count: "",
                        preventive_measures_count: "",
                        project_meeting_count: "",
                        statistical_consideration: "",
                        qualitygoals_evaluate: "",
                        total_report: ""},
                    phases: []
                    }
const initPrj = {status: "",
                approval: "",
                approval_date: "",
                pl_id: "",
                number: "",
                name: "",
                make_date: "",
                make_id: "",
                update_date: "",
                update_id: "",
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
                remarks: ""}

const RepEditPage = (props) => {
  const { prj_id } = props;
  const [data, setData] = useState(initData);
  const [prj, setPrj] = useState(initPrj); 
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();

  const isEmpty = (obj) => {
    return !Object.keys(obj).length;
  }

  useEffect(() => {
    handleGetRep(prj_id);
  },[prj_id]);

  const handleGetRep = async (id) => {
    try {
      const res = await getRep(Number(id));
      const tmpPhases = res.data.phases.map(phase => {
        const tmpPhase = {};
        tmpPhase.id = phase.id;
        tmpPhase.name = phase.name;
        tmpPhase.deliverables = phase.deliverables;
        tmpPhase.review_count = phase.review_count;
        tmpPhase.planned_cost = phase.planned_cost;
        tmpPhase.actual_cost = phase.actual_cost;
        tmpPhase.accept_comp_date = phase.accept_comp_date;
        tmpPhase.ship_number = phase.ship_number;
        return tmpPhase; 
      });
      if(res.data.rep===null || isEmpty(res.data.rep)) {
        setData({
          ...data,
          rep: {...data.rep,
            gross_profit: res.data.prj.order_amount
          },
          phases: tmpPhases,
        });
      } else {
        setData({
          ...data,
          rep: {id: res.data.rep.id,
                approval: res.data.rep.approval,
                approval_date: res.data.rep.approval_date,
                make_date: res.data.rep.make_date,
                make_id: res.data.rep.make_id,
                delivery_date: res.data.rep.delivery_date,
                actual_work_cost: res.data.rep.actual_work_cost,
                actual_workload: res.data.rep.actual_workload,
                actual_purchasing_cost: res.data.rep.actual_purchasing_cost,
                actual_outsourcing_cost: res.data.rep.actual_outsourcing_cost,
                actual_outsourcing_workload: res.data.rep.actual_outsourcing_workload,
                actual_expenses_cost: res.data.rep.actual_expenses_cost,
                gross_profit: res.data.rep.gross_profit,
                customer_property_accept_result: res.data.rep.customer_property_accept_result,
                customer_property_accept_remarks: res.data.rep.customer_property_accept_remarks,
                customer_property_used_result: res.data.rep.customer_property_used_result,
                customer_property_used_remarks: res.data.rep.customer_property_used_remarks,
                purchasing_goods_accept_result: res.data.rep.purchasing_goods_accept_result,
                purchasing_goods_accept_remarks: res.data.rep.purchasing_goods_accept_remarks,
                outsourcing_evaluate1: res.data.rep.outsourcing_evaluate1,
                outsourcing_evaluate_remarks1: res.data.rep.outsourcing_evaluate_remarks1,
                outsourcing_evaluate2: res.data.rep.outsourcing_evaluate2,
                outsourcing_evaluate_remarks2: res.data.rep.outsourcing_evaluate_remarks2,
                communication_count: res.data.rep.communication_count,
                meeting_count: res.data.rep.meeting_count,
                phone_count: res.data.rep.phone_count,
                mail_count: res.data.rep.mail_count,
                fax_count: res.data.rep.fax_count,
                design_changes_count: res.data.rep.design_changes_count,
                specification_change_count: res.data.rep.specification_change_count,
                design_error_count: res.data.rep.design_error_count,
                others_count: res.data.rep.others_count,
                improvement_count: res.data.rep.improvement_count,
                corrective_action_count: res.data.rep.corrective_action_count,
                preventive_measures_count: res.data.rep.preventive_measures_count,
                project_meeting_count: res.data.rep.project_meeting_count,
                statistical_consideration: res.data.rep.statistical_consideration,
                qualitygoals_evaluate: res.data.rep.qualitygoals_evaluate,
                total_report: res.data.rep.total_report},
            phases: tmpPhases,
        });
      }
      setPrj({
        ...prj,
        status: res.data.prj.status,
        approval: res.data.prj.approval,
        approval_date: res.data.prj.approval_date,
        pl_id: res.data.prj.pl_id,
        number: res.data.prj.number,
        name: res.data.prj.name,
        make_date: res.data.prj.make_date,
        make_id: res.data.prj.make_id,
        update_date: res.data.prj.update_date,
        update_id: res.data.prj.update_id,
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
      });
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (name, value) => {
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value
      }
    });
  }

  const handleChangeBudget = (name, value) => {
    var presum, sum;
    presum = Number(data.rep.gross_profit) + Number(data.rep[name]);
    sum = Number(presum) - Number(value);
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value,
        gross_profit: sum,
      }
    });
  }

  const handleChangePhase = (i, name, value) => {
    const tempPhases = [...data.phases];
    tempPhases[i][name] = value;
    setData({
      ...data,
      phases: tempPhases,
    });
  }

  const handleChangeComCnt = (name, value) => {
    var presum, sum;
    presum = Number(data.rep.meeting_count) + Number(data.rep.phone_count) + Number(data.rep.mail_count) + Number(data.rep.fax_count);
    sum = presum - Number(data.rep[name]) + Number(value);
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value,
        communication_count: sum,
      }
    });
  }

  const handleChangeDesignCnt = (name, value) => {
    var presum, sum;
    presum = Number(data.rep.specification_change_count) + Number(data.rep.design_error_count) + Number(data.rep.others_count);
    sum = presum - Number(data.rep[name]) + Number(value);
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value,
        design_changes_count: sum,
      }
    });
  }

  const handleChangeImpCnt = (name, value) => {
    var presum, sum;
    presum = Number(data.rep.corrective_action_count) + Number(data.rep.preventive_measures_count);
    sum = presum - Number(data.rep[name]) + Number(value);
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value,
        improvement_count: sum,
      }
    });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateRep(prj_id, data)
      if (res.data.status === 500) {
        setMessage("プロジェクト完了報告書更新エラー(500)");
        setMessageVar("error");
      } else {
        handleGetRep(prj_id);
      }
    } catch (e) {
      setMessage("プロジェクト完了報告書更新エラー");
      setMessageVar("error");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setData({
      ...data,
      prj: {...data.prj,
        status: "完了報告書監査中",
      }
    });
    setConfirm({
      ...confirm,
      msg: "この内容でプロジェクト完了報告書を提出します。よろしいですか？",
      tag: "",
    })
  }

  const handleSubmitOk = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateRep(prj_id, data)
      if (res.data.status === 500) {
        setMessage("プロジェクト完了報告書更新エラー(500)");
        setMessageVar("error");
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage("プロジェクト情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleSubmitCancel = () => {
    setData({
      ...data,
      prj: {...data.prj,
        status: "",
      }
    });
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  return (
    <div className="rep-edit-container">
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <div className="rep-entry-container">

        <div className="button-area">
          <Button size="small" variant="contained" endIcon={<SaveAltIcon />} onClick={(e) => handleUpdate(e)}>一時保存</Button>
          {"　"}
          <Button size="small" variant="contained" endIcon={<SendIcon />} onClick={(e) => handleSubmit(e)}>提出</Button>
        </div>

        <div className="rep-title-cell">プロジェクト完了報告書</div>

        <div className="scroll-frame">

          <div className="rep-entry-container1">
            {/* 1行目 */}
            <div className="title-cell cell1-1">プロジェクトNo.</div>
            <div className="data-cell cell1-2">{prj.number}</div>
            <div className="title-cell cell1-3">承認</div>
            <div className="data-cell cell1-4">{displayDate(data.rep.approval_date)}</div>
            {/* 2行目 */}
            <div className="title-cell cell2-1">プロジェクト名</div>
            <div className="data-cell cell2-2">{prj.name}</div>
            <div className="title-cell cell2-3">作　成</div>
            <div className="date-cell cell2-4">
              <CustomDatePicker 
                selected={data.rep.make_date || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="make_date"
              />
              <SelectEmployee
                name="make_id" 
                value={data.rep.make_id || ''} 
                setValue={handleChange}
                width={100}
                height={19}
                border="0.5px solid #aaa"
              />
            </div>
            {/* 3行目 */}
            <div className="title-cell cell3-1">開発期間</div>
            <div className="data-cell cell3-2">
              {displayDate(prj.development_period_fr || '')}
              <label className="inner-caption">{"　〜　"}</label>
              {displayDate(prj.development_period_to || '')}
            </div>
            <div className="title-cell cell3-3">納期</div>
            <div className="date-cell cell3-4">
              <CustomDatePicker 
                selected={data.rep.delivery_date || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="delivery_date"
              />
            </div>
          </div>

          <div className="rep-entry-container2">
            {/* 4行目 */}
            <div className="title-cell cell4-1">受注金額</div>
            <div className="data-cell cell4-2">
              {prj.order_amount}
              <label className="inner-caption">{"円"}</label>
            </div>
            <div className="title-cell cell4-3">実績値</div>
            <div className="title-cell cell4-4">作業費</div>
            <div className="data-cell cell4-5">
              <InputNumber 
                name="actual_work_cost" 
                id="actual_work_cost" 
                maxLength="10"
                className="actual_work_cost text-base"
                toValue={data.rep.actual_work_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            <div className="title-cell cell4-6">仕入費</div>
            <div className="data-cell cell4-7">
              <InputNumber 
                name="actual_purchasing_cost" 
                id="actual_purchasing_cost" 
                maxLength="10"
                className="actual_purchasing_cost text-base"
                toValue={data.rep.actual_purchasing_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* 5行目 */}
            <div className="title-cell cell5-1">粗利</div>
            <div className="data-cell cell5-2">
              <input 
                type="text" 
                name="gross_profit" 
                id="gross_profit" 
                className="gross_profit text-base" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={Number(data.rep.gross_profit || '').toLocaleString()}
                readOnly
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* <div className="title-cell cell5-3"></div> */}
            <div className="title-cell cell5-4">外注費</div>
            <div className="data-cell cell5-5">
              <InputNumber 
                name="actual_outsourcing_cost" 
                id="actual_outsourcing_cost" 
                maxLength="10"
                className="actual_outsourcing_cost text-base"
                toValue={data.rep.actual_outsourcing_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            <div className="title-cell cell5-6">経費</div>
            <div className="data-cell cell5-7">
              <InputNumber 
                name="actual_expenses_cost" 
                id="actual_expenses_cost" 
                maxLength="10"
                className="actual_expenses_cost text-base"
                toValue={data.rep.actual_expenses_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
          </div>

          <div className="rep-entry-container3">
            {/* 6行目 */}
            <div className="title-cell cell6-1">顧客所有物</div>
            <div className="title-cell cell6-2">受入結果</div>
            <div className="data-cell cell6-3">
              <select 
                name="customer_property_accept_result"
                id="customer_property_accept_result"
                className="customer_property_accept_result"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.customer_property_accept_result}
              >
                <option key="cpar-1" value="良好">良好</option>
                <option key="cpar-2" value="不良">不良</option>
              </select>
            </div>
            <div className="data-cell cell6-4">
              <input 
                type="text" 
                name="customer_property_accept_remarks"
                id="customer_property_accept_remarks"
                maxLength="30"
                className="text-base customer_property_accept_remarks" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.customer_property_accept_remarks || ''} 
              />
            </div>
            {/* 7行目 */}
            {/* <div className="title-cell cell7-1"></div> */}
            <div className="title-cell cell7-2">使用結果</div>
            <div className="data-cell cell7-3">
              <select 
                name="customer_property_used_result"
                id="customer_property_used_result"
                className="customer_property_used_result"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.customer_property_used_result}
              >
                <option key="cpar-1" value="良好">良好</option>
                <option key="cpar-2" value="不良">不良</option>
              </select>
            </div>
            <div className="data-cell cell7-4">
              <input
                type="text" 
                name="customer_property_used_remarks"
                id="customer_property_used_remarks"
                maxLength="30"
                className="text-base customer_property_used_remarks" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.customer_property_used_remarks || ''} 
              />
            </div>
            {/* 8行目 */}
            <div className="title-cell cell8-1">仕入品</div>
            <div className="title-cell cell8-2">受入結果</div>
            <div className="data-cell cell8-3">
              <select 
                name="purchasing_goods_accept_result"
                id="purchasing_goods_accept_result"
                className="purchasing_goods_accept_result"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.purchasing_goods_accept_result}
              >
                <option key="cpar-1" value="良好">良好</option>
                <option key="cpar-2" value="不良">不良</option>
              </select>
            </div>
            <div className="data-cell cell8-4">
              <input
                type="text" 
                name="purchasing_goods_accept_remarks"
                id="purchasing_goods_accept_remarks"
                maxLength="30"
                className="text-base purchasing_goods_accept_remarks" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.purchasing_goods_accept_remarks || ''} 
              />
            </div>
            {/* 9行目 */}
            <div className="title-cell cell9-1">外注評価</div>
            <div className="data-cell cell9-2">
              <input
                type="text" 
                name="outsourcing_evaluate1"
                id="outsourcing_evaluate1"
                maxLength="10"
                className="text-base outsourcing_evaluate1" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.outsourcing_evaluate1 || ''} 
              />          
            </div>
            {/* <div className="data-cell cell9-3"></div> */}
            <div className="data-cell cell9-4">
              <input
                type="text" 
                name="outsourcing_evaluate_remarks1"
                id="outsourcing_evaluate_remarks1"
                maxLength="30"
                className="text-base outsourcing_evaluate_remarks1" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.outsourcing_evaluate_remarks1 || ''} 
              />          
            </div>
            {/* 10行目 */}
            {/* <div className="title-cell cell10-1"></div> */}
            <div className="data-cell cell10-2">
              <input
                type="text" 
                name="outsourcing_evaluate2"
                id="outsourcing_evaluate2"
                maxLength="10"
                className="text-base outsourcing_evaluate2" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.outsourcing_evaluate2 || ''} 
              />          
            </div>
            {/* <div className="data-cell cell10-3"></div> */}
            <div className="data-cell cell10-4">
              <input
                type="text" 
                name="outsourcing_evaluate_remarks2"
                id="outsourcing_evaluate_remarks2"
                maxLength="30"
                className="text-base outsourcing_evaluate_remarks2" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.rep.outsourcing_evaluate_remarks2 || ''} 
              />          
            </div>
          </div>

          <div className="rep-entry-container4">
            <div className="title-cell">
              <div className="title">受注範囲</div>
            </div>
            <div className="data-cell">
              <table className="phase-hd">
                <thead>
                  <tr className="header-tr">
                    <td className="header-td review-td">レビュー実施結果</td>
                    <td className="header-td amount-td">金額</td>
                    <td className="header-td shipping-td">出荷</td>
                  </tr>
                </thead>
              </table>
              <table className="phase-tbl">
                <thead>
                  <tr className="header-tr">
                    <td className="header-td name-td">工程</td>
                    <td className="header-td deliverables-td">成果物</td>
                    <td className="header-td review-count-td">実施回数</td>
                    <td className="header-td planed-cost-td">予定</td>
                    <td className="header-td actual-cost-td">実績</td>
                    <td className="header-td accept-comp-date-td">検収日</td>
                    <td className="header-td ship-number-td">出荷No.</td>                  
                  </tr>
                </thead>
                <tbody>
                  {data.phases ? (
                    data.phases.map((phase, i) => 
                      <tr key={"phase-" + i} className="body-tr">
                        <td className="name-td">{phase.name}</td>
                        <td className="deliverables-td">{phase.deliverables}</td>
                        <td className="review-count-td">
                          <input 
                            type="text" 
                            name="review_count" 
                            id="review-count"
                            maxLength="3"
                            className="text-base review-count"
                            onChange={(e) => handleChangePhase(i, e.target.name, integerValidator(e))} 
                            value={phase.review_count || ''} 
                          />
                          {"回"}
                        </td>
                        <td className="planed-cost-td">
                          <InputNumber 
                            name="planned_cost" 
                            id="planned_cost" 
                            maxLength="10"
                            className="planned_cost text-base"
                            toValue={phase.planned_cost || ''}
                            procChange={handleChangePhase}
                            index={i}
                          />
                          {"円"}
                        </td>
                        <td className="actual-cost-td">
                          <InputNumber 
                            name="actual_cost" 
                            id="actual_cost" 
                            maxLength="10"
                            className="actual_cost text-base"
                            toValue={phase.actual_cost || ''}
                            procChange={handleChangePhase}
                            index={i}
                          />
                          {"円"}
                        </td>
                        <td className="accept-comp-date-td">
                          <CustomDatePicker 
                            selected={phase.accept_comp_date || ''} 
                            dateFormat="yyyy年MM月dd日" 
                            className="date-field"
                            onChange={handleChangePhase}
                            name="accept_comp_date"
                            index={i}
                          />
                        </td>
                        <td className="ship-number-td">
                          <input 
                            type="text" 
                            name="ship_number" 
                            id="ship-number"
                            maxLength="3"
                            className="text-base ship-number"
                            onChange={(e) => handleChangePhase(i, e.target.name, integerValidator(e))} 
                            value={phase.ship_number || ''} 
                          />
                        </td>                  
                      </tr>
                    )
                  ) : (
                    <></>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rep-entry-container5">
            {/* 11行目 */}
            <div className="title-cell cell11-1">統計数値</div>
            <div className="subtitle-cell cell11-2">コミュニケーション記録</div>
            <div className="data-cell cell11-3">
              <input 
                type="text" 
                name="communication_count" 
                id="communication_count" 
                className="communication_count text-base" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={Number(data.rep.communication_count || '').toLocaleString()}
                readOnly
              />
              {"件"}
            </div>
            <div className="data-cell cell11-4">
              <label className="inner-caption">{"会議等　:"}</label>
              <input 
                type="text" 
                name="meeting_count" 
                id="meeting_count"
                maxLength="3"
                className="text-base meeting_count"
                onChange={(e) => handleChangeComCnt(e.target.name, integerValidator(e))} 
                value={data.rep.meeting_count || ''} 
              />
            </div>
            <div className="data-cell cell11-5">
              <label className="inner-caption">{"電話　　:"}</label>
              <input 
                type="text" 
                name="phone_count" 
                id="phone_count"
                maxLength="3"
                className="text-base phone_count"
                onChange={(e) => handleChangeComCnt(e.target.name, integerValidator(e))} 
                value={data.rep.phone_count || ''} 
              />
            </div>
            <div className="data-cell cell11-6">
              <label className="inner-caption">{"メール:"}</label>
              <input 
                type="text" 
                name="mail_count" 
                id="mail_count"
                maxLength="3"
                className="text-base mail_count"
                onChange={(e) => handleChangeComCnt(e.target.name, integerValidator(e))} 
                value={data.rep.mail_count || ''} 
              />
            </div>
            <div className="data-cell cell11-7">
              <label className="inner-caption">{"FAX:"}</label>
              <input 
                type="text" 
                name="fax_count" 
                id="fax_count"
                maxLength="3"
                className="text-base fax_count"
                onChange={(e) => handleChangeComCnt(e.target.name, integerValidator(e))} 
                value={data.rep.fax_count || ''} 
              />
            </div>
            {/* 12行目 */}
            {/* <div className="title-cell cell12-1"></div> */}
            <div className="subtitle-cell cell12-2">設計変更票</div>
            <div className="data-cell cell12-3">
              <input 
                type="text" 
                name="design_changes_count" 
                id="design_changes_count" 
                className="design_changes_count text-base" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={Number(data.rep.design_changes_count || '').toLocaleString()}
                readOnly
              />
              {"件"}
            </div>
            <div className="data-cell cell12-4">
              <label className="inner-caption">{"仕変　　:"}</label>
              <input 
                type="text" 
                name="specification_change_count" 
                id="specification_change_count"
                maxLength="3"
                className="text-base specification_change_count"
                onChange={(e) => handleChangeDesignCnt(e.target.name, integerValidator(e))} 
                value={data.rep.specification_change_count || ''} 
              />
            </div>
            <div className="data-cell cell12-5">
              <label className="inner-caption">{"設計ミス:"}</label>
              <input 
                type="text" 
                name="design_error_count" 
                id="design_error_count"
                maxLength="3"
                className="text-base design_error_count"
                onChange={(e) => handleChangeDesignCnt(e.target.name, integerValidator(e))} 
                value={data.rep.design_error_count || ''} 
              />
            </div>
            <div className="data-cell cell12-6">
              <label className="inner-caption">{"その他:"}</label>
              <input 
                type="text" 
                name="others_count" 
                id="others_count"
                maxLength="3"
                className="text-base others_count"
                onChange={(e) => handleChangeDesignCnt(e.target.name, integerValidator(e))} 
                value={data.rep.others_count || ''} 
              />
            </div>
            {/* <div className="data-cell cell12-7"></div> */}
            {/* 13行目 */}
            {/* <div className="title-cell cell13-1"></div> */}
            <div className="subtitle-cell cell13-2">改善一覧</div>
            <div className="data-cell cell13-3">
              <input 
                type="text" 
                name="improvement_count" 
                id="improvement_count" 
                className="improvement_count text-base" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={Number(data.rep.improvement_count || '').toLocaleString()}
                readOnly
              />
              <label className="inner-caption">{"件"}</label>
            </div>
            <div className="data-cell cell13-4">
              <label className="inner-caption">{"是正処置:"}</label>
              <input 
                type="text" 
                name="corrective_action_count" 
                id="corrective_action_count"
                maxLength="3"
                className="text-base corrective_action_count"
                onChange={(e) => handleChangeImpCnt(e.target.name, integerValidator(e))} 
                value={data.rep.corrective_action_count || ''} 
              />
            </div>
            <div className="data-cell cell13-5">
              <label className="inner-caption">{"予防処置:"}</label>
              <input 
                type="text" 
                name="preventive_measures_count" 
                id="preventive_measures_count"
                maxLength="3"
                className="text-base preventive_measures_count"
                onChange={(e) => handleChangeImpCnt(e.target.name, integerValidator(e))} 
                value={data.rep.preventive_measures_count || ''} 
              />
            </div>
            {/* <div className="data-cell cell13-6"></div> */}
            {/* <div className="data-cell cell13-7"></div> */}
            {/* 14行目 */}
            {/* <div className="title-cell cell14-1"></div> */}
            <div className="subtitle-cell cell14-2">プロジェクトミーティング</div>
            <div className="data-cell cell14-3">
              <InputNumber 
                name="project_meeting_count" 
                id="project_meeting_count" 
                maxLength="5"
                className="project_meeting_count text-base"
                toValue={data.rep.project_meeting_count || ''}
                procChange={handleChange}
              />
              <label className="inner-caption">{"件"}</label>
            </div>
            <div className="data-cell cell14-4"></div>
            {/* <div className="data-cell cell14-5"></div> */}
            {/* <div className="data-cell cell14-6"></div> */}
            {/* <div className="data-cell cell14-7"></div> */}
          </div>

          <div className="rep-entry-container6">
            {/* 15行目 */}
            <div className="title-cell cell15-1">統計的考察</div>
            <div className="data-cell cell15-2">
              <textarea 
                name="statistical_consideration" 
                id="statistical_consideration" 
                className="statistical_consideration"
                maxLength="300"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.statistical_consideration || ''}
              />
            </div>
          </div>

          <div className="rep-entry-container7">
            {/* 16行目 */}
            <div className="title-cell cell16-1">品質目標達成度</div>
            <div className="data-cell cell16-2">
              <textarea 
                name="qualitygoals_evaluate" 
                id="qualitygoals_evaluate" 
                className="qualitygoals_evaluate"
                maxLength="300"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.qualitygoals_evaluate || ''}
              />
            </div>
          </div>

          <div className="rep-entry-container8">
            {/* 17行目 */}
            <div className="title-cell cell17-1">完了報告</div>
            <div className="data-cell cell17-2">
              <textarea 
                name="total_report" 
                id="total_report" 
                className="total_report"
                maxLength="300"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.rep.total_report || ''}
              />
            </div>
          </div>

        </div>

      </div>
      <ModalConfirm confirm={confirm} handleOk={handleSubmitOk} handleCancel={handleSubmitCancel} />
    </div>
  );
}

export default RepEditPage;