import { useState, useEffect } from 'react';
import { getDeps } from '../../lib/api/department';

const SelectDepartment = (props) => {
  const { name, id, className, value, handleChange } = props;
  const [deps, setDeps] = useState([]);

  useEffect(() => {
    handleGetDeps();
  },[])

  const handleGetDeps = async () => {
    try {
      const res = await getDeps();
      setDeps(res.data);
    } catch (e) {
    }      
  }

  return (
    <select 
      name={name}
      id={id}
      className={className} 
      onChange={(e) => handleChange(e.target.name, e.target.value)}
      value={value}
    >
      <option key={""} value="">{""}</option>
      {deps.map((dep,i) => (
        <option key={id + i} value={dep.id}>{dep.name}</option>
      ))}
    </select>
  )  
}

export default SelectDepartment;