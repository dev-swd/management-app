import "./MemAddPage.css";
import { useState, useEffect } from 'react';
import { getEmps } from '../../../lib/api/employee';
import Button from '@mui/material/Button';

const initEmp = {id: "", name: ""}

const MemAddPage = (props) => {
  const { addMemFlg, setAddMemFlg, handleAddMemOK } = props;
  const [emps, setEmps] = useState([]);
  const [emp, setEmp] = useState(initEmp);

  useEffect(() => {
    handleGetEmps();
  },[])

  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      setEmps(res.data);
    } catch (e) {
    }      
  }

  const handleChange = (e) => {
    const tergetEmp = emps.find((v) => v.id === Number(e.target.value));
    setEmp({
      ...emp,
      id: e.target.value,
      name: tergetEmp.name
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddMemOK(emp.id, emp.name);
    setAddMemFlg(false);
    setEmp(initEmp);
  }

  const handleBack = (e) => {
    setAddMemFlg(false);
    setEmp(initEmp);
  }

  return (
    <>
    { addMemFlg ? (
      <div className="overlay">
        <div className="mem-add-container">
          <div className="header-area">
            <div className="header-title">Add Member</div>
          </div>

          <div className="mem-entry-area">
            <select 
              name="emp-list"
              id="emp-list"
              className="emp-list" 
              onChange={(e) => handleChange(e)}
              value={emp.id}
            >
              <option key={""} value="">{""}</option>
              {emps.map((emp,i) => (
                <option key={"emp-" + i} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              onClick={(e) => handleSubmit(e)}
              disabled={!emp.id ? true : false}
            >
              OK
            </Button>
            {"　"}
            <Button size="small" variant="contained" onClick={(e) => handleBack(e)}>キャンセル</Button>
          </div>
        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  );
}

export default MemAddPage;