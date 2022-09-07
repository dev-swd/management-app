// m2c
import './LogEditPage.css';
import Button from '@mui/material/Button';
import { isEmpty } from "../../../lib/common/isEmpty";

const LogEditPage = (props) => {
  const { showFlg, log, handleChange, handleOK, handleCancel } = props;

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (log.contents === "") {
      return true;
    } else {
      return false;
    }
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
    { showFlg ? (
      <div className="overlay">
        <div className="m2c-container">
          <div className="m2c-header-title">変更履歴入力</div>

          <Button 
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => handleOK()}
            disabled={setDisabledSubmit()}
            style={{marginTop:20, marginLeft:20}}
          >
            登録
          </Button>

          <Button 
            variant="contained" 
            color="secondary"
            size="small" 
            onClick={(e) => handleCancel()} 
            style={{marginTop:20, marginLeft:10}}
          >
            戻る
          </Button>

          <div className="m2c-title">
            {"変更概要"}
            <label className="required">*</label>
          </div>
          <textarea 
            name="contents" 
            id="contents" 
            className="m2c-contents"
            maxLength="100"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            value={toStr(log.contents)}
          />
        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  );
}
export default LogEditPage;
