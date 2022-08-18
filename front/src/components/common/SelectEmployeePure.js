import { useState, useEffect } from 'react';
import { getEmps } from '../../lib/api/employee';

const SelectEmployeePure = (props) => {
  const { name, id, className, value, handleChange, index, numFlg } = props;
  const [emps, setEmps] = useState([]);

  useEffect(() => {
    handleGetEmps();
  },[])

  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      setEmps(res.data.emps);
    } catch (e) {
    }      
  }

  return (
    <>
    {typeof index === 'undefined' ? (
      <select 
        name={name}
        id={id}
        className={className} 
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        value={value}
      >
        <option key={""} value="">{""}</option>
        {numFlg ? (
          <>
          {emps.map((emp,i) => (
            <option key={id + i} value={emp.id}>{emp.number + ":" + emp.name}</option>
          ))}
          </>
        ) : (
          <>
          {emps.map((emp,i) => (
            <option key={id + i} value={emp.id}>{emp.name}</option>
          ))}
          </>          
        )}
      </select>
    ) : (
      <select 
        name={name}
        id={id}
        className={className} 
        onChange={(e) => handleChange(index, e.target.name, e.target.value)}
        value={value}
      >
        <option key={""} value="">{""}</option>
        {numFlg ? (
          <>
          {emps.map((emp,i) => (
            <option key={id + i} value={emp.id}>{emp.number + ":" + emp.name}</option>
          ))}
          </>
        ) : (
          <>
          {emps.map((emp,i) => (
            <option key={id + i} value={emp.id}>{emp.name}</option>
          ))}
          </>
        )}
      </select>
    )}
    </>
  )
}

export default SelectEmployeePure;