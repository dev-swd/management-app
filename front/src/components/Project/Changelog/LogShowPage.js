import './LogShowPage.css';
import { useEffect, useState } from 'react';
import { getChangelogs } from '../../../lib/api/changelog';
import { toDate } from "../../../lib/common/ToDate";
import { displayDate } from '../../../lib/common/datotostr';
import Alert from "@mui/material/Alert";

const LogShowPage = (props) => {
  const { prj_id } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  useEffect(() => {
    handleGetLogs(prj_id);
  },[prj_id]);

  const handleGetLogs = async (id) => {
    try {
      const res = await getChangelogs(Number(id));
      const tmpLogs = res.data.changelogs.map(log => {
        const tmpLog = {};
        tmpLog.changer_name = log.changer_name;
        tmpLog.change_date = toDate(log.change_date);
        tmpLog.contents = log.contents;
        return tmpLog;
      });
      setData({
        ...data,
        logs: tmpLogs,
      });
    } catch (e) {
      setMessage("変更履歴取得エラー");
      setMessageVar("error");
    }
  }

  return (

    <div className="prj-log-container">
      { message_var && <Alert severity={message_var}>{message}</Alert>}

      <table className="log-table-hd">
        <thead>
          <tr className="header-tr">
            <td className="change-date-td-hd">変更日</td>
            <td className="changer-name-td-hd">変更者</td>
            <td className="contents-td-hd">変更概要</td>
          </tr>
        </thead>
      </table>

      <div className="table-frame">
        <table className="log-table">
          <tbody>
            {data.logs ? (
              data.logs.map((log, i) => 
                <tr key={"log-" + i} className="body-tr">
                  <td className="change-date-td">{displayDate(log.change_date || '')}</td>
                  <td className="changer-name-td">{log.changer_name || ''}</td>
                  <td className="contents-td">{log.contents || ''}</td>
                </tr>
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

export default LogShowPage;