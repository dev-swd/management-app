import './AuthorizerPage.css'
import { useEffect, useState } from "react";
import { isEmpty } from "../../../lib/common/isEmpty";
import { getDivByDepDummy } from '../../../lib/api/division';
import { getAuthsByDiv, getAuthsByDepDirect, createAuth, deleteAuth } from '../../../lib/api/approvalauth';
import { getEmps } from '../../../lib/api/employee';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import Select from 'react-select';
import ModalMessage from '../../common/ModalMessage';
import ModalConfirm from '../../common/ModalConfirm';

const AuthorizerPage = (props) => {
  const { param, closeAuth, setMessage } = props;
  const [data, setData] = useState([]);
  const [thisDivId, setThisDivId] = useState("");
  const [emp, setEmp] = useState({});
  const [addConfirm, setAddConfirm] = useState({msg: "", tag: ""});
  const [liftConfirm, setLiftConfirm] = useState({msg: "", tag: ""});
  const [modalMsg, setModalMsg] = useState("");

  // 初期処理（パラメーター設定ありの場合のみ）
  useEffect(() => {
    if (!isEmpty(param)) {
      // パラメーター設定ありの場合のみ管理者リスト取得
      handleGetAuths();
      // 処理対象のdivision_idを設定
      handleSetThisDivId();
    }
  }, [param]);

  // 管理者リスト取得
  const handleGetAuths = async () => {
    try {
      let res = null;
      if (param.level==="dep") {
        // 事業部の承認権限
        res = await getAuthsByDepDirect(Number(param.data.id));
      } else {
        // 課の承認権限
        res = await getAuthsByDiv(Number(param.data.id));
      }
      const tmpAuths = res.data.auths.map(a => {
        const tmpAuth = {};
        tmpAuth.id = a.id;
        tmpAuth.employee_id = a.employee_id;
        tmpAuth.division_id = a.division_id;
        tmpAuth.emp_number = a.emp_number;
        tmpAuth.emp_name = a.emp_name;
        return tmpAuth;
      });
      setData({
        ...data,
        auths: tmpAuths
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "管理者リスト取得エラー"});
    }
  } 

  // 当処理対象のdivision_id設定
  const handleSetThisDivId = async () => {
    if (param.level==="dep") {
      // 事業部の場合は、事業部ダミー課のIDを取得
      try {
        const res = await getDivByDepDummy(Number(param.data.id));
        setThisDivId(res.data.div.id);
      } catch (e) {
        setMessage({kbn: "error", msg: "事業部直結課ID取得エラー"});
      }
    } else {
      // 課の場合は、パラメータから設定
      setThisDivId(param.data.id);
    }
  }
  
  // サブタイトル編集
  const setSubTitleOption = () => {
    if (param.level === "dep") {
      return " （"  + param.data.name + "）";
    } else {
      return " （" + param.data.dep_name + " " + param.data.name + "）";
    }
  }

  // 画面終了時の処理
  const handleClose = () => {
    closeAuth();
    setData([]);
    setEmp({});
    setMessage({kbn: "", msg: ""});
  }

  // 管理者追加
  const handleAdd = (e) => {
    if (!isEmpty(emp.id)) {
      // 重複チェック
      const res = data.auths.find((a) => a.employee_id === emp.id);
      if (!isEmpty(res)) {
        setModalMsg("既にこの部門の管理者になっています");
      } else {
        // 重複していなければ登録
        setAddConfirm({
          ...addConfirm,
          msg: emp.name + "（" + emp.number + "）をこの部門の承認者に追加します。よろしいですか？",
          tag: emp.id,
        });    
      }
    }    
  }

  // 追加確認ダイアログでOKの場合の処理
  const handleAddConfirmOK = async (empId) => {
    try {
      setAddConfirm({
        ...addConfirm,
        msg: "",
        tag: "",
      });
      const res = await createAuth({employee_id: empId, division_id: thisDivId});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "承認権限登録エラー(500)"});
      } else {
        // 登録正常時は一覧再表示
        handleGetAuths(thisDivId);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "承認権限登録エラー"});
    }
  }

  // 追加確認ダイアログでキャンセルの場合の処理
  const handleAddCofirmCancel = () => {
    setAddConfirm({
      ...addConfirm,
      msg: "",
      tag: "",
    });
  }

  // モーダルメッセージOKボタン押下時の処理
  const handleMessageOK = () => {
    setModalMsg("");
  }

  // 管理者解除
  const handleLift = (a) => {
    setLiftConfirm({
      ...liftConfirm,
      msg: a.emp_name + "（" + a.emp_number + "）をこの部門の管理者から解除します。よろしいですか？",
      tag: a.id,
    });    
  }

  // 解除確認ダイアログでOKの場合の処理
  const handleLiftConfirmOK = async (id) => {
    try {
      setLiftConfirm({
        ...liftConfirm,
        msg: "",
        tag: "",
      });
      const res = await deleteAuth(id);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "承認権限削除エラー(500)"});
      } else {
        // 削除正常時は一覧再表示
        handleGetAuths(thisDivId);
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "承認権限削除エラー"});
    }
  }

  // 追加確認ダイアログでキャンセルの場合の処理
  const handleLiftCofirmCancel = () => {
    setLiftConfirm({
      ...liftConfirm,
      msg: "",
      tag: "",
    });
  }

  // 画面編集
  return (
    <>
      { param ? (
        <div className="m19-auth-container">
          <div className="m19-header-area">
            <div className="m19-header-title">{"管理者登録" + setSubTitleOption()}</div>
            <button 
              className="link-style-btn m19-link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>

          {/* 社員追加エリア */}
          <div className="m19-add-emp-area">
            <div className="m19-emp-list-pos">
              <SelectEmployee
                empId={emp.id}
                handleSetEmp={setEmp}
                setMessage={setMessage}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PersonAddIcon />}
              disabled={isEmpty(emp.id) || isEmpty(thisDivId)}
              onClick={() => handleAdd()}
            >
              追加
            </Button>
          </div>

          {/* 管理者一覧 */}
          <table className="m19-auth-table-hd">
            <thead>
              <tr>
                <td className="m19-number-td">社員番号</td>
                <td className="m19-name-td">氏名</td>
                <td className="m19-button-td"></td>
              </tr>
            </thead>
          </table>
          <table className="m19-auth-table">
            <tbody>
              {data.auths ? (
                data.auths.map((a,i) =>
                  <tr key={"auth-" + i}>
                    <td className="m19-number-td">{a.emp_number}</td>
                    <td className="m19-name-td">{a.emp_name}</td>
                    <td className="m19-button-td">
                      <IconButton aria-label="delete" size="small" onClick={() => handleLift(a)}>
                        <HighlightOffTwoToneIcon color="primary" fontSize="inherit" />
                      </IconButton>
                    </td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
          <ModalConfirm confirm={addConfirm} handleOk={handleAddConfirmOK} handleCancel={handleAddCofirmCancel} />
          <ModalConfirm confirm={liftConfirm} handleOk={handleLiftConfirmOK} handleCancel={handleLiftCofirmCancel} />
          <ModalMessage modalMsg={modalMsg} handleOk={handleMessageOK} />

        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default AuthorizerPage;

// 社員リストボックス
const initOptions = [{value: "", label: "(未選択)"}];
const SelectEmployee = (props) => {
  const { empId, handleSetEmp, setMessage } = props;
  const [options, setOptions] = useState([]);
  const [emps, setEmps] = useState([]);

  // 初期処理
  useEffect(() => {
    handleGetEmps();
  },[]);

  // 社員情報取得（全社員）
  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      // リストボックス用変数
      const tmpOptions = res.data.emps.map(e => {
        const tmpOption = {};
        tmpOption.value = e.id;
        tmpOption.label = e.name;
        return tmpOption;
      });
      const tmpOptions2 = initOptions.concat(tmpOptions);
      setOptions(tmpOptions2);
      // 社員リスト
      const tmpEmps = res.data.emps.map(e => {
        const tmpEmp = {};
        tmpEmp.id = e.id;
        tmpEmp.number = e.number;
        tmpEmp.name = e.name;
        tmpEmp.dep_name = e.dep_name;
        tmpEmp.div_name = e.div_name;
        tmpEmp.division_id = e.division_id;
        return tmpEmp;
      });
      setEmps(tmpEmps);
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー（リスト）"});
    }
  }

  // リストボックス選択時の処理
  const handleChange = (selectedOption) => {
    if (isEmpty(selectedOption.value)) {
      handleSetEmp({id:"", number: "", name: "", dep_name: "", div_name: "", division_id: ""});
    } else {
      const selectedEmp = emps.filter(item => item.id === selectedOption.value)
      handleSetEmp(selectedEmp[0]);  
    }
  }

  // リストボックス選択
  const setSelectOption = () => {
    const selectOption = options.find((v) => v.value === empId);
    return selectOption;
  }

  // Style設定
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      //ここでボックスの中身のスタイルをカスタマイズ
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      marginTop: 0,
      paddingLeft: 3,
      border: "0.5px solid #000",
      width: 150,
      fontSize: 11,
    }),
    control: () => ({
      border: "1px solid #000",
      padding: 0,
      width: 150,
      height: 25,
      display: "flex",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      margin: 0,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      paddingLeft: 2,
      width: 150,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      width: 150,
    }),
  }

  // リストボックス編集
  return (
    <Select 
      value={setSelectOption()}
      options={options} 
      onChange={handleChange}
      styles={customStyles}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
    />
  );
}
