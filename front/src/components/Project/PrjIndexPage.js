import "./PrjIndexPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getPrjs, deletePrj } from '../../lib/api/project';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { displayDate } from '../../lib/common/datotostr';
import PrjNewPage from './PrjNewPage';
import ModalConfirm from '../common/ModalConfirm';

const PrjIndexPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [prjs, setPrjs] = useState([]);
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");    //'primary','secondary','success','danger','warning','info','light','dark'
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();

  useEffect(() => {
    handleGetPrjs();
  }, []);

  const handleGetPrjs = async () => {
    try {
      const res = await getPrjs();
      setPrjs(res.data);
    } catch (e) {
      setMessage("プロジェクト情報取得エラー");
      setMessageVar("error");
    } 
  }

  const PrjStatus = (props) => {
    const { status } = props;
    if (status==="計画未提出" || status==="計画書差戻" || status==="完了報告書差戻") {
      return (
        <td className="status-td alert">{status}</td>
      );
    } else if (status==="計画書監査中" || status==="完了報告書監査中") {
      return (
        <td className="status-td audit">{status}</td>
      )
    } else if (status==="PJ推進中") {
      return (
        <td className="status-td running">{status}</td>
      );
    } else {
      return (
        <td className="status-td completion">{status}</td>
      );
    }
  }

  const handleDelPrj = (param) => {
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
      const res = await deletePrj(Number(id));
      handleGetPrjs();
    } catch (e) {
      setMessage("プロジェクト情報削除エラー");
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
    <div className="prj-index-background">
      <div className="prj-index-container">
        <div className="header-area">
          <div className="header-title">Projects</div>
        </div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <div className="table-frame">
          <Table striped bordered hover>
            <thead>
              <tr className="head-tr">
                <th rowSpan="2" className="head-td">No.</th>
                <th rowSpan="2" className="head-td">プロジェクト名</th>
                <th rowSpan="2" className="head-td">承認日</th>
                <th rowSpan="2" className="head-td">担当PL</th>
                <th rowSpan="2" className="head-td">状況</th>
                <th colSpan="2" className="head-td">予定期間</th>
                <th rowSpan="2" className="head-td"></th>
              </tr>
              <tr className="head-tr">
                <th className="head-td">開始</th>
                <th className="head-td">完了</th>
              </tr>
            </thead>
            <tbody>
              {prjs.map((prj) => 
                <tr key={prj.id} className="body-tr">
                  <td className="number-td">
                    <Link 
                      component="button" 
                      variant="body2" 
                      onClick={() => navigate(`/prj/top`,{state: {id: prj.id,status: prj.status}})}
                    >
                      {prj.number}
                    </Link>
                  </td>
                  <td className="name-td">{prj.name}</td>
                  <td className="date-td">{displayDate(prj.approval_date)}</td>
                  <td className="plname-td">{prj.pl_name}</td>
                  <PrjStatus status={prj.status} />
                  <td className="date-td">{displayDate(prj.development_period_fr)}</td>
                  <td className="date-td">{displayDate(prj.development_period_to)}</td>
                  <td className="button-td">
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelPrj(prj)} disabled={!authInfo.prjdelete}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="button-area">
          {authInfo.prjnew && 
          <IconButton aria-label="Add" color="primary" size="large" onClick={() => setShowNewModal(true)}>
            <AddCircleIcon sx={{ fontSize : 40 }} />
          </IconButton>
          }
        </div>
      </div>
      <PrjNewPage  showFlg={showNewModal} setShowModal={setShowNewModal} handleGetPrjs={handleGetPrjs} />
      <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
    </div>
  )
}

export default PrjIndexPage;
