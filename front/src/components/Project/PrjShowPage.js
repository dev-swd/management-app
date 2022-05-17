import './Project.css';
import { useState } from 'react';
import ShowPage from "./Project/PrjShowPage";
import AuditShowPage from "./Audit/AuditShowPage";
import LogShowPage from "./Changelog/LogShowPage";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const PrjShowPage = (props) => {
  const { prj_id } = props;
  const [value, setValue] = useState("0");

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <>
      <ShowPage prj_id={prj_id} />
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
            <AuditShowPage prj_id={prj_id} />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
}

export default PrjShowPage;
