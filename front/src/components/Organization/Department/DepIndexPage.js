import "./DepIndexPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDeps, deleteDep } from '../../../lib/api/department';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DepNewPage from './DepNewPage';
import DepUpdPage from './DepUpdatePage';
import ModalConfirm from '../../common/ModalConfirm';

const DepIndexPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [deps, setDeps] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  useEffect(() => {
    handleGetDeps();
  }, []);

  const handleGetDeps = async () => {
    try {
      const res = await getDeps();
      setDeps(res.data.deps);
    } catch (e) {
      setMessage("事業部情報取得エラー");
      setMessageVar("error");
    } 
  }

  const handleDelDep = (param) => {
    setConfirm({
      ...confirm,
      msg: "[" + param.code + "]" + param.name + "を削除します。よろしいですか。",
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
      const res = await deleteDep(Number(id));
      handleGetDeps();
    } catch (e) {
      setMessage("事業部情報削除エラー");
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
    <div className="dep-index-background">
      <div className="dep-index-container">
        <div className="header-area">
          <div className="header-title">Departments</div>
        </div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <div className="table-frame">
          <Table striped bordered hover>
            <thead>
              <tr className="head-tr">
                <th className="head-td">コード</th>
                <th className="head-td">名称</th>
                <th className="head-td"></th>
              </tr>
            </thead>
            <tbody>
              {deps.map((dep) => 
                <tr key={dep.id} className="body-tr">
                  <td className="code-td">{dep.code}</td>
                  <td className="name-td">{dep.name}</td>
                  <td className="button-td">
                    <IconButton aria-label="edit" color="primary" size="small" onClick={() => setUpdateId(dep.id)} disabled={!authInfo.depupdate}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelDep(dep)} disabled={!authInfo.depdelete}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="button-area">
          { authInfo.depnew && 
          <IconButton aria-label="Add" color="primary" size="large" onClick={() => setShowNewModal(true)}>
            <AddCircleIcon sx={{ fontSize : 40 }} />
          </IconButton>
          }
        </div>
      </div>
      <DepNewPage  showFlg={showNewModal} setShowModal={setShowNewModal} handleGetDeps={handleGetDeps} />
      <DepUpdPage  updateId={updateId} setUpdateId={setUpdateId} handleGetDeps={handleGetDeps} />
      <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
    </div>
  )

}

export default DepIndexPage;