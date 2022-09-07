// m2d
import './LogShowPage.css';
import { useEffect, useState } from 'react';
import { getChangelogs } from '../../../lib/api/changelog';
import { formatDateZero } from '../../../lib/common/dateCom';
import Alert from "@mui/material/Alert";
import { isEmpty } from '../../../lib/common/isEmpty';

const LogShowPage = (props) => {
  const { prjId } = props;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      handleGetLogs(prjId);
    }
  },[prjId]);

  // 変更履歴情報取得
  const handleGetLogs = async () => {
    try {
      const res = await getChangelogs(Number(prjId));
      const tmpLogs = res.data.changelogs.map(log => {
        const tmpLog = {};
        tmpLog.changer_name = log.changer_name;
        tmpLog.change_date = log.change_date;
        tmpLog.contents = log.contents;
        return tmpLog;
      });
      setData({
        ...data,
        logs: tmpLogs,
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "変更履歴取得エラー"});
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

    <div className="m2d-container">
      { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

      <table className="m2d-table-hd">
        <thead>
          <tr>
            <td className="m2d-date-td m2d-th">変更日</td>
            <td className="m2d-name-td m2d-th">変更者</td>
            <td className="m2d-contents-th m2d-th">変更概要</td>
          </tr>
        </thead>
      </table>

      <div className="m2d-table-frame">
        <table className="m2d-table">
          <tbody>
            {data.logs ? (
              data.logs.map((l, i) => 
                <tr key={"log-" + i}>
                  <td className="m2d-date-td">{formatDateZero(l.change_date, "YYYY年MM月DD日")}</td>
                  <td className="m2d-name-td">{toStr(l.changer_name)}</td>
                  <td className="m2d-contents-td">{toStr(l.contents)}</td>
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