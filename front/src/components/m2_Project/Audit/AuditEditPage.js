// m29
import './AuditEditPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAudits, updateAudits } from '../../../lib/api/audit';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CustomDatePicker from "../../common/customDatePicker";
import SelectEmployee from "../../common/SelectEmployee";
import ModalConfirm from '../../common/ModalConfirm';
import { isEmpty } from '../../../lib/common/isEmpty';

const AuditEditPage = (props) => {
  const { prjId, kbn } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      handleGetAudits();
    }
  },[prjId]);

  // 監査情報取得
  const handleGetAudits = async () => {
    try {
      const res = await getAudits(Number(prjId), kbn);
      const tmpAudits = res.data.audits.map(audit => {
        const tmpAudit = {};
        tmpAudit.id = audit.id;
        tmpAudit.project_id = audit.project_id;
        tmpAudit.kinds = audit.kinds;
        tmpAudit.number = audit.number;
        tmpAudit.auditor_id = audit.auditor_id;
        tmpAudit.audit_date = audit.audit_date;
        tmpAudit.title = audit.title;
        tmpAudit.contents = audit.contents;
        tmpAudit.result = audit.result;
        tmpAudit.accept_id = audit.accept_id;
        tmpAudit.accept_date = audit.accept_date;
        tmpAudit.del = "";
        return tmpAudit;
      });
      setData({
        ...data,
        audits: tmpAudits,
        prj: {status: ""},
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "監査情報取得エラー"});
    }
  }

  // 監査情報追加ボタン押下時の処理
  const handleAddAudit = () => {
    setData({
      ...data,
      audits: [...data.audits,
              {id: "",
                project_id: "",
                kinds: kbn,
                number: "",
                auditor_id: "",
                audit_date: null,
                title: "",
                contents: "",
                result: "",
                accept_id: "",
                accept_date: null,
                del: ""
              }
      ],
    });
  }

  // 項目入力時の処理
  const handleChange = (i, name, value) => {
    const tmpAudits = [...data.audits];
    tmpAudits[i][name] = value;
    setData({
      ...data,
      audits: tmpAudits,
    });
  }

  // 監査情報削除チェックボックス変更時の処理
  const handleChangeDel = (i, e) => {
    const tmpAudits = [...data.audits];
    tmpAudits[i]["del"] = e.target.checked;
    setData({
      ...data,
      audits: tmpAudits,
    });
  }

  // 監査差戻ボタン押下時の処理
  const handleDisapproval = async (e) => {
    const tmpPrj = {...data.prj};
    if(kbn==="plan"){
      tmpPrj["status"] = "計画書差戻";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト計画書を差し戻します。よろしいですか？",
        tag: "",
      });
    } else {
      tmpPrj["status"] = "完了報告書差戻";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト完了報告書を差し戻します。よろしいですか？",
        tag: "",
      });
    }
    setData({
      ...data,
      prj: tmpPrj,
    });
  }

  // 監査承認ボタン押下時の処理
  const handleApproval = async (e) => {
    const tmpPrj = {...data.prj};
    if(kbn==="plan"){
      tmpPrj["status"] = "PJ推進中";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト計画書を承認します。よろしいですか？",
        tag: "",
      });
    } else {
      tmpPrj["status"] = "完了";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト完了報告書を承認します。よろしいですか？",
        tag: "",
      });
    }
    setData({
      ...data,
      prj: tmpPrj,
    });
  }

  // 一時保存ボタン押下時の処理
  const handleUpdate = async (e) => {
    setConfirm({
      ...confirm,
      msg: "この内容で一時保存します。よろしいですか？",
      tag: "upd",
    });
  }

  // 監査登録確認OKボタン押下時の処理
  const handleConfirmOK = async (tag) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateAudits(prjId, data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "監査情報更新エラー(500)"});
      } else {
        if (tag !== "upd") {
          // 一時保存以外の場合は一覧に遷移
          navigate(`/prj`);
        }
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "監査情報更新エラー"});
    }
  }

  // 監査登録確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    const tmpPrj = {...data.prj};
    tmpPrj["status"] = "";
    setData({
      ...data,
      prj: tmpPrj,
    });
    setConfirm({
      ...confirm,
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
    <div className="m29-container">
      <div className="m29-header-title">監査記録</div>
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      <Button 
        size="small" 
        variant="contained" 
        endIcon={<ThumbDownAltIcon />} 
        onClick={(e) => handleDisapproval(e)}
        style={{marginLeft:10}}
      >
        差し戻し
      </Button>

      <Button 
        size="small" 
        variant="contained" 
        endIcon={<ThumbUpAltIcon />} 
        onClick={(e) => handleApproval(e)}
        style={{marginLeft:10}}
      >
        承認
      </Button>

      <Button 
        size="small"
        variant="contained" 
        endIcon={<SaveAltIcon />} 
        onClick={(e) => handleUpdate(e)}
        style={{marginLeft:10}}
      >
        一時保存
      </Button>

      <table className="m29-table-hd">
        <thead>
          <tr>
            <td className="m29-title-td m29-th">項目</td>
            <td className="m29-contents-td m29-th">指摘内容</td>
            <td className="m29-audit-td m29-th">監査日・担当者</td>
            <td colSpan="2" className="m29-th">再確認</td>
            <td className="m29-del-td m29-th">削除</td>
          </tr>
        </thead>
      </table>
      <div className="m29-table-frame">
        <table className="m29-table">
          <tbody>
            {data.audits ? (
              data.audits.map((a, i) => 
              <>
                <tr key={"audit-" + i}>
                  <td rowSpan="2" className={'m29-title-td ' + (a.del ? 'm29-delete' : '')}>
                    <input 
                      type="text" 
                      name="title" 
                      id="title" 
                      maxLength="10"
                      className={'m29-title ' + (a.del ? 'm29-delete' : '')} 
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)} 
                      value={toStr(a.title)} 
                    />
                  </td>
                  <td rowSpan="2" className={'m29-contents-td ' + (a.del ? 'm29-delete' : '')}>
                    <textarea 
                      name="contents" 
                      id="contents" 
                      className={'m29-contents ' + (a.del ? 'm29-delete' : '')}
                      maxLength="50"
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)}
                      value={toStr(a.contents)}
                    />
                  </td>
                  <td className={'m29-audit-td ' + (a.del ? 'm29-delete' : '')}>
                    <CustomDatePicker 
                      selected={toStr(a.audit_date)} 
                      dateFormat="yyyy年MM月dd日" 
                      className={'m29-date ' + (a.del ? 'm29-delete' : '')}
                      onChange={handleChange}
                      name="audit_date"
                      index={i}
                    />
                  </td>
                  <td rowSpan="2" className={'m29-result-td ' + (a.del ? 'm29-delete' : '')}>
                    <select 
                      name="result"
                      id="result"
                      className={'m29-result ' + (a.del ? 'm29-delete' : '')}
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)}
                      value={toStr(a.result)}
                    >
                      <option key={"result-" + i + "-none"} value=""></option>
                      <option key={"result-" + i + "-ng"} value="NG">NG</option>
                      <option key={"result-" + i + "-ok"} value="OK">OK</option>
                    </select>
                  </td>
                  <td className={'m29-accept-td ' + (a.del ? 'm29-delete' : '')}>
                    <CustomDatePicker 
                      selected={toStr(a.accept_date)} 
                      dateFormat="yyyy年MM月dd日" 
                      className={'m29-date ' + (a.del ? 'm29-delete' : '')}
                      onChange={handleChange}
                      name="accept_date"
                      index={i}
                    />
                  </td>
                  <td rowSpan="2" className="m29-del-td">
                    <input 
                      type="checkbox"
                      name="del-check"
                      id="del-check"
                      value="del-check"
                      checked={a.del || false}
                      onChange={(e) => handleChangeDel(i,e)}
                    />
                  </td>
                </tr>
                <tr key={"audit-" + i + "a"}>
                  <td className={'m29-audit-td ' + (a.del ? 'm29-delete' : '')}>
                    <SelectEmployee
                      name="auditor_id" 
                      value={toStr(a.auditor_id)} 
                      setValue={handleChange}
                      index={i}
                      width={100}
                      height={20}
                      border="0.5px solid #aaa"
                    />
                  </td>
                  <td className={'m29-accept-td ' + (a.del ? 'm29-delete' : '')}>
                    <SelectEmployee
                      name="accept_id" 
                      value={toStr(a.accept_id)} 
                      setValue={handleChange}
                      index={i}
                      width={100}
                      height={20}
                      border="0.5px solid #aaa"
                    />
                  </td>
                </tr>                
              </>
              )
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
          
      <div className="m29-button-area">
        <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAddAudit()}>
          <AddCircleIcon sx={{ fontSize : 40 }} />
        </IconButton>
      </div>

      <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />

    </div>
  );
}

export default AuditEditPage;