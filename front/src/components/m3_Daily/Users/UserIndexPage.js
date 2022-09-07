// m30
import "./UserIndexPage.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDailyReps, updateStatus } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import UserEditPage from './UserEditPage';
import UserWorkEditPage from './UserWorkEditPage';
import { isEmpty } from "../../../lib/common/isEmpty";

const today = new Date();

const UserIndexPage = () => {
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const months = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
  const day_arr = [ "日", "月", "火", "水", "木", "金", "土" ];
  const [selectVal, setSelectVal] = useState({ year: String(today.getFullYear()), month: ('0' + (today.getMonth()+1)).slice(-2) });
  const [dispVal, setDispVal] = useState({ year: "", month: ""});
  const [dailyId, setDailyId] = useState("");
  const [dailyInfo, setDailyInfo] = useState({});
  const [data, setData] = useState([]);

  // 日報情報取得
  const handleGetDailyReps = async () => {

    // 表示ボタン押下時点の選択値を退避
    setDispVal({
      year: selectVal.year,
      month: selectVal.month,
    });
    try {
      const res = await getDailyReps(empInfo.id, selectVal.year, selectVal.month);
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
    }
  }

  // 検索条件リストボックス選択時の処理
  const handleChangeSelect = (e) => {
    setSelectVal({
      ...selectVal,
      [e.target.name]: e.target.value,
    });
  }

  // 年リストボックスの生成
  const SelectYear = () => {
    var thisYear = today.getFullYear();
    var years=[];
    for (var i=0; i<=5; i++) {
      years[i]=thisYear-5+i;
    }
    return (
      <select 
        id="year-select" 
        name="year"
        value={selectVal.year} 
        className="m30-select-year" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {years.map((year,i) => (
          <option key={"select-y-" + i} value={String(year)}>{year + "年"}</option>
        ))}
      </select>
    );
  }

  // 月リストボックスの生成
  const SelectMonth = () => {
    return (
      <select 
        id="month-select" 
        name="month"
        value={selectVal.month} 
        className="m30-select-month" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {months.map((month,i) => (
          <option key={"select-m-" + i} value={month}>{month + "月"}</option>
        ))}
      </select>
    );
  }

  // 日報一覧の行生成
  const DailyRow = (props) => {
    const {d,i} = props;
    var pd = Date.parse(d.date);
    var dt = new Date(pd);

    // 時刻表示編集
    const formatTime = (h,m) => {
      if (h===undefined || h===null || h==="" || m===undefined || m===null || m==="") {
        return "";
      }
      var hh = ('0' + h).slice(-2);
      var mm = ('0' + m).slice(-2);
      return hh + ":" + mm;
    }

    // 出社時間編集
    const prescribedFrom = () => {
      let prescribed = formatTime(d.prescribed_frh,d.prescribed_frm);
      if(isEmpty(d.late_h)){
        return prescribed;
      } else {
        let late = formatTime(d.late_h,d.late_m);
        if(prescribed<=late){
          return late;
        } else {
          return prescribed;
        }  
      }
    }

    // 退社時間編集
    const prescribedTo = () => {
      let prescribed = formatTime(d.prescribed_toh,d.prescribed_tom);
      if(isEmpty(d.over_toh)){
        return prescribed;
      } else {
        let over = formatTime(d.over_toh,d.over_tom);
        if(prescribed<=over){
          return over;
        } else {
          return prescribed;
        }
      }
    }

    // 遅刻・外出・早退のマーク編集
    const marking = (v) => {
      if (v===undefined || v===null || v==="") {
        return "";
      } else {
        return "●";
      }
    }

    // 勤務日報欄編集
    const setDailyRep = () => {
      if (d.status==="未入力" || d.status==="入力済" || d.status==="承認取消") {
        return (
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => handleDailyEdit(d.id)} >
            入力
          </button>
        );
      } else {
        return "入力済";
      }
    }

    // 作業日報欄編集
    const setWorkRep = () => {
      if (d.status==="未入力") {
        return "";
      } else if(d.status==="入力済" || d.status==="承認取消") {
        return (
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => handleWorkEdit(d)} >
            入力
          </button>
        );
      } else {
        return "入力済";
      }
    }

    // 申請欄編集
    const setRequest = () => {
      if (d.status==="未入力") {
        return (
          <button 
            className="m30-daily-request-btn" 
            type="button" 
            disabled
            >
            申請
          </button>
        );
      } else if (d.status==="入力済" || d.status==="承認取消") {
        if (Number(d.prescribed_h)===Number(d.work_prescribed_h) && Number(d.prescribed_m)===Number(d.work_prescribed_m)
            && Number(d.over_h)===Number(d.work_over_h) && Number(d.over_m)===Number(d.work_over_m)) {
          return (
            <button 
              className="m30-daily-request-btn" 
              type="button" 
              onClick={() => handleRequest(d.id, "申請中")}
              >
              申請
            </button>
          );
        } else {
          return (
            <button 
              className="m30-daily-request-btn" 
              type="button" 
              disabled
              >
              申請
            </button>
          );
        }
      } else if (d.status==="申請中") {
        return (
          <button 
            className="m30-daily-request-btn" 
            type="button" 
            onClick={() => handleRequest(d.id, "入力済")}
            >
            申請取消
          </button>
        );
      } else {
        return "済";
      }
    }

    // アラート欄編集
    const setAlert = () => {
      if (d.status==="入力済" || d.status==="承認取消") {
        if (Number(d.prescribed_h)===Number(d.work_prescribed_h) && Number(d.prescribed_m)===Number(d.work_prescribed_m)
            && Number(d.over_h)===Number(d.work_over_h) && Number(d.over_m)===Number(d.work_over_m)) {
          return "";
        } else {
          return "勤務日報と作業日報の時間が合っていません。";
        }
      } else {
        return "";
      }
    }

    return (
      <tr key={"daily-" + i}>
        <td className="m30-daily-date-td">{('0' + dt.getDate()).slice(-2)}</td>
        <td className="m30-daily-day-td">{day_arr[dt.getDay()]}</td>
        <td className="m30-daily-kbn-td">{d.kbn}</td>
        <td className="m30-daily-time-td">{prescribedFrom()}</td>
        <td className="m30-daily-time-td">{prescribedTo()}</td>
        <td className="m30-daily-mark-td">{marking(d.late_h)}</td>
        <td className="m30-daily-mark-td">{marking(d.goout_frh)}</td>
        <td className="m30-daily-mark-td">{marking(d.early_h)}</td>
        <td className="m30-daily-time-td">{formatTime(d.prescribed_h,d.prescribed_m)}</td>
        <td className="m30-daily-time-td">{formatTime(d.over_h,d.over_m)}</td>
        <td className="m30-daily-time-td">{formatTime(d.midnight_h,d.midnight_m)}</td>
        <td className="m30-daily-status-td">{d.status}</td>
        <td className="m30-daily-link-td">{setDailyRep()}</td>
        <td className="m30-daily-link-td">{setWorkRep()}</td>
        <td className="m30-daily-request-td">{setRequest()}</td>
        <td className="m30-daily-alert-td">{setAlert()}</td>
      </tr>
    );
  }

  // 所定労働時間集計
  const sumPrescribedTime = () => {
    let h = data.dailys.reduce((total,item) => {
      return total + Number(item.prescribed_h);
    },0);
    let m = data.dailys.reduce((total,item) => {
      return total + Number(item.prescribed_m);
    },0);
    let minute = (h * 60 + m) % 60;
    let hour = (h * 60 + m - minute) / 60;
    return hour + ":" + ('0' + minute).slice(-2);
  }

  // 時間外労働時間集計
  const sumOverTime = () => {
    let h = data.dailys.reduce((total,item) => {
      return total + Number(item.over_h);
    },0);
    let m = data.dailys.reduce((total,item) => {
      return total + Number(item.over_m);
    },0);
    let minute = (h * 60 + m) % 60;
    let hour = (h * 60 + m - minute) / 60;
    return hour + ":" + ('0' + minute).slice(-2);
  }

  // 深夜時間集計
  const sumMidnightTime = () => {
    let h = data.dailys.reduce((total,item) => {
      return total + Number(item.midnight_h);
    },0);
    let m = data.dailys.reduce((total,item) => {
      return total + Number(item.midnight_m);
    },0);
    let minute = (h * 60 + m) % 60;
    let hour = (h * 60 + m - minute) / 60;
    return hour + ":" + ('0' + minute).slice(-2);
  }

  // 出社日数集計
  const countDay1 = () => {
    return data.dailys.reduce((total,item) => {
      return total + ((item.kbn==="通常" || item.kbn==="時差" || item.kbn==="休出") ? 1 : 0);
    },0);
  }

  // 休暇日数集計
  const countDay2 = () => {
    return data.dailys.reduce((total,item) => {
      return total + (item.kbn==="休暇" ? 1 : 0);
    },0);
  }

  // 休出日数集計
  const countDay3 = () => {
    return data.dailys.reduce((total,item) => {
      return total + (item.kbn==="休出" ? 1 : 0);
    },0);
  }

  // 遅刻回数集計
  const countLate = () => {
    return data.dailys.reduce((total,item) => {
      return total + (isEmpty(item.late_h) ? 0 : 1);
    },0);
  }

  // 早退回数集計
  const countEarly = () => {
    return data.dailys.reduce((total,item) => {
      return total + (isEmpty(item.late_h) ? 0 : 1);
    },0);
  }

  // 一覧リフレッシュ
  const refreshDailyReps = async () => {
    try {
      const res = await getDailyReps(empInfo.id, dispVal.year, dispVal.month);
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
    }
  }

  // 申請ボタン押下時の処理
  const handleRequest = async (id, status) => {
    try {
      const res = await updateStatus(id, {status: status});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        refreshDailyReps();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
    }
  }

  // 勤務日報リンククリック時の処理
  const handleDailyEdit = (dailyId) => {
    setDailyId(dailyId);
  }

  // 勤務日報画面クローズ時の処理
  const closeDailyEdit = () => {
    setDailyId("");
    refreshDailyReps();
  }

  // 作業日報リンククリック時の処理
  const handleWorkEdit = (daily) => {
    setDailyInfo({id: daily.id, 
      date: daily.date, 
      prescribed_h: daily.prescribed_h, 
      prescribed_m: daily.prescribed_m, 
      over_h: daily.over_h, 
      over_m: daily.over_m});
  }

  // 作業日報画面クローズ時の処理
  const closeWorkEdit = () => {
    setDailyInfo({});
    refreshDailyReps();
  }
  
  // 画面編集
  return (
    <div className="m30-background">
      <div className="m30-container">

        <div className="m30-header-title">勤怠入力</div>

        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m30-search-area">
          <SelectYear />
          <SelectMonth />
          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SearchIcon />} 
            sx={{height:25}}
            onClick={(e) => handleGetDailyReps()}>
            表示
          </Button>
        </div>

        <div className="m30-calendar-area">
          {dispVal.year && dispVal.month ? (
            <div className="m30-yyyymm">
              <div className="m30-yyyy">{dispVal.year}</div>
              <div>年</div>
              <div className="m30-mm">{dispVal.month}</div>
              <div>月</div>
            </div>
          ) : (
            <div className="m30-yyyymm">
              <div className="m30-yyyy"></div>
              <div>年</div>
              <div className="m30-mm"></div>
              <div>月</div>
            </div>
          )}

          <table className="m30-summary">
            <thead>
              <tr>
                <td className="m30-th">所定労働時間</td>
                <td className="m30-th">時間外労働時間</td>
                <td className="m30-th">深夜時間</td>
                <td className="m30-th">出社日数</td>
                <td className="m30-th">休暇日数</td>
                <td className="m30-th">休出日数</td>
                <td className="m30-th">遅刻回数</td>
                <td className="m30-th">早退回数</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.dailys ? sumPrescribedTime() : ""}</td>
                <td>{data.dailys ? sumOverTime() : ""}</td>
                <td>{data.dailys ? sumMidnightTime() : ""}</td>
                <td>{data.dailys ? countDay1() + "日" : ""}</td>
                <td>{data.dailys ? countDay2() + "日" : ""}</td>
                <td>{data.dailys ? countDay3() + "日" : ""}</td>
                <td>{data.dailys ? countLate() + "回" : ""}</td>
                <td>{data.dailys ? countEarly() + "回" : ""}</td>
              </tr>
            </tbody>
          </table>

          <table className="m30-table-hd">
            <thead>
              <tr>
                <td className="m30-th m30-daily-date-td">日付</td>
                <td className="m30-th m30-daily-day-td">曜日</td>
                <td className="m30-th m30-daily-kbn-td">区分</td>
                <td className="m30-th m30-daily-time-td">出社時間</td>
                <td className="m30-th m30-daily-time-td">退社時間</td>
                <td className="m30-th m30-daily-mark-td">遅刻</td>
                <td className="m30-th m30-daily-mark-td">外出</td>
                <td className="m30-th m30-daily-mark-td">早退</td>
                <td className="m30-th m30-daily-time-td">所定時間</td>
                <td className="m30-th m30-daily-time-td">時間外時間</td>
                <td className="m30-th m30-daily-time-td">深夜時間</td>
                <td className="m30-th m30-daily-status-td">状態</td>
                <td className="m30-th m30-daily-link-td">勤務日報</td>
                <td className="m30-th m30-daily-link-td">作業日報</td>
                <td className="m30-th m30-daily-request-td">申請</td>
                <td className="m30-th m30-daily-alert-td"></td>
              </tr>
            </thead>
          </table>

          <div className="m30-frame">
            <table className="m30-table-bd">
              <tbody>
                {data.dailys ? (
                  data.dailys.map((d,i) =>
                    <DailyRow d={d} i={i} key={"daily-" + i}/>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>

          </div>
        </div>

      </div>
      <UserEditPage dailyId={dailyId} closeWin={closeDailyEdit} />
      <UserWorkEditPage dailyInfo={dailyInfo} closeWin={closeWorkEdit} />
    </div>
  )
}

export default UserIndexPage;
