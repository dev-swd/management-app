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

const ProgRepDetailPage = (props) => {
  const { progId, setProgId } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [value, setValue] = useState("0");

  const handleClose = (e) => {
    setMessage("");
    setProgId("");
  }

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <>
    { progId ? (
      <div className="overlay">
        <div className="m6-prog-detail-container">
          <div className="header-area">
            <div className="header-title">進捗レポート</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}
          
          <div className="inner">
            <TabContext value={value} >
              <TabList onChange={handleChange}>
                <Tab label="EVM" value="0" />
                <Tab label="EVMグラフ" value="1" />
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
            </TabContext>
          </div>
        </div>
      </div>
    ) : (
      <></>
    )}
    </>

  )
}
export default ProgRepDetailPage;
