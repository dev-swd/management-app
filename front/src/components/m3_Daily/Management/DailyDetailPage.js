// m35
import "./DailyDetailPage.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';
import DailyShowPage from './DailyShowPage';
import DailyWorkShowPage from './DailyWorkShowPage';
import ModalConfirm from '../../common/ModalConfirm';
import { approvalUpdate } from '../../../lib/api/daily';
import Alert from "@mui/material/Alert";

const DailyDetailPage = (props) => {
  const { dailyInfo, closeWin } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [value, setValue] = useState("0");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 承認ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "承認します。よろしいですか？",
      tag: "",
    })
  }

  // 承認確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 承認確認OKボタン押下時の処理
  const handleConfirmOK = async (e) => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await approvalUpdate(setParam);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "日報情報更新エラー(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "日報情報更新エラー"});
    }
  }

  // 承認更新パラメータ
  const setParam = {
    approvals: [{id: dailyInfo.id, approval_id: empInfo.id}]
  }

  // 画面終了リンククリック時の処理
  const handleClose = () => {
    closeWin();
  }

  // タブ選択時の処理
  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  // 承認ボタン非活性制御
  const setDisabledSubmit = () => {
    if (dailyInfo.status === "申請中") {
      return false;
    } else {
      return true;
    }
  }
  
  return (
    <>
    { dailyInfo.id ? (
      <div className="overlay">
        <div className="daily-detail-container">
          <div className="m35-header-area">
            <div className="m35-header-title">日報詳細</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose()}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <Button 
            size="small" 
            variant="contained" 
            endIcon={<ThumbUpAltIcon />} 
            style={{height:25, marginTop:20, marginLeft:20}}
            onClick={(e) => handleSubmit(e)}
            disabled={setDisabledSubmit()}
          >
            承認
          </Button>

          <div className="m35-tab-container">
            <TabContext value={value} >
              <TabList onChange={handleChange}>
                <Tab label="日報" value="0" />
                <Tab label="詳細" value="1" />
              </TabList>
              <TabPanel value="0">
                <DailyShowPage 
                  dailyId={dailyInfo.id} 
                  setMessage={setMessage} 
                />
              </TabPanel>
              <TabPanel value="1">
                <DailyWorkShowPage 
                  dailyInfo={dailyInfo} 
                  setMessage={setMessage} 
                />
              </TabPanel>
            </TabContext>
          </div>
        </div>
        <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
      </div>
    ) : (
      <></>
    )}
    </>
  )
}
export default DailyDetailPage;
