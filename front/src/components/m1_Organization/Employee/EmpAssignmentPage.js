// m18
import './EmpAssignmentPage.css';
import { useEffect, useState } from "react";
import { isEmpty } from "../../../lib/common/isEmpty";
import { getEmpsByDivision, getEmpsByDepDirect, getEmps, updateEmp } from '../../../lib/api/employee';
import { getDivByDepDummy } from '../../../lib/api/division';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import ModalMessage from '../../common/ModalMessage';
import ModalConfirm from '../../common/ModalConfirm';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EmpAssignmentPage = (props) => {
  const { param, closeAssign, setMessage } = props;
  const [data, setData] = useState([]);
  const [thisDivId, setThisDivId] = useState("");
  const [emp, setEmp] = useState({});
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [modalMsg, setModalMsg] = useState("");

  // 初期処理
  useEffect(() => {
    if (!isEmpty(param)) {
      // パラメーター設定ありの場合のみ社員情報取得
      handleGetEmps();
      // 処理対象のdivision_idを設定
      handleSetThisDivId();
    }
  }, [param]);

  // 社員情報取得（所属社員）
  const handleGetEmps = async () => {
    try {
      let res = null;
      if (param.level==="dep") {
        // 事業部直属社員
        res = await getEmpsByDepDirect(Number(param.data.id));
      } else {
        // 課所属社員
        res = await getEmpsByDivision(Number(param.data.id));
      }
      const tmpEmps = res.data.emps.map(e => {
        const tmpEmp = {};
        tmpEmp.id = e.id;
        tmpEmp.number = e.number;
        tmpEmp.name = e.name;
        return tmpEmp;
      });
      setData({
        ...data,
        emps: tmpEmps
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
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
    closeAssign();
    setData([]);
    setEmp({});
    setThisDivId("");
    setMessage({kbn: "", msg: ""});
  }

  // 社員追加
  const handleAdd = (e) =>{
    if (!isEmpty(emp.id) && !isEmpty(thisDivId)) {
      if (isEmpty(emp.division_id)) {
        // 未所属の場合
        setConfirm({
          ...confirm,
          msg: "この部門に配属します。よろしいですか？",
          tag: { empId: emp.id, divId: thisDivId },
        });    
      } else {
        if (emp.division_id===thisDivId) {
          setModalMsg("既にこの部門に配属済です");
        } else {
          // 他部門に所属しているので異動の確認
          let name = "";
          if (emp.dep_name === emp.div_name) {
            name = emp.dep_name;
          } else {
            name = emp.dep_name + " " + emp.div_name;
          }
          setConfirm({
            ...confirm,
            msg: name + " からこの部門に異動します。よろしいですか？",
            tag: { empId: emp.id, divId: thisDivId },
          });    
        }
      }
    }
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = async (param) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateEmp(param.empId, {division_id: param.divId});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "社員報更新エラー(500)"});
      } else {
        // 登録正常時は一覧再表示
        handleGetEmps();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報更新エラー"});
    }
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // モーダルメッセージOKボタン押下時の処理
  const handleMessageOK = () => {
    setModalMsg("");
  }

  // 社員解除
  const handleLift = (e) => {
    setConfirm({
      ...confirm,
      msg: e.name + "（" + e.number + "）をこの部門から解除します。よろしいですか？",
      tag: { empId: e.id, divId: "" },
    });    
  }

  // 画面編集
  return (
    <>
      { param ? (
        <div className="m18-assign-container">
          <div className="m18-header-area">
            <div className="m18-header-title">{"社員追加／解除" + setSubTitleOption()}</div>
            <button 
              className="link-style-btn m18-link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>

          {/* 社員追加エリア */}
          <div className="m18-add-emp-area">
            <div className="m18-emp-list-pos">
              <SelectEmployee 
                emp={emp}
                setEmp={setEmp}
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

          {/* 所属社員一覧 */}
          <table className="m18-emps-table-hd">
            <thead>
              <tr>
                <td className="m18-number-td">社員番号</td>
                <td className="m18-name-td">氏名</td>
                <td className="m18-button-td"></td>
              </tr>
            </thead>
          </table>
          <table className="m18-emps-table">
            <tbody>
              {data.emps ? (
                data.emps.map((e,i) => 
                  <tr key={"emp-" + i}>
                    <td className="m18-number-td">{e.number}</td>
                    <td className="m18-name-td">{e.name}</td>
                    <td className="m18-button-td">
                      <IconButton aria-label="delete" size="small" onClick={() => handleLift(e)}>
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
          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <ModalMessage modalMsg={modalMsg} handleOk={handleMessageOK} />

        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default EmpAssignmentPage;

// 社員リストボックス
const SelectEmployee = (props) => {
  const { emp, setEmp, setMessage } = props;
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
      setOptions(tmpOptions);
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
      setEmp({id:"", number: "", name: "", dep_name: "", div_name: "", division_id: ""});
    } else {
      const selectedEmp = emps.filter(item => item.id === selectedOption.value)
      setEmp(selectedEmp[0]);  
    }
  }

  // リストボックス選択
  const setSelectOption = () => {
    const selectOption = options.find((v) => v.value === emp.id);
    return selectOption;
  }

  // リストボックス編集
  return (
    <Autocomplete
      id="emp_id"
      name="emp_id"
      size="small" 
      style={{width:150}}
      options={options}
      noOptionsText={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"該当なし"}</Typography>}
      renderOption={(props, option) => (
        <Box style={{fontSize: 11}} {...props}>
            {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField 
          {...params}
          label="社員"
          variant="outlined"
          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}  
          inputProps={{ ...params.inputProps, style: {fontSize:11, fontFamily:"sans-serif"}}}
        />
      )}
      value={setSelectOption()}
      onChange={(_event,newTerm) => {
        handleChange(newTerm);
      }}
    />
  );
}
