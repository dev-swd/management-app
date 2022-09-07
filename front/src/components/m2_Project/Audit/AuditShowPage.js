// m26
import "./AuditShowPage.css";
import { useEffect, useState } from 'react';
import { getAudits } from '../../../lib/api/audit';
import { formatDateZero } from '../../../lib/common/dateCom';
import Alert from "@mui/material/Alert";
import { isEmpty } from "../../../lib/common/isEmpty";

const AuditShowPage = (props) => {
  const { prjId, kbn } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      handleGetAudits(prjId);
    }
  },[prjId]);

  // 監査情報取得
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
        tmpAudit.audit_date = audit.audit_date;
        tmpAudit.title = audit.title;
        tmpAudit.contents = audit.contents;
        tmpAudit.result = audit.result;
        tmpAudit.accept_name = audit.accept_name;
        tmpAudit.accept_date = audit.accept_date;
        return tmpAudit;
      });
      setData({
        ...data,
        audits: tmpAudits,
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "監査情報取得エラー"});
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

  // 画面編集
  return (
    <div className="m26-container">
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      <table className="m26-table-hd">
        <thead>
          <tr>
            <td className="m26-title-td m26-th">項目</td>
            <td className="m26-contents-td m26-th">指摘内容</td>
            <td className="m26-audit-td m26-th">監査日・担当者</td>
            <td colSpan="2" className="m26-th">再確認</td>
          </tr>
        </thead>
      </table>

      <div className="m26-table-frame">
        <table className="m26-table">
          <tbody>
            {data.audits ? (
              data.audits.map((a, i) => 
              <>
                <tr key={"audit-" + i}>
                  <td rowSpan="2" className="m26-title-td">{toStr(a.title)} </td>
                  <td rowSpan="2" className="m26-contents-td">{toStr(a.contents)}</td>
                  <td className="m26-audit-td">{formatDateZero(a.audit_date, "YYYY年MM月DD日")}</td>
                  <td rowSpan="2" className="m26-result-td">{toStr(a.result)}</td>
                  <td className="m26-accept-td">{formatDateZero(a.accept_date, "YYYY年MM月DD日")}</td>
                </tr>
                <tr key={"audit-" + i + "a"}>
                  <td className="m26-audit-td">{toStr(a.auditor_name)}</td>
                  <td className="m26-accept-td">{toStr(a.accept_name)}</td>
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