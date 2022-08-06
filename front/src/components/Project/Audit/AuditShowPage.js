import "./AuditShowPage.css";
import { useEffect, useState } from 'react';
import { getAudits } from '../../../lib/api/audit';
import { toDate } from "../../../lib/common/ToDate";
import { displayDate } from '../../../lib/common/datetostr';
import Alert from "@mui/material/Alert";

const AuditShowPage = (props) => {
  const { prj_id, kbn } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

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
        tmpAudit.auditor_name = audit.auditor_name;
        tmpAudit.audit_date = toDate(audit.audit_date);
        tmpAudit.title = audit.title;
        tmpAudit.contents = audit.contents;
        tmpAudit.result = audit.result;
        tmpAudit.accept_name = audit.accept_name;
        tmpAudit.accept_date = toDate(audit.accept_date);
        return tmpAudit;
      });
      setData({
        ...data,
        audits: tmpAudits,
      });
    } catch (e) {
      setMessage("監査情報取得エラー");
      setMessageVar("error");
    }
  }

  return (

    <div className="audit-show-container">
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <table className="audit-table-hd">
          <thead>
            <tr className="header-tr">
              <td className="title-td-hd">項目</td>
              <td className="contents-td-hd">指摘内容</td>
              <td className="audit-td-hd">監査日・担当者</td>
              <td colSpan="2" className="accept-td-hd">再確認</td>
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
                    <td rowSpan="2" className="title-td">{audit.title || ''} </td>
                    <td rowSpan="2" className="contents-td">{audit.contents || ''}</td>
                    <td className="audit-td">{displayDate(audit.audit_date || '')}</td>
                    <td rowSpan="2" className="result-td">{audit.result || ''}</td>
                    <td className="accept-td">{displayDate(audit.accept_date || '')}</td>
                  </tr>
                  <tr key={"audit-" + i + "a"} className="body-tr">
                    <td className="audit-td">{audit.auditor_name || ''}</td>
                    <td className="accept-td">{audit.accept_name || ''}</td>
                  </tr>                
                </>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>

    </div>
  )
}

export default AuditShowPage;