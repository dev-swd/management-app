// m37
import "./DailyWorkShowPage.css";
import { useEffect, useState } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { formatTime } from "../../../lib/common/timeCom";
import { getWorkReps } from '../../../lib/api/daily';
import { formatDateZero } from '../../../lib/common/dateCom';

const DailyWorkShowPage = (props) => {
  const {dailyInfo, setMessage } = props;
  const [data, setData] = useState([]);
  const [preSum, setPreSum] = useState("");
  const [overSum, setOverSum] = useState("");

  // 初期処理
  useEffect(() => {
    if(!isEmpty(dailyInfo.id)){
      handleGetWorkReports();
      setPreSum(formatTime(dailyInfo.prescribed_h,dailyInfo.prescribed_m));
      setOverSum(formatTime(dailyInfo.over_h,dailyInfo.over_m));
    } else {
      setData([]);
    }
  },[dailyInfo]);

  // 作業日報取得
  const handleGetWorkReports = async () => {
    try {
      const res = await getWorkReps(Number(dailyInfo.id));
      const tmpWorkReports = res.data.workreports.map(report => {
        const tmpReport = {};
        tmpReport.id = report.id;
        tmpReport.project_name = report.project_name;
        tmpReport.phase_name = report.phase_name;
        tmpReport.task_name = report.task_name;
        tmpReport.hour = report.hour;
        tmpReport.minute = report.minute;
        tmpReport.over_h = report.over_h;
        tmpReport.over_m = report.over_m;
        tmpReport.comments = report.comments;
        return tmpReport;
      });
      setData({
        ...data,
        workreports: tmpWorkReports
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
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
    <div className="m37-container">

      <div className="m37-date">{formatDateZero(dailyInfo.date, "YYYY年MM月DD日")}</div>

      <table className="m37-summary">
        <tbody>
          <tr>
            <td className="m37-th">所定時間</td>
            <td>{preSum}</td>
            <td className="m37-th">時間外</td>
            <td>{overSum}</td>
          </tr>
        </tbody>
      </table>

      <table className="m37-table-hd">
        <thead>
          <tr>
            <td className="m37-th m37-prj-td">プロジェクト</td>
            <td className="m37-th m37-phase-td">工程</td>
            <td className="m37-th m37-task-td">タスク</td>
            <td className="m37-th m37-time-td">所定時間</td>
            <td className="m37-th m37-time-td">時間外</td>
            <td className="m37-th m37-comments-td">備考</td>
          </tr>
        </thead>
      </table>

      <div className="m37-frame">
        <table className="m37-table-bd">
          <tbody>
            {data.workreports ? (
              data.workreports.map((report, i) => 
              <>
                <tr key={"work-" + i}>
                  <td className="m37-prj-td">{toStr(report.project_name)}</td>
                  <td className="m37-phase-td">{toStr(report.phase_name)}</td>
                  <td className="m37-task-td">{toStr(report.task_name)}</td>
                  <td className="m37-time-td">{formatTime(report.hour,report.minute)}</td>
                  <td className="m37-time-td">{formatTime(report.over_h,report.over_m)}</td>
                  <td className="m37-comments-td">{toStr(report.comments)}</td>
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
  );
}
export default DailyWorkShowPage;