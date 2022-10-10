// m24
import "./PrjUpdatePage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../../App";
import { useNavigate } from 'react-router-dom';
import { getPrj, updatePrj } from '../../../lib/api/project';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { formatDateZero } from '../../../lib/common/dateCom';
import CustomDatePicker from '../../common/customDatePicker';
import SelectEmployee from "../../common/SelectEmployee";
import InputNumber from '../../common/InputNumber';
import { phoneOnly, hankakuOnly, decimalOnly } from '../../../lib/common/InputRegulation';
import MemAddPage from '../Member/MemAddPage';
import ModalConfirm from '../../common/ModalConfirm';
import LogEditPage from '../Changelog/LogEditPage';
import { isEmpty } from "../../../lib/common/isEmpty";

const initDate = new Date();
const initDatestr = formatDateZero(initDate, "YYYY-MM-DD 00:00:00");
const initData = {prj: {status: "",
                        approval: "",
                        approval_name: "",
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
  const { prjId, kbn, setInputErr } = props; 
  const { empInfo } = useContext(AuthContext);
  const [data, setData] = useState(initData);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [showAddMem, setShowAddMem] = useState(false);
  const [updateConfirm, setUpdateConfirm] = useState({msg: "", tag: ""});
  const [submitConfirm, setSubmitConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();
  const [showLogEdit, setShowLogEdit] = useState(false);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)){
      handleGetPrj();
    }
  },[prjId]);

  // プロジェクト情報取得
  const handleGetPrj = async () => {
    try {
      const res = await getPrj(Number(prjId));
      // 工程情報セット
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
      // リスク情報セット
      const tmpRisks = res.data.risks.map(risk => {
        const tmpRisk = {};
        tmpRisk.id = risk.id;
        tmpRisk.project_id = risk.project_id;
        tmpRisk.number = risk.number;
        tmpRisk.contents = risk.contents;
        tmpRisk.del = "";
        return tmpRisk;
      });
      // 品質目標セット
      const tmpGoals = res.data.goals.map(goal => {
        const tmpGoal = {};
        tmpGoal.id = goal.id;
        tmpGoal.project_id = goal.project_id;
        tmpGoal.number = goal.number;
        tmpGoal.contents = goal.contents;
        tmpGoal.del = "";
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
        tmpMem.del = false;
        return tmpMem;
      });
      // プロジェクト情報セット
      setData({
        ...data,
        prj: {status: res.data.prj.status,
              approval: res.data.prj.approval,
              approval_name: res.data.prj.approval_name,
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
      prj: {...data.prj,
        [name]: value
      }
    });
  }

  // 金額項目入力時の処理（再集計）
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

  // 工程追加ボタン押下時の処理（行追加）
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

  // 工程項目入力時の処理
  const handleChangePhase = (i, name, value) => {
    const tempPhases = [...data.phases];
    tempPhases[i][name] = value;
    setData({
      ...data,
      phases: tempPhases,
    });
  }

  // 工程削除チェックボックス変更時の処理
  const hancleChangePhaseDel = (i, e) => {
    const tempPhases = [...data.phases];
    tempPhases[i]["del"] = e.target.checked;
    setData({
      ...data,
      phases: tempPhases,
    });
  }

  // リスク追加ボタン押下時の処理（行追加）
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

  // リスク項目入力時の処理
  const handleChangeRisk = (i, name, value) => {
    const tempRisks = [...data.risks];
    tempRisks[i][name] = value;
    setData({
      ...data,
      risks: tempRisks,
    });
  }

  // リスク削除チェックボックス変更時の処理
  const hancleChangeRiskDel = (i, e) => {
    const tempRisks = [...data.risks];
    tempRisks[i]["del"] = e.target.checked;
    setData({
      ...data,
      risks: tempRisks,
    });
  }

  // 品質目標追加ボタン押下時の処理
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

  // 品質目標項目入力時の処理
  const handleChangeGoal = (i, name, value) => {
    const tempGoals = [...data.goals];
    tempGoals[i][name] = value;
    setData({
      ...data,
      goals: tempGoals,
    });
  }

  // 品質目標削除チェックボックス変更時の処理
  const hancleChangeGoalDel = (i, e) => {
    const tempGoals = [...data.goals];
    tempGoals[i]["del"] = e.target.checked;
    setData({
      ...data,
      goals: tempGoals,
    });
  }

  // メンバー追加ボタン押下時の処理
  const handleAddMem = () => {
    // メンバー追加ダイアログ表示
    setShowAddMem(true);
  }

  // メンバー追加ダイアログOKボタン押下時の処理
  const handleAddMemOK = (id, name) => {
    setShowAddMem(false);
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

  // メンバー追加ダイアログ終了時の処理
  const handleAddMemCancel = () => {
    setShowAddMem(false);
  }

  // メンバー削除ボタン押下時の処理
  const handleDelMem = (i, value) => {
    const tempMems = [...data.mems];
    tempMems[i]["del"] = value;
    setData({
      ...data,
      mems: tempMems,
    });
  }

  // 入力チェック
  const checkInput = () => {
    let err=[];

    // 作成日
    if (isEmpty(data.prj.make_date)) {
      err[err.length] = {msg: "作成日が未入力です。"};
    }

    // 作成者
    if (isEmpty(data.prj.make_id)) {
      err[err.length] = {msg: "作成者が未選択です。"};
    }

    // 取引先
    if (isEmpty(data.prj.company_name) || isEmpty(data.prj.department_name) || isEmpty(data.prj.personincharge_name)) {
      // いずれか未入力の場合エラー
      err[err.length] = {msg: "取引先に未入力があります。"};
    }

    // 開発期間
    if (isEmpty(data.prj.development_period_fr) || isEmpty(data.prj.development_period_to)) {
      // いずれか未入力の場合エラー
      err[err.length] = {msg: "開発期間（自・至）が未入力です。"};
    } else {
      if (data.prj.development_period_fr > data.prj.development_period_to) {
        // 開始＞終了の場合エラー
        err[err.length] = {msg: "開発期間が不正です（自＜至）"};
      }
    }

    // 完了予定日
    if (isEmpty(data.prj.scheduled_to_be_completed)) {
      err[err.length] = {msg: "完了予定日が未入力です。"};
    }

    // システム概要
    if (isEmpty(data.prj.system_overview)) {
      err[err.length] = {msg: "システム概要が未入力です。"};
    }

    // 開発環境
    if (isEmpty(data.prj.development_environment)) {
      err[err.length] = {msg: "開発環境が未入力です。"};
    }

    // 作業場所
    if (isEmpty(data.prj.work_place_kbn)) {
      err[err.length] = {msg: "作業場所が未選択です。"};
    }

    // 顧客所有物
    if (isEmpty(data.prj.customer_property_kbn)) {
      err[err.length] = {msg: "顧客所有物が未選択です。"};
    }

    // 顧客環境
    if (isEmpty(data.prj.customer_environment)) {
      err[err.length] = {msg: "顧客環境が未選択です。"};
    }

    // 仕入品
    if (isEmpty(data.prj.purchasing_goods_kbn)) {
      err[err.length] = {msg: "仕入品が未選択です。"};
    }

    // 外部委託
    if (isEmpty(data.prj.outsourcing_kbn)) {
      err[err.length] = {msg: "外部委託が未選択です。"};
    }

    // 顧客要求仕様書
    if (isEmpty(data.prj.customer_requirement_kbn)) {
      err[err.length] = {msg: "顧客要求仕様書が未選択です。"};
    }

    // 受注範囲
    const phaseCnt = data.phases.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (phaseCnt === 0) {
      err[err.length] = {msg: "受注範囲が１件も入力されていません。"};  
    }
    data.phases.map((phase,i) => {
      if (!(phase.del)) {
        if (isEmpty(phase.name) || isEmpty(phase.planned_periodfr) || isEmpty(phase.planned_periodto) || isEmpty(phase.deliverables) || isEmpty(phase.criteria)) {
          // いずれか未入力の場合エラー
          err[err.length] = {msg: "受注範囲に未入力があります。（" + (i + 1) + "行目）"};  
        }
        if (!isEmpty(phase.planned_periodfr) && !isEmpty(phase.planned_periodto)) {
          if (phase.planned_periodfr > phase.planned_periodto) {
            // 開始＞終了の場合エラー
            err[err.length] = {msg: "受注範囲の開始予定・終了予定が不正です。（開始＜終了）（" + (i + 1) + "行目）"};    
          }
        }
      }
    });

    // リスク
    const riskCnt = data.risks.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (riskCnt === 0) {
      err[err.length] = {msg: "リスクが１件も入力されていません。"};  
    }
    data.risks.map((risk,i) => {
      if (!(risk.del)) {
        if (isEmpty(risk.contents)) {
          err[err.length] = {msg: "リスクが未入力です。（" + (i + 1) + "行目）"};  
        }
      }
    })

    // 品質目標
    const goalCnt = data.goals.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (goalCnt === 0) {
      err[err.length] = {msg: "品質目標が１件も入力されていません。"};  
    }
    data.goals.map((goal,i) => {
      if (!(goal.del)) {
        if (isEmpty(goal.contents)) {
          err[err.length] = {msg: "品質目標が未入力です。（" + (i + 1) + "行目）"};  
        }
      }
    })

    // プロジェクトリーダー
    if (isEmpty(data.prj.pl_id)) {
      err[err.length] = {msg: "プロジェクトリーダーが未選択です。"};
    }

    // プロジェクトメンバー
    const memCnt = data.mems.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (memCnt === 0) {
      err[err.length] = {msg: "プロジェクトメンバーが１人も設定されていません。"};  
    }

    if (err.length > 0) {
      setInputErr(err);
      return true;
    } else {
      return false;
    }
  }

  // 変更履歴ダイアログ用）項目入力の処理
  const handleChangeLog = (name, value) => {
    const tempLog = {...data.log};
    tempLog[name] = value;
    setData({
      ...data,
      log: tempLog,
    });
  }

  // 変更の場合
  // 変更登録ボタン押下時の処理
  const handleModify = () => {
    // 入力チェック
    if (!checkInput()) {
      const tempLog = {...data.log};
      tempLog["changer_id"] = empInfo.id;
      tempLog["change_date"] = initDate;
      setData({
        ...data,
        log: tempLog,
      });
      setShowLogEdit(true);
  
    }    
  }

  // 変更履歴ダイアログ用）更新確認OKボタン押下時の処理
  const handleModifyOK = async () => {
    setShowLogEdit(false);
    try {
      const res = await updatePrj(prjId, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト情報更新エラー(500)"});
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報更新エラー"});
    }
  }

  // 変更履歴ダイアログ用）更新確認Cancelボタン押下時の処理
  const handleModifyCancel = () => {
    setShowLogEdit(false);
    const tempLog = {...data.log};
    tempLog["changer_id"] = "";
    tempLog["change_date"] = "";
    tempLog["contents"] = "";
    setData({
      ...data,
      log: tempLog,
    });
  }

  // 作成の場合
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
      const res = await updatePrj(prjId, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト情報更新エラー(500)"});
      } else {
        handleGetPrj();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報更新エラー"});
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
  const handleSubmit = (e) => {
    // 入力チェック
    if (!checkInput()) {

      handleChange("status","計画書監査中");
      setSubmitConfirm({
        ...submitConfirm,
        msg: "この内容でプロジェクト計画書を提出します。よろしいですか？",
        tag: "",
      })

    }
  }

  // 提出確認OKボタン押下時の処理
  const handleSubmitOk = async (dummy) => {
    try {
      setSubmitConfirm({
        ...submitConfirm,
        msg: "",
        tag: "",
      });
      const res = await updatePrj(prjId, data);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト情報更新エラー(500)"});
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報更新エラー"});
    }
  }

  // 提出確認Cancelボタン押下時の処理
  const handleSubmitCancel = () => {
    handleChange("status",status);
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
    <div className="m24-container">
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      {/* ボタン */}
      <div className="m24-button-area">
        {(kbn === "mod")?
          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SaveAltIcon />} 
            onClick={(e) => handleModify()}
          >
            変更登録
          </Button>
        :
          <>
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
              onClick={(e) => handleSubmit()}
            >
              提出
            </Button>
          </>
        } 
      </div>

      {/* セクション１ */}
      <table className="m24-sec01">
        <tr>
          <td className="m24-prj-ttl">プロジェクト計画書</td>
          <td className="m24-approval-ttl">承認</td>
          <td className="m24-approval">{formatDateZero(data.prj.approval_date, "YYYY年MM月DD日") + "　" + toStr(data.prj.approval_name)}</td>
        </tr>
      </table>

      <div className="m24-frame">

        {/* セクション２ */}
        <table className="m24-sec02">
          <tr>
            <td className="m24-sec02-ttl1">プロジェクトNo.</td>
            <td className="m24-sec02-val1">{toStr(data.prj.number)}</td>
            <td className="m24-sec02-ttl2">作　成</td>
            <td className="m24-sec02-val2">
              <CustomDatePicker 
                selected={toStr(data.prj.make_date)} 
                dateFormat="yyyy年MM月dd日" 
                className="m24-date"
                onChange={handleChange}
                name="make_date"
              />
              <SelectEmployee
                name="make_id" 
                value={toStr(data.prj.make_id)} 
                setValue={handleChange}
                width={100}
                height={20}
                border="0.5px solid #aaa"
              />
            </td>
          </tr>
          <tr>
            <td className="m24-sec02-ttl1">プロジェクト名</td>
            <td className="m24-sec02-val1">{toStr(data.prj.name)}</td>
            <td className="m24-sec02-ttl2">変　更</td>
            <td className="m24-sec02-val2">
              <CustomDatePicker 
                selected={toStr(data.prj.update_date)} 
                dateFormat="yyyy年MM月dd日" 
                className="m24-date"
                onChange={handleChange}
                name="update_date"
              />
              <SelectEmployee
                name="update_id" 
                value={toStr(data.prj.update_id)} 
                setValue={handleChange}
                width={100}
                height={20}
                border="0.5px solid #aaa"
              />
            </td>
          </tr>
        </table>

        {/* セクション３ */}
        <table className="m24-sec03">
          <tr>
            <td className="m24-sec03-ttl1" rowSpan="3">取引先</td>
            <td className="m24-sec03-val1" rowSpan="3">
              <div className="m24-sec03-innerrow">
                <div className="m24-sec03-innerttl">会社名:</div>
                <input 
                  type="text" 
                  name="company_name" 
                  id="company_name" 
                  maxLength="25"
                  className="m24-company_name" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.prj.company_name)} 
                />
              </div>
              <div className="m24-sec03-innerrow">
                <div className="m24-sec03-innerttl">部署名:</div>
                <input 
                  type="text" 
                  name="department_name" 
                  id="department_name" 
                  maxLength="25"
                  className="m24-department_name"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.prj.department_name)} 
                />
              </div>
              <div className="m24-sec03-innerrow">
                <div className="m24-sec03-innerttl">担当者:</div>
                <input 
                  type="text" 
                  name="personincharge_name" 
                  id="personincharge_name" 
                  maxLength="10"
                  className="m24-personincharge_name"
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.prj.personincharge_name)} 
                />
              </div>
            </td>
            <td className="m24-sec03-ttl2">TEL</td>
            <td className="m24-sec03-val2">
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                maxLength="15"
                className="m24-phone" 
                placeholder="012-3456-7890"
                onChange={(e) => handleChange(e.target.name, phoneOnly(e.target.value))} 
                value={toStr(data.prj.phone)} 
              />
            </td>
          </tr>
          <tr>
            <td className="m24-sec03-ttl2">FAX</td>
            <td className="m24-sec03-val2">
              <input 
                type="text" 
                name="fax" 
                id="fax" 
                maxLength="15"
                className="m24-fax" 
                placeholder="012-3456-7890"
                onChange={(e) => handleChange(e.target.name, phoneOnly(e.target.value))} 
                value={toStr(data.prj.fax)} 
              />
            </td>
          </tr>
          <tr>
            <td className="m24-sec03-ttl2">E-mail</td>
            <td className="m24-sec03-val2">
              <input 
                type="email" 
                name="email" 
                id="email" 
                maxLength="254"
                className="m24-email"
                placeholder="info@example.com" 
                onChange={(e) => handleChange(e.target.name, hankakuOnly(e.target.value))} 
                value={toStr(data.prj.email)} 
              />
            </td>
          </tr>            
        </table>

        {/* セクション４ */}
        <table className="m24-sec04">
          <tr>
            <td className="m24-sec04-ttl1">開発期間</td>
            <td className="m24-sec04-val1">
              <div className="m24-date-frame">
                <CustomDatePicker 
                  selected={toStr(data.prj.development_period_fr)} 
                  dateFormat="yyyy年MM月dd日" 
                  className="m24-date"
                  onChange={handleChange}
                  name="development_period_fr"
                />
              </div>
              <div className="m24-sec04-innerlbl">〜</div>
              <div className="m24-date-frame">
                <CustomDatePicker 
                  selected={toStr(data.prj.development_period_to)} 
                  dateFormat="yyyy年MM月dd日" 
                  className="m24-date"
                  onChange={handleChange}
                  name="development_period_to"
                />
              </div>
            </td>
            <td className="m24-sec04-ttl2">完了予定</td>
            <td className="m24-sec04-val2">
              <div className="m24-date-frame">
                <CustomDatePicker 
                  selected={toStr(data.prj.scheduled_to_be_completed)} 
                  dateFormat="yyyy年MM月dd日" 
                  className="m24-date"
                  onChange={handleChange}
                  name="scheduled_to_be_completed"
                />
              </div>
            </td>
          </tr>
        </table>

        {/* セクション５ */}
        <table className="m24-sec05">
          <tr>
            <td className="m24-sec05-ttl1">システム概要</td>
            <td className="m24-sec05-val1">
              <textarea 
                name="system_overview" 
                id="system_overview" 
                className="m24-system_overview"
                maxLength="200"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={toStr(data.prj.system_overview)}
              />
            </td>
            <td className="m24-sec05-ttl2">開発環境</td>
            <td className="m24-sec05-val2">
              <textarea 
                name="development_environment" 
                id="development_environment" 
                className="m24-development_environment"
                maxLength="150"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={toStr(data.prj.development_environment)}
              />
            </td>
          </tr>
        </table>

        {/* セクション６ */}
        <table className="m24-sec06">
          <tr>
            <td className="m24-sec06-ttl1">受注金額</td>
            <td className="m24-sec06-val1">
              <div className="m24-sec06-val1-frame">
                <InputNumber 
                  name="order_amount" 
                  id="order_amount" 
                  maxLength="10"
                  className="m24-order_amount"
                  toValue={toStr(data.prj.order_amount)}
                  procChange={handleChangeBudget}
                />
                <div className="m24-sec06-innerlbl">円</div>
              </div>
            </td>
            <td className="m24-sec06-ttl2" rowSpan="2">計画値</td>
            <td className="m24-sec06-ttl2">作業費</td>
            <td className="m24-sec06-val2">
              <div className="m24-sec06-val2-frame">
                <InputNumber 
                  name="planned_work_cost" 
                  id="planned_work_cost" 
                  maxLength="10"
                  className="m24-planned_work_cost"
                  toValue={toStr(data.prj.planned_work_cost)}
                  procChange={handleChangeBudget}
                />
                <div className="m24-sec06-innerlbl2">{"円（"}</div>
                <input 
                  type="text" 
                  name="planned_workload" 
                  id="planned_workload" 
                  maxLength="5"
                  className="m24-planned_workload"
                  onChange={(e) => handleChange(e.target.name, decimalOnly(e.target.value))} 
                  value={toStr(data.prj.planned_workload)} 
                />
                <div className="m24-sec06-innerlbl">{"人月）"}</div>
              </div>
            </td>
            <td className="m24-sec06-ttl3">仕入費</td>
            <td className="m24-sec06-val3">
              <div className="m24-sec06-val3-frame">
                <InputNumber 
                  name="planned_purchasing_cost" 
                  id="planned_purchasing_cost" 
                  maxLength="10"
                  className="m24-planned_purchasing_cost"
                  toValue={toStr(data.prj.planned_purchasing_cost)}
                  procChange={handleChangeBudget}
                />
                <div className="m24-sec06-innerlbl">円</div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="m24-sec06-ttl1">粗利見込</td>
            <td className="m24-sec06-val1">
              <div className="m24-sec06-val1-frame">
                <input 
                  type="text" 
                  name="gross_profit" 
                  id="gross_profit" 
                  className="m24-gross_profit" 
                  value={Number(toStr(data.prj.gross_profit)).toLocaleString()}
                  readOnly
                />
                <div className="m24-sec06-innerlbl">円</div>
              </div>
            </td>
            <td className="m24-sec06-ttl2">外注費</td>
            <td className="m24-sec06-val2">
              <div className="m24-sec06-val2-frame">
                <InputNumber 
                  name="planned_outsourcing_cost" 
                  id="planned_outsourcing_cost" 
                  maxLength="10"
                  className="m24-planned_outsourcing_cost"
                  toValue={toStr(data.prj.planned_outsourcing_cost)}
                  procChange={handleChangeBudget}
                />
                <div className="m24-sec06-innerlbl2">{"円（"}</div>
                <input 
                  type="text" 
                  name="planned_outsourcing_workload" 
                  id="planned_outsourcing_workload" 
                  maxLength="5"
                  className="m24-planned_outsourcing_workload"
                  onChange={(e) => handleChange(e.target.name, decimalOnly(e.target.value))} 
                  value={toStr(data.prj.planned_outsourcing_workload)} 
                />
                <div className="m24-sec06-innerlbl">{"人月）"}</div>
              </div>
            </td>
            <td className="m24-sec06-ttl3">経費</td>
            <td className="m24-sec06-val3">
              <div className="m24-sec06-val3-frame">
                <InputNumber 
                  name="planned_expenses_cost" 
                  id="planned_expenses_cost" 
                  maxLength="10"
                  className="m24-planned_expenses_cost"
                  toValue={toStr(data.prj.planned_expenses_cost)}
                  procChange={handleChangeBudget}
                />
                <div className="m24-sec06-innerlbl">円</div>
              </div>
            </td>
          </tr>
        </table>

        {/* セクション７ */}
        <table className="m24-sec07">
          <tr>
            <td className="m24-sec07-ttl">作業場所</td>
            <td className="m24-sec07-val">
              <div className="m24-sec07-val-frame">
                <div onChange={(e) => handleChange(e.target.name, e.target.value)}>
                  <label className="m24-sec07-radiolabel1">
                    <input 
                      type="radio" 
                      name="work_place_kbn" 
                      value="自社内" 
                      checked={toStr(data.prj.work_place_kbn)==="自社内"} 
                    />
                    <span>自社内</span>
                  </label>
                  <label className="m24-sec07-radiolabel2">
                    <input 
                      type="radio" 
                      name="work_place_kbn" 
                      value="他社" 
                      checked={toStr(data.prj.work_place_kbn)==="他社"} 
                    />
                    <span>社外：</span>
                  </label>
                </div>
                <input 
                  type="text" 
                  name="work_place"
                  id="work_place"
                  maxLength="35"
                  className="m24-work_place" 
                  onChange={(e) => handleChange(e.target.name, e.target.value)} 
                  value={toStr(data.prj.work_place)} 
                />
              </div>
            </td>
          </tr>
        </table>

        {/* セクション８ */}
        <table className="m24-sec08">
          <tr>
            <td className="m24-sec08-ttl1">顧客所有物</td>
            <td className="m24-sec08-val11">
              <div className="m24-sec08-val11-frame" onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="m24-sec08-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_property_kbn" 
                    value="無" 
                    checked={toStr(data.prj.customer_property_kbn)==="無"} 
                  />
                  <span>無</span>
                </label>
                <label className="m24-sec08-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_property_kbn" 
                    value="有" 
                    checked={toStr(data.prj.customer_property_kbn)==="有"} 
                  />
                  <span>有</span>
                </label>
              </div>
            </td>
            <td className="m24-sec08-val12">
              <input 
                type="text" 
                name="customer_property"
                id="customer_property"
                maxLength="25"
                className="m24-customer_property" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={toStr(data.prj.customer_property)} 
              />
            </td>
            <td className="m24-sec08-ttl2">顧客環境</td>
            <td className="m24-sec08-val2">
              <div className="m24-sec08-val2-frame" onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="m24-sec08-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_environment" 
                    value="無" 
                    checked={toStr(data.prj.customer_environment)==="無"} 
                  />
                  <span>無</span>
                </label>
                <label className="m24-sec08-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_environment" 
                    value="有" 
                    checked={toStr(data.prj.customer_environment)==="有"} 
                  />
                  <span>有</span>
                </label>
              </div>
            </td>
          </tr>
        </table>

        {/* セクション９ */}
        <table className="m24-sec09">
          <tr>
            <td className="m24-sec09-ttl">仕入品</td>
            <td className="m24-sec09-val1">
              <div className="m24-sec09-val1-frame" onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="m24-sec09-radiolabel">
                  <input 
                    type="radio" 
                    name="purchasing_goods_kbn" 
                    value="無" 
                    checked={toStr(data.prj.purchasing_goods_kbn)==="無"} 
                  />
                  <span>無</span>
                </label>
                <label className="m24-sec09-radiolabel">
                  <input 
                    type="radio" 
                    name="purchasing_goods_kbn" 
                    value="有" 
                    checked={toStr(data.prj.purchasing_goods_kbn)==="有"} 
                  />
                  <span>有</span>
                </label>
              </div>
            </td>
            <td className="m24-sec09-val2">
              <input 
                type="text" 
                name="purchasing_goods"
                id="purchasing_goods"
                maxLength="40"
                className="m24-purchasing_goods" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={toStr(data.prj.purchasing_goods)} 
              />
            </td>
          </tr>
          <tr>
            <td className="m24-sec09-ttl">外部委託</td>
            <td className="m24-sec09-val1">
              <div className="m24-sec09-val1-frame" onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="m24-sec09-radiolabel">
                  <input 
                    type="radio" 
                    name="outsourcing_kbn" 
                    value="無" 
                    checked={toStr(data.prj.outsourcing_kbn)==="無"} 
                  />
                  <span>無</span>
                </label>
                <label className="m24-sec09-radiolabel">
                  <input 
                    type="radio" 
                    name="outsourcing_kbn" 
                    value="有" 
                    checked={toStr(data.prj.outsourcing_kbn)==="有"} 
                  />
                  <span>有</span>
                </label>
              </div>
            </td>
            <td className="m24-sec09-val2">
              <input 
                type="text" 
                name="outsourcing"
                id="outsourcing"
                maxLength="40"
                className="m24-outsourcing" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={toStr(data.prj.outsourcing)} 
              />
            </td>
          </tr>
        </table>

        {/* セクション１０ */}
        <table className="m24-sec10">
          <tr>
            <td className="m24-sec10-ttl1">顧客要求仕様書</td>
            <td className="m24-sec10-val1">
              <div className="m24-sec10-val1-frame" onChange={(e) => handleChange(e.target.name, e.target.value)}>
                <label className="m24-sec10-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_requirement_kbn" 
                    value="無" 
                    checked={toStr(data.prj.customer_requirement_kbn)==="無"} 
                  />
                  <span>無</span>
                </label>
                <label className="m24-sec10-radiolabel">
                  <input 
                    type="radio" 
                    name="customer_requirement_kbn" 
                    value="有" 
                    checked={toStr(data.prj.customer_requirement_kbn)==="有"} 
                  />
                  <span>有</span>
                </label>
              </div>
            </td>
            <td className="m24-sec10-ttl2">文書名</td>
            <td className="m24-sec10-val2">
              <input 
                type="text" 
                name="customer_requirement"
                id="customer_requirement"
                maxLength="35"
                className="m24-customer_requirement" 
                onChange={(e) => handleChange(e.target.name, e.target.value)} 
                value={toStr(data.prj.customer_requirement)} 
              />
            </td>
          </tr>
        </table>

        {/* セクション１１ */}
        <div className="m24-sec11">
          <div className="m24-sec11-ttl">
            <div className="m24-sec11-ttllabel">受注範囲</div>
            <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddPhase()}>
              <AddCircleIcon fontSize="small"/>
            </IconButton>
          </div>
          <div className="m24-sec11-val">
            <table className="m24-phasetbl">
              <thead>
                <tr className="m24-phase-hdtr">
                  <td className="m24-phase-name-td m24-phase-th">工程</td>
                  <td className="m24-phase-period-td m24-phase-th">開始予定</td>
                  <td className="m24-phase-period-td m24-phase-th">終了予定</td>
                  <td className="m24-phase-deliverables-td m24-phase-th">成果物</td>
                  <td className="m24-phase-criteria-td m24-phase-th">合否判定基準</td>
                  <td className="m24-phase-del-td m24-phase-th">削除</td>
                </tr>
              </thead>
              <tbody>
                {data.phases ? (
                  data.phases.map((p,i) =>
                    <tr key={"phase-" + i} className="m24-phase-bdtr">
                      <td className={'m24-phase-name-td ' + (p.del ? 'm24-delete' : '')}>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          maxLength="20"
                          className={'m24-phase-name ' + (p.del ? 'm24-delete' : '')} 
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)} 
                          value={toStr(p.name)} 
                        />
                      </td>
                      <td className={'m24-phase-period-td ' + (p.del ? 'm24-delete' : '')}>
                        <CustomDatePicker 
                          selected={toStr(p.planned_periodfr)} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'m24-date ' + (p.del ? 'm24-delete' : '')}
                          onChange={handleChangePhase}
                          name="planned_periodfr"
                          index={i}
                        />
                      </td>
                      <td className={'m24-phase-period-td ' + (p.del ? 'm24-delete' : '')}>
                        <CustomDatePicker 
                          selected={toStr(p.planned_periodto)} 
                          dateFormat="yyyy年MM月dd日" 
                          className={'m24-date ' + (p.del ? 'm24-delete' : '')}
                          onChange={handleChangePhase}
                          name="planned_periodto"
                          index={i}
                        />
                      </td>
                      <td className={'m24-phase-deliverables-td ' + (p.del ? 'm24-delete' : '')}>
                        <textarea 
                          name="deliverables" 
                          id="deliverables" 
                          className={'m24-phase-deliverables ' + (p.del ? 'm24-delete' : '')}
                          maxLength="50"
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)}
                          value={toStr(p.deliverables)}
                        />
                      </td>
                      <td className={'m24-phase-criteria-td ' + (p.del ? 'm24-delete' : '')}>
                        <textarea 
                          name="criteria" 
                          id="criteria" 
                          className={'m24-phase-criteria ' + (p.del ? 'm24-delete' : '')}
                          maxLength="50"
                          onChange={(e) => handleChangePhase(i, e.target.name, e.target.value)}
                          value={toStr(p.criteria)}
                        />
                      </td>
                      <td className="m24-phase-del-td">
                        <input 
                          type="checkbox"
                          name="phase-del"
                          id="phase-del"
                          checked={p.del || false}
                          onChange={(e) => hancleChangePhaseDel(i,e)}
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

        {/* セクション１２ */}
        <div className="m24-sec12">
          <div className="m24-sec12-ttl">
            {"リスク"}
            <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddRisk()}>
              <AddCircleIcon fontSize="small"/>
            </IconButton>
          </div>
          <div className="m24-sec12-val">
            <table className="m24-risktbl">
              <tbody>
                {data.risks ? (
                  data.risks.map((r,i) => 
                    <tr key={"risk-" + i}>
                      <td className={'m24-risk-contents-td ' + (r.del ? 'm24-delete' : '')}>
                        <textarea 
                          name="contents" 
                          id="contents" 
                          className={'m24-risk-contents ' + (r.del ? 'm24-delete' : '')}
                          maxLength="100"
                          onChange={(e) => handleChangeRisk(i, e.target.name, e.target.value)}
                          value={toStr(r.contents)}
                        />
                      </td>
                      <td className="m24-risk-del-td">
                        <input 
                          type="checkbox"
                          name="risk-del"
                          id="risk-del"
                          checked={r.del || false}
                          onChange={(e) => hancleChangeRiskDel(i,e)}
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

        {/* セクション１３ */}
        <div className="m24-sec13">
          <div className="m24-sec13-ttl">
            {"品質目標"}
            <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddGoal()}>
              <AddCircleIcon fontSize="small"/>
            </IconButton>
          </div>
          <div className="m24-sec13-val">
            <table className="m24-goaltbl">
              <tbody>
                {data.goals ? (
                  data.goals.map((g,i) => 
                  <tr key={"goal-" + i}>
                    <td className={'m24-goal-contents-td ' + (g.del ? 'm24-delete' : '')}>
                      <textarea 
                        name="contents" 
                        id="contents" 
                        className={'m24-goal-contents ' + (g.del ? 'm24-delete' : '')}
                        maxLength="100"
                        onChange={(e) => handleChangeGoal(i, e.target.name, e.target.value)}
                        value={toStr(g.contents)}
                      />
                    </td>
                    <td className="m24-goal-del-td">
                      <input 
                          type="checkbox"
                          name="goal-del"
                          id="goal-del"
                        checked={g.del || false}
                        onChange={(e) => hancleChangeGoalDel(i,e)}
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

        {/* セクション１４ */}
        <div className="m24-sec14">
          <table className="m24-sec14-tbl">
            <tbody>
              <tr>
                <td className="m24-sec14-ttl-td" rowSpan="2">開発体制</td>
                <td className="m24-sec14-subttl-td">プロジェクトリーダー</td>
                <td className="m24-sec14-val-td">
                  <SelectEmployee
                    name="pl_id" 
                    value={toStr(data.prj.pl_id)} 
                    setValue={handleChange}
                    width={100}
                    height={20}
                    border="0.5px solid #aaa"
                  />
                </td>
              </tr>
              <tr>
                <td className="m24-sec14-subttl-td">
                  {"プロジェクトメンバー"}
                  <IconButton aria-label="Add" color="primary" size="small" onClick={() => handleAddMem()}>
                    <AddCircleIcon fontSize="small"/>
                  </IconButton>
                </td>
                <td className="m24-sec14-val-td">
                  {data.mems ? (
                    data.mems.map((m, i) => 
                      <>
                        {m.del ? (
                          <Chip
                            label={toStr(m.member_name)}
                            color="error"
                            size="small"
                            sx={{fontSize: 11, fontFamily: 'sans-serif'}}
                            deleteIcon={<DoneIcon />}
                            onDelete={() => handleDelMem(i,false)}
                          />
                        ) : (
                          <Chip
                            label={toStr(m.member_name)}
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* セクション１５ */}
        <table className="m24-sec15">
          <tbody>
            <tr>
              <td className="m24-sec15-ttl-td">特記事項</td>
              <td className="m24-sec15-val-td">
                <textarea 
                  name="remarks" 
                  id="remarks" 
                  className="m24-remarks"
                  maxLength="300"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={toStr(data.prj.remarks)}
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <MemAddPage showFlg={showAddMem} handleOK={handleAddMemOK} handleClose={handleAddMemCancel} />
      <ModalConfirm confirm={updateConfirm} handleOk={handleUpdateOK} handleCancel={handleUpdateCancel} />
      <ModalConfirm confirm={submitConfirm} handleOk={handleSubmitOk} handleCancel={handleSubmitCancel} />
      <LogEditPage showFlg={showLogEdit} log={data.log} handleChange={handleChangeLog} handleOK={handleModifyOK} handleCancel={handleModifyCancel} />
    </div>
  );
}

export default PrjUpdatePage;
