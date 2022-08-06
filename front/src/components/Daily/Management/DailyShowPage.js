import './DailyShowPage.css';
import { useEffect, useState } from 'react';
import { getDailyRep } from '../../../lib/api/daily';
import { displayDate } from '../../../lib/common/datetostr';
import { formatTime } from '../../../lib/common/timetostr';
import { isEmptyNum } from '../../../lib/common/numberCom';

const initData = {id: "", kbn: "", kbn_reason: "",
                  prescribed_frh: "", prescribed_frm: "", prescribed_toh: "", prescribed_tom: "",
                  lunch_frh: "", lunch_frm: "", lunch_toh: "", lunch_tom: "",
                  over_reason: "", over_frh: "", over_frm: "", over_toh: "", over_tom: "",
                  rest_frh: "", rest_frm: "", rest_toh: "", rest_tom: "",
                  late_reason: "", late_h: "", late_m: "",
                  goout_reason: "", goout_frh: "", goout_frm: "", goout_toh: "", goout_tom: "",
                  early_reason: "", early_h: "", early_m: "",
                  prescribed_h: "", prescribed_m: "", over_h: "", over_m: "", midnight_h: "", midnight_m: "",
                  status: ""}
                  
const DailyShowPage = (props) => {
  const { dailyId, setMessage, setMessageVar } = props;
  const [daily, setDaily] = useState(initData);

  useEffect(() => {
    if(!isEmptyNum(dailyId)){
      handleGetDaily(Number(dailyId));
      setMessage("");
      setMessageVar("");
    } else {
      setDaily(initData);
    }
  },[dailyId]);

  const handleGetDaily = async (id) => {
    try {
      const res = await getDailyRep(Number(id));
      setDaily({
        ...daily,
        id: res.data.daily.id,
        date: res.data.daily.date,
        kbn: res.data.daily.kbn,
        kbn_reason: res.data.daily.kbn_reason,
        prescribed_frh: res.data.daily.prescribed_frh,
        prescribed_frm: res.data.daily.prescribed_frm,
        prescribed_toh: res.data.daily.prescribed_toh,
        prescribed_tom: res.data.daily.prescribed_tom,
        lunch_frh: res.data.daily.lunch_frh,
        lunch_frm: res.data.daily.lunch_frm,
        lunch_toh: res.data.daily.lunch_toh,
        lunch_tom: res.data.daily.lunch_tom,
        over_reason: res.data.daily.over_reason,
        over_frh: res.data.daily.over_frh,
        over_frm: res.data.daily.over_frm,
        over_toh: res.data.daily.over_toh,
        over_tom: res.data.daily.over_tom,
        rest_frh: res.data.daily.rest_frh,
        rest_frm: res.data.daily.rest_frm,
        rest_toh: res.data.daily.rest_toh,
        rest_tom: res.data.daily.rest_tom,
        late_reason: res.data.daily.late_reason,
        late_h: res.data.daily.late_h,
        late_m: res.data.daily.late_m,
        goout_reason: res.data.daily.goout_reason,
        goout_frh: res.data.daily.goout_frh,
        goout_frm: res.data.daily.goout_frm,
        goout_toh: res.data.daily.goout_toh,
        goout_tom: res.data.daily.goout_tom,
        early_reason: res.data.daily.early_reason,
        early_h: res.data.daily.early_h,
        early_m: res.data.daily.early_m,
        prescribed_h: res.data.daily.prescribed_h,
        prescribed_m: res.data.daily.prescribed_m,
        over_h: res.data.daily.over_h,
        over_m: res.data.daily.over_m,
        midnight_h: res.data.daily.midnight_h,
        midnight_m: res.data.daily.midnight_m,
        status: res.data.daily.status,
      });
    } catch (e) {
      setMessage("日報情報取得エラー");
      setMessageVar("error");
    }
  }

  return (
    <div className="daily-show-container">
      <div className="daily-date">{displayDate(daily.date)}</div>

<div className="section-frame">
  <div className="section-title">■所定勤務</div>
  <div className="display-row">
    <div className="title">勤怠区分:</div>
    <div className="kbn">{daily.kbn}</div>
  </div>
  <PrescribedArea daily={daily} /> 
</div>
<OverArea daily={daily} />
<OthersArea daily={daily} />
</div>
  );
}
export default DailyShowPage;

const PrescribedArea = (props) => {
  const { daily } = props;
  if ( daily.kbn==="通常") {
    return (
      <>
        <div className="display-row">
          <div className="title">所定勤務時間:</div>
          { daily.prescribed_frh ? (
            <div className="time">{formatTime(daily.prescribed_frh, daily.prescribed_frm) + " 〜 " + formatTime(daily.prescribed_toh, daily.prescribed_tom)}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="display-row">
          <div className="title">休憩時間:</div>
          { daily.lunch_frh ? (
            <div className="time">{formatTime(daily.lunch_frh, daily.lunch_frm) + " 〜 " + formatTime(daily.lunch_toh, daily.lunch_tom)}</div>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  } else if (daily.kbn==="時差") {
    return (
      <>
        <div className="display-row">
          <div className="title">時差勤務理由:</div>
          <div className="reason">{daily.kbn_reason}</div>
        </div>
        <div className="display-row">
          <div className="title">所定勤務時間:</div>
          { daily.prescribed_frh ? (
            <div className="time">{formatTime(daily.prescribed_frh, daily.prescribed_frm) + " 〜 " + formatTime(daily.prescribed_toh, daily.prescribed_tom)}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="display-row">
          <div className="title">休憩時間:</div>
          { daily.lunch_frh ? (
            <div className="time">{formatTime(daily.lunch_frh, daily.lunch_frm) + " 〜 " + formatTime(daily.lunch_toh, daily.lunch_tom)}</div>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  } else if (daily.kbn==="休暇") {
    return (
      <>
        <div className="display-row">
          <div className="title">休暇理由:</div>
          <div className="reason">{daily.kbn_reason}</div>
        </div>
      </>
    );
  } else {
    // 休日出勤
    return (
      <>
        <div className="display-row">
          <div className="title">休出理由:</div>
          <div className="reason">{daily.kbn_reason}</div>
        </div>
        <div className="display-row">
          <div className="title">所定勤務時間:</div>
          { daily.prescribed_frh ? (
            <div className="time">{formatTime(daily.prescribed_frh, daily.prescribed_frm) + " 〜 " + formatTime(daily.prescribed_toh, daily.prescribed_tom)}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="display-row">
          <div className="title">休憩時間:</div>
          { daily.lunch_frh ? (
            <div className="time">{formatTime(daily.lunch_frh, daily.lunch_frm) + " 〜 " + formatTime(daily.lunch_toh, daily.lunch_tom)}</div>
          ) : (
            <></>
          )}
        </div>
     </>
    );
  }
}

const OverArea = (props) => {
  const { daily } = props;
  if (daily.kbn==="通常" || daily.kbn==="時差" || daily.kbn==="休出") {
    return (
      <div className="section-frame">
        <div className="section-title">■時間外</div>
        <div className="display-row">
          <div className="title">時間外理由:</div>
          <div className="reason">{daily.over_reason}</div>
        </div>
        <div className="display-row">
          <div className="title">時間外時間:</div>
          { daily.over_frh ? (
            <div className="time">{formatTime(daily.over_frh, daily.over_frm) + " 〜 " + formatTime(daily.over_toh, daily.over_tom)}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="display-row">
          <div className="title">休憩時間:</div>
          { daily.rest_frh ? (
            <div className="time">{formatTime(daily.rest_frh, daily.rest_frm) + " 〜 " + formatTime(daily.rest_toh, daily.rest_tom)}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  } else {
    return (<></>);
  }
}

const OthersArea = (props) => {
  const { daily } = props;
  if (daily.kbn==="通常") {
    return (
      <div className="section-frame">
        <div className="section-title">■遅刻・外出・早退</div>
        <div className="display-row">
          <div className="title">遅刻:</div>
          <div className="time">{formatTime(daily.late_h, daily.late_m)}</div>
          <div className="reason">{daily.late_reason}</div>
        </div>
        <div className="display-row">
          <div className="title">外出:</div>
          { daily.goout_frh ? (
            <div className="time">{formatTime(daily.goout_frh, daily.goout_frm) + " 〜 " + formatTime(daily.goout_toh, daily.goout_frm)}</div>
          ) : (
            <></>
          )}
          <div className="reason">{daily.goout_reason}</div>
        </div>
        <div className="display-row">
          <div className="title">早退:</div>
          <div className="time">{formatTime(daily.early_h, daily.early_m)}</div>
          <div className="reason">{daily.early_reason}</div>
        </div>
      </div>
    );
  } else if (daily.kbn==="時差") {
    return (
      <div className="section-frame">
        <div className="display-row">
          <div className="title">外出:</div>
          { daily.goout_frh ? (
            <div className="time">{formatTime(daily.goout_frh, daily.goout_frm) + " 〜 " + formatTime(daily.goout_toh, daily.goout_frm)}</div>
          ) : (
            <></>
          )} 
          <div className="reason">{daily.goout_reason}</div>
        </div>
      </div>
    );    
  } else {
    return (<></>);
  }
}
