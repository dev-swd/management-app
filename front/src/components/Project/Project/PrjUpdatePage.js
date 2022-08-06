import "./PrjUpdatePage.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrj, updatePrj } from '../../../lib/api/project';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { displayDate, formatDate } from '../../../lib/common/datetostr';
import CustomDatePicker from "../../common/customDatePicker";
import SelectEmployee from "../../common/SelectEmployee";
import InputNumber from '../../common/InputNumber';
import { decimalValidator, phoneValidator, hankakuValidator } from '../../../lib/common/inputValidator.js';
import MemAddPage from '../Member/MemAddPage';
import ModalConfirm from '../../common/ModalConfirm';
import LogEditPage from '../Changelog/LogEditPage';

const initDate = new Date();
const initDatestr = formatDate(initDate, "YYYY-MM-DD 00:00:00");
const initData = {prj: {status: "",
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
                        remarks: ""},
                      phases: [],
                      risks: [],
                      goals: [],
                      mems: [],
                      log: {changer_id: "",
                            change_date: initDatestr,
                            contents: ""
                            },
                      }

const PrjUpdatePage = (props) => {
  const { prj_id, kbn } = props; 
  const [data, setData] = useState(initData);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [addMemFlg, setAddMemFlg] = useState(false);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();
  const [showLogEdit, setShowLogEdit] = useState(false);

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
        tmpPhase.planned_periodfr = phase.planned_periodfr;
        tmpPhase.planned_periodto = phase.planned_periodto;
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
        },
        phases: tmpPhases,
        risks: tmpRisks,
        goals: tmpGoals,
        mems: tmpMems,
      });
      setStatus(res.data.prj.status);
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChange = (name, value) => {
    setData({
      ...data,
      prj: {...data.prj,
        [name]: value
      }
    });
  }

  const handleChangeBudget = (name, value) => {
    var presum, sum;
    if(name==="order_amount"){
      presum = Number(data.prj.gross_profit) - Number(data.prj[name]);
      sum = Number(presum) + Number(value);
    } else {
      presum = Number(data.prj.gross_profit) + Number(data.prj[name]);
      sum = Number(presum) - Number(value);
    }
    setData({
      ...data,
      prj: {...data.prj,
        [name]: value,
        gross_profit: sum,
      }
    });
  }

  const handleAddPhase = () => {
    setData({
      ...data,
      phases: [...data.phases,
              {id: "",
                project_id: "",
                number: "",
                name: "",
                planned_periodfr: null,
                planned_periodto: null,
                deliverables: "",
                criteria: "",
                del: ""
              }
      ],
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

  const handleDelCheckPhase = (i, e) => {
    const tempPhases = [...data.phases];
    tempPhases[i]["del"] = e.target.checked;
    setData({
      ...data,
      phases: tempPhases,
    });
  }

  const handleAddRisk = () => {
    setData({
      ...data,
      risks: [...data.risks,
              {id: "",
                project_id: "",
                number: "",
                contents: "",
                del: ""
              }
      ],
    });
  }

  const handleChangeRisk = (i, name, value) => {
    const tempRisks = [...data.risks];
    tempRisks[i][name] = value;
    setData({
      ...data,
      risks: tempRisks,
    });
  }

  const handleDelCheckRisk = (i, e) => {
    const tempRisks = [...data.risks];
    tempRisks[i]["del"] = e.target.checked;
    setData({
      ...data,
      risks: tempRisks,
    });
  }

  const handleAddGoal = () => {
    setData({
      ...data,
      goals: [...data.goals,
              {id: "",
                project_id: "",
                number: "",
                contents: "",
                del: ""
              }
      ],
    });
  }

  const handleChangeGoal = (i, name, value) => {
    const tempGoals = [...data.goals];
    tempGoals[i][name] = value;
    setData({
      ...data,
      goals: tempGoals,
    });
  }

  const handleDelCheckGoal = (i, e) => {
    const tempGoals = [...data.goals];
    tempGoals[i]["del"] = e.target.checked;
    setData({
      ...data,
      goals: tempGoals,
    });
  }

  const handleAddMemOK = (id, name) => {
    setData({
      ...data,
      mems: [...data.mems,
              {id: "",
                project_id: "",
                number: "",
                level: "emp",
                member_id: id,
                member_name: name,
                del: false
              }
      ],
    });
  }

  const handleDelMem = (i, value) => {
    const tempMems = [...data.mems];
    tempMems[i]["del"] = value;
    setData({
      ...data,
      mems: tempMems,
    });
  }

  const handleChangeLog = (name, value) => {
    const tempLog = {...data.log};
    tempLog[name] = value;
    setData({
      ...data,
      log: tempLog,
    });
  }
  
  const handleModifyOK = async () => {
    try {
      setShowLogEdit(false);
      const res = await updatePrj(prj_id, data)
      if (res.data.status === 500) {
        setMessage("プロジェクト情報更新エラー(500)");
        setMessageVar("error");
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage("プロジェクト情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleModifyCancel = () => {
    setShowLogEdit(false);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePrj(prj_id, data)
      if (res.data.status === 500) {
        setMessage("プロジェクト情報更新エラー(500)");
        setMessageVar("error");
      } else {
        handleGetPrj(prj_id);
      }
    } catch (e) {
      setMessage("プロジェクト情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChange("status","計画書監査中");
    setConfirm({
      ...confirm,
      msg: "この内容でプロジェクト計画書を提出します。よろしいですか？",
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
      const res = await updatePrj(prj_id, data)
      if (res.data.status === 500) {
        setMessage("プロジェクト情報更新エラー(500)");
        setMessageVar("error");
      } else {
        navigate(`/prj`);
//        handleGetPrj(prj_id);
      }
    } catch (e) {
      setMessage("プロジェクト情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleSubmitCancel = () => {
    handleChange("status",status);
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  return (
    <div className="prj-upd-container">
      { message_var && <Alert severity={message_var}>{message}</Alert>}
      <div className="prj-entry-container">

        <div className="button-area">
          {
          (kbn === "mod")?
            <>
              <Button size="small" variant="contained" endIcon={<SaveAltIcon />} onClick={(e) => setShowLogEdit(true)}>変更登録</Button>
            </>
          :
            <>
              <Button size="small" variant="contained" endIcon={<SaveAltIcon />} onClick={(e) => handleUpdate(e)}>一時保存</Button>
              {"　"}
              <Button size="small" variant="contained" endIcon={<SendIcon />} onClick={(e) => handleSubmit(e)}>提出</Button>
            </>
          } 
        </div>
        <div className="prj-entry-container1">
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

          <div className="prj-entry-container2">
            {/* 2行目 */}
            <div className="title-cell cell2-1">プロジェクトNo.</div>
            <div className="data-cell cell2-2">{data.prj.number || ''}</div>
            <div className="title-cell cell2-3">作　成</div>
            <div className="date-cell cell2-4">
              <CustomDatePicker 
                selected={data.prj.make_date || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="make_date"
              />
              <SelectEmployee
                name="make_id" 
                value={data.prj.make_id || ''} 
                setValue={handleChange}
                width={100}
                height={19}
                border="0.5px solid #aaa"
              />
            </div>
            {/* 3行目 */}
            <div className="title-cell cell3-1">プロジェクト名</div>
            <div className="data-cell cell3-2">{data.prj.name || ''}</div>
            <div className="title-cell cell3-3">変　更</div>
            <div className="date-cell cell3-4">
              <CustomDatePicker 
                selected={data.prj.update_date || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="update_date"
              />
              <SelectEmployee
                name="update_id" 
                value={data.prj.update_id || ''} 
                setValue={handleChange}
                width={100}
                height={19}
                border="0.5px solid #aaa"
              />
            </div>
          </div>

          <div className="prj-entry-container3">
            {/* 4行目 */}
            <div className="title-cell-a cell4-1">取引先</div>
            <div className="data-cell cell4-2">
              <div className="inner">
                <label className="inner-title">会社名:</label>
                <input 
                  type="text" 
                  name="company_name" 
                  id="company_name" 
                  maxLength="25"
                  className="company_name text-base" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={data.prj.company_name || ''} 
                />
              </div>
              <div className="inner">
                <label className="inner-title">部署名:</label>
                <input 
                  type="text" 
                  name="department_name" 
                  id="department_name" 
                  maxLength="25"
                  className="department_name text-base"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={data.prj.department_name || ''} 
                />
              </div>
              <div className="inner">
                <label className="inner-title">担当者名:</label>
                <input 
                  type="text" 
                  name="personincharge_name" 
                  id="personincharge_name" 
                  maxLength="10"
                  className="personincharge_name text-base"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={data.prj.personincharge_name || ''} 
                />
              </div>
            </div>
            <div className="title-cell cell4-3">TEL</div>
            <div className="data-cell cell4-4">
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                maxLength="15"
                className="phone text-base" 
                placeholder="012-3456-7890"
                onChange={(e) => handleChange(e.target.name, phoneValidator(e))} 
                value={data.prj.phone || ''} 
              />
            </div>
            {/* 5行目 */}
            {/* <div className="title-cell cell5-1"></div> */}
            {/* <div className="data-cell cell5-2"></div> */}
            <div className="title-cell cell5-3">FAX</div>
            <div className="data-cell cell5-4">
              <input 
                type="text" 
                name="fax" 
                id="fax" 
                maxLength="15"
                className="fax text-base" 
                placeholder="012-3456-7890"
                onChange={(e) => handleChange(e.target.name, phoneValidator(e))} 
                value={data.prj.fax || ''} 
              />
            </div>
            {/* 6行目 */}
            {/* <div className="title-cell cell6-1"></div> */}
            {/* <div className="data-cell cell6-2"></div> */}
            <div className="title-cell cell6-3">E-mail</div>
            <div className="data-cell cell6-4">
              <input 
                type="email" 
                name="email" 
                id="email" 
                maxLength="254"
                className="email text-base"
                placeholder="info@example.com" 
                onChange={(e) => handleChange(e.target.name, hankakuValidator(e))} 
                value={data.prj.email || ''} 
              />
            </div>
          </div>

          <div className="prj-entry-container4">
            {/* 7行目 */}
            <div className="title-cell cell7-1">開発期間</div>
            <div className="date-cell cell7-2">
              <CustomDatePicker 
                selected={data.prj.development_period_fr || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="development_period_fr"
              />
              <label className="inner-caption">{"　〜　"}</label>
              <CustomDatePicker 
                selected={data.prj.development_period_to || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="development_period_to"
              />
            </div>
            <div className="title-cell cell7-3">完了予定</div>
            <div className="date-cell cell7-4">
              <CustomDatePicker 
                selected={data.prj.scheduled_to_be_completed || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="scheduled_to_be_completed"
              />
            </div>
          </div>

          <div className="prj-entry-container5">
            {/* 8行目 */}
            <div className="title-cell cell8-1">システム概要</div>
            <div className="data-cell cell8-2">
              <textarea 
                name="system_overview" 
                id="system_overview" 
                className="system_overview"
                maxLength="200"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.prj.system_overview || ''}
              />
            </div>
            <div className="title-cell cell8-3">開発環境</div>
            <div className="data-cell cell8-4">
              <textarea 
                name="development_environment" 
                id="development_environment" 
                className="development_environment"
                maxLength="150"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.prj.development_environment || ''}
              />
            </div>
          </div>

          <div className="prj-entry-container6">
            {/* 9行目 */}
            <div className="title-cell cell9-1">受注金額</div>
            <div className="data-cell cell9-2">
              <InputNumber 
                name="order_amount" 
                id="order_amount" 
                maxLength="10"
                className="order_amount text-base"
                toValue={data.prj.order_amount || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            <div className="title-cell cell9-3">計画値</div>
            <div className="title-cell cell9-4">作業費</div>
            <div className="data-cell cell9-5">
              <InputNumber 
                name="planned_work_cost" 
                id="planned_work_cost" 
                maxLength="10"
                className="planned_work_cost text-base"
                toValue={data.prj.planned_work_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円（"}</label>
              <input 
                type="text" 
                name="planned_workload" 
                id="planned_workload" 
                maxLength="5"
                className="planned_workload text-base"
                onChange={(e) => handleChange(e.target.name, decimalValidator(e))} 
                value={data.prj.planned_workload || ''} 
              />
              <label className="inner-caption">{"人月）"}</label>
            </div>
            <div className="title-cell cell9-6">仕入費</div>
            <div className="data-cell cell9-7">
              <InputNumber 
                name="planned_purchasing_cost" 
                id="planned_purchasing_cost" 
                maxLength="10"
                className="planned_purchasing_cost text-base"
                toValue={data.prj.planned_purchasing_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* 10行目 */}
            <div className="title-cell cell10-1">粗利見込</div>
            <div className="data-cell cell10-2">
              <input 
                type="text" 
                name="gross_profit" 
                id="gross_profit" 
                className="gross_profit text-base" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={Number(data.prj.gross_profit || '').toLocaleString()}
                readOnly
              />
              <label className="inner-caption">{"円"}</label>
            </div>
            {/* <div className="title-cell cell10-3"></div> */}
            <div className="title-cell cell10-4">外注費</div>
            <div className="data-cell cell10-5">
              <InputNumber 
                name="planned_outsourcing_cost" 
                id="planned_outsourcing_cost" 
                maxLength="10"
                className="planned_outsourcing_cost text-base"
                toValue={data.prj.planned_outsourcing_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円（"}</label>
              <input 
                type="text" 
                name="planned_outsourcing_workload" 
                id="planned_outsourcing_workload" 
                maxLength="5"
                className="planned_outsourcing_workload text-base"
                onChange={(e) => handleChange(e.target.name, decimalValidator(e))} 
                value={data.prj.planned_outsourcing_workload || ''} 
              />
              <label className="inner-caption">{"人月）"}</label>
            </div>
            <div className="title-cell cell10-6">経費</div>
            <div className="data-cell cell10-7">
              <InputNumber 
                name="planned_expenses_cost" 
                id="planned_expenses_cost" 
                maxLength="10"
                className="planned_expenses_cost text-base"
                toValue={data.prj.planned_expenses_cost || ''}
                procChange={handleChangeBudget}
              />
              <label className="inner-caption">{"円"}</label>
            </div>
          </div>

          <div className="prj-entry-container7">
            {/* 11行目 */}
            <div className="title-cell cell11-1">作業場所</div>
            <div className="radio-cell cell11-2">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="work_place_kbn" name="work_place_kbn" value="自社内" checked={data.prj.work_place_kbn==="自社内"} />自社内
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="work_place_kbn" name="work_place_kbn" value="他社" checked={data.prj.work_place_kbn==="他社"} />他社：
                </label>
              </div>
              <input 
                type="text" 
                name="work_place"
                id="work_place"
                maxLength="35"
                className="text-base work_place" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.prj.work_place || ''} 
              />
            </div>
            {/* <div className="title-cell cell11-3"></div> */}
            {/* <div className="data-cell cell11-4"></div> */}
            {/* <div className="title-cell cell11-5"></div> */}
            {/* <div className="data-cell cell11-6"></div> */}
            {/* 12行目 */}
            <div className="title-cell cell12-1">顧客所有物</div>
            <div className="radio-cell cell12-2">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="customer_property_kbn" name="customer_property_kbn" value="無" checked={data.prj.customer_property_kbn==="無"} />無
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="customer_property_kbn" name="customer_property_kbn" value="有" checked={data.prj.customer_property_kbn==="有"} />有
                </label>
              </div>
            </div>
            <div className="data-cell cell12-3">
              <input 
                type="text" 
                name="customer_property"
                id="customer_property"
                maxLength="25"
                className="text-base customer_property" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.prj.customer_property || ''} 
              />
            </div>
            {/* <div className="data-cell cell12-4"></div> */}
            <div className="title-cell cell12-5">顧客環境</div>
            <div className="radio-cell cell12-6">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="customer_environment" name="customer_environment" value="無" checked={data.prj.customer_environment==="無"} />無
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="customer_environment" name="customer_environment" value="有" checked={data.prj.customer_environment==="有"} />有
                </label>
              </div>
            </div>
            {/* 13行目 */}
            <div className="title-cell cell13-1">仕入品</div>
            <div className="radio-cell cell13-2">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="purchasing_goods_kbn" name="purchasing_goods_kbn" value="無" checked={data.prj.purchasing_goods_kbn==="無"} />無
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="purchasing_goods_kbn" name="purchasing_goods_kbn" value="有" checked={data.prj.purchasing_goods_kbn==="有"} />有
                </label>
              </div>
            </div>
            <div className="data-cell cell13-3">
              <input 
                type="text" 
                name="purchasing_goods"
                id="purchasing_goods"
                maxLength="40"
                className="text-base purchasing_goods" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.prj.purchasing_goods || ''} 
              />
            </div>
            {/* <div className="data-cell cell13-4"></div> */}
            {/* <div className="title-cell cell13-5"></div> */}
            {/* <div className="data-cell cell13-6"></div> */}
            {/* 14行目 */}
            <div className="title-cell cell14-1">外部委託</div>
            <div className="radio-cell cell14-2">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="outsourcing_kbn" name="outsourcing_kbn" value="無" checked={data.prj.outsourcing_kbn==="無"} />無
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="outsourcing_kbn" name="outsourcing_kbn" value="有" checked={data.prj.outsourcing_kbn==="有"} />有
                </label>
              </div>
            </div>
            <div className="data-cell cell14-3">
              <input 
                type="text" 
                name="outsourcing"
                id="outsourcing"
                maxLength="40"
                className="text-base outsourcing" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.prj.outsourcing || ''} 
              />
            </div>
            {/* <div className="data-cell cell14-4"></div> */}
            {/* <div className="title-cell cell14-5"></div> */}
            {/* <div className="data-cell cell14-6"></div> */}
            {/* 15行目 */}
            <div className="title-cell cell15-1">顧客要求仕様書</div>
            <div className="radio-cell cell15-2">
              <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="radio-button">
                  <input type="radio" className="customer_requirement_kbn" name="customer_requirement_kbn" value="無" checked={data.prj.customer_requirement_kbn === '無'} />無
                </label>
                {"　"}
                <label className="radio-button">
                  <input type="radio" className="customer_requirement_kbn" name="customer_requirement_kbn" value="有" checked={data.prj.customer_requirement_kbn === '有'} />有
                </label>
              </div>
            </div>
            <div className="title-cell cell15-3">文書名</div>
            <div className="data-cell cell15-4">
              <input 
                type="text" 
                name="customer_requirement"
                id="customer_requirement"
                maxLength="35"
                className="text-base customer_requirement" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={data.prj.customer_requirement || ''} 
              />
            </div>
            {/* <div className="title-cell cell15-5"></div> */}
            {/* <div className="data-cell cell15-6"></div> */}
          </div>

          <div className="prj-entry-container8">
            <div className="title-cell">
              <div className="title">受注範囲</div>
              <div className="button">
                <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddPhase()}>
                  <AddCircleIcon fontSize="small"/>
                </IconButton>
              </div>
            </div>
            <div className="data-cell">
              <table className="prj-entry-phases">
                <thead>
                  <tr className="header-tr">
                    <td className="header-td name-td">工程</td>
                    <td className="header-td period-td">開始予定</td>
                    <td className="header-td period-td">終了予定</td>
                    <td className="header-td deliverables-td">成果物</td>
                    <td className="header-td criteria-td">合否判定基準</td>
                    <td className="header-td del-check-td">削除</td>
                  </tr>
                </thead>
                <tbody>
                  {data.phases ? (
                    data.phases.map((phase, i) => 
                    <tr key={"phase-" + i} className="body-tr">
                      <td className={'name-td ' + (phase.del ? 'delete' : '')}>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          maxLength="20"
                          className={'text-base name ' + (phase.del ? 'delete' : '')} 
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)} 
                          value={phase.name || ''} 
                        />
                      </td>
                      <td className={'period-td ' + (phase.del ? 'delete' : '')}>
                        <CustomDatePicker 
                          selected={phase.planned_periodfr || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className="date-field"
                          onChange={handleChangePhase}
                          name="planned_periodfr"
                          index={i}
                        />
                      </td>
                      <td className={'period-td ' + (phase.del ? 'delete' : '')}>
                        <CustomDatePicker 
                          selected={phase.planned_periodto || ''} 
                          dateFormat="yyyy年MM月dd日" 
                          className="date-field"
                          onChange={handleChangePhase}
                          name="planned_periodto"
                          index={i}
                        />
                      </td>
                      <td className={'deliverables-td ' + (phase.del ? 'delete' : '')}>
                        <textarea 
                          name="deliverables" 
                          id="deliverables" 
                          className={'deliverables ' + (phase.del ? 'delete' : '')}
                          maxLength="50"
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)}
                          value={phase.deliverables}
                        />
                      </td>
                      <td className={'criteria-td ' + (phase.del ? 'delete' : '')}>
                        <textarea 
                          name="criteria" 
                          id="criteria" 
                          className={'criteria ' + (phase.del ? 'delete' : '')}
                          maxLength="50"
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)}
                          value={phase.criteria}
                        />
                      </td>
                      <td className="del-check-td">
                        <input 
                          type="checkbox"
                          name="del-check"
                          id="del-check"
                          className="del-check"
                          value="del-check"
                          checked={phase.del || false}
                          onChange={(e) => handleDelCheckPhase(i,e)}
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

          <div className="prj-entry-container9">
            <div className="title-cell">
              リスク
              <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddRisk()}>
                <AddCircleIcon fontSize="small"/>
              </IconButton>
            </div>
            <div className="data-cell">
              <table className="prj-entry-risks">
                <tbody>
                  {data.risks ? (
                    data.risks.map((risk, i) => 
                    <tr key={"risk-" + i} className="body-tr">
                      <td className={'contents-td ' + (risk.del ? 'delete' : '')}>
                        <textarea 
                          name="contents" 
                          id="contents" 
                          className={'contents ' + (risk.del ? 'delete' : '')}
                          maxLength="100"
                          onChange={(e) => handleChangeRisk(i, e.target.name, e.target.value)}
                          value={risk.contents || ''}
                        />
                      </td>
                      <td className="del-check-td">
                        <input 
                          type="checkbox"
                          name="del-check"
                          id="del-check"
                          className="del-check"
                          value="del-check"
                          checked={risk.del || false}
                          onChange={(e) => handleDelCheckRisk(i,e)}
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

          <div className="prj-entry-container10">
            <div className="title-cell">
              品質目標
              <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddGoal()}>
                <AddCircleIcon fontSize="small"/>
              </IconButton>
            </div>
            <div className="data-cell">
              <table className="prj-entry-goals">
                <tbody>
                  {data.goals ? (
                    data.goals.map((goal, i) => 
                    <tr key={"goal-" + i} className="body-tr">
                      <td className={'contents-td ' + (goal.del ? 'delete' : '')}>
                      <textarea 
                          name="contents" 
                          id="contents" 
                          className={'contents ' + (goal.del ? 'delete' : '')}
                          maxLength="100"
                          onChange={(e) => handleChangeGoal(i, e.target.name, e.target.value)}
                          value={goal.contents || ''}
                        />
                      </td>
                      <td className="del-check-td">
                        <input 
                          type="checkbox"
                          name="del-check"
                          id="del-check"
                          className="del-check"
                          value="del-check"
                          checked={goal.del || false}
                          onChange={(e) => handleDelCheckGoal(i,e)}
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

          <div className="prj-entry-container11">
            <div className="title-cell title-top">開発体制</div>
            <div className="title-cell pl-title">プロジェクトリーダー</div>
            <div className="data-cell pl-cell">
              <SelectEmployee
                name="pl_id" 
                value={data.prj.pl_id || ''} 
                setValue={handleChange}
                width={100}
                height={19}
                border="0.5px solid #aaa"
              />
            </div>
            {/* <div className="title-cell"></div> */}
            <div className="title-cell member-title">
              プロジェクトメンバー
              <IconButton aria-label="Add" color="primary" size="small" onClick={() => setAddMemFlg(true)}>
                <AddCircleIcon fontSize="small"/>
              </IconButton>
            </div>
            <div className="data-cell member-cell">
            {data.mems ? (
              data.mems.map((mem, i) => 
                <>
                {mem.del ? (
                  <Chip
                    label={mem.member_name || ''}
                    color="error"
                    size="small"
                    sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                    deleteIcon={<DoneIcon />}
                    onDelete={() => handleDelMem(i,false)}
                  />
                ) : (
                  <Chip
                    label={mem.member_name || ''}
                    variant="outlined"
                    size="small"
                    sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                    onDelete={() => handleDelMem(i,true)}
                  />
                )}
                </>
              )
            ) : (
              <></>
            )}
            </div>
          </div>

          <div className="prj-entry-container12">
            {/* 16行目 */}
            <div className="title-cell cell16-1">特記事項</div>
            <div className="data-cell cell16-2">
              <textarea 
                name="remarks" 
                id="remarks" 
                className="remarks"
                maxLength="300"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={data.prj.remarks || ''}
              />
            </div>
          </div>

        </div>

      </div>
      <MemAddPage addMemFlg={addMemFlg} setAddMemFlg={setAddMemFlg} handleAddMemOK={handleAddMemOK} />
      <ModalConfirm confirm={confirm} handleOk={handleSubmitOk} handleCancel={handleSubmitCancel} />
      <LogEditPage showFlg={showLogEdit} log={data.log} handleChange={handleChangeLog} handleOK={handleModifyOK} handleCancel={handleModifyCancel} />
    </div>
  );
}

export default PrjUpdatePage;
