// m2a
import './PrjViewPage.css';
import { useState } from 'react';
import PrjShowPage from "./Project/PrjShowPage";
import AuditShowPage from "./Audit/AuditShowPage";
import LogShowPage from "./Changelog/LogShowPage";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const PrjViewPage = (props) => {
  const { prjId } = props;
  const [value, setValue] = useState("0");

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <div className="m2a-container">
      <div className="m2a-left">
        <PrjShowPage prjId={prjId} />
      </div>
      <div className="m2a-right">
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            <Tab label="変更履歴" value="0" />
            <Tab label="監査結果" value="1" />
          </TabList>
          <TabPanel value="0">
            <div className="m2a-right-position">
              <LogShowPage prjId={prjId} />
            </div>
          </TabPanel>
          <TabPanel value="1">
            <div className="m2a-right-position">
              <AuditShowPage prjId={prjId} kbn="plan" />
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default PrjViewPage;
