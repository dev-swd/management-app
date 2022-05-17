import './Project.css';
import { useState } from 'react';
import PrjUpdatePage from './Project/PrjUpdatePage';
import LogShowPage from './Changelog/LogShowPage';
import AuditShowPage from './Audit/AuditShowPage';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const PrjCreatePage = (props) => {
  const { prj_id } = props;
  const [value, setValue] = useState("0");

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <>
      <PrjUpdatePage prj_id={prj_id} />
      <div className="right-container">
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            <Tab label="変更履歴" value="0" />
            <Tab label="監査結果" value="1" />
          </TabList>
          <TabPanel value="0">
            <LogShowPage prj_id={prj_id} />
          </TabPanel>
          <TabPanel value="1">
            <AuditShowPage prj_id={prj_id} kbn="plan" />
          </TabPanel>
        </TabContext>
      </div>
    </>
  )
}

export default PrjCreatePage;