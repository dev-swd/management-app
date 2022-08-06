import "./UserIndexPage.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDailyReps, updateStatus } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import UserEditPage from './UserEditPage';
import UserWorkEditPage from './UserWorkEditPage';
import { isEmptyNum } from "../../../lib/common/numberCom";

const today = new Date();

const UserIndexPage = () => {
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const months = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
  const day_arr = [ "日", "月", "火", "水", "木", "金", "土" ];
  const [selectVal, setSelectVal] = useState({ year: String(today.getFullYear()), month: ('0' + (today.getMonth()+1)).slice(-2) });
  const [dispVal, setDispVal] = useState({ year: "", month: ""});
  const [dailyId, setDailyId] = useState("");
  const [dailyInfo, setDailyInfo] = useState({});
  const [data, setData] = useState([]);

  const handleGetDailyReps = async () => {

    setDispVal({
      year: selectVal.year,
      month: selectVal.month,
    });
    try {
      const res = await getDailyReps(empInfo.id, selectVal.year, selectVal.month);
      setData(res.data);
    } catch (e) {
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleChangeSelect = (e) => {
    setSelectVal({
      ...selectVal,
      [e.target.name]: e.target.value,
    });
  }

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
        className="select-box select-year" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {years.map((year,i) => (
          <option key={"select-y-" + i} value={String(year)}>{year + "年"}</option>
        ))}
      </select>
    );
  }

  const SelectMonth = () => {
    return (
      <select 
        id="month-select" 
        name="month"
        value={selectVal.month} 
        className="select-box select-month" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {months.map((month,i) => (
          <option key={"select-m-" + i} value={month}>{month + "月"}</option>
        ))}
      </select>
    );
  }

  const DailyRow = (props) => {
    const {d,i} = props;
    var pd = Date.parse(d.date);
    var dt = new Date(pd);

    const formatTime = (h,m) => {
      if (h===undefined || h===null || h==="" || m===undefined || m===null || m==="") {
        return "";
      }
      var hh = ('0' + h).slice(-2);
      var mm = ('0' + m).slice(-2);
      return hh + ":" + mm;
    }

    const prescribedFrom = () => {
      let prescribed = formatTime(d.prescribed_frh,d.prescribed_frm);
      if(isEmptyNum(d.late_h)){
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

    const prescribedTo = () => {
      let prescribed = formatTime(d.prescribed_toh,d.prescribed_tom);
      if(isEmptyNum(d.over_toh)){
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

    const marking = (v) => {
      if (v===undefined || v===null || v==="") {
        return "";
      } else {
        return "●";
      }
    }

    const setDailyRep = () => {
      if (d.status==="未入力" || d.status==="入力済" || d.status==="承認取消") {
        return (
          <button 
            className="link-style-btn link-detail" 
            type="button" 
            onClick={() => setDailyId(d.id)} >
            入力
          </button>
        );
      } else {
        return "入力済";
      }
    }

    const setWorkRep = () => {
      if (d.status==="未入力") {
        return "";
      } else if(d.status==="入力済" || d.status==="承認取消") {
        return (
          <button 
            className="link-style-btn link-detail" 
            type="button" 
            onClick={() => setDailyInfo({id: d.id, 
                                          date: d.date, 
                                          prescribed_h: d.prescribed_h, 
                                          prescribed_m: d.prescribed_m, 
                                          over_h: d.over_h, 
                                          over_m: d.over_m})} >
            入力
          </button>
        );
      } else {
        return "入力済";
      }
    }

    const setRequest = () => {
      if (d.status==="未入力") {
        return (
          <button 
            className="request-btn" 
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
              className="request-btn" 
              type="button" 
              onClick={() => handleRequest(d.id, "申請中")}
              >
              申請
            </button>
          );
        } else {
          return (
            <button 
              className="request-btn" 
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
            className="request-btn" 
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
      <tr key={"daily-" + i} className="body-tr">
        <td className="date-td">{('0' + dt.getDate()).slice(-2)}</td>
        <td className="day-td">{day_arr[dt.getDay()]}</td>
        <td className="kbn-td">{d.kbn}</td>
        <td className="time-td">{prescribedFrom()}</td>
        <td className="time-td">{prescribedTo()}</td>
        <td className="mark-td">{marking(d.late_h)}</td>
        <td className="mark-td">{marking(d.goout_frh)}</td>
        <td className="mark-td">{marking(d.early_h)}</td>
        <td className="time-td">{formatTime(d.prescribed_h,d.prescribed_m)}</td>
        <td className="time-td">{formatTime(d.over_h,d.over_m)}</td>
        <td className="time-td">{formatTime(d.midnight_h,d.midnight_m)}</td>
        <td className="status-td">{d.status}</td>
        <td className="link-td">{setDailyRep()}</td>
        <td className="link-td">{setWorkRep()}</td>
        <td className="request-td">{setRequest()}</td>
        <td className="alert-td">{setAlert()}</td>
      </tr>
    );
  }

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

  const countDay1 = () => {
    return data.dailys.reduce((total,item) => {
      return total + ((item.kbn==="通常" || item.kbn==="時差" || item.kbn==="休出") ? 1 : 0);
    },0);
  }

  const countDay2 = () => {
    return data.dailys.reduce((total,item) => {
      return total + (item.kbn==="休暇" ? 1 : 0);
    },0);
  }

  const countDay3 = () => {
    return data.dailys.reduce((total,item) => {
      return total + (item.kbn==="休出" ? 1 : 0);
    },0);
  }

  const countLate = () => {
    return data.dailys.reduce((total,item) => {
      return total + (isEmptyNum(item.late_h) ? 0 : 1);
    },0);
  }

  const countEarly = () => {
    return data.dailys.reduce((total,item) => {
      return total + (isEmptyNum(item.late_h) ? 0 : 1);
    },0);
  }

  const refreshDailyReps = async () => {
    try {
      const res = await getDailyReps(empInfo.id, dispVal.year, dispVal.month);
      setData(res.data);
    } catch (e) {
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleRequest = async (id, status) => {
    try {
      const res = await updateStatus(id, {status: status});
      if (res.data.status === 500) {
        setMessage("日報情報更新エラー(500)");
        setMessageVar("error");
      } else {
        refreshDailyReps();
      }
    } catch (e) {
      setMessage("日報情報更新エラー(500)");
      setMessageVar("error");
    }
  }

  return (
    <div className="user-index-background">
      <div className="user-index-container">

        <div className="header-title">勤怠入力</div>

        { message_var && <Alert severity={message_var}>{message}</Alert>}

        <div className="search-area">
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

        <div className="calendar-area">
          {dispVal.year && dispVal.month ? (
            <div className="yyyymm">
              <div className="yyyy">{dispVal.year}</div>
              <div>年</div>
              <div className="mm">{dispVal.month}</div>
              <div>月</div>
            </div>
          ) : (
            <div className="yyyymm">
              <div className="yyyy"></div>
              <div>年</div>
              <div className="mm"></div>
              <div>月</div>
            </div>
          )}

          <table className="summary-table">
            <thead>
              <tr>
                <td className="header-td">所定労働時間</td>
                <td className="header-td">時間外労働時間</td>
                <td className="header-td">深夜時間</td>
                <td className="header-td">出社日数</td>
                <td className="header-td">休暇日数</td>
                <td className="header-td">休出日数</td>
                <td className="header-td">遅刻回数</td>
                <td className="header-td">早退回数</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.dailys ? sumPrescribedTime() : ""}</td>
                <td>{data.dailys ?sumOverTime() : ""}</td>
                <td>{data.dailys ? sumMidnightTime() : ""}</td>
                <td>{data.dailys ? countDay1() + "日" : ""}</td>
                <td>{data.dailys ? countDay2() + "日" : ""}</td>
                <td>{data.dailys ? countDay3() + "日" : ""}</td>
                <td>{data.dailys ? countLate() + "回" : ""}</td>
                <td>{data.dailys ? countEarly() + "回" : ""}</td>
              </tr>
            </tbody>
          </table>

          <table className="daily-table-hd">
            <thead>
              <tr className="header-tr">
                <td className="header-td date-td">日付</td>
                <td className="header-td day-td">曜日</td>
                <td className="header-td kbn-td">区分</td>
                <td className="header-td time-td">出社時間</td>
                <td className="header-td time-td">退社時間</td>
                <td className="header-td mark-td">遅刻</td>
                <td className="header-td mark-td">外出</td>
                <td className="header-td mark-td">早退</td>
                <td className="header-td time-td">所定時間</td>
                <td className="header-td time-td">時間外時間</td>
                <td className="header-td time-td">深夜時間</td>
                <td className="header-td status-td">状態</td>
                <td className="header-td link-td">勤務日報</td>
                <td className="header-td link-td">作業日報</td>
                <td className="header-td request-td">申請</td>
                <td className="header-td alert-td"></td>
              </tr>
            </thead>
          </table>

          <div className="daily-table-frame">
            <table className="daily-table">
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
      <UserEditPage dailyId={dailyId} setDailyId={setDailyId} refresh={refreshDailyReps} />
      <UserWorkEditPage dailyInfo={dailyInfo} setDailyInfo={setDailyInfo} refresh={refreshDailyReps} />
    </div>
  )
}

export default UserIndexPage;
