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
  const { dailyInfo, setDailyInfo } = props;
  const { empInfo } = useContext(AuthContext)
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const [value, setValue] = useState("0");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirm({
      ...confirm,
      msg: "承認します。よろしいですか？",
      tag: "",
    })
  }

  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  const handleConfirmOK = async (e) => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await approvalUpdate(setParam);
      if (res.data.status === 500) {
        setMessage("日報情報更新エラー(500)");
        setMessageVar("error");
      } else {
        setDailyInfo({
          ...dailyInfo,
          id: "",
          date: "",
        });
      }
    } catch (e) {
      setMessage("日報情報更新エラー");
      setMessageVar("error");
    }
  }

  const setParam = {
    approvals: [{id: dailyInfo.id, approval_id: empInfo.id}]
  }

  const handleClose = (e) => {
    setDailyInfo({
      ...dailyInfo,
      id: "",
      date: "",
    });
  }

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <>
    { dailyInfo.id ? (
      <div className="overlay">
        <div className="daily-detail-container">
          <div className="header-area">
            <div className="header-title">日報詳細</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          { message_var && <Alert severity={message_var}>{message}</Alert>}

          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              endIcon={<ThumbUpAltIcon />} 
              sx={{height:25}}
              onClick={(e) => handleSubmit(e)}>
              承認
            </Button>
          </div>

          <div className="inner">
            <TabContext value={value} >
              <TabList onChange={handleChange}>
                <Tab label="日報" value="0" />
                <Tab label="詳細" value="1" />
              </TabList>
              <TabPanel value="0">
                <DailyShowPage 
                  dailyId={dailyInfo.id} 
                  setMessage={setMessage} 
                  setMessageVar={setMessageVar} />
              </TabPanel>
              <TabPanel value="1">
                <DailyWorkShowPage 
                  dailyInfo={dailyInfo} 
                  setMessage={setMessage} 
                  setMessageVar={setMessageVar} />
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
