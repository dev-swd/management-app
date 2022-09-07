// m2h
import "./RepEditPage.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRep, updateRep } from '../../../lib/api/report';
import { formatDateZero } from '../../../lib/common/dateCom';
import SelectEmployee from "../../common/SelectEmployee";
import CustomDatePicker from "../../common/customDatePicker";
import InputNumber from '../../common/InputNumber';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import ModalConfirm from '../../common/ModalConfirm';
import { isEmpty } from '../../../lib/common/isEmpty';
import { integerOnly } from '../../../lib/common/InputRegulation';

const initDate = new Date();
const initDatestr = formatDateZero(initDate, "YYYY-MM-DD 00:00:00");
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
  const { prjId } = props;
  const [data, setData] = useState(initData);
  const [prj, setPrj] = useState(initPrj); 
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [updateConfirm, setUpdateConfirm] = useState({msg: "", tag: ""});
  const [submitConfirm, setSubmitConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();

  // 空オブジェクト判定
  const isNothing = (obj) => {
    return !Object.keys(obj).length;
  }

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)){
      handleGetRep();
    }
  },[prjId]);

  // プロジェクト情報取得
  const handleGetRep = async () => {
    try {
      const res = await getRep(Number(prjId));
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
      if(res.data.rep===null || isNothing(res.data.rep)) {
        // 完了報告書がまだない場合
        setData({
          ...data,
          rep: {...data.rep,
            gross_profit: res.data.prj.order_amount
          },
          phases: tmpPhases,
        });
      } else {
        // 完了報告書が既にある場合
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
      // 現在の状態を退避
      setStatus(res.data.prj.status);
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    }
  }

  // プロジェクト項目入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      rep: {...data.rep,
        [name]: value
      }
    });
  }

  // 金額項目入力時の処理（再集計）
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

  // 工程項目入力時の処理
  const handleChangePhase = (i, name, value) => {
    const tempPhases = [...data.phases];
    tempPhases[i][name] = value;
    setData({
      ...data,
      phases: tempPhases,
    });
  }

  // コミュニケーション記録件数集計
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

  // 設計変更票件数集計
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

  // 改善一覧件数集計
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

  // 一時保存ボタン押下時の処理
  const handleUpdate = () => {
    setUpdateConfirm({
      ...updateConfirm,
      msg: "この内容で一時保存します。よろしいですか？",
      tag: "",
    });
  }

  // 一時保存確認OKボタン押下時の処理
  const handleUpdateOK = async (dummy) => {
    setUpdateConfirm({
      ...updateConfirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await updateRep(prjId, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト完了報告書更新エラー(500)"});
      } else {
        handleGetRep();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト完了報告書更新エラー"});
    }
  }

  // 一時保存確認Cancelボタン押下時の処理
  const handleUpdateCancel = () => {
    setUpdateConfirm({
      ...updateConfirm,
      msg: "",
      tag: "",
    });
  }

  // 提出ボタン押下時の処理
  const handleSubmit = () => {
    setData({
      ...data,
      prj: {...data.prj,
        status: "完了報告書監査中",
      }
    });
    setSubmitConfirm({
      ...submitConfirm,
      msg: "この内容でプロジェクト完了報告書を提出します。よろしいですか？",
      tag: "",
    })
  }

  // 提出確認OKボタン押下時の処理
  const handleSubmitOk = async (dummy) => {
    try {
      setSubmitConfirm({
        ...submitConfirm,
        msg: "",
        tag: "",
      });
      const res = await updateRep(prjId, data);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト完了報告書更新エラー(500)"});
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト完了報告書更新エラー"});
    }
  }

  // 提出確認Cancelボタン押下時の処理
  const handleSubmitCancel = () => {
    setData({
      ...data,
      prj: {...data.prj,
        status: status,
      }
    });
    setSubmitConfirm({
      ...submitConfirm,
      msg: "",
      tag: "",
    });
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // 画面編集
  return (
    <div className="m2h-container">
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      {/* ボタン */}
      <div className="m2h-button-area">
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<SaveAltIcon />} 
          onClick={(e) => handleUpdate()}
          style={{marginRight:10}}
        >
          一時保存
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<SendIcon />} 
          onClick={(e) => handleSubmit(e)}
        >
          提出
        </Button>
      </div>

      {/* セクション１ */}
      <div className="m2h-sec01">プロジェクト完了報告書</div>

      <div className="m2h-frame">

        {/* セクション２ */}
        <table className="m2h-sec02">
          <tbody>
            <tr>
              <td className="m2h-sec02-ttl1">プロジェクトNo.</td>
              <td className="m2h-sec02-val1">{toStr(prj.number)}</td>
              <td className="m2h-sec02-ttl2">承認</td>
              <td className="m2h-sec02-val2">
                {formatDateZero(data.rep.approval_date, "YYYY年MM月DD日")}
              </td>
            </tr>
            <tr>
              <td className="m2h-sec02-ttl1">プロジェクト名</td>
              <td className="m2h-sec02-val1">{toStr(prj.name)}</td>
              <td className="m2h-sec02-ttl2">作 成</td>
              <td className="m2h-sec02-val2">
                <div className="m2h-sec02-val2-frame">
                  <CustomDatePicker 
                    selected={toStr(data.rep.make_date)} 
                    dateFormat="yyyy年MM月dd日" 
                    className="m2h-date"
                    onChange={handleChange}
                    name="make_date"
                  />
                  <SelectEmployee
                    name="make_id" 
                    value={toStr(data.rep.make_id)} 
                    setValue={handleChange}
                    width={100}
                    height={20}
                    border="0.5px solid #aaa"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="m2h-sec02-ttl1">開発期間</td>
              <td className="m2h-sec02-val1">{formatDateZero(prj.development_period_fr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(prj.development_period_to, "YYYY年MM月DD日")}</td>
              <td className="m2h-sec02-ttl2">納期</td>
              <td className="m2h-sec02-val2">
                <div className="m2h-sec02-val2-frame">
                  <CustomDatePicker 
                    selected={toStr(data.rep.delivery_date)} 
                    dateFormat="yyyy年MM月dd日" 
                    className="m2h-date"
                    onChange={handleChange}
                    name="delivery_date"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション３ */}
        <table className="m2h-sec03">
          <tbody>
            <tr>
              <td className="m2h-sec03-ttl1">受注金額</td>
              <td className="m2h-sec03-val1">{Number(toStr(prj.order_amount)).toLocaleString() + " 円"}</td>
              <td className="m2h-sec03-ttl2" rowSpan="2">実績値</td>
              <td className="m2h-sec03-ttl2">作業費</td>
              <td className="m2h-sec03-val2">
                <div className="m2h-sec03-val2-frame">
                  <InputNumber 
                    name="actual_work_cost" 
                    id="actual_work_cost" 
                    maxLength="10"
                    className="m2h-actual_work_cost"
                    toValue={toStr(data.rep.actual_work_cost)}
                    procChange={handleChangeBudget}
                  />
                  <div className="m2h-sec03-innerlbl">円</div>
                </div>
              </td>
              <td className="m2h-sec03-ttl3">仕入費</td>
              <td className="m2h-sec03-val3">
                <div className="m2h-sec03-val3-frame">
                  <InputNumber 
                    name="actual_purchasing_cost" 
                    id="actual_purchasing_cost" 
                    maxLength="10"
                    className="m2h-actual_purchasing_cost"
                    toValue={toStr(data.rep.actual_purchasing_cost)}
                    procChange={handleChangeBudget}
                  />
                  <div className="m2h-sec03-innerlbl">円</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="m2h-sec03-ttl1">粗利</td>
              <td className="m2h-sec03-val1">
                <div className="m2h-sec03-val1-frame">
                  <input 
                    type="text" 
                    name="gross_profit" 
                    id="gross_profit" 
                    className="m2h-gross_profit" 
                    value={Number(toStr(data.rep.gross_profit)).toLocaleString()}
                    readOnly
                  />
                  <div className="m2h-sec03-innerlbl">円</div>
                </div>
              </td>
              <td className="m2h-sec03-ttl2">外注費</td>
              <td className="m2h-sec03-val2">
                <div className="m2h-sec03-val2-frame">
                  <InputNumber 
                    name="actual_outsourcing_cost" 
                    id="actual_outsourcing_cost" 
                    maxLength="10"
                    className="m2h-actual_outsourcing_cost"
                    toValue={toStr(data.rep.actual_outsourcing_cost)}
                    procChange={handleChangeBudget}
                  />
                  <div className="m2h-sec03-innerlbl">円</div>
                </div>
              </td>
              <td className="m2h-sec03-ttl3">経費</td>
              <td className="m2h-sec03-val3">
                <div className="m2h-sec03-val3-frame">
                  <InputNumber 
                    name="actual_expenses_cost" 
                    id="actual_expenses_cost" 
                    maxLength="10"
                    className="m2h-actual_expenses_cost"
                    toValue={toStr(data.rep.actual_expenses_cost)}
                    procChange={handleChangeBudget}
                  />
                  <div className="m2h-sec03-innerlbl">円</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション４ */}
        <table className="m2h-sec04">
          <tbody>
            <tr>
              <td rowSpan="2" className="m2h-sec04-ttl1">顧客所有物</td>
              <td className="m2h-sec04-ttl2">受入結果</td>
              <td className="m2h-sec04-val2">
                <select 
                  name="customer_property_accept_result"
                  id="customer_property_accept_result"
                  className="m2h-customer_property_accept_result"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.customer_property_accept_result)}
                >
                  <option key="cpar-1" value="良好">良好</option>
                  <option key="cpar-2" value="不良">不良</option>
                </select>
              </td>
              <td className="m2h-sec04-val3">
                <input 
                  type="text" 
                  name="customer_property_accept_remarks"
                  id="customer_property_accept_remarks"
                  maxLength="30"
                  className="m2h-customer_property_accept_remarks" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.customer_property_accept_remarks)} 
                />
              </td>
            </tr>
            <tr>
              <td className="m2h-sec04-ttl2">使用結果</td>
              <td className="m2h-sec04-val2">
                <select 
                  name="customer_property_used_result"
                  id="customer_property_used_result"
                  className="m2h-customer_property_used_result"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.customer_property_used_result)}
                >
                  <option key="cpar-1" value="良好">良好</option>
                  <option key="cpar-2" value="不良">不良</option>
                </select>
              </td>
              <td className="m2h-sec04-val3">
                <input
                  type="text" 
                  name="customer_property_used_remarks"
                  id="customer_property_used_remarks"
                  maxLength="30"
                  className="m2h-customer_property_used_remarks" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.customer_property_used_remarks)} 
                />
              </td>
            </tr>
            <tr>
              <td className="m2h-sec04-ttl1">仕入品</td>
              <td className="m2h-sec04-ttl2">受入結果</td>
              <td className="m2h-sec04-val2">
                <select 
                  name="purchasing_goods_accept_result"
                  id="purchasing_goods_accept_result"
                  className="m2h-purchasing_goods_accept_result"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.purchasing_goods_accept_result)}
                >
                  <option key="cpar-1" value="良好">良好</option>
                  <option key="cpar-2" value="不良">不良</option>
                </select>
              </td>
              <td className="m2h-sec04-val3">
                <input
                  type="text" 
                  name="purchasing_goods_accept_remarks"
                  id="purchasing_goods_accept_remarks"
                  maxLength="30"
                  className="m2h-purchasing_goods_accept_remarks" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.purchasing_goods_accept_remarks)} 
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション５ */}
        <table className="m2h-sec05">
          <tbody>
            <tr>
              <td rowSpan="2" className="m2h-sec05-ttl">外注評価</td>
              <td className="m2h-sec05-val1">
                <input
                  type="text" 
                  name="outsourcing_evaluate1"
                  id="outsourcing_evaluate1"
                  maxLength="10"
                  className="m2h-outsourcing_evaluate1" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.outsourcing_evaluate1)} 
                />          
              </td>
              <td className="m2h-sec05-val2">
                <input
                  type="text" 
                  name="outsourcing_evaluate_remarks1"
                  id="outsourcing_evaluate_remarks1"
                  maxLength="30"
                  className="m2h-outsourcing_evaluate_remarks1" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.outsourcing_evaluate_remarks1)} 
                />          
              </td>
            </tr>
            <tr>
              <td className="m2h-sec05-val1">
                <input
                  type="text" 
                  name="outsourcing_evaluate2"
                  id="outsourcing_evaluate2"
                  maxLength="10"
                  className="m2h-outsourcing_evaluate2" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.outsourcing_evaluate2)} 
                />          
              </td>
              <td className="m2h-sec05-val2">
                <input
                  type="text" 
                  name="outsourcing_evaluate_remarks2"
                  id="outsourcing_evaluate_remarks2"
                  maxLength="30"
                  className="m2h-outsourcing_evaluate_remarks2" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.rep.outsourcing_evaluate_remarks2)} 
                />          
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション６ */}
        <table className="m2h-sec06">
          <tbody>
            <tr>
              <td className="m2h-sec06-ttl">受注範囲</td>
              <td className="m2h-sec06-val">
                <table className="m2h-phasetbl">
                  <thead>
                    <tr className="m2h-phase-hdtr">
                      <td colSpan="3" className="m2h-phase-th">レビュー実施結果</td>
                      <td colSpan="2" className="m2h-phase-th">金額</td>
                      <td colSpan="2" className="m2h-phase-th">出荷</td>
                    </tr>
                    <tr className="m2h-phase-hdtr">
                      <td className="m2h-phase-name-td m2h-phase-th">工程</td>
                      <td className="m2h-phase-deliverables-td m2h-phase-th">成果物</td>
                      <td className="m2h-phase-reviewcount-td m2h-phase-th">実施回数</td>
                      <td className="m2h-phase-planedcost-td m2h-phase-th">予定</td>
                      <td className="m2h-phase-planedcost-td m2h-phase-th">実績</td>
                      <td className="m2h-phase-acceptcompdate-td m2h-phase-th">検収日</td>
                      <td className="m2h-phase-shipnumber-td m2h-phase-th">No.</td>                  
                    </tr>
                  </thead>
                  <tbody>
                    {data.phases ? (
                      data.phases.map((p, i) => 
                        <tr key={"phase-" + i} className="m2h-phase-bdtr">
                          <td className="m2h-phase-name-td">{toStr(p.name)}</td>
                          <td className="m2h-phase-deliverables-td">{toStr(p.deliverables)}</td>
                          <td className="m2h-phase-reviewcount-td">
                            <input 
                              type="text" 
                              name="review_count" 
                              id="review-count"
                              maxLength="3"
                              className="m2h-phase-reviewcount"
                              onChange={(e) => handleChangePhase(i, e.target.name, integerOnly(e.target.value))} 
                              value={toStr(p.review_count)} 
                            />
                            {"回"}
                          </td>
                          <td className="m2h-phase-planedcost-td">
                            <InputNumber 
                              name="planned_cost" 
                              id="planned_cost" 
                              maxLength="10"
                              className="m2h-phase-plannedcost"
                              toValue={toStr(p.planned_cost)}
                              procChange={handleChangePhase}
                              index={i}
                            />
                            {"円"}
                          </td>
                          <td className="m2h-phase-actualcost-td">
                            <InputNumber 
                              name="actual_cost" 
                              id="actual_cost" 
                              maxLength="10"
                              className="m2h-phase-actualcost"
                              toValue={toStr(p.actual_cost)}
                              procChange={handleChangePhase}
                              index={i}
                            />
                            {"円"}
                          </td>
                          <td className="m2h-phase-acceptcompdate-td">
                            <CustomDatePicker 
                              selected={toStr(p.accept_comp_date)} 
                              dateFormat="yyyy年MM月dd日" 
                              className="m2h-date"
                              onChange={handleChangePhase}
                              name="accept_comp_date"
                              index={i}
                            />
                          </td>
                          <td className="m2h-phase-shipnumber-td">
                            <input 
                              type="text" 
                              name="ship_number" 
                              id="ship-number"
                              maxLength="3"
                              className="m2h-phase-shipnumber"
                              onChange={(e) => handleChangePhase(i, e.target.name, integerOnly(e.target.value))} 
                              value={toStr(p.ship_number)} 
                            />
                          </td>                  
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

        {/* セクション７ */}
        <table className="m2h-sec07">
          <tbody>
            <tr>
              <td rowSpan="4" className="m2h-sec07-ttl1">統計数値</td>
              <td className="m2h-sec07-ttl2">コミュニケーション記録</td>
              <td className="m2h-sec07-val1">
                <input 
                  type="text" 
                  name="communication_count" 
                  id="communication_count" 
                  className="m2h-communication_count" 
                  value={Number(toStr(data.rep.communication_count)).toLocaleString()}
                  readOnly
                />
                {"件"}
              </td>
              <td className="m2h-sec07-val2">
                <div className="m2h-sec07-val2-frame">
                  <div className="m2h-sec07-val2-inner">会議等</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="meeting_count" 
                    id="meeting_count"
                    maxLength="3"
                    className="m2h-meeting_count"
                    onChange={(e) => handleChangeComCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.meeting_count)} 
                  />
                </div>
              </td>
              <td className="m2h-sec07-val3">
                <div className="m2h-sec07-val3-frame">
                  <div className="m2h-sec07-val3-inner">電話</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="phone_count" 
                    id="phone_count"
                    maxLength="3"
                    className="m2h-phone_count"
                    onChange={(e) => handleChangeComCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.phone_count)} 
                  />
                </div>
              </td>
              <td className="m2h-sec07-val4">
                <div className="m2h-sec07-val4-frame">
                  <div className="m2h-sec07-val4-inner">メール</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="mail_count" 
                    id="mail_count"
                    maxLength="3"
                    className="m2h-mail_count"
                    onChange={(e) => handleChangeComCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.mail_count)} 
                  />
                </div>
              </td>
              <td className="m2h-sec07-val5">
                <div className="m2h-sec07-val5-frame">
                  <div className="m2h-sec07-val5-inner">FAX</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="fax_count" 
                    id="fax_count"
                    maxLength="3"
                    className="m2h-fax_count"
                    onChange={(e) => handleChangeComCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.fax_count)} 
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="m2h-sec07-ttl2">設計変更票</td>
              <td className="m2h-sec07-val1">
                <input 
                  type="text" 
                  name="design_changes_count" 
                  id="design_changes_count" 
                  className="m2h-design_changes_count" 
                  value={Number(toStr(data.rep.design_changes_count)).toLocaleString()}
                  readOnly
                />
                {"件"}
              </td>
              <td className="m2h-sec07-val2">
                <div className="m2h-sec07-val2-frame">
                  <div className="m2h-sec07-val2-inner">仕変</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="specification_change_count" 
                    id="specification_change_count"
                    maxLength="3"
                    className="m2h-specification_change_count"
                    onChange={(e) => handleChangeDesignCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.specification_change_count)} 
                  />
                </div>
              </td>
              <td className="m2h-sec07-val3">
                <div className="m2h-sec07-val3-frame">
                  <div className="m2h-sec07-val3-inner">設計ミス</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="design_error_count" 
                    id="design_error_count"
                    maxLength="3"
                    className="m2h-design_error_count"
                    onChange={(e) => handleChangeDesignCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.design_error_count)} 
                  />
                </div>
              </td>
              <td colSpan="2" className="m2h-sec07-val4">
                <div className="m2h-sec07-val4-frame">
                  <div className="m2h-sec07-val4-inner">その他</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="others_count" 
                    id="others_count"
                    maxLength="3"
                    className="m2h-others_count"
                    onChange={(e) => handleChangeDesignCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.others_count)} 
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="m2h-sec07-ttl2">改善一覧</td>
              <td className="m2h-sec07-val1">
                <input 
                  type="text" 
                  name="improvement_count" 
                  id="improvement_count" 
                  className="m2h-improvement_count" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={Number(toStr(data.rep.improvement_count)).toLocaleString()}
                  readOnly
                />
                {"件"}
              </td>
              <td className="m2h-sec07-val2">
                <div className="m2h-sec07-val2-frame">
                  <div className="m2h-sec07-val2-inner">是正処置</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="corrective_action_count" 
                    id="corrective_action_count"
                    maxLength="3"
                    className="m2h-corrective_action_count"
                    onChange={(e) => handleChangeImpCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.corrective_action_count)} 
                  />
                </div>
              </td>
              <td colSpan="3" className="m2h-sec07-val3">
                <div className="m2h-sec07-val3-frame">
                  <div className="m2h-sec07-val3-inner">予防処置</div>
                  <div className="m2h-sec07-inner">:</div>
                  <input 
                    type="text" 
                    name="preventive_measures_count" 
                    id="preventive_measures_count"
                    maxLength="3"
                    className="m2h-preventive_measures_count"
                    onChange={(e) => handleChangeImpCnt(e.target.name, integerOnly(e.target.value))} 
                    value={toStr(data.rep.preventive_measures_count)} 
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="m2h-sec07-ttl2">プロジェクトミーティング</td>
              <td className="m2h-sec07-val1">
                <InputNumber 
                  name="project_meeting_count" 
                  id="project_meeting_count" 
                  maxLength="4"
                  className="m2h-project_meeting_count"
                  toValue={toStr(data.rep.project_meeting_count)}
                  procChange={handleChange}
                />
                {"件"}
              </td>
              <td colSpan="4" className="m2h-sec07-val2">
              </td>
            </tr>
          </tbody>
        </table>

        {/* セクション８ */}
        <table className="m2h-sec08">
          <tbody>
            <tr className="m2h-sec08-r1">
              <td className="m2h-sec08-ttl">統計的考察</td>
              <td className="m2h-sec08-val">
                <textarea 
                  name="statistical_consideration" 
                  id="statistical_consideration" 
                  className="m2h-statistical_consideration"
                  maxLength="300"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.statistical_consideration)}
                />
              </td>
            </tr>
            <tr className="m2h-sec08-r2">
              <td className="m2h-sec08-ttl">品質目標達成度</td>
              <td className="m2h-sec08-val">
                <textarea 
                  name="qualitygoals_evaluate" 
                  id="qualitygoals_evaluate" 
                  className="m2h-qualitygoals_evaluate"
                  maxLength="300"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.qualitygoals_evaluate)}
                />
              </td>
            </tr>
            <tr className="m2h-sec08-r3">
              <td className="m2h-sec08-ttl">完了報告</td>
              <td className="m2h-sec08-val">
                <textarea 
                  name="total_report" 
                  id="total_report" 
                  className="m2h-total_report"
                  maxLength="300"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.rep.total_report)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ModalConfirm confirm={updateConfirm} handleOk={handleUpdateOK} handleCancel={handleUpdateCancel} />
      <ModalConfirm confirm={submitConfirm} handleOk={handleSubmitOk} handleCancel={handleSubmitCancel} />
    </div>
  );
}
export default RepEditPage;