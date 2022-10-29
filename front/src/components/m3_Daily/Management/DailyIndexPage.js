// m34
import './DailyIndexPage.css';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDailyReps } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import DailyDetailPage from './DailyDetailPage';
import ModalConfirm from '../../common/ModalConfirm';
import { approvalUpdate, approvalCancel } from '../../../lib/api/daily';
import { formatTime } from '../../../lib/common/timeCom';
import { isEmpty } from '../../../lib/common/isEmpty';

const today = new Date();

const DailyIndexPage = (props) => {
  const { empId, empName, closeDaily } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const months = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
  const day_arr = [ "日", "月", "火", "水", "木", "金", "土" ];
  const [selectVal, setSelectVal] = useState({ year: String(today.getFullYear()), month: ('0' + (today.getMonth()+1)).slice(-2) });
  const [dispVal, setDispVal] = useState({ year: "", month: ""});
  const [data, setData] = useState({});
  const [dailyInfo, setDailyInfo] = useState({});
  const [approvals, setApprovals] = useState([]);

  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 日報取得
  const handleGetDailyReps = async () => {

    // 表示条件退避
    setDispVal({
      year: selectVal.year,
      month: selectVal.month,
    });
    try {
      const res = await getDailyReps(empId, selectVal.year, selectVal.month);
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
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
    }
  }

  // 表示条件リストボックス選択時の処理
  const handleChangeSelect = (e) => {
    setSelectVal({
      ...selectVal,
      [e.target.name]: e.target.value,
    });
  }

  // 年リストボックス生成
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
        className="m34-select-year" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {years.map((year,i) => (
          <option key={"select-y-" + i} value={String(year)}>{year + "年"}</option>
        ))}
      </select>
    );
  }

  // 月リストボックス生成
  const SelectMonth = () => {
    return (
      <select 
        id="select-month" 
        name="month"
        value={selectVal.month} 
        className="m34-select-month" 
        onChange={(e) => handleChangeSelect(e)}
      >
        {months.map((month,i) => (
          <option key={"select-m-" + i} value={month}>{month + "月"}</option>
        ))}
      </select>
    );
  }

  // 一覧行編集
  const DailyRow = (props) => {
    const {d,i} = props;
    var pd = Date.parse(d.date);
    var dt = new Date(pd);

    // 土日の場合の背景色設定
    var dayStyle = "";
    if (dt.getDay() === 0) {
      // 日曜
      dayStyle = " m34-sunday";
    } else if(dt.getDay() === 6) {
      // 土曜
      dayStyle = " m34-saturday";
    }

    // 出社時間編集（通常出社と遅刻時間の比較より）
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

    // 退社時間（通常退社時間と早退時間の比較より）
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

    // 遅刻・外出・早退のマーキング
    const marking = (v) => {
      if (isEmpty(v)) {
        return "";
      } else {
        return "●";
      }
    }

    // 詳細欄の編集
    const setDetail = () => {
      if (d.status==="未入力" || d.status==="入力済") {
        return "";
      } else {
        return (
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => hancleDetail(d)}>
            表示
          </button>
        );
      }
    }

    // 承認欄の編集
    const setApproval = () => {
      if (d.status==="申請中") {
        return (
          <button 
            className="m34-approval-btn" 
            type="button" 
            onClick={() => handleApproval(d.id)}
            >
            承認
          </button>
        );
      } else if (d.status==="承認済") {
        return (
          <button 
            className="m34-approval-btn" 
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

    // 選択欄の編集
    const setSelect = () => {
      if (d.status==="申請中") {
        return (
          <input 
            type="checkbox"
            name="approval_select"
            id="approval_select"
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
            checked={d.approval_select || false}
            disabled
          />
        );
      }
    }

    // 行編集
    return (
      <tr key={"daily-" + i} className="body-tr">
        <td className={'m34-date-td' + dayStyle}>{('0' + dt.getDate()).slice(-2)}</td>
        <td className={'m34-day-td' + dayStyle}>{day_arr[dt.getDay()]}</td>
        <td className={'m34-kbn-td' + dayStyle}>{d.kbn}</td>
        <td className={'m34-time-td' + dayStyle}>{prescribedFrom()}</td>
        <td className={'m34-time-td' + dayStyle}>{prescribedTo()}</td>
        <td className={'m34-mark-td' + dayStyle}>{marking(d.late_h)}</td>
        <td className={'m34-mark-td' + dayStyle}>{marking(d.goout_frh)}</td>
        <td className={'m34-mark-td' + dayStyle}>{marking(d.early_h)}</td>
        <td className={'m34-time-td' + dayStyle}>{formatTime(d.prescribed_h,d.prescribed_m)}</td>
        <td className={'m34-time-td' + dayStyle}>{formatTime(d.over_h,d.over_m)}</td>
        <td className={'m34-time-td' + dayStyle}>{formatTime(d.midnight_h,d.midnight_m)}</td>
        <td className={'m34-status-td' + dayStyle}>{d.status}</td>
        <td className={'m34-link-td' + dayStyle}>{setDetail()}</td>
        <td className={'m34-link-td' + dayStyle}>{setApproval()}</td>
        <td className={'m34-checkbox-td' + dayStyle}>{setSelect()}</td>
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

  // 時間外時間集計
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
      setMessage({kbn: "error", msg: "日報情報取得エラー"});
    }
  }

  // 承認ボタン押下時の処理
  const handleApproval = async (id) => {
    try {
      const res = await approvalUpdate({approvals: [{id: id, approval_id: empInfo.id}]});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        refreshDailyReps();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
    }
  }

  // 承認取消ボタン押下時の処理
  const handleApprovalCancel = async (id) => {
    try {
      const res = await approvalCancel({approvals: [{id: id}]});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        refreshDailyReps();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
    }
  }

  // 全選択ボタン押下時の処理
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

  // 全解除ボタン押下時の処理
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

  // 選択状態カウント処理
  const countSelect = () => {
    if (data.dailys===undefined) {
      return 0;
    } else {
      return data.dailys.reduce((total,item) => {
        return total + ((item.status==="申請中" & item.approval_select===true) ? 1 : 0);
      },0);  
    }
  }

  // 選択承認ボタン押下時の処理
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

  // 選択承認確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setApprovals([]);
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 選択承認確認OKボタン押下時の処理
  const handleConfirmOK = async (dummy) => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await approvalUpdate(approvals);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        refreshDailyReps();
        setApprovals([]);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
    }
  }

  // 選択チェックボックス変更時の処理
  const handleCheckbox = (i,e) => {
    const tmpDailys = [...data.dailys];
    tmpDailys[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      dailys: tmpDailys,
    });
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    closeDaily();
  }

  // 詳細ボタン押下時の処理
  const hancleDetail = (d) => {
    setDailyInfo({id: d.id, 
                  date: d.date, 
                  status: d.status,
                  prescribed_h: d.prescribed_h, 
                  prescribed_m: d.prescribed_m, 
                  over_h: d.over_h, 
                  over_m: d.over_m});
  }

  // 詳細画面終了時の処理
  const closeDetail = () => {
    setDailyInfo({});
    refreshDailyReps();
  }

  // 画面編集
  return (
    <>
      { empId ? (
        <div className="m34-container">
          <div className="m34-header-area">
            <div className="m34-header-title">{"日報承認（" + empName + "）"}</div>
            <button 
              className="link-style-btn m34-link-return" 
              type="button" 
              onClick={() => handleClose()}>
              ≫閉じる
            </button>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="m34-button-area">
            <div className="m34-search-area">
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

          <div className="m34-calendar-area">

            {dispVal.year && dispVal.month ? (
              <div className="m34-yyyymm">
                <div className="m34-yyyy">{dispVal.year}</div>
                <div>年</div>
                <div className="m34-mm">{dispVal.month}</div>
                <div>月</div>
                {data.emp ?(
                  <div>{"　" + data.emp.name}</div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="m34-yyyymm">
                <div className="m34-yyyy"></div>
                <div>年</div>
                <div className="m34-mm"></div>
                <div>月</div>
              </div>
            )}

            <table className="m34-summary">
              <thead>
                <tr>
                  <td className="m34-th">所定労働時間</td>
                  <td className="m34-th">時間外労働時間</td>
                  <td className="m34-th">深夜時間</td>
                  <td className="m34-th">出社日数</td>
                  <td className="m34-th">休暇日数</td>
                  <td className="m34-th">休出日数</td>
                  <td className="m34-th">遅刻回数</td>
                  <td className="m34-th">早退回数</td>
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

            <div className="m34-frame-hd">
              <table className="m34-table-hd">
                <thead>
                  <tr>
                    <td className="m34-th m34-date-td">日付</td>
                    <td className="m34-th m34-day-td">曜日</td>
                    <td className="m34-th m34-kbn-td">区分</td>
                    <td className="m34-th m34-time-td">出社時間</td>
                    <td className="m34-th m34-time-td">退社時間</td>
                    <td className="m34-th m34-mark-td">遅刻</td>
                    <td className="m34-th m34-mark-td">外出</td>
                    <td className="m34-th m34-mark-td">早退</td>
                    <td className="m34-th m34-time-td">所定時間</td>
                    <td className="m34-th m34-time-td">時間外時間</td>
                    <td className="m34-th m34-time-td">深夜時間</td>
                    <td className="m34-th m34-status-td">状態</td>
                    <td className="m34-th m34-link-td">詳細</td>
                    <td className="m34-th m34-link-td">承認</td>
                    <td className="m34-th m34-checkbox-td">選択</td>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="m34-frame">
              <table className="m34-table-bd">
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

          <DailyDetailPage dailyInfo={dailyInfo} closeWin={closeDetail} />
          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
        </div>
      ) : (
        <></>
      )}
    </>

  )
}

export default DailyIndexPage;
