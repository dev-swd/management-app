import './Project.css';
import { useState } from 'react';
import RepEditPage from './Report/RepEditPage';
import AuditShowPage from './Audit/AuditShowPage';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const RepCreatePage = (props) => {
  const { prj_id } = props;
  const [value, setValue] = useState("0");

  const handleChange = (event,newValue) => {
    setValue(newValue);
  }

  return (
    <>
      <RepEditPage prj_id={prj_id} />
      <div className="right-container">
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            <Tab label="監査結果" value="0" />
          </TabList>
          <TabPanel value="0">
            <AuditShowPage prj_id={prj_id} kbn="report" />
          </TabPanel>
        </TabContext>
      </div>
    </>
  )

}

export default RepCreatePage;