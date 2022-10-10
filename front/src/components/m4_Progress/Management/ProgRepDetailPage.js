// m44
import "./ProgRepDetailPage.css";
import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';
import EvmShowPage from './EvmShowPage';
import EvmGraphPage from './EvmGraphPage';
import PhasesGraphPage from "./PhasesGraphPage";
import PhasePlanActualPage from "./PhasePlanActualPage";

const ProgRepDetailPage = (props) => {
  const { progId, closeWin } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [value, setValue] = useState("0");

  // 画面終了時の処理
  const handleClose = () => {
    setMessage("");
    closeWin();
  }

  // タブ選択時の処理
  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  // 画面編集
  return (
    <>
    { progId ? (
      <div className="overlay">
        <div className="m44-container">
          <div className="m44-header-area">
            <div className="m44-header-title">進捗レポート</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose()}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}
          
          <TabContext value={value} >
            <TabList onChange={handleChange}>
              <Tab label="EVM" value="0" />
              <Tab label="EVMグラフ" value="1" />
              <Tab label="工程別工数グラフ" value="2" />
              <Tab label="工程別コストグラフ" value="3" />
              <Tab label="工程予実表" value="4" />
            </TabList>
            <TabPanel value="0">
              <EvmShowPage 
                progId={progId} 
                level="project"
                phase=""
                setMessage={setMessage} />
            </TabPanel>
            <TabPanel value="1">
              <EvmGraphPage
                progId={progId} 
                level="project"
                phase=""
                setMessage={setMessage} />
            </TabPanel>
            <TabPanel value="2">
              <PhasesGraphPage
                progId={progId}
                kbn="workload" 
                setMessage={setMessage} />
            </TabPanel>
            <TabPanel value="3">
              <PhasesGraphPage
                progId={progId} 
                kbn="cost" 
                setMessage={setMessage} />
            </TabPanel>
            <TabPanel value="4">
              <PhasePlanActualPage
                progId={progId} 
                setMessage={setMessage} />
            </TabPanel>
          </TabContext>
        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  )
}
export default ProgRepDetailPage;
