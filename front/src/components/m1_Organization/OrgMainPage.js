// m10
import './OrgMainPage.css';
import { useState, useRef, useEffect } from 'react';
import { getDeps, deleteDep } from '../../lib/api/department';
import { getDivsByDepartment, deleteDiv } from '../../lib/api/division';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ModalConfirm from '../common/ModalConfirm';
import EmpNewPage from './Employee/EmpNewPage';
import EmpAllPage from './Employee/EmpAllPage';
import EmpNotAssignPage from './Employee/EmpNotAssignPage';
import DepNewPage from './Department/DepNewPage';
import DepUpdatePage from './Department/DepUpdatePage';
import DivNewPage from './Division/DivNewPage';
import DivUpdatePage from './Division/DivUpdatePage';
import EmpAssignmentPage from './Employee/EmpAssignmentPage';
import AuthorizerPage from './Employee/AuthorizerPage';

const OrgMainPage = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [leftLock, setLeftLock] = useState(false);
  const [empAll, setEmpAll] = useState(0);
  const [notAssign, setNotAssign] = useState(false);
  const [empNew, setEmpNew] = useState(false);
  const [depNew, setDepNew] = useState(false);
  const [depUpd, setDepUpd] = useState(null);
  const [divNew, setDivNew] = useState(null);
  const [divUpd, setDivUpd] = useState(null);
  const [assignParam, setAssignParam] = useState(null);
  const [authParam, setAuthParam] = useState(null);
  const [depConfirm, setDepConfirm] = useState({msg: "", tag: ""});
  const [divConfirm, setDivConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    handleGetDeps();
  }, []);

  // 事業部情報取得
  const handleGetDeps = async () => {
    try {
      const res = await getDeps();
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "事業部情報取得エラー"});
    } 
  }

  // 社員追加ボタン押下時の処理
  const handleNewEmp = () => {
    setEmpNew(true);
  }

  // 社員追加画面クローズ処理
  const closeNewEmp = () => {
    setEmpNew(false);
    setEmpAll(empAll * 2);    // 全社員画面の再表示契機（表示中はempAll=1なので✖️2で値が変更され、useEffectが発火する）
    setNotAssign(notAssign * 2);  // 未所属の社員画面の再表示契機（表示中はnotAssign=1なので✖️2で値が変更され、useEffectが発火する）
  }

  // 全ての社員クリック時の処理
  const handleAllEmp = () => {
    setLeftLock(true);
    setEmpAll(1);
  }

  // 全社員画面クローズ処理
  const closeAllEmp = () => {
    setLeftLock(false);
    setEmpAll(0);
  }

  // 未所属の社員クリック時の処理
  const handleNotAssign = () => {
    setLeftLock(true);
    setNotAssign(1);
  }

  // 未所属社員画面クローズ処理
  const closeNotAssign = () => {
    setLeftLock(false);
    setNotAssign(0);
  }

  // 事業部追加ボタン押下時の処理
  const handleNewDep = () => {
    setLeftLock(true);
    setDepNew(true);
  }

  // 事業部追加画面クローズ処理
  const closeNewDep = () => {
    setLeftLock(false);
    setDepNew(false);
  }

  // 事業部変更選択時の処理
  const handleUpdDep = (dep) => {
    setLeftLock(true);
    setDepUpd(dep);
  }

  // 事業部変更画面クローズ処理
  const closeUpdDep = () => {
    setLeftLock(false);
    setDepUpd(null);
  }

  // 事業部削除選択時の処理
  const handleDelDep = (dep) => {
    setDepConfirm({
      ...depConfirm,
      msg: dep.name + "（" + dep.code + "）を削除します。よろしいですか。",
      tag: dep.id,
    });
  }

  // 事業部削除確認ダイアログでOKの場合の処理
  const handleDelDepOk = async (id) => {
    try {
      setDepConfirm({
        ...depConfirm,
          msg: "",
        tag: "",
      });
      const res = await deleteDep(Number(id));
      handleGetDeps();
    } catch (e) {
      setMessage({kbn: "error", msg: "事業部情報削除エラー"});
    }
  }

  // 事業部削除確認ダイアログでキャンセルの場合の処理
  const handleDelDepCancel = () => {
    setDepConfirm({
      ...depConfirm,
      msg: "",
      tag: "",
    });
  }

  // 課追加ボタン押下時の処理
  const handleNewDiv = (dep) => {
    setLeftLock(true);
    setDivNew(dep);
  }

  // 課追加画面クローズ処理
  const closeNewDiv = () => {
    setLeftLock(false);
    setDivNew(null);
  }

  // 課変更選択時の処理
  const handleUpdDiv = (div) => {
    setLeftLock(true);
    setDivUpd(div);
  }

  // 課変更画面クローズ処理
  const closeUpdDiv = () => {
    setLeftLock(false);
    setDivUpd(null);
  }

  // 課削除選択時の処理
  const handleDelDiv = (div) => {
    setDivConfirm({
      ...divConfirm,
      msg: div.name + "（" + div.code + "）を削除します。よろしいですか。",
      tag: div.id,
    });
  }

  // 課削除確認ダイアログでOKの場合の処理
  const handleDelDivOk = async (id) => {
    try {
      setDivConfirm({
        ...divConfirm,
        msg: "",
        tag: "",
      });
      const res = await deleteDiv(Number(id));
      handleGetDeps();
    } catch (e) {
      setMessage({kbn: "error", msg: "課情報削除エラー"});
    }
  }

  // 課削除確認ダイアログでキャンセルの場合の処理
  const handleDelDivCancel = () => {
    setDivConfirm({
      ...divConfirm,
      msg: "",
      tag: "",
    });
  }

  // 社員追加／解除選択時の処理
  const handleAssign = (level, data) => {
    setLeftLock(true);
    setAssignParam({
      level: level,
      data: data
    });
  }

  // 社員追加／解除画面クローズ処理
  const closeAssign = () => {
    setLeftLock(false);
    setAssignParam(null);
  }

  // 管理者設定選択時の処理
  const handleAuth = (level, data) => {
    setLeftLock(true);
    setAuthParam({
      level: level,
      data: data
    });
  }

  // 管理者設定画面クローズ処理
  const closeAuth = () => {
    setLeftLock(false);
    setAuthParam(null);
  }

  // 画面編集
  return (
    <div className="m10-org-main-bg">
      <div className="m10-org-main-container">
        <div className="m10-header-title">組織管理</div>
        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m10-main-container">

          {/* 左コンテナ（所属一覧） */}
          <div className="m10-left-container">
            
            <div className="m10-dep-ctrl-bar">
              <Button 
                variant="contained"
                color="primary"
                size="small"
                startIcon={<GroupAddIcon />}
                onClick={() => handleNewDep()}
                disabled={leftLock}
                style={{marginRight:10}}
                >
              組織追加
              </Button>

              <Button 
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PersonAddAlt1Icon />}
                onClick={() => handleNewEmp()}
                style={{marginRight:10}}
              >
              社員追加
              </Button>

            </div>

            <div>
              <button type="button" className="m10-other-node" onClick={() => handleAllEmp()} disabled={leftLock} >
                <GroupsIcon />
                {" 全ての社員"}
              </button>
            </div>
            <div>
              <button type="button" className="m10-other-node" onClick={() => handleNotAssign()} disabled={leftLock} >
                <GroupsIcon />
                {" 未所属の社員"}
              </button>
            </div>
            { data.deps ? (
              data.deps.map((d,i) => (
                <div key={"dep-div-" + i}>
                  <DepNodeTree 
                    dep={d} 
                    idx={i}
                    setMessage={setMessage} 
                    leftLock={leftLock} 
                    handleUpdDep={handleUpdDep}
                    handleNewDiv={handleNewDiv}
                    handleDelDep={handleDelDep}
                    handleUpdDiv={handleUpdDiv}
                    handleDelDiv={handleDelDiv}
                    handleAssign={handleAssign}
                    handleAuth={handleAuth}
                  />
                </div>
              ))
            ) : (
              <></>
            )}

          </div>

          {/* 可変コンテナ */}
          <EmpAllPage showFlg={empAll} closeAllEmp={closeAllEmp} setMessage={setMessage} />
          <EmpNotAssignPage showFlg={notAssign} closeNotAssign={closeNotAssign} setMessage={setMessage} />
          <DepNewPage showFlg={depNew} closeNewDep={closeNewDep} setMessage={setMessage} refresh={handleGetDeps} />
          <DepUpdatePage dep={depUpd} closeUpdDep={closeUpdDep} setMessage={setMessage} refresh={handleGetDeps} />
          <DivNewPage dep={divNew} closeNewDiv={closeNewDiv} setMessage={setMessage} refresh={handleGetDeps} />
          <DivUpdatePage div={divUpd} closeUpdDiv={closeUpdDiv} setMessage={setMessage} refresh={handleGetDeps} />
          <EmpAssignmentPage param={assignParam} closeAssign={closeAssign} setMessage={setMessage} />
          <AuthorizerPage param={authParam} closeAuth={closeAuth} setMessage={setMessage} />
        </div>

      </div>
      <ModalConfirm confirm={depConfirm} handleOk={handleDelDepOk} handleCancel={handleDelDepCancel} />
      <ModalConfirm confirm={divConfirm} handleOk={handleDelDivOk} handleCancel={handleDelDivCancel} />
      <EmpNewPage showFlg={empNew} closeNewEmp={closeNewEmp} />
    </div>
  );
}
export default OrgMainPage;

// 事業部ノード
const DepNodeTree = (props) => {
  const { dep, idx, setMessage, leftLock, handleUpdDep, handleNewDiv, handleDelDep, handleUpdDiv, handleDelDiv, handleAssign, handleAuth } = props;
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // 初期処理
  useEffect(() => {
    hendleGetDivs();
  }, [dep]);

  // 課情報取得
  const hendleGetDivs = async () => {
    try {
      const res = await getDivsByDepartment(dep.id);
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "課情報取得エラー"});
    }   
  }

  // チェックボックスのクリックでisOpenステートを更新
  const handleChange = (e) => {
    setIsOpen(e.target.checked);
  }

  // 事業部ノードのドロップダウンメニュー
  const DepMenu = (props) => {
    const { isOpenMenu, setIsOpenMenu, dep } = props;
    const menuRef = useRef(null);

    // menuオープンの場合は、フォーカスを当てる
    useEffect(() => {
      isOpenMenu && menuRef.current.focus();
    }, [isOpenMenu]);

    // メニュークリック時の処理
    const handleMenuClick = (i) => {
      setIsOpenMenu(false);
      switch (i) {
        case 1: // 変更
          handleUpdDep(dep);
          break;
        case 2: // 管理者設定
          handleAuth("dep", dep);
          break;
        case 3: // 社員追加／解除
          handleAssign("dep", dep);
          break;
        case 4: // 課追加
          handleNewDiv(dep);
          break;
        case 5: // 削除
          handleDelDep(dep);
          break;
        default:
      }
    }

    // フォーカスアウトした際にはmenuクローズ
    return (
      <ul className="m10-dep-menu" 
          key={"dep-" + idx}
          ref={menuRef} onBlur={() => setIsOpenMenu(false)} 
          hidden={!isOpenMenu}
          tabIndex={1}
      >
        <li key={"dep-" + idx + "-1"} onClick={() => handleMenuClick(1)}>
          {"変更"}
        </li>
        <li key={"dep-" + idx + "-2"} onClick={() => handleMenuClick(2)}>
          {"管理者設定"}
        </li>
        <li key={"dep-" + idx + "-3"} onClick={() => handleMenuClick(3)}>
          {"社員追加／解除"}
        </li>
        <li key={"dep-" + idx + "-4"} onClick={() => handleMenuClick(4)}>
          {"課追加"}
        </li>
        <li key={"dep-" + idx + "-5"} onClick={() => handleMenuClick(5)}>
          {"削除"}
        </li>
      </ul>
    );
  }

  return (
    <div className="m10-dep-group">
      <div className="m10-dep-node">
        <label>
          { (data.divs===undefined || data.divs.length===0) ? (
            <>
              <input type="checkbox" disabled />
              <ArrowRightIcon color="disabled" />
            </>
          ) : (
            <>
              <input type="checkbox" onChange={handleChange} />
              { isOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )}
            </>
          )}
          <span>{dep.code + ": " + dep.name}</span>
          <IconButton size="small" onClick={() => setIsOpenMenu(!isOpenMenu)} disabled={leftLock}>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </label>
        <DepMenu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} dep={dep} />
      </div>
      <div className={!isOpen ? "m10-invisible" : ""}>
        { data.divs ? (
          data.divs.map((d,i) => (
            <div key={"div-div-" + i}>
              <DivNodeTree 
                div={d}
                idx={i}
                leftLock={leftLock}
                handleUpdDiv={handleUpdDiv}
                handleDelDiv={handleDelDiv}
                handleAssign={handleAssign}
                handleAuth={handleAuth}
              />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>

    </div>
  );   
}

// 課ノード
const DivNodeTree = (props) => {
  const { div, idx, leftLock, handleUpdDiv, handleDelDiv, handleAssign, handleAuth } = props;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // 課ノードのドロップダウンメニュー
  const DivMenu = (props) => {
    const { isOpenMenu, setIsOpenMenu, div } = props;
    const menuRef = useRef(null);

    // menuオープンの場合は、フォーカスを当てる
    useEffect(() => {
      isOpenMenu && menuRef.current.focus();
    }, [isOpenMenu]);

    // メニュークリック時の処理
    const handleMenuClick = (i) => {
      setIsOpenMenu(false);
      switch (i) {
        case 1: // 変更
          handleUpdDiv(div);
          break;
        case 2: // 管理者設定
          handleAuth("div", div);
          break;
        case 3: // 社員追加／解除
          handleAssign("div", div);
          break;
        case 4: // 削除
          handleDelDiv(div);
          break;
        default:
      }
    }

    // フォーカスアウトした際にはmenuクローズ
    return (
      <ul className="m10-div-menu" 
          key={"div-"+ idx}
          ref={menuRef} onBlur={() => setIsOpenMenu(false)} 
          hidden={!isOpenMenu}
          tabIndex={1}
      >
        <li key={"div-"+ idx + "-1"} onClick={() => handleMenuClick(1)}>
          {"変更"}
        </li>
        <li key={"div-"+ idx + "-2"} onClick={() => handleMenuClick(2)}>
          {"管理者設定"}
        </li>
        <li key={"div-"+ idx + "-3"} onClick={() => handleMenuClick(3)}>
          {"社員追加／解除"}
        </li>
        <li key={"div-"+ idx + "-4"} onClick={() => handleMenuClick(4)}>
          {"削除"}
        </li>
      </ul>
    );
  }

  return (
    <>
      <div className="m10-div-node">
        <label>
          <ArrowRightIcon color="disabled" />
          <span>{div.code + ": " + div.name}</span>
          <IconButton size="small" onClick={() => setIsOpenMenu(!isOpenMenu)} disabled={leftLock} >
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </label>
        <DivMenu isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} div={div} />
      </div>
    </>
  );
}
