import './DailyIndexPage.css';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDailyReps } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { isEmptyNum } from "../../../lib/common/numberCom";
import DailyDetailPage from './DailyDetailPage';
import ModalConfirm from '../../common/ModalConfirm';
import { approvalUpdate, approvalCancel } from '../../../lib/api/daily';

const today = new Date();

const DailyIndexPage = (props) => {
  const { empId, setEmpId } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const months = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
  const day_arr = [ "日", "月", "火", "水", "木", "金", "土" ];
  const [selectVal, setSelectVal] = useState({ year: String(today.getFullYear()), month: ('0' + (today.getMonth()+1)).slice(-2) });
  const [dispVal, setDispVal] = useState({ year: "", month: ""});
  const [data, setData] = useState({});
  const [dailyInfo, setDailyInfo] = useState({});
  const [approvals, setApprovals] = useState([]);

  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  const handleGetDailyReps = async () => {

    setDispVal({
      year: selectVal.year,
      month: selectVal.month,
    });
    try {
      const res = await getDailyReps(empInfo.id, selectVal.year, selectVal.month);
      const tmpDailys = res.data.dailys.map(d => {
        const tmpDaily = {};
        tmpDaily.id = d.id;
        tmpDaily.date = d.date;
        tmpDaily.kbn = d.kbn;
        tmpDaily.prescribed_frh = d.prescribed_frh;
        tmpDaily.prescribed_frm = d.prescribed_frm;
        tmpDaily.prescribed_toh = d.prescribed_toh;
        tmpDaily.prescribed_tom = d.prescribed_tom;
        tmpDaily.lunch_frh = d.lunch_frh;
        tmpDaily.lunch_frm = d.lunch_frm;
        tmpDaily.lunch_toh = d.lunch_toh;
        tmpDaily.lunch_tom = d.lunch_tom;
        tmpDaily.late_h = d.late_h;
        tmpDaily.late_m = d.late_m;
        tmpDaily.goout_frh = d.goout_frh;
        tmpDaily.goout_frm = d.goout_frm;
        tmpDaily.goout_toh = d.goout_toh;
        tmpDaily.goout_tom = d.goout_tom;
        tmpDaily.early_h = d.early_h;
        tmpDaily.early_m = d.early_m;
        tmpDaily.over_frh = d.over_frh;
        tmpDaily.over_frm = d.over_frm;
        tmpDaily.over_toh = d.over_toh;
        tmpDaily.over_tom = d.over_tom;
        tmpDaily.rest_frh = d.rest_frh;
        tmpDaily.rest_frm = d.rest_frm;
        tmpDaily.rest_toh = d.rest_toh;
        tmpDaily.rest_tom = d.rest_tom;
        tmpDaily.prescribed_h = d.prescribed_h;
        tmpDaily.prescribed_m = d.prescribed_m;
        tmpDaily.over_h = d.over_h;
        tmpDaily.over_m = d.over_m;
        tmpDaily.midnight_h = d.midnight_h;
        tmpDaily.midnight_m = d.midnight_m;
        tmpDaily.status = d.status;
        tmpDaily.approval_select = false;
        return tmpDaily;
      });
      setData({
        ...data,
        dailys: tmpDailys
      });
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
        id="select-year" 
        name="year"
        value={selectVal.year} 
        className="select-year" 
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
        id="select-month" 
        name="month"
        value={selectVal.month} 
        className="select-month" 
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

    const setDetail = () => {
      if (d.status==="未入力" || d.status==="入力済") {
        return "";
      } else {
        return (
          <button 
            className="link-style-btn link-detail" 
            type="button" 
            onClick={() => setDailyInfo({id: d.id, 
                                          date: d.date, 
                                          prescribed_h: d.prescribed_h, 
                                          prescribed_m: d.prescribed_m, 
                                          over_h: d.over_h, 
                                          over_m: d.over_m})}>
            表示
          </button>
        );
      }
    }

    const setApproval = () => {
      if (d.status==="申請中") {
        return (
          <button 
            className="approval-btn" 
            type="button" 
            onClick={() => handleApproval(d.id)}
            >
            承認
          </button>
        );
      } else if (d.status==="承認済") {
        return (
          <button 
            className="approval-btn" 
            type="button" 
            onClick={() => handleApprovalCancel(d.id)}
            >
            承認取消
          </button>
        );
      } else {
        return "";
      }
    }

    const setSelect = () => {
      if (d.status==="申請中") {
        return (
          <input 
            type="checkbox"
            name="approval_select"
            id="approval_select"
            className="approval_select"
            value="approval_select"
            checked={d.approval_select || false}
            onChange={(e) => handleCheckbox(i,e)}
          />
        );
      } else {
        return (
          <input 
            type="checkbox"
            name="approval_select"
            id="approval_select"
            className="approval_select"
            value="approval_select"
            checked={d.approval_select || false}
            disabled
          />
        );
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
        <td className="link-td">{setDetail()}</td>
        <td className="link-td">{setApproval()}</td>
        <td className="checkbox-td">{setSelect()}</td>
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
      const tmpDailys = res.data.dailys.map(d => {
        const tmpDaily = {};
        tmpDaily.id = d.id;
        tmpDaily.date = d.date;
        tmpDaily.kbn = d.kbn;
        tmpDaily.prescribed_frh = d.prescribed_frh;
        tmpDaily.prescribed_frm = d.prescribed_frm;
        tmpDaily.prescribed_toh = d.prescribed_toh;
        tmpDaily.prescribed_tom = d.prescribed_tom;
        tmpDaily.lunch_frh = d.lunch_frh;
        tmpDaily.lunch_frm = d.lunch_frm;
        tmpDaily.lunch_toh = d.lunch_toh;
        tmpDaily.lunch_tom = d.lunch_tom;
        tmpDaily.late_h = d.late_h;
        tmpDaily.late_m = d.late_m;
        tmpDaily.goout_frh = d.goout_frh;
        tmpDaily.goout_frm = d.goout_frm;
        tmpDaily.goout_toh = d.goout_toh;
        tmpDaily.goout_tom = d.goout_tom;
        tmpDaily.early_h = d.early_h;
        tmpDaily.early_m = d.early_m;
        tmpDaily.over_frh = d.over_frh;
        tmpDaily.over_frm = d.over_frm;
        tmpDaily.over_toh = d.over_toh;
        tmpDaily.over_tom = d.over_tom;
        tmpDaily.rest_frh = d.rest_frh;
        tmpDaily.rest_frm = d.rest_frm;
        tmpDaily.rest_toh = d.rest_toh;
        tmpDaily.rest_tom = d.rest_tom;
        tmpDaily.prescribed_h = d.prescribed_h;
        tmpDaily.prescribed_m = d.prescribed_m;
        tmpDaily.over_h = d.over_h;
        tmpDaily.over_m = d.over_m;
        tmpDaily.midnight_h = d.midnight_h;
        tmpDaily.midnight_m = d.midnight_m;
        tmpDaily.status = d.status;
        tmpDaily.approval_select = false;
        return tmpDaily;
      });
      setData({
        ...data,
        dailys: tmpDailys
      });
    } catch (e) {
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  const handleApproval = async (id) => {
    try {
      const res = await approvalUpdate({approvals: [{id: id, approval_id: empInfo.id}]});
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

  const handleApprovalCancel = async (id) => {
    try {
      const res = await approvalCancel({approvals: [{id: id}]});
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

  const handleAllChecked = (e) => {
    const tmpDailys = [...data.dailys];
    data.dailys.map((d,i) => {
      if (d.status==="申請中") {
        tmpDailys[i]["approval_select"] = true;
      }
    });
    setData({
      ...data,
      dailys: tmpDailys,
    });
  }

  const handleAllUnChecked = (e) => {
    const tmpDailys = [...data.dailys];
    data.dailys.map((d,i) => {
      if (d.status==="申請中") {
        tmpDailys[i]["approval_select"] = false;
      }
    });
    setData({
      ...data,
      dailys: tmpDailys,
    });
  }

  const countSelect = () => {
    if (data.dailys===undefined) {
      return 0;
    } else {
      return data.dailys.reduce((total,item) => {
        return total + ((item.status==="申請中" & item.approval_select===true) ? 1 : 0);
      },0);  
    }
  }

  const handleAllApproval = (e) => {
    e.preventDefault();
    const tmpDailys = data.dailys.filter(d => {
      if (d.status==="申請中" && d.approval_select===true) {
        return true;
      }
    });
    const tmpApprovals = tmpDailys.map(d => {
      const tmpApproval = {};
      tmpApproval.id = d.id;
      tmpApproval.approval_id = empInfo.id;
      return tmpApproval;
    });
    setApprovals({approvals: tmpApprovals});
    setConfirm({
      ...confirm,
      msg: "選択した日報をすべて承認します。よろしいですか？",
      tag: "",
    })
  }

  const handleCofirmCancel = () => {
    setApprovals([]);
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  const handleConfirmOK = async (dummy) => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await approvalUpdate(approvals);
      if (res.data.status === 500) {
        setMessage("日報情報更新エラー(500)");
        setMessageVar("error");
      } else {
        refreshDailyReps();
        setApprovals([]);
      }
    } catch (e) {
      setMessage("日報情報更新エラー");
      setMessageVar("error");
    }
  }

  const handleCheckbox = (i,e) => {
    const tmpDailys = [...data.dailys];
    tmpDailys[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      dailys: tmpDailys,
    });
  }

  return (
    <>
      { empId ? (
        <div className="daily-index-background">
          <div className="daily-index-container">
            <div className="header-area">
              <div className="header-title">日報承認</div>
              <button 
                className="link-style-btn link-return" 
                type="button" 
                onClick={() => setEmpId("")}>
                ≫戻る
              </button>
            </div>
            { message_var && <Alert severity={message_var}>{message}</Alert>}

            <div className="button-area">
              <div className="search-area">
                <SelectYear />
                <SelectMonth />
                <Button 
                  size="small" 
                  variant="contained" 
                  endIcon={<SearchIcon />} 
                  sx={{height:25}}
                  onClick={(e) => handleGetDailyReps()}
                  >
                  表示
                </Button>
              </div>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small"
                    variant="contained"
                    sx={{height:25}}
                    onClick={(e) => handleAllChecked()}
                    disabled={data.dailys===undefined}>
                    全選択
                  </Button>
                  <Button 
                    size="small"
                    variant="contained"
                    sx={{height:25}}
                    onClick={(e) => handleAllUnChecked()}
                    disabled={data.dailys===undefined}>
                    全解除
                  </Button>
                  <Button 
                    size="small"
                    variant="contained"
                    sx={{height:25}}
                    onClick={(e) => handleAllApproval(e)}                    
                    disabled={countSelect()===0}
                  >
                    選択承認
                  </Button>                  
                </Stack>
            </div>

            <div className="calendar-area">
              {dispVal.year && dispVal.month ? (
                <div className="yyyymm">
                  <div className="yyyy">{dispVal.year}</div>
                  <div>年</div>
                  <div className="mm">{dispVal.month}</div>
                  <div>月</div>
                  {data.emp ?(
                    <div>{"　" + data.emp.name}</div>
                  ) : (
                    <></>
                  )}
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
                  <tr>
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
                    <td className="header-td link-td">詳細</td>
                    <td className="header-td link-td">承認</td>
                    <td className="header-td checkbox-td">選択</td>
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
          <DailyDetailPage dailyInfo={dailyInfo} setDailyInfo={setDailyInfo} />
          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
        </div>
      ) : (
        <></>
      )}
    </>

  )
}

export default DailyIndexPage;
