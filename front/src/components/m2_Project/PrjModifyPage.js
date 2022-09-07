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

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <div className="m2b-container">
      <div className="m2b-left">
        <PrjUpdatePage prjId={prjId} kbn={"mod"} />
      </div>
      <div className="m2b-right">
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
      </div>

    </div>
  )
}

export default PrjModifyPage;