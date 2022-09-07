// m25
import "./MemAddPage.css";
import { useState, useEffect } from 'react';
import { getEmps } from '../../../lib/api/employee';
import { isEmpty } from '../../../lib/common/isEmpty';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const initEmp = {id: "", name: ""}

const MemAddPage = (props) => {
  const { showFlg, handleOK, handleClose } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [options, setOptions] = useState([]);
  const [emp, setEmp] = useState(initEmp);
  
  // 初期処理
  useEffect(() => {
    if (showFlg) {
      handleGetEmps();
    }
  },[showFlg])

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
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー（リスト）"});
    }
  }

  // リストボックス選択時の処理
  const handleChange = (selectedOption) => {
    if (isEmpty(selectedOption.value)) {
      setEmp(initEmp);
    } else {
      setEmp({id: selectedOption.value, name: selectedOption.label});
    }
  }

  // OKボタン非活性制御
  const setDisabledSubmit = () => {
    if (emp.id==="") {
      return true;
    } else {
      return false;
    }
  }
  
  // OKボタン押下時の処理
  const handleSubmit = (e) => {
    handleOK(emp.id, emp.name);
    setEmp(initEmp);
  }

  // クローズボタン押下時の処理
  const handleCancel = (e) => {
    handleClose();
    setEmp(initEmp);
  }

  // 画面編集
  return (
    <>
      { showFlg ? (
        <div className="overlay">
          <div className="m25-container">
            <div className="m25-header-area">
              <div className="m25-header-title">プロジェクトメンバー追加</div>
              <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleCancel()}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>
            { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

            <div className="m25-frame">
              <Autocomplete
                id="emp_id"
                name="emp_id"
                size="small" 
                style={{width:150, marginRight:20}}
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
                    label="管理者"
                    variant="outlined"
                    InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}  
                    inputProps={{ ...params.inputProps, style: {fontSize:11, fontFamily:"sans-serif"}}}
                  />
                )}
                onChange={(_event,newTerm) => {
                  handleChange(newTerm);
                }}
              />
              <Button 
                size="small" 
                variant="contained" 
                onClick={(e) => handleSubmit(e)}
                disabled={setDisabledSubmit()}
              >
                OK
              </Button>
            </div>

          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default MemAddPage;