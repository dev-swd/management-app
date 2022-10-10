// m2k
import './LoadCsvPage.css';
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { isEmpty } from '../../../lib/common/isEmpty';

const LoadCsvPage = (props) => {
  const { showDlg, closeDlg } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [file, setFile] = useState(null);

  // file選択時の処理
  const handleFileSelect = (e) => {
    // 型エラーを回避
    if (!(e.target instanceof HTMLInputElement)) return
    if (!e.target.files) return

    setFile((e.target.value).name);
    
  }

  // ダイアログ終了時の処理
  const handleClose = () => {
    closeDlg();
  }

  return (
    <>
    { showDlg ? (
      <div className="overlay">
        <div className="m2k-containar">
          <div className="m2k-header-area">
            <div className="m2k-header-title">CSV取込</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose(e)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>

          <Button 
            size="small" 
            variant="contained" 
            endIcon={<BrowserUpdatedIcon />} 
            disabled={isEmpty(file)}
            style={{marginTop:10, marginLeft:20}}
          >
            保存
          </Button>

          <div>
            <input id="dummy_file" type="text" value={file} readonly />
            <label for="filename">
              <span className="browse_btn">Browse</span>
              <input type="file" accept="text/csv" size="16" id="filename" onChange={(e) => handleFileSelect(e)} />
            </label>
          </div>
        </div>
      </div>
    ) : (
      <></>
    )}
    </>

  );
}
export default LoadCsvPage;
