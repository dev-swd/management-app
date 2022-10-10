// m52
import './TaskUpdatePage.css';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";
import { getNoProject, updateNoProject } from "../../lib/api/project";
import { getEmps } from "../../lib/api/employee";
import { getDeps } from "../../lib/api/department";
import { getDivByDepDummy, getDivsByDepartment } from "../../lib/api/division";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from "@mui/material/TextField";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateAdapter from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneIcon from '@mui/icons-material/Done';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";import { isEmpty } from '../../lib/common/isEmpty';
import ModalConfirm from '../common/ModalConfirm';

const today = new Date();

// DatePickerのためのStyle
const styles = {
  paperprops: {
    'div[role=presentation]': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& div::after':{
          content: '"年"'
        }
      },
      '& .MuiButtonBase-root': {
        order: 3
      }
    }
  },
}

const TaskUpdatePage = (props) => {
  const { prjId, closeWindow } = props;
  const { empInfo } = useContext(AuthContext);
  const [msgs, setMsgs] = useState([]);  
  const initData = {project: { pl_id: "", number: "", name: "", development_period_fr: today, development_period_to: today, remarks: "" }, tasks: [], mems: []};
  const [data, setData] = useState(initData);  
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [selectedMem, setSelectedMem] = useState("dep");
  const [selectedEmp, setSelectedEmp] = useState({value: "", label: ""});
  const [selectedDep, setSelectedDep] = useState({value: "", label: ""});
  const [selectedDiv, setSelectedDiv] = useState({value: "", label: ""});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(prjId)) {
      // タスクグループ取得
      handleGetTaskGr();
    }
  }, [prjId]);

  // タスクグループ取得
  const handleGetTaskGr = async () => {
    try {
      const res = await getNoProject(Number(prjId));
      // タスクセット
      const tmpTasks = res.data.tasks.map(task => {
        const tmpTask = {};
        tmpTask.id = task.id;
        tmpTask.phase_id = task.phase_id
        tmpTask.name = task.name;
        tmpTask.del = "";
        return tmpTask;
      });
      // メンバーセット
      const tmpMems = res.data.mems.map(mem => {
        const tmpMem = {};
        tmpMem.id = mem.id;
        tmpMem.project_id = mem.project_id;
        tmpMem.number = mem.number;
        tmpMem.level = mem.level;
        tmpMem.member_id = mem.member_id;
        tmpMem.member_name = mem.member_name;
        tmpMem.del = "";
        return tmpMem;
      });
      // タスクグループセット
      setData({
        ...data,
        project: { pl_name: res.data.project.pl_name,
                  number: res.data.project.number,
                  name: res.data.project.name,
                  development_period_fr: res.data.project.development_period_fr,
                  development_period_to: res.data.project.development_period_to,
                  remarks: res.data.project.remarks,
                  update_date: res.data.project.update_date,
                  update_name: res.data.project.update_name},
        phase_id: res.data.phase.id,
        tasks: tmpTasks,
        mems: tmpMems,
      });
    } catch (e) {
      setMsgs([{message: "その他タスク取得エラー",
      severity: "error",}]);
    }
  }

  // No、タスクグループ名、備考入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      project: {...data.project,
        [name]: value,
      }
    });
  }

  // 期間From入力時の処理
  const handleChangeFrom = (value) => {
    setData({
      ...data,
      project: {...data.project,
        development_period_fr: value,
      }
    });
  }

  // 期間To入力時の処理
  const handleChangeTo = (value) => {
    setData({
      ...data,
      project: {...data.project,
        development_period_to: value,
      }
    });
  }

  // 明細項目入力時の処理
  const handleChangeTask = (i,name,value) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][name] = value;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  // 明細チェックボックス変更時の処理
  const handleCheckbox = (i,e) => {
    const tmpTasks = [...data.tasks];
    tmpTasks[i][e.target.name] = e.target.checked;
    setData({
      ...data,
      tasks: tmpTasks,
    });
  }

  // タスク追加ボタン押下時の処理
  const handleAddTask = () => {
    setData({
      ...data,
      tasks: [...data.tasks,
            {id: "",
              phase_id: data.phase_id,
              name: "",
              del: false
            }
      ],
    });
  }

  // メンバーラジオ選択時の処理
  const handleChangeRadio = (e) => {
    setSelectedMem(e.target.value);
  }

  // メンバー追加
  const handleAddMem = () => {
    switch (selectedMem) {
      case "dep":
        if (!isEmpty(selectedDep.value)) {
          if (!checkMemDuplication(selectedMem, selectedDep.value)) {
            setData({
              ...data,
              mems: [...data.mems,
                      {id: "",
                        project_id: "",
                        number: "",
                        level: "dep",
                        member_id: selectedDep.value,
                        member_name: selectedDep.label,
                        del: false
                      }
              ],
            });  
          }
        }
        break;
      case "div":
        if (!isEmpty(selectedDiv.value)) {
          if (!checkMemDuplication(selectedMem, selectedDiv.value)) {
            setData({
              ...data,
              mems: [...data.mems,
                      {id: "",
                        project_id: "",
                        number: "",
                        level: "div",
                        member_id: selectedDiv.value,
                        member_name: selectedDiv.label,
                        del: false
                      }
              ],
            });
          }
        }
        break;
      case "emp":
        if (!isEmpty(selectedEmp.value)) {
          if (!checkMemDuplication(selectedMem, selectedEmp.value)) {
            setData({
              ...data,
              mems: [...data.mems,
                      {id: "",
                        project_id: "",
                        number: "",
                        level: "emp",
                        member_id: selectedEmp.value,
                        member_name: selectedEmp.label,
                        del: false
                      }
              ],
            });
          }
        }
        break;
      default:
    }
  }

  // メンバー重複チェック
  const checkMemDuplication = (level, id) => {
    const ret = data.mems.filter(item => item.level === level && item.member_id === id);
    if (ret.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // メンバーチップのカラー設定
  const setMemColor = (level) => {
    switch (level) {
      case "dep":
        return "secondary";
      case "div":
        return "success";
      case "emp":
        return "primary";
      default:
    }
  }

  // メンバー削除ボタン押下時の処理
  const handleDelMem = (i, value) => {
    const tempMems = [...data.mems];
    tempMems[i]["del"] = value;
    setData({
      ...data,
      mems: tempMems,
    });
  }
    // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (isEmpty(data.project.number) || isEmpty(data.project.name) || isEmpty(data.project.development_period_fr) || isEmpty(data.project.development_period_to)) {
      return true;
    } else {
      if (data.tasks.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    if (!checkInput()) {
      setConfirm({
        ...confirm,
        msg: "その他タスクを登録します。よろしいですか？",
        tag: "",
      });  
    }
  }

  // 入力チェック処理
  const checkInput = () => {
    let err=[];
    // 期間相関チェック
    if (data.project.development_period_fr > data.project.development_period_to) {
      err[err.length] = {message: "期間の入力が不正です。（開始＜完了）", severity: "error",};
    }
    // 明細行
    data.tasks.map((task,i) => {
      if(!task.del) {
        if (isEmpty(task.name)) {
          // タスク名が未入力の場合エラー
          err[err.length] = {message: "作業名に未入力があります。（" + (i + 1) + "行目）", severity: "error",};
        }
      }
    });

    if (err.length > 0) {
      setMsgs(err);
      return true;    
    } else {
      return false;
    }
  }

  // 保存確認OKボタン押下時の処理
  const handleConfirmOK = async (dummy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await updateNoProject(prjId, {prj: { update_id: empInfo.id,
                                                  development_period_fr: data.project.development_period_fr,
                                                  development_period_to: data.project.development_period_to,
                                                  remarks: data.project.remarks },
                                            tasks: data.tasks,
                                            mems: data.mems});
      if (res.data.status === 500) {
        setMsgs([{message: "その他タスク更新エラー(500)",
                severity: "error",}]);
      } else {
        handleClose();
      }
    } catch (e) {
      setMsgs([{message: "その他タスク更新エラー",
              severity: "error",}]);
    }
  }

  // 保存確認Cancelボタン押下時の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }
  
  // 画面終了時の処理
  const handleClose = () => {
    closeWindow();
    setData(initData);
    setMsgs([]);
  }

  // null／undefined対策
  const toStr = (v) => {
    if (isEmpty(v)) {
      return "";
    } else {
      return v;
    }
  }

  // 画面編集
  return (
    <>
      { prjId ? (
        <div className="overlay">
          <div className="m52-container">
            <div className="m52-header-area">
              <div className="m52-header-title">その他タスク変更</div>
              <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose()}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>
            {msgs ? (
              <div className="m52-msg">
                {msgs.map((msg,i) =>
                  <Alert severity={msg.severity}>{msg.message}</Alert>
                )}
              </div>
            ) : (
              <></>
            )}

            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveAltIcon />}
              disabled={setDisabledSubmit()}
              onClick={() => handleSubmit()}
              style={{marginTop:20, marginLeft:20}}
            >
              登録
            </Button>

            <div className="m52-detail-flex">
              <div className="m52-detail">
                {/* No. */}
                <div className="m52-taskno">{data.project.number}</div>
                {/* プロジェクト名 */}
                <div className="m52-taskname">{data.project.name}</div>
              </div>
              {/* 期間From */}
              <div className="m52-date-pos">
                <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
                  <DatePicker
                    label="期間FROM*"
                    inputFormat="yyyy年MM月dd日"
                    mask='____/__/__'
                    value={data.project.development_period_fr}
                    onChange={handleChangeFrom}
                    inputProps={{style: {fontSize:11, fontFamily:"sans-serif"} }}
                    renderInput={(params) => <TextField 
                                              {...params} 
                                              variant="standard" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </div>
              <div className="m52-inner-label">〜</div>
              <div className="m52-date-pos">
                <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
                  <DatePicker
                    label="期間TO*"
                    inputFormat="yyyy年MM月dd日"
                    mask='____/__/__'
                    value={data.project.development_period_to}
                    onChange={handleChangeTo}
                    inputProps={{style: {fontSize:11, fontFamily:"sans-serif"} }}
                    renderInput={(params) => <TextField 
                                              {...params} 
                                              variant="standard" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            {/* 備考 */}
            <div className="m52-text-pos">
              <div className="m52-remarks-title"><label for="remarks">備考：</label></div>
              <textarea 
                name="remarks" 
                id="remarks" 
                className="m52-remarks"
                maxLength="300"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={toStr(data.project.remarks)}
              />
            </div>

            {/* 明細 */}
            <div className="m52-main">
              {/* 左 */}
              <div className="m52-left">
                <table className="m52-table-hd">
                  <thead>
                    <tr>
                      <td className="m52-th m52-name-td">タスク名</td>
                      <td className="m52-th m52-del-td">削除</td>
                    </tr>
                  </thead>
                </table>
                <div className="m52-table-frame">
                  <table className="m52-table-bd">
                    <tbody>
                      {data.tasks ? (
                        data.tasks.map((t,i) =>
                        <>
                          <tr key={"task-" + i}>
                            <td className={'m52-name-td ' + (t.del ? 'm52-delete' : '')}>
                              <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                maxLength="20"
                                className={'m52-task-name ' + (t.del ? 'm52-delete' : '')} 
                                onChange={(e) => handleChangeTask(i, e.target.name, e.target.value)} 
                                value={toStr(t.name)} 
                              />
                            </td>
                            <td className="m52-del-td">
                              <input 
                                type="checkbox"
                                name="del"
                                checked={t.del || false}
                                onChange={(e) => handleCheckbox(i,e)}
                              />
                            </td>
                          </tr>
                        </>
                        )
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="m52-button-area">
                  <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAddTask()}>
                    <AddCircleIcon sx={{ fontSize : 40 }} />
                  </IconButton>
                </div>
              </div>
              <div className="m52-right">
                <div className="m52-right-header">対象メンバー選択</div>

                <RadioGroup row value={selectedMem} onChange={handleChangeRadio} style={{ marginTop:10, marginLeft:20 }}>
                  <FormControlLabel value="dep" control={<Radio sx={{ '& .MuiSvgIcon-root': {fontSize: 18,}}} />} label={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"事業部"}</Typography>} />
                  <FormControlLabel value="div" control={<Radio sx={{ '& .MuiSvgIcon-root': {fontSize: 18,}}} style={{ marginLeft:20 }} />} label={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"課"}</Typography>} />
                  <FormControlLabel value="emp" control={<Radio sx={{ '& .MuiSvgIcon-root': {fontSize: 18,}}} style={{ marginLeft:20 }} />} label={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"社員"}</Typography>} />
                </RadioGroup>
                <div className="m52-mem-container">
                  { selectedMem === "dep" &&
                    <div className="m52-mem-select">
                      <SelectDep
                        selectedDep={selectedDep}
                        setSelectedDep={setSelectedDep}
                        setMsgs={setMsgs}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleAddMem()}
                        style={{marginTop:9, marginLeft:20, height:30 }}
                      >
                        追加
                      </Button>
                    </div>
                  }
                  { selectedMem === "div" &&
                    <div className="m52-mem-select">
                      <SelectDep
                        selectedDep={selectedDep}
                        setSelectedDep={setSelectedDep}
                        setMsgs={setMsgs}
                      />
                      <SelectDiv
                        selectedDep={selectedDep}
                        selectedDiv={selectedDiv}
                        setSelectedDiv={setSelectedDiv}
                        setMsgs={setMsgs}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleAddMem()}
                        style={{marginTop:9, marginLeft:20, height:30 }}
                      >
                        追加
                      </Button>
                    </div>
                  }
                  { selectedMem === "emp" && 
                    <div className="m52-mem-select">
                      <SelectEmp
                        selectedEmp={selectedEmp}
                        setSelectedEmp={setSelectedEmp}
                        setMsgs={setMsgs}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleAddMem()}
                        style={{marginTop:9, marginLeft:20, height:30 }}
                      >
                        追加
                      </Button>
                    </div>
                  }
                  <div className="m52-mem-area">
                    {data.mems ? (
                      data.mems.map((m,i) =>
                        <>
                          {m.del ? (
                            <Chip
                              label={toStr(m.member_name)}
                              color="error"
                              size="small"
                              sx={{fontSize: 11, fontFamily: 'sans-serif', marginRight:0.5, marginBottom:0.5}}
                              deleteIcon={<DoneIcon />}
                              onDelete={() => handleDelMem(i,false)}
                            />
                          ) : (
                            <Chip
                              label={toStr(m.member_name)}
                              color={setMemColor(m.level)}
                              size="small"
                              sx={{fontSize: 11, fontFamily: 'sans-serif', marginRight:0.5, marginBottom:0.5}}
                              onDelete={() => handleDelMem(i,true)}
                            />
                          )}
                        </>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
          </div>

        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default TaskUpdatePage;

// 社員リストボックス
const SelectEmp = (props) => {
  const { selectedEmp, setSelectedEmp, setMsgs } = props;
  const [options, setOptions] = useState([]);

  // 初期処理
  useEffect(() => {
    handleGetEmps();
  }, []);
  
  // 社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmps(true);
      // リストボックス用変数
      const tmpOptions = res.data.emps.map(e => {
        const tmpOption = {};
        tmpOption.value = e.id;
        tmpOption.label = e.name;
        return tmpOption;
      });
      setOptions(tmpOptions);
    } catch (e) {
      setMsgs([{message: "社員情報取得エラー（リスト）",
              severity: "error",}]);
    }
  }

  // リストボックス編集
  return (
    <Autocomplete
      id="emp_id"
      name="emp_id"
      size="small" 
      style={{margin:8, width:150}}
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
      value={selectedEmp}
      onChange={(_event,newTerm) => {
        setSelectedEmp(newTerm);
      }}
    />
  );
}

// 部リストボックス
const SelectDep = (props) => {
  const {selectedDep, setSelectedDep, setMsgs } = props;
  const [deps, setDeps] = useState([]);

  // 初期処理
  useEffect(() => {
    handleGetDeps();
  }, []);

  // 部情報取得
  const handleGetDeps = async () => {
    try {
      const res = await getDeps();
      // リストボックス用変数
      const tmpDeps = res.data.deps.map(d => {
        const tmpDep = {};
        tmpDep.value = d.id;
        tmpDep.label = d.name;
        return tmpDep;
      });
      setDeps(tmpDeps);
    } catch (e) {
      setMsgs([{message: "部情報取得エラー（リスト）",
              severity: "error",}]);
    }
  }

  // リストボックス選択時の処理
  const handleChange = (value) => {
    if (isEmpty(value)) {
      setSelectedDep({value: "", label: ""});
    } else {
      const tmpDep = deps.filter(item => item.value === value)
      setSelectedDep(tmpDep[0]);
    }
  }

  // リストボックス編集
  return (
    <FormControl sx={{ m: 1, width: 200 }} size="small">
      <InputLabel id="select-dep-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>部</InputLabel>
      <Select
        labelId="select-dep-label"
        id="select-dep"
        value={selectedDep.value}
        label="部"
        onChange={(e) => handleChange(e.target.value)}
        sx={{ fontSize:11, fontFamily:"sans-serif" }}
      >
        { deps ? (
          deps.map((d,i) => 
            <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value={d.value}>{d.label}</MenuItem>
          )
        ) : (
          <></>
        )}
      </Select>
    </FormControl>

  );
}

// 課リストボックス
const SelectDiv = (props) => {
  const {selectedDep, selectedDiv, setSelectedDiv, setMsgs } = props;
  const [divs, setDivs] = useState([]);

  // 初期処理
  useEffect(() => {
    setSelectedDiv({value: "", label: ""});
    setDivs([]);
    if (isEmpty(selectedDep.value)) {
    } else {
      handleGetDivs();
    }
  }, [selectedDep]);

  // 課情報取得
  const handleGetDivs = async () => {
    try {
      // 事業部ダミー課
      const res1 = await getDivByDepDummy(Number(selectedDep.value));
      const tmpDiv = [{ value: res1.data.div.id, label: "−"}];
      // 事業部配下の課
      const res2 = await getDivsByDepartment(Number(selectedDep.value));
      const tmpDivs = res2.data.divs.map(d => {
        const tmpDiv = {};
        tmpDiv.value = d.id;
        tmpDiv.label = d.name;
        return tmpDiv;
      });
      let _tmpDiv = tmpDiv;
      let _tmpDivs = _tmpDiv.concat(tmpDivs);
      setDivs(_tmpDivs);
    } catch (e) {
      setMsgs([{message: "課情報取得エラー（リスト）",
              severity: "error",}]);
    }
  }

  // リストボックス選択時の処理
  const handleChange = (value) => {
    if (isEmpty(value)) {
      setSelectedDiv({value: "", label: ""});
    } else {
      const tmpDiv = divs.filter(item => item.value === value)
      setSelectedDiv(tmpDiv[0]);
    }
  }

  // リストボックス編集
  return (
    <FormControl sx={{ m: 1, width: 200 }} size="small">
      <InputLabel id="select-dep-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>課</InputLabel>
      <Select
        labelId="select-dep-label"
        id="select-dep"
        value={selectedDiv.value}
        label="課"
        onChange={(e) => handleChange(e.target.value)}
        sx={{ fontSize:11, fontFamily:"sans-serif" }}
      >
        { divs ? (
          divs.map((d,i) => 
            <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value={d.value}>{d.label}</MenuItem>
          )
        ) : (
          <></>
        )}
      </Select>
    </FormControl>

  );
}