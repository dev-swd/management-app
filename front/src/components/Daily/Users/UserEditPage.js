import "./UserEditPage.css";
import { useEffect, useState } from 'react';
import { getDailyRep, updateDailyRep } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from "@mui/icons-material/Close";
import { displayDate } from '../../../lib/common/datetostr';
import ModalConfirm from '../../common/ModalConfirm';
import { zeroPadding, isEmptyStr } from "../../../lib/common/stringCom";
import { integerValidator } from "../../../lib/common/inputValidator";

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
const defPrescribed_frh = "09";
const defPrescribed_frm = "00";
const defPrescribed_toh = "18";
const defPrescribed_tom = "00"
const defLunch_frh = "11";
const defLunch_frm = "45";
const defLunch_toh = "12";
const defLunch_tom = "45";

const UserEditPage = (props) => {
  const { dailyId, setDailyId, refresh } = props;
  const [msgs, setMsgs] = useState([]);  
  const [daily, setDaily] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  useEffect(() => {
    if(dailyId===""){
    } else {
      handleGetDaily(dailyId);
      setMsgs("");
    }
  },[dailyId]);

  const handleGetDaily = async (id) => {
    try {
      const res = await getDailyRep(Number(id));
      var wkkbn;
      if(res.data.daily.kbn===null || res.data.daily.kbn==="") {
        wkkbn="通常";
      } else {
        wkkbn=res.data.daily.kbn;
      }
      setDaily({
        ...daily,
        id: res.data.daily.id,
        date: res.data.daily.date,
        kbn: wkkbn,
        kbn_reason: res.data.daily.kbn_reason,
        prescribed_frh: zeroPadding(res.data.daily.prescribed_frh, 2),
        prescribed_frm: zeroPadding(res.data.daily.prescribed_frm, 2),
        prescribed_toh: zeroPadding(res.data.daily.prescribed_toh, 2),
        prescribed_tom: zeroPadding(res.data.daily.prescribed_tom, 2),
        lunch_frh: zeroPadding(res.data.daily.lunch_frh, 2),
        lunch_frm: zeroPadding(res.data.daily.lunch_frm, 2),
        lunch_toh: zeroPadding(res.data.daily.lunch_toh, 2),
        lunch_tom: zeroPadding(res.data.daily.lunch_tom, 2),
        over_reason: res.data.daily.over_reason,
        over_frh: zeroPadding(res.data.daily.over_frh, 2),
        over_frm: zeroPadding(res.data.daily.over_frm, 2),
        over_toh: zeroPadding(res.data.daily.over_toh, 2),
        over_tom: zeroPadding(res.data.daily.over_tom, 2),
        rest_frh: zeroPadding(res.data.daily.rest_frh, 2),
        rest_frm: zeroPadding(res.data.daily.rest_frm, 2),
        rest_toh: zeroPadding(res.data.daily.rest_toh, 2),
        rest_tom: zeroPadding(res.data.daily.rest_tom, 2),
        late_reason: res.data.daily.late_reason,
        late_h: zeroPadding(res.data.daily.late_h, 2),
        late_m: zeroPadding(res.data.daily.late_m, 2),
        goout_reason: res.data.daily.goout_reason,
        goout_frh: zeroPadding(res.data.daily.goout_frh, 2),
        goout_frm: zeroPadding(res.data.daily.goout_frm, 2),
        goout_toh: zeroPadding(res.data.daily.goout_toh, 2),
        goout_tom: zeroPadding(res.data.daily.goout_tom, 2),
        early_reason: res.data.daily.early_reason,
        early_h: zeroPadding(res.data.daily.early_h, 2),
        early_m: zeroPadding(res.data.daily.early_m, 2),
        prescribed_h: zeroPadding(res.data.daily.prescribed_h, 2),
        prescribed_m: zeroPadding(res.data.daily.prescribed_m, 2),
        over_h: zeroPadding(res.data.daily.over_h, 2),
        over_m: zeroPadding(res.data.daily.over_m, 2),
        midnight_h: zeroPadding(res.data.daily.midnight_h, 2),
        midnight_m: zeroPadding(res.data.daily.midnight_m, 2),
        status: res.data.daily.status,
      });
    } catch (e) {
      setMsgs([{message: "日報情報取得エラー",
              severity: "error",}]);
    }
  }

  const handleClose = (e) => {
    setDailyId("");
    setDaily(initData);
  }

  const handleChange = (name, value) => {
    setDaily({
      ...daily,
      [name]: value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(checkData()) {
      console.log(msgs);
      return;
    }
    setConfirm({
      ...confirm,
      msg: "この内容で登録します。よろしいですか？",
      tag: "",
    })
  }

  const checkData = () => {
    let errmsg=[];
    let res;
    let res2;

    switch (daily.kbn){
      case '通常':

        /* 時間外 */
        if(!(isEmptyStr(daily.over_reason) && isEmptyStr(daily.over_frh) && isEmptyStr(daily.over_frm) && isEmptyStr(daily.over_toh) && isEmptyStr(daily.over_tom) && 
            isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))){
          if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)){
            errmsg[errmsg.length] = {message: "時間外の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.over_frh, "時間外（自）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_frm, "時間外（自）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

            res = checkHour(daily.over_toh, "時間外（至）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_tom, "時間外（至）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
          }

          if(!(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))) {
            if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（時間外の入力が前提）", severity: "error"}
            }
            if(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（入力する場合は全て必須）", severity: "error"}
            } else {
              res = checkHour(daily.rest_frh, "時間外休憩（自）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_frm, "時間外休憩（自）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
  
              res = checkHour(daily.rest_toh, "時間外休憩（至）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_tom, "時間外休憩（至）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }  
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }
  
          /* 時間外 */
          res = checkHm(daily.over_frh, daily.over_frm, daily.over_toh, daily.over_tom, "時間外（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          /* 時間外休憩 */
          res = checkHm(daily.rest_frh, daily.rest_frm, daily.rest_toh, daily.rest_tom, "時間外休憩（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

          /* 時間外（所定時間との依存関係） */
          res = checkHm(defPrescribed_toh, defPrescribed_tom, daily.over_frh, daily.over_frm, "時間外（自）", "（所定時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"};
          }

          /* 時間外休憩（時間外との依存関係） */
          if(daily.rest_frh!==""){
            res = checkHm(daily.over_frh, daily.over_frm, daily.rest_frh, daily.rest_frm, "", "");
            res2 = checkHm(daily.rest_toh, daily.rest_tom, daily.over_toh, daily.over_tom, "", "");
            if(res!=="" || res2!==""){
              errmsg[errmsg.length] = {message: "時間外休憩の入力が不正です（時間外時間の範囲内で入力してください）", severity: "error"};
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        }

        /* 遅刻 */
        if(!(isEmptyStr(daily.late_reason) && isEmptyStr(daily.late_h) && isEmptyStr(daily.late_m))){
          if(isEmptyStr(daily.late_reason) || isEmptyStr(daily.late_h) || isEmptyStr(daily.late_m)){
            errmsg[errmsg.length] = {message: "遅刻の入力が不正です（入力する場合は全て必須）", severity: "error"};
          } else {
            res = checkHour(daily.late_h, "遅刻時間（時）");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"};
            }
    
            res = checkMin(daily.late_m, "遅刻時間（分）");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"};
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        }

        /* 外出 */
        if(!(isEmptyStr(daily.goout_reason) && isEmptyStr(daily.goout_frh) && isEmptyStr(daily.goout_frm) && isEmptyStr(daily.goout_toh) && isEmptyStr(daily.goout_tom))){
          if(isEmptyStr(daily.goout_reason) || isEmptyStr(daily.goout_frh) || isEmptyStr(daily.goout_frm) || isEmptyStr(daily.goout_toh) || isEmptyStr(daily.goout_tom)){
            errmsg[errmsg.length] = {message: "外出の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.goout_frh, "外出時間（自）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.goout_frm, "外出時間（自）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

            res = checkHour(daily.goout_toh, "外出時間（至）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.goout_tom, "外出時間（至）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

          /* 外出時間 */
          res = checkHm(daily.goout_frh, daily.goout_frm, daily.goout_toh, daily.goout_tom, "外出時間（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        } 

        /* 早退 */
        if(!(isEmptyStr(daily.early_reason) && isEmptyStr(daily.early_h) && isEmptyStr(daily.early_m))){
          if(isEmptyStr(daily.early_reason) || isEmptyStr(daily.early_h) || isEmptyStr(daily.early_m)){
            errmsg[errmsg.length] = {message: "早退の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.early_h, "早退時間（時）");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.early_m, "早退時間（分）");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        }

        /* 遅刻時間（所定時間との依存関係） */
        if(!isEmptyStr(daily.late_h)){
          res = checkHm(defPrescribed_frh, defPrescribed_frm, daily.late_h, daily.late_m, "", "");
          res2 = checkHm(daily.late_h, daily.late_m, defPrescribed_toh, defPrescribed_tom, "", "");
          if(res!=="" || res2!==""){
            errmsg[errmsg.length] = {message: "遅刻時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"}
          }
        }

        /* 外出時間（所定時間との依存関係） */
        if(!isEmptyStr(daily.goout_frm)){
          res = checkHm(defPrescribed_frh, defPrescribed_frm, daily.goout_frh, daily.goout_frm, "", "");
          res2 = checkHm(daily.goout_toh, daily.goout_tom, defPrescribed_toh, defPrescribed_tom, "", "");
          if(res!=="" || res2!==""){
            errmsg[errmsg.length] = {message: "外出時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"}
          }
        }

        /* 早退時間（所定時間との依存関係） */
        if(!isEmptyStr(daily.early_h)){
          res = checkHm(defPrescribed_frh, defPrescribed_frm, daily.early_h, daily.early_m, "", "");
          res2 = checkHm(daily.early_h, daily.early_m, defPrescribed_toh, defPrescribed_tom, "", "");
          if(res!=="" || res2!==""){
            errmsg[errmsg.length] = {message: "早退時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"}
          }
        }

        /* 遅刻（外出との異存関係） */
        if(!isEmptyStr(daily.late_h) && !isEmptyStr(daily.goout_frh)) {
          res = checkHm(daily.late_h, daily.late_m, daily.goout_frh, daily.goout_frm, "遅刻時間", "（外出時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }
        }

        /* 遅刻（早退との依存関係） */
        if(!(daily.late_h) && !isEmptyStr(daily.early_h)) {
          res = checkHm(daily.late_h, daily.late_m, daily.early_h, daily.early_m, "遅刻時間", "（早退時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }
        }

        /* 外出（早退との依存関係） */
        if(!isEmptyStr(daily.goout_frh) && !isEmptyStr(daily.early_h)) {
          res = checkHm(daily.goout_toh, daily.goout_tom, daily.early_h, daily.earlt_m, "外出時間", "（早退時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }
        
        break;

      case '時差':

        /* 時差勤務理由 */
        if(isEmptyStr(daily.kbn_reason)) {
          errmsg[errmsg.length] = {message: "時差勤務理由が未入力です", severity: "error"};
        }

        /* 所定時間 */
        res = checkHour(daily.prescribed_frh, "所定時間（自）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.prescribed_frm, "所定時間（自）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkHour(daily.prescribed_toh, "所定時間（至）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.prescribed_tom, "所定時間（至）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        /* 休憩時間 */
        res = checkHour(daily.lunch_frh, "休憩時間（自）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.lunch_frm, "休憩時間（自）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkHour(daily.lunch_toh, "休憩時間（至）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.lunch_tom, "休憩時間（至）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }

        /* 所定時間 */
        res = checkHm(daily.prescribed_frh, daily.prescribed_frm, daily.prescribed_toh, daily.prescribed_tom, "所定時間（自・至）", "（自＜至）");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        /* 休憩時間 */
        res = checkHm(daily.lunch_frh, daily.lunch_frm, daily.lunch_toh, daily.lunch_tom, "休憩時間（自・至）", "（自＜至）");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }

        /* 休憩時間（所定時間との依存関係） */
        res = checkHm(daily.prescribed_frh, daily.prescribed_frm, daily.lunch_frh, daily.lunch_frm, "", "");
        res2 = checkHm(daily.lunch_toh, daily.lunch_tom, daily.prescribed_toh, daily.prescribed_tom, "", "");
        if(res!=="" || res2!==""){
          errmsg[errmsg.length] = {message: "休憩時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"};
        }

        /* 時間外 */
        if(!(isEmptyStr(daily.over_reason) && isEmptyStr(daily.over_frh) && isEmptyStr(daily.over_frm) && isEmptyStr(daily.over_toh) && isEmptyStr(daily.over_tom) && 
            isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))){

          if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)){
            errmsg[errmsg.length] = {message: "時間外の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.over_frh, "時間外（自）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_frm, "時間外（自）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

            res = checkHour(daily.over_toh, "時間外（至）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_tom, "時間外（至）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
          }

          if(!(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))) {
            if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（時間外の入力が前提）", severity: "error"}
            }
            if(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（入力する場合は全て必須）", severity: "error"}
            } else {
              res = checkHour(daily.rest_frh, "時間外休憩（自）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_frm, "時間外休憩（自）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
  
              res = checkHour(daily.rest_toh, "時間外休憩（至）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_tom, "時間外休憩（至）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }  
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }
  
          /* 時間外 */
          res = checkHm(daily.over_frh, daily.over_frm, daily.over_toh, daily.over_tom, "時間外（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          /* 時間外休憩 */
          res = checkHm(daily.rest_frh, daily.rest_frm, daily.rest_toh, daily.rest_tom, "時間外休憩（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

          /* 時間外（所定時間との依存関係） */
          res = checkHm(daily.prescribed_toh, daily.prescribed_tom, daily.over_frh, daily.over_frm, "時間外（自）", "（所定時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"};
          }

          /* 時間外休憩（時間外との依存関係） */
          if(!isEmptyStr(daily.rest_frh)){
            res = checkHm(daily.over_frh, daily.over_frm, daily.rest_frh, daily.rest_frm, "", "");
            res2 = checkHm(daily.rest_toh, daily.rest_tom, daily.over_toh, daily.over_tom, "", "");
            if(res!=="" || res2!==""){
              errmsg[errmsg.length] = {message: "時間外休憩の入力が不正です（時間外時間の範囲内で入力してください）", severity: "error"};
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        }

        /* 外出 */
        if(!(isEmptyStr(daily.late_reason) && isEmptyStr(daily.goout_frh) && isEmptyStr(daily.goout_frm) && isEmptyStr(daily.goout_toh) && isEmptyStr(daily.goout_tom))){
          if(isEmptyStr(daily.late_reason) || isEmptyStr(daily.goout_frh) || isEmptyStr(daily.goout_frm) || isEmptyStr(daily.goout_toh) || isEmptyStr(daily.goout_tom)){
            errmsg[errmsg.length] = {message: "外出の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.goout_frh, "外出時間（自）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.goout_frm, "外出時間（自）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

            res = checkHour(daily.goout_toh, "外出時間（至）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.goout_tom, "外出時間（至）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

          /* 外出時間 */
          res = checkHm(daily.goout_frh, daily.goout_frm, daily.goout_toh, daily.goout_tom, "外出時間（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        } 

        /* 外出時間（所定時間との依存関係） */
        if(!isEmptyStr(daily.goout_frm)){
          res = checkHm(daily.prescribed_frh, daily.prescribed_frm, daily.goout_frh, daily.goout_frm, "", "");
          res2 = checkHm(daily.goout_toh, daily.goout_tom, daily.prescribed_toh, daily.prescribed_tom, "", "");
          if(res!=="" || res2!==""){
            errmsg[errmsg.length] = {message: "外出時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"}
          }
        }

        break;

      case '休暇':

        /* 休暇理由 */
        if(isEmptyStr(daily.kbn_reason)){
          errmsg[errmsg.length] = {message: "休暇理由が未入力です", severity: "error"} 
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }

        break;

      case '休出':
        /* 休出理由 */
        if(isEmptyStr(daily.kbn_reason)){
          errmsg[errmsg.length] = {message: "休出理由が未入力です", severity: "error"};
        }

        /* 所定時間 */
        res = checkHour(daily.prescribed_frh, "所定時間（自）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.prescribed_frm, "所定時間（自）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkHour(daily.prescribed_toh, "所定時間（至）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.prescribed_tom, "所定時間（至）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        /* 休憩時間 */
        res = checkHour(daily.lunch_frh, "休憩時間（自）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.lunch_frm, "休憩時間（自）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkHour(daily.lunch_toh, "休憩時間（至）・時");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"};
        }

        res = checkMin(daily.lunch_tom, "休憩時間（至）・分");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }

        /* 所定時間 */
        res = checkHm(daily.prescribed_frh, daily.prescribed_frm, daily.prescribed_toh, daily.prescribed_tom, "所定時間（自・至）", "（自＜至）");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        /* 休憩時間 */
        res = checkHm(daily.lunch_frh, daily.lunch_frm, daily.lunch_toh, daily.lunch_tom, "休憩時間（自・至）", "（自＜至）");
        if(res!==""){
          errmsg[errmsg.length] = {message: res, severity: "error"}
        }

        if(errmsg.length){
          setMsgs(errmsg);
          return true;
        }

        /* 休憩時間（所定時間との依存関係） */
        res = checkHm(daily.prescribed_frh, daily.prescribed_frm, daily.lunch_frh, daily.lunch_frm, "", "");
        res2 = checkHm(daily.lunch_toh, daily.lunch_tom, daily.prescribed_toh, daily.prescribed_tom, "", "");
        if(res!=="" || res2!==""){
          errmsg[errmsg.length] = {message: "休憩時間の入力が不正です（所定時間の範囲内で入力してください）", severity: "error"};
        }

        /* 時間外 */
        if(!(isEmptyStr(daily.over_reason) && isEmptyStr(daily.over_frh) && isEmptyStr(daily.over_frm) && isEmptyStr(daily.over_toh) && isEmptyStr(daily.over_tom) && 
            isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))){

          if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)){
            errmsg[errmsg.length] = {message: "時間外の入力が不正です（入力する場合は全て必須）", severity: "error"}
          } else {
            res = checkHour(daily.over_frh, "時間外（自）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_frm, "時間外（自）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }

            res = checkHour(daily.over_toh, "時間外（至）・時");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
            res = checkMin(daily.over_tom, "時間外（至）・分");
            if(res!==""){
              errmsg[errmsg.length] = {message: res, severity: "error"}
            }
    
          }

          if(!(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom))) {
            if(isEmptyStr(daily.over_reason) || isEmptyStr(daily.over_frh) || isEmptyStr(daily.over_frm) || isEmptyStr(daily.over_toh) || isEmptyStr(daily.over_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（時間外の入力が前提）", severity: "error"}
            }
            if(isEmptyStr(daily.rest_frh) && isEmptyStr(daily.rest_frm) && isEmptyStr(daily.rest_toh) && isEmptyStr(daily.rest_tom)) {
              errmsg[errmsg.length] = {message: "時間外休憩時間の入力が不正です（入力する場合は全て必須）", severity: "error"}
            } else {
              res = checkHour(daily.rest_frh, "時間外休憩（自）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_frm, "時間外休憩（自）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
  
              res = checkHour(daily.rest_toh, "時間外休憩（至）・時");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }
      
              res = checkMin(daily.rest_tom, "時間外休憩（至）・分");
              if(res!==""){
                errmsg[errmsg.length] = {message: res, severity: "error"}
              }  
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }
  
          /* 時間外 */
          res = checkHm(daily.over_frh, daily.over_frm, daily.over_toh, daily.over_tom, "時間外（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          /* 時間外休憩 */
          res = checkHm(daily.rest_frh, daily.rest_frm, daily.rest_toh, daily.rest_tom, "時間外休憩（自・至）", "（自＜至）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"}
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

          /* 時間外（所定時間との依存関係） */
          res = checkHm(daily.prescribed_toh, daily.prescribed_tom, daily.over_frh, daily.over_frm, "時間外（自）", "（所定時間と重なっています）");
          if(res!==""){
            errmsg[errmsg.length] = {message: res, severity: "error"};
          }

          /* 時間外休憩（時間外との依存関係） */
          if(!isEmptyStr(daily.rest_frh)){
            res = checkHm(daily.over_frh, daily.over_frm, daily.rest_frh, daily.rest_frm, "", "");
            res2 = checkHm(daily.rest_toh, daily.rest_tom, daily.over_toh, daily.over_tom, "", "");
            if(res!=="" || res2!==""){
              errmsg[errmsg.length] = {message: "時間外休憩の入力が不正です（時間外時間の範囲内で入力してください）", severity: "error"};
            }
          }

          if(errmsg.length){
            setMsgs(errmsg);
            return true;
          }

        }

        break;

      default:
    }

    return false
  }

  const checkHour = (h, name) => {
    if(isEmptyStr(h)){
      return name + "が未入力です";
    } else {
      if(Number(h)<0){
        return name + "が不正です（0〜）";
      }
    }
    return "";
  }

  const checkMin = (m, name) => {
    if(isEmptyStr(m)){
      return name + "が未入力です";
    } else {
      if(Number(m)<0 || Number(m)>59){
        return name + "が不正です（0〜59）";
      }
    }
    return "";
  }

  const checkHm = (frh, frm, toh, tom, name, comment) => {
    let from = zeroPadding(frh, 2) + zeroPadding(frm, 2);
    let to = zeroPadding(toh, 2) + zeroPadding(tom, 2);
    if(from>to){
      return name + "が不正です" + comment;
    }
    return "";
  }

  const handleConfirmOK = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      let res;
      if(daily.kbn==="通常"){
        res = await updateDailyRep(dailyId, setParam1)
      } else if(daily.kbn==="時差"){
        res = await updateDailyRep(dailyId, setParam2)
      } else if(daily.kbn==="休暇"){
        res = await updateDailyRep(dailyId, setParam3)
      } else {
        res = await updateDailyRep(dailyId, setParam4)
      }
      if (res.data.status === 500) {
        setMsgs([{message: "日報情報更新エラー(500)",
                severity: "error",}]);
      } else {
        setDailyId("");
        refresh();
      }
    } catch (e) {
      setMsgs([{message: "日報情報更新エラー",
              severity: "error",}]);
    }
  }

  // 通常の場合のパラメータ
  const setParam1 =  {
    kbn: daily.kbn,
    kbn_reason: "",
    prescribed_frh: defPrescribed_frh,
    prescribed_frm: defPrescribed_frm,
    prescribed_toh: defPrescribed_toh,
    prescribed_tom: defPrescribed_tom,
    lunch_frh: defLunch_frh,
    lunch_frm: defLunch_frm,
    lunch_toh: defLunch_toh,
    lunch_tom: defLunch_tom,
    over_reason: daily.over_reason,
    over_frh: daily.over_frh,
    over_frm: daily.over_frm,
    over_toh: daily.over_toh,
    over_tom: daily.over_tom,
    rest_frh: daily.rest_frh,
    rest_frm: daily.rest_frm,
    rest_toh: daily.rest_toh,
    rest_tom: daily.rest_tom,
    late_reason: daily.late_reason,
    late_h: daily.late_h,
    late_m: daily.late_m,
    goout_reason: daily.goout_reason,
    goout_frh: daily.goout_frh,
    goout_frm: daily.goout_frm,
    goout_toh: daily.goout_toh,
    goout_tom: daily.goout_tom,
    early_reason: daily.early_reason,
    early_h: daily.early_h,
    early_m: daily.early_m,
    status: "入力済",
  }

  // 時差の場合のパラメータ
  const setParam2 =  {
    kbn: daily.kbn,
    kbn_reason: daily.kbn_reason,
    prescribed_frh: daily.prescribed_frh,
    prescribed_frm: daily.prescribed_frm,
    prescribed_toh: daily.prescribed_toh,
    prescribed_tom: daily.prescribed_tom,
    lunch_frh: daily.lunch_frh,
    lunch_frm: daily.lunch_frm,
    lunch_toh: daily.lunch_toh,
    lunch_tom: daily.lunch_tom,
    over_reason: daily.over_reason,
    over_frh: daily.over_frh,
    over_frm: daily.over_frm,
    over_toh: daily.over_toh,
    over_tom: daily.over_tom,
    rest_frh: daily.rest_frh,
    rest_frm: daily.rest_frm,
    rest_toh: daily.rest_toh,
    rest_tom: daily.rest_tom,
    late_reason: "",
    late_h: "",
    late_m: "",
    goout_reason: daily.goout_reason,
    goout_frh: daily.goout_frh,
    goout_frm: daily.goout_frm,
    goout_toh: daily.goout_toh,
    goout_tom: daily.goout_tom,
    early_reason: "",
    early_h: "",
    early_m: "",
    status: "入力済",
  }

  // 休暇の場合のパラメータ
  const setParam3 = {
    kbn: daily.kbn,
    kbn_reason: daily.kbn_reason,
    prescribed_frh: "",
    prescribed_frm: "",
    prescribed_toh: "",
    prescribed_tom: "",
    lunch_frh: "",
    lunch_frm: "",
    lunch_toh: "",
    lunch_tom: "",
    over_reason: "",
    over_frh: "",
    over_frm: "",
    over_toh: "",
    over_tom: "",
    rest_frh: "",
    rest_frm: "",
    rest_toh: "",
    rest_tom: "",
    late_reason: "",
    late_h: "",
    late_m: "",
    goout_reason: "",
    goout_frh: "",
    goout_frm: "",
    goout_toh: "",
    goout_tom: "",
    early_reason: "",
    early_h: "",
    early_m: "",
    status: "入力済",
  }

  // 休出の場合のパラメータ
  const setParam4 =  {
    kbn: daily.kbn,
    kbn_reason: daily.kbn_reason,
    prescribed_frh: daily.prescribed_frh,
    prescribed_frm: daily.prescribed_frm,
    prescribed_toh: daily.prescribed_toh,
    prescribed_tom: daily.prescribed_tom,
    lunch_frh: daily.lunch_frh,
    lunch_frm: daily.lunch_frm,
    lunch_toh: daily.lunch_toh,
    lunch_tom: daily.lunch_tom,
    over_reason: daily.over_reason,
    over_frh: daily.over_frh,
    over_frm: daily.over_frm,
    over_toh: daily.over_toh,
    over_tom: daily.over_tom,
    rest_frh: daily.rest_frh,
    rest_frm: daily.rest_frm,
    rest_toh: daily.rest_toh,
    rest_tom: daily.rest_tom,
    late_reason: "",
    late_h: "",
    late_m: "",
    goout_reason: "",
    goout_frh: "",
    goout_frm: "",
    goout_toh: "",
    goout_tom: "",
    early_reason: "",
    early_h: "",
    early_m: "",
    status: "入力済",
  }
  
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  return (
    <>
    { dailyId ? (
      <div className="overlay">
        <div className="user-edit-container">
          <div className="header-area">
            <div className="header-title">日報入力</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          {msgs ? (
            <div className="message-frame">
              {msgs.map((msg,i) =>
                <Alert severity={msg.severity}>{msg.message}</Alert>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<SaveAltIcon />} 
              sx={{height:25}}
              onClick={(e) => handleSubmit(e)}>
              登録
            </Button>
          </div>

          <div className="date-area">{displayDate(daily.date)}</div>
          <div className="section-frame">
            <div className="section-title">■所定勤務</div>
            <div className="input-group">
              <div className="title">勤務区分:</div>
              <select 
                id="select-kbn" 
                name="kbn"
                value={daily.kbn} 
                className="select-kbn" 
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              >
                <option key={"select-kbn-1"} value={"通常"}>{"通常"}</option>
                <option key={"select-kbn-2"} value={"時差"}>{"時差"}</option>
                <option key={"select-kbn-3"} value={"休暇"}>{"休暇"}</option>
                <option key={"select-kbn-4"} value={"休出"}>{"休出"}</option>
              </select>
            </div>
            <PrescribedArea daily={daily} handleChange={handleChange} /> 
          </div>
          <OverArea daily={daily} handleChange={handleChange} />
          <OthersArea daily={daily} handleChange={handleChange}  />
        </div>
        <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
      </div>
    ) : (
      <></>
    )}
    </>
  );
}

export default UserEditPage;

const PrescribedArea = (props) => {
  const {daily, handleChange} = props;
  if ( daily.kbn==="通常") {
    return (
      <>
        <div className="input-group">
          <div className="title">所定勤務時間:</div>
          <div className="label-time">{defPrescribed_frh}</div>
          <div className="inner-caption1">{":"}</div>
          <div className="label-time">{defPrescribed_frm}</div>
          <div className="inner-caption2">{"〜"}</div>
          <div className="label-time">{defPrescribed_toh}</div>
          <div className="inner-caption1">{":"}</div>
          <div className="label-time">{defPrescribed_tom}</div>
        </div>
        <div className="input-group">
          <div className="title">休憩時間:</div>
          <div className="label-time">{defLunch_frh}</div>
          <div className="inner-caption1">{":"}</div>
          <div className="label-time">{defLunch_frm}</div>
          <div className="inner-caption2">{"〜"}</div>
          <div className="label-time">{defLunch_toh}</div>
          <div className="inner-caption1">{":"}</div>
          <div className="label-time">{defLunch_tom}</div>
        </div>
      </>
    );
  } else if (daily.kbn==="時差") {
    return (
      <>
        <div className="input-group">
          <div className="title">時差勤務理由:</div>
          <input 
            type="text" 
            name="kbn_reason" 
            id="kbn_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.kbn_reason || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">所定勤務時間:</div>
          <input 
            type="text" 
            name="prescribed_frh" 
            id="prescribed_frh" 
            maxLength="2"
            className="edit-time"
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_frh || ''}
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="prescribed_frm" 
            id="prescribed_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="prescribed_toh" 
            id="prescribed_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="prescribed_tom" 
            id="prescribed_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_tom || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">休憩時間:</div>
          <input 
            type="text" 
            name="lunch_frh" 
            id="lunch_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="lunch_frm" 
            id="lunch_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="lunch_toh" 
            id="lunch_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="lunch_tom" 
            id="lunch_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_tom || ''} 
          />
          <div className="comment1">※所定時間の範囲内で入力してください。</div>
        </div>
      </>
    );
  } else if (daily.kbn==="休暇") {
    return (
      <>
        <div className="input-group">
          <div className="title">休暇理由:</div>
          <input 
            type="text" 
            name="kbn_reason" 
            id="kbn_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.kbn_reason || ''} 
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="input-group">
          <div className="title">休出理由:</div>
          <input 
            type="text" 
            name="kbn_reason" 
            id="kbn_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.kbn_reason || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">所定勤務時間:</div>
          <input 
            type="text" 
            name="prescribed_frh" 
            id="prescribed_frh" 
            maxLength="2"
            className="edit-time"
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_frh || ''}
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="prescribed_frm" 
            id="prescribed_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="prescribed_toh" 
            id="prescribed_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="prescribed_tom" 
            id="prescribed_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.prescribed_tom || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">休憩時間:</div>
          <input 
            type="text" 
            name="lunch_frh" 
            id="lunch_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="lunch_frm" 
            id="lunch_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="lunch_toh" 
            id="lunch_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="lunch_tom" 
            id="lunch_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.lunch_tom || ''} 
          />
          <div className="comment1">※所定時間の範囲内で入力してください。</div>
        </div>
      </>
    );
  }
}

const OverArea = (props) => {
  const {daily, handleChange} = props;
  if (daily.kbn==="通常" || daily.kbn==="時差" || daily.kbn==="休出") {
    return (
      <div className="section-frame">
        <div className="section-title">■時間外</div>
        <div className="input-group">
          <div className="title">時間外理由:</div>
          <input 
            type="text" 
            name="over_reason" 
            id="over_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.over_reason || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">時間外時間:</div>
          <input 
            type="text" 
            name="over_frh" 
            id="over_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.over_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="over_frm" 
            id="over_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.over_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="over_toh" 
            id="over_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.over_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="over_tom" 
            id="over_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.over_tom || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">休憩時間:</div>
          <input 
            type="text" 
            name="rest_frh" 
            id="rest_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.rest_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="rest_frm" 
            id="rest_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.rest_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="rest_toh" 
            id="rest_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.rest_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="rest_tom" 
            id="rest_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.rest_tom || ''} 
          />
          <div className="comment1">※時間外時間の範囲内で入力してください。</div>
        </div>
      </div>
    );
  } else {
    return (<></>);
  }
}

const OthersArea = (props) => {
  const {daily, handleChange} = props;
  if (daily.kbn==="通常") {
    return (
      <div className="section-frame">
        <div className="section-title">■遅刻・外出・早退</div>
        <div className="input-group">
          <div className="title">遅刻:</div>
          <input 
            type="text" 
            name="late_reason" 
            id="late_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.late_reason || ''} 
          />
          <input 
            type="text" 
            name="late_h" 
            id="late_h" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.late_h || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="late_m" 
            id="late_m" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.late_m || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">外出:</div>
          <input 
            type="text" 
            name="goout_reason" 
            id="goout_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.goout_reason || ''} 
          />
          <input 
            type="text" 
            name="goout_frh" 
            id="goout_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="goout_frm" 
            id="goout_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="goout_toh" 
            id="goout_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="goout_tom" 
            id="goout_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_tom || ''} 
          />
        </div>
        <div className="input-group">
          <div className="title">早退:</div>
          <input 
            type="text" 
            name="early_reason" 
            id="early_reason" 
            maxLength="30"
            className="edit-reason" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.early_reason || ''} 
          />
          <input 
            type="text" 
            name="early_h" 
            id="early_h" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.early_h || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="early_m" 
            id="early_m" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.early_m || ''} 
          />
        </div>
        <br />
        <div className="comment2">※所定時間の範囲内で入力してください。</div>
        <div className="comment2">※遅刻、外出、早退は重ならないように入力してください。</div>
      </div>
    );
  } else if (daily.kbn==="時差") {
    return (
      <div className="section-frame">
        <div className="section-title">■外出</div>
        <div className="input-group">
          <div className="title">外出:</div>
          <input 
            type="text" 
            name="goout_frh" 
            id="goout_frh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_frh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="goout_frm" 
            id="goout_frm" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_frm || ''} 
          />
          <div className="inner-caption2">{"〜"}</div>
          <input 
            type="text" 
            name="goout_toh" 
            id="goout_toh" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_toh || ''} 
          />
          <div className="inner-caption1">{":"}</div>
          <input 
            type="text" 
            name="goout_tom" 
            id="goout_tom" 
            maxLength="2"
            className="edit-time" 
            onChange={(e) => handleChange(e.target.name, integerValidator(e))} 
            value={daily.goout_tom || ''} 
          />
          <input 
            type="text" 
            name="goout_reason" 
            id="goout_reason" 
            maxLength="30"
            className="edit-reason after" 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            value={daily.goout_reason || ''} 
          />
        </div>
        <br />
        <div className="comment2">※所定時間の範囲内で入力してください。</div>
      </div>
    );    
  } else {
    return (<></>);
  }
}
