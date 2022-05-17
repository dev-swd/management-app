import { useState, useEffect } from 'react';
import { getDivs } from '../../lib/api/division';

const SelectDivision = (props) => {
  const { name, id, className, value, handleChange } = props;
  const [divs, setDivs] = useState([]);

  useEffect(() => {
    handleGetDivs();
  },[])

  const handleGetDivs = async () => {
    try {
      const res = await getDivs();
      setDivs(res.data);
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
      {divs.map((div,i) => (
        <option key={id + i} value={div.id}>{div.dep_name}{"　"}{div.name}</option>
      ))}
    </select>
  )  
}

export default SelectDivision;