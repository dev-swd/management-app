import "./DailyWorkShowPage.css";
import { useEffect, useState } from 'react';
import { isEmptyNum } from '../../../lib/common/numberCom';
import { formatTime } from "../../../lib/common/timetostr";
import { getWorkReps } from '../../../lib/api/daily';
import { displayDate } from '../../../lib/common/datetostr';

const DailyWorkShowPage = (props) => {
  const {dailyInfo, setMessage, setMessageVar } = props;
  const [data, setData] = useState([]);
  const [preSum, setPreSum] = useState("");
  const [overSum, setOverSum] = useState("");

  useEffect(() => {
    if(!isEmptyNum(dailyInfo.id)){
      handleGetWorkReports(dailyInfo.id);
      setPreSum(formatTime(dailyInfo.prescribed_h,dailyInfo.prescribed_m));
      setOverSum(formatTime(dailyInfo.over_h,dailyInfo.over_m));
    } else {
      setData([]);
    }

  },[dailyInfo]);

  const handleGetWorkReports = async (id) => {
    try {
      const res = await getWorkReps(Number(id));
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
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  return (
    <div className="work-show-container">

      <div className="daily-date">{displayDate(dailyInfo.date)}</div>

      <div className="summary-area">
        <div className="header-td">所定時間</div>
        <div>{preSum}</div>
        <div className="header-td">時間外</div>
        <div>{overSum}</div>
      </div>

      <table className="work-table-hd">
        <thead>
          <tr className="header-tr">
            <td className="header-td prj-td">プロジェクト</td>
            <td className="header-td phase-td">工程</td>
            <td className="header-td task-td">タスク</td>
            <td className="header-td time-td">所定時間</td>
            <td className="header-td time-td">時間外</td>
            <td className="header-td comments-td">備考</td>
          </tr>
        </thead>
      </table>

      <div className="table-frame">
        <table className="work-table">
          <tbody>
            {data.workreports ? (
              data.workreports.map((report, i) => 
              <>
                <tr key={"work-" + i} className="body-tr">
                  <td className="prj-td">{report.project_name}</td>
                  <td className="phase-td">{report.phase_name}</td>
                  <td className="task-td">{report.task_name}</td>
                  <td className="time-td">{formatTime(report.hour,report.minute)}</td>
                  <td className="time-td">{formatTime(report.over_h,report.over_m)}</td>
                  <td className="comments-td">{report.comments || ''}</td>
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