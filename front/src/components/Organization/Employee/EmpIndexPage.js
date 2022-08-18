import "./EmpIndexPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getEmps, deleteEmp } from '../../../lib/api/employee';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import EmpUpdPage from './EmpUpdatePage';
import EmpShowPage from './EmpShowPage';
import ModalConfirm from '../../common/ModalConfirm';

const EmpIndexPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [emps, setEmps] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [showId, setShowId] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  useEffect(() => {
    handleGetEmps();
  }, []);

  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      setEmps(res.data.emps);
    } catch (e) {
      setMessage("社員情報取得エラー");
      setMessageVar("error");
    } 
  }

  const handleDelEmp = (param) => {
    setConfirm({
      ...confirm,
      msg: "[" + param.number + "]" + param.name + "を削除します。よろしいですか。",
      tag: param.id,
    })
  }

  const handleDelOk = async (id) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await deleteEmp(Number(id));
      handleGetEmps();
    } catch (e) {
      setMessage("社員情報削除エラー");
      setMessageVar("error");
    }
  }

  const handleDelCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  return (
    <div className="emp-index-background">
      <div className="emp-index-container">
        <div className="header-area">
          <div className="header-title">Employees</div>
        </div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <div className="table-frame">
          <Table striped bordered hover>
            <thead>
              <tr className="head-tr">
                <th className="head-td">番号</th>
                <th className="head-td">氏名</th>
                <th className="head-td">所属</th>
                <th className="head-td"></th>
              </tr>
            </thead>
            <tbody>
              {emps.map((emp) => 
                <tr key={emp.id} className="body-tr">
                  <td className="number-td">{emp.number}</td>
                  <td className="name-td">{emp.name}</td>
                  <td className="department-td">{emp.dep_name + "　" + emp.div_name}</td>
                  <td className="button-td">
                    <IconButton aria-label="show" color="secondary" size="small" onClick={() => setShowId(emp.id)} disabled={!authInfo.empshow}>
                      <FileOpenIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="edit" color="primary" size="small" onClick={() => setUpdateId(emp.id)} disabled={!authInfo.empupdate}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelEmp(emp)} disabled={!authInfo.empdelete}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <EmpUpdPage  updateId={updateId} setUpdateId={setUpdateId} handleGetEmps={handleGetEmps} />
      <EmpShowPage  showId={showId} setShowId={setShowId} />
      <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
    </div>
  );
}

export default EmpIndexPage;