import "./DivIndexPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../App';
import { getDivsWithAuthcnt, deleteDiv } from '../../../lib/api/division';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DivNewPage from './DivNewPage';
import DivUpdPage from './DivUpdatePage';
import ModalConfirm from '../../common/ModalConfirm';

const DivIndexPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [divs, setDivs] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  useEffect(() => {
    handleGetDivs();
  }, []);

  const handleGetDivs = async () => {
    try {
      const res = await getDivsWithAuthcnt();
      setDivs(res.data.divs);
    } catch (e) {
      setMessage("課情報取得エラー");
      setMessageVar("error");
    } 
  }

  const handleDelDiv = (param) => {
    setConfirm({
      ...confirm,
      msg: "[" + param.dep_code + "-" + param.code + "]" + param.dep_name + "　" + param.name + "を削除します。よろしいですか。",
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
      const res = await deleteDiv(Number(id));
      handleGetDivs();
    } catch (e) {
      setMessage("課情報削除エラー");
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
    <div className="div-index-background">
      <div className="div-index-container">
        <div className="header-area">
          <div className="header-title">Divisions</div>
        </div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <table className="table-hd">
          <thead>
            <tr className="head-tr">
              <th colSpan="2" className="head-td dep-td">事業部</th>
              <th colSpan="2" className="head-td div-td">課</th>
              <th className="head-td div-auth-td">承認者</th>
              <th className="head-td button-td"></th>
            </tr>
          </thead>
        </table>
        <div className="table-frame">
          <table className="table-bd StripeTable">
            <tbody>
              {divs.map((div) => 
                <tr key={div.id} className="body-tr">
                  <td className="dep-code-td">{div.dep_code}</td>
                  <td className="dep-name-td">{div.dep_name}</td>
                  <td className="div-code-td">{div.code}</td>
                  <td className="div-name-td">{div.name}</td>
                  <td className="div-auth-td">{div.auth_cnt + "名"}</td>
                  <td className="button-td">
                    <IconButton aria-label="edit" color="primary" size="small" onClick={() => setUpdateId(div.id)} disabled={!authInfo.divupdate}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelDiv(div)} disabled={!authInfo.divdelete}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="button-area">
          {authInfo.divnew && 
          <IconButton aria-label="Add" color="primary" size="large" onClick={() => setShowNewModal(true)}>
            <AddCircleIcon sx={{ fontSize : 40 }} />
          </IconButton>
          }
        </div>
      </div>
      <DivNewPage  showFlg={showNewModal} setShowModal={setShowNewModal} handleGetDivs={handleGetDivs} />
      <DivUpdPage  updateId={updateId} setUpdateId={setUpdateId} handleGetDivs={handleGetDivs} />
      <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
    </div>
  );
}

export default DivIndexPage;
