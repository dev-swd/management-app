// m2b
import './PrjModifyPage.css';
import { useState } from 'react';
import PrjUpdatePage from './Project/PrjUpdatePage';
import LogShowPage from './Changelog/LogShowPage';
import AuditShowPage from './Audit/AuditShowPage';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const PrjModifyPage = (props) => {
  const { prjId } = props;
  const [value, setValue] = useState("0");
  const [inputErr, setInputErr] = useState(null);

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  // エラー表示クローズ時の処理
  const handleClose = () => {
    setInputErr(null);
  }

  return (
    <div className="m2b-container">
      <div className="m2b-left">
        <PrjUpdatePage prjId={prjId} kbn={"mod"} setInputErr={setInputErr} />
      </div>
      <div className="m2b-right">
        { inputErr ? (
          <>
            <div className="m2b-err-header">
              <div className="m2b-err-title">{"入力エラー"}</div>
              <button 
                className="link-style-btn m2b-link-close" 
                type="button" 
                onClick={() => handleClose()}>
                {"[閉じる]"}
              </button>
            </div>
            <div className="m2b-err-frame">
              <ul className="m2b-err-list">
                { inputErr.map((e,i) => 
                  <li>{e.msg}</li>
                )}
              </ul>              
            </div>
          </>
        ) : (
          <TabContext value={value}>
            <TabList onChange={handleChange}>
              <Tab label="変更履歴" value="0" />
              <Tab label="監査結果" value="1" />
            </TabList>
            <TabPanel value="0">
              <div className="m2b-right-position">
                <LogShowPage prjId={prjId} />
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div className="m2b-right-position">
                <AuditShowPage prjId={prjId} kbn="plan" />
              </div>
            </TabPanel>
          </TabContext>
        )}
      </div>

    </div>
  )
}

export default PrjModifyPage;