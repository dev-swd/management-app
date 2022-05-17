import "./PrjTopPage.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { Link, useLocation } from 'react-router-dom';
import Button from "@mui/material/Button";
import PrjShowPage from "./PrjShowPage";
import PrjCreatePage from "./PrjCreatePage";
import RepShowPage from "./RepShowPage";
import RepCreatePage from "./RepCreatePage";
import PrjModifyPage from "./PrjModifyPage";
import PrjAuditPage from "./PrjAuditPage";
import RepAuditPage from "./RepAuditPage";

const PrjTopPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [menu, setMenu] = useState(0);
  const location = useLocation();
  const params = location.state;

  const PrjStatus = () => {
    if (params.status==="計画未提出" || params.status==="計画書差戻" || params.status==="完了報告書差戻") {
      return (
        <div className="status alert">{"【" + params.status + "】"}</div>
      );
    } else if (params.status==="計画書監査中" || params.status==="完了報告書監査中") {
      return (
        <div className="status audit">{"【" + params.status + "】"}</div>
      )
    } else if (params.status==="PJ推進中") {
      return (
        <div className="status running">{"【" + params.status + "】"}</div>
      );
    } else {
      return (
        <div className="status completion">{"【" + params.status + "】"}</div>
      );
    }
  }

  const MenuButtons = () => {
    if (params.status==="計画未提出" || params.status==="計画書差戻") {
      return (
        <>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(1)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(2)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjcreate}>計画書作成</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(4)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.taskentry}>タスク編集</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(5)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(6)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書作成</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(7)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書監査</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(8)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書監査</Button></div>
        </>
      );
    } else if (params.status==="計画書監査中") {
      return (
        <>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(1)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjshow}>計画書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(2)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書作成</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(4)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.taskentry}>タスク編集</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(5)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(6)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書作成</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(7)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjaudit}>計画書監査</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(8)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書監査</Button></div>
        </>
      );
    } else if (params.status==="PJ推進中" || params.status==="完了報告書差戻") {
      return (
        <>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(1)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjshow}>計画書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(3)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjmodify}>計画書変更</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(4)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.taskentry}>タスク編集</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(5)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(6)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.repcreate}>完了報告書作成</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(7)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書監査</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(8)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書監査</Button></div>
        </>
      );
    } else if (params.status==="完了報告書監査中") {
      return (
        <>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(1)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjshow}>計画書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(3)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書変更</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(4)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>タスク編集</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(5)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(6)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書作成</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(7)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書監査</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(8)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.repaudit}>完了報告書監査</Button></div>
        </>
      );
    } else if (params.status==="完了") {
      return (
        <>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(1)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.prjshow}>計画書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(3)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書変更</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(4)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>タスク編集</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(5)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={!authInfo.repshow}>完了報告書照会</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(6)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書作成</Button></div>
          <div></div>
          <div className="menu-link"><Button onClick={() => setMenu(7)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>計画書監査</Button></div>
          <div className="menu-link"><Button onClick={() => setMenu(8)} sx={{fontSize: 11, fontFamily: 'sans-serif'}} disabled={true}>完了報告書監査</Button></div>
        </>
      );
    }
    
  }

  return (
    <div className="prj-top-background">
      <div className="side-menu">
        <div className="to-index"><Button component={Link} to="/prj" sx={{fontSize: 11, fontFamily: 'sans-serif'}}>一覧へ</Button></div>
        <PrjStatus />
        <MenuButtons />
      </div>
      { menu===1 && <PrjShowPage prj_id={params.id} />}
      { menu===2 && <PrjCreatePage prj_id={params.id} />}
      { menu===3 && <PrjModifyPage prj_id={params.id} />}

      { menu===5 && <RepShowPage prj_id={params.id} />}
      { menu===6 && <RepCreatePage prj_id={params.id} />}

      { menu===7 && <PrjAuditPage prj_id={params.id} />}
      { menu===8 && <RepAuditPage prj_id={params.id} />}
    </div>
  )
}

export default PrjTopPage;