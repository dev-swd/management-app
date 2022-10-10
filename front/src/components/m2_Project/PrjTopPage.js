// m22
import './PrjTopPage.css';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { useLocation, Link } from 'react-router-dom';
import { isEmpty } from '../../lib/common/isEmpty';
import Chip from '@mui/material/Chip';
import PrjCreatePage from "./PrjCreatePage";
import PrjViewPage from "./PrjViewPage";
import RepViewPage from "./RepViewPage";
import RepCreatePage from "./RepCreatePage";
import PrjModifyPage from "./PrjModifyPage";
import PrjAuditPage from "./PrjAuditPage";
import RepAuditPage from "./RepAuditPage";
import PhaseIndexPage from "./Task/PhaseIndexPage";
import Button from '@mui/material/Button';

const PrjTopPage = () => {
  const { authInfo } = useContext(AuthContext)
  const location = useLocation();
  const params = location.state;
  const [menu, setMenu] = useState(0);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(params.menu)) {
      setMenu(Number(params.menu));
    }
  }, [params])

  // プロジェクト状態編集
  const ProjectStatus = () => {
    let color = "primary";
    let title = "";
    switch (params.status) {
      case "計画未提出":
        title = "計画書未提出"
        color = "error";
        break;
      case "計画書差戻":
        title = "計画書差戻"
        color = "warning";
        break;
      case "完了報告書差戻":
        title = "報告書差戻"
        color = "warning";
        break;
      case "計画書監査中":
        title = "計画書監査中"
        color = "secondary";
        break;
      case "完了報告書監査中":
        title = "報告書監査中"
        color = "secondary";
        break;
      case "PJ推進中":
        title = "PJ推進中"
        color = "primary";
        break;
      default:
        title = "完了"
        color = "success";
    }
    return (<Chip label={title} color={color} sx={{width:100, height:25, fontSize:11, fontFamily:"sans-serif"}}/>);
  }

  // メニューリンク編集
  const MenuLinks = () => {
    switch (params.status) {
      case "計画未提出":
      case "計画書差戻":
        return (
          <>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(1)}>計画書作成</button>
            </div>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(4)}>作業項目設定</button>
            </div>
          </>
        );
      case "計画書監査中":
        return (
          <>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(4)}>作業項目設定</button>
            </div>
            {authInfo.prjAuditAuth && 
              <div className="m22-menu-link">
                <button className="link-style-btn" onClick={() => setMenu(7)}>計画書監査</button>
              </div>
            }
          </>
        );
      case "PJ推進中":
      case "完了報告書差戻":
        return (
          <>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(2)}>計画書参照</button>
            </div>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(3)}>計画書変更</button>
            </div>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(4)}>作業項目設定</button>
            </div>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(5)}>完了報告書作成</button>
            </div>
          </>
        );
      case "完了報告書監査中":
        return (
          <>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(2)}>計画書参照</button>
            </div>
            {authInfo.prjAuditAuth && 
              <div className="m22-menu-link">
                <button className="link-style-btn" onClick={() => setMenu(8)}>完了報告書監査</button>
              </div>
            }
          </>
        );
      case "完了":
        return (
          <>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(2)}>計画書参照</button>
            </div>
            <div className="m22-menu-link">
              <button className="link-style-btn" onClick={() => setMenu(6)}>完了報告書参照</button>
            </div>
          </>
        );
      default:
        return (<></>);
    }
  }

  // 画面編集
  return (
    <div className="m22-background">
      <div className="m22-sidemenu">

        <div className="m22-index-link">
          <Button component={Link} to="/prj" sx={{fontSize:11, fontFamily:"sans-serif", textTransform: 'none'}}>プロジェクト一覧</Button>
        </div>
        
        <div className="m22-status">
          <ProjectStatus />
        </div>

        <div className="m22-menu-links">
          <MenuLinks />
        </div>

      </div>
      {/* 可変コンテナ */}
      {/* プロジェクト計画書作成 */}
      { menu===1 && <PrjCreatePage prjId={params.id} />}      
      {/* プロジェクト計画書参照} */}
      { menu===2 && <PrjViewPage prjId={params.id} />}
      {/* プロジェクト計画書変更 */}
      { menu===3 && <PrjModifyPage prjId={params.id} />}
      {/* 作業項目設定 */}
      { menu===4 && <PhaseIndexPage prjId={params.id} />}
      {/* 完了報告書作成 */}
      { menu===5 && <RepCreatePage prjId={params.id} />}
      {/* 完了報告書参照 */}
      { menu===6 && <RepViewPage prjId={params.id} />}
      {/* プロジェクト計画書監査 */}
      { menu===7 && <PrjAuditPage prjId={params.id} />}
      {/* 完了報告書監査 */}
      { menu===8 && <RepAuditPage prjId={params.id} />}
    </div>
  );
}
export default PrjTopPage;
