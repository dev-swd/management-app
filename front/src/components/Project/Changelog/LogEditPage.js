import './LogEditPage.css';
import SelectEmployee from "../../common/SelectEmployee";
import Button from '@mui/material/Button';
import CustomDatePicker from "../../common/customDatePicker";

const LogEditPage = (props) => {
  const { showFlg, log, handleChange, handleOK, handleCancel } = props;

  return (
    <>
    { showFlg ? (
      <div className="overlay">
        <div className="log-edit-container">
          <div className="header-area">
            <div className="header-title">変更履歴入力</div>
          </div>

          <div className="button-area">
            <Button 
              size="small" 
              variant="contained" 
              onClick={(e) => handleOK()}
              disabled={!log.changer_id || !log.change_date || !log.contents ? true : false}
            >
              登録
            </Button>
            {"　"}
            <Button size="small" variant="contained" onClick={(e) => handleCancel()} color="secondary">戻る</Button>
          </div>

          <div className="log-entry-area">
            <div className="title-cell">
              {"変更者"}
              <label className="required">*</label>
            </div>
            <div className="data-cell">
              <SelectEmployee
                name="changer_id" 
                value={log.changer_id || ''} 
                setValue={handleChange}
                width={110}
                height={20}
              />
            </div>
            <div className="title-cell">
              {"変更日"}
              <label className="required">*</label>
            </div>
            <div className="data-cell">
              <CustomDatePicker 
                selected={log.change_date || ''} 
                dateFormat="yyyy年MM月dd日" 
                className="date-field"
                onChange={handleChange}
                name="change_date"
              />
            </div>
            <div className="title-cell">
              {"変更概要"}
              <label className="required">*</label>
            </div>
            <div className="data-cell">
              <textarea 
                name="contents" 
                id="contents" 
                className="contents"
                maxLength="100"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                value={log.contents || ''}
              />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <></>
    )}
    </>
  );
}

export default LogEditPage;