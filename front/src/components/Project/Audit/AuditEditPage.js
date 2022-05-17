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

const AuditEditPage = (props) => {
  const { prj_id, kbn } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAudits(prj_id);
  },[prj_id]);

  const handleGetAudits = async (id) => {
    try {
      const res = await getAudits(Number(id), kbn);
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
      setMessage("監査情報取得エラー");
      setMessageVar("error");
    }
  }

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

  const handleChange = (i, name, value) => {
    const tmpAudits = [...data.audits];
    tmpAudits[i][name] = value;
    setData({
      ...data,
      audits: tmpAudits,
    });
  }

  const handleDelCheckAudit = (i, e) => {
    const tmpAudits = [...data.audits];
    tmpAudits[i]["del"] = e.target.checked;
    setData({
      ...data,
      audits: tmpAudits,
    });
  }

  const handleDisapproval = async (e) => {
    e.preventDefault();
    const tmpPrj = {...data.prj};
    if(kbn==="plan"){
      tmpPrj["status"] = "計画書差戻";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト計画書を差し戻します。よろしいですか？",
        tag: "",
      })
      } else {
      tmpPrj["status"] = "完了報告書差戻";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト完了報告書を差し戻します。よろしいですか？",
        tag: "",
      })
      }
    setData({
      ...data,
      prj: tmpPrj,
    });
  }

  const handleApproval = async (e) => {
    e.preventDefault();
    const tmpPrj = {...data.prj};
    if(kbn==="plan"){
      tmpPrj["status"] = "PJ推進中";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト計画書を承認します。よろしいですか？",
        tag: "",
      })
    } else {
      tmpPrj["status"] = "完了";
      setConfirm({
        ...confirm,
        msg: "この内容でプロジェクト完了報告書を承認します。よろしいですか？",
        tag: "",
      })
    }
    setData({
      ...data,
      prj: tmpPrj,
    });
  }

  const handleConfirmOK = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateAudits(prj_id, data)
      if (res.data.status === 500) {
        setMessage("監査情報更新エラー(500)");
        setMessageVar("error");
      } else {
        navigate(`/prj`);
      }
    } catch (e) {
      setMessage("監査情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleCofirmCancel = () => {
    setData({
      ...data,
      status: "",
    });
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAudits(prj_id, data)
      if (res.data.status === 500) {
        setMessage("監査情報更新エラー(500)");
        setMessageVar("error");
      } else {
        handleGetAudits(prj_id);
      }
    } catch (e) {
      setMessage("監査情報更新エラー");
      setMessageVar("error");
    }
  }

  return (
    <div className="audit-edit-container">
      <div className="header-area">
        <div className="header-title">監査記録</div>
      </div>
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <div className="button-area">
        <Button size="small" variant="contained" endIcon={<ThumbDownAltIcon />} onClick={(e) => handleDisapproval(e)}>差し戻し</Button>
        {"　"}
        <Button size="small" variant="contained" endIcon={<ThumbUpAltIcon />} onClick={(e) => handleApproval(e)}>承認</Button>
        {"　"}
        <Button size="small" variant="contained" endIcon={<SaveAltIcon />} onClick={(e) => handleUpdate(e)}>一時保存</Button>
      </div>

      <table className="audit-table-hd">
        <thead>
          <tr className="header-tr">
            <td className="header-td title-td">項目</td>
            <td className="header-td contents-td">指摘内容</td>
            <td className="header-td audit-td">監査日・担当者</td>
            <td colSpan="2" className="header-td accept-td">再確認</td>
            <td className="header-td del-check-td">削除</td>
          </tr>
        </thead>
      </table>
      <div className="table-frame">
        <table className="audit-table">
          <tbody>
            {data.audits ? (
              data.audits.map((audit, i) => 
              <>
                <tr key={"audit-" + i} className="body-tr">
                  <td rowSpan="2" className={'title-td ' + (audit.del ? 'delete' : '')}>
                    <input 
                      type="text" 
                      name="title" 
                      id="title" 
                      maxLength="10"
                      className={'text-base title ' + (audit.del ? 'delete' : '')} 
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)} 
                      value={audit.title || ''} 
                    />
                  </td>
                  <td rowSpan="2" className={'contents-td ' + (audit.del ? 'delete' : '')}>
                    <textarea 
                      name="contents" 
                      id="contents" 
                      className={'text-base contents ' + (audit.del ? 'delete' : '')}
                      maxLength="50"
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)}
                      value={audit.contents || ''}
                    />
                  </td>
                  <td className={'audit-date-td ' + (audit.del ? 'delete' : '')}>
                    <CustomDatePicker 
                      selected={audit.audit_date || ''} 
                      dateFormat="yyyy年MM月dd日" 
                      className={'text-base date-field ' + (audit.del ? 'delete' : '')}
                      onChange={handleChange}
                      name="audit_date"
                      index={i}
                    />
                  </td>
                  <td rowSpan="2" className={'result-td ' + (audit.del ? 'delete' : '')}>
                    <select 
                      name="result"
                      id="result"
                      className={'text-base result ' + (audit.del ? 'delete' : '')}
                      onChange={(e) => handleChange(i, e.target.name, e.target.value)}
                      value={audit.result || ''}
                    >
                      <option key={"result-" + i + "-ng"} value="NG">NG</option>
                      <option key={"result-" + i + "-ok"} value="OK">OK</option>
                    </select>
                  </td>
                  <td className={'accept-date-td ' + (audit.del ? 'delete' : '')}>
                    <CustomDatePicker 
                      selected={audit.accept_date || ''} 
                      dateFormat="yyyy年MM月dd日" 
                      className={'text-base date-field ' + (audit.del ? 'delete' : '')}
                      onChange={handleChange}
                      name="accept_date"
                      index={i}
                    />
                  </td>
                  <td rowSpan="2" className="del-check-td">
                    <input 
                      type="checkbox"
                      name="del-check"
                      id="del-check"
                      className="del-check"
                      value="del-check"
                      checked={audit.del || false}
                      onChange={(e) => handleDelCheckAudit(i,e)}
                    />
                  </td>
                </tr>
                <tr key={"audit-" + i + "a"} className="body-tr">
                  <td className={'auditor-id-td ' + (audit.del ? 'delete' : '')}>
                    <SelectEmployee
                      name="auditor_id" 
                      id="auditor_id" 
                      className={'text-base auditor_id ' + (audit.del ? 'delete' : '')}
                      value={audit.auditor_id || ''} 
                      handleChange={handleChange}
                      index={i}
                    />
                  </td>
                  <td className={'accept-id-td ' + (audit.del ? 'delete' : '')}>
                    <SelectEmployee
                      name="accept_id" 
                      id="accept_id" 
                      className={'text-base accept_id ' + (audit.del ? 'delete' : '')} 
                      value={audit.accept_id || ''} 
                      handleChange={handleChange}
                      index={i}
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
          
      <div className="button-area-bottom">
        <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAddAudit()}>
          <AddCircleIcon sx={{ fontSize : 40 }} />
        </IconButton>
      </div>

      <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />

    </div>
  );
}

export default AuditEditPage;