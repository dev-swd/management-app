// m42
import "./PrjIndexPage.css";
import { useEffect, useState } from 'react';
import { getPls, getPrjsByConditional } from '../../../lib/api/project';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { formatDateZero } from '../../../lib/common/dateCom';
import ProgRepIndexPage from './ProgRepIndexPage';
import { isEmpty } from "../../../lib/common/isEmpty";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const status = ["計画未提出", "計画書監査中", "計画書差戻", "PJ推進中", "完了報告書監査中", "完了報告書差戻", "完了"];

const PrjIndexPage = () => {
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState([]);
  const [prjInfo, setPrjInfo] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("*");
  const [selectedPlId, setSelectedPlId] = useState({value: "", label: ""});
  const [selectedOrder, setSelectedOrder] = useState("number");
  const [desc, setDesc] = useState(false);
  const [visible, setVisible] = useState(true);

  // プロジェクト情報取得（画面指定条件）
  const handleGetPrj = async () => {
    try {
      const res = await getPrjsByConditional(false, selectedStatus, selectedPlId.value, selectedOrder, desc);
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
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

  // 表示リンククリック時の処理
  const handleLinkClick = (p) => {
    setPrjInfo({id: p.id, number: p.number, name: p.name});
    setVisible(false);
  }

  // 進捗レポート終了時の処理
  const closeProgRep = () => {
    setPrjInfo({});
    setVisible(true);
  }

  // 画面編集
  return (
    <>
    { visible ? (
      <div className="m42-background">
        <div className="m6-prj-index-container">
          <div className="m42-header-title">進捗管理（プロジェクト選択）</div>

          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

          <div className="m42-search-area">
          {/* 検索条件 */}
            {/* 状態 */}
            <div className="m20-status-pos">
              <FormControl>
                <InputLabel id="select-status-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>状態</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={selectedStatus}
                  label="状態"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ fontSize:11, fontFamily:"sans-serif", height:33, width:150 }}
                >
                  <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value="*">すべて</MenuItem>
                  { status.map((s,i) => 
                    <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value={s}>{s}</MenuItem>
                  )}
                </Select>        
              </FormControl>
            </div>
            {/* 担当PL */}
            <div className="m20-pl-pos">
              <SelectPl
                plId={selectedPlId}
                setPlId={setSelectedPlId}
                setMessage={setMessage}
              />
            </div>
            {/* 並び順 */}
            <div className="m20-order-pos">
              <FormControl>
                <InputLabel id="select-order-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>並び順</InputLabel>
                <Select
                  labelId="select-order-label"
                  id="select-order"
                  value={selectedOrder}
                  label="並び順"
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  sx={{ fontSize:11, fontFamily:"sans-serif", height:33, width:100 }}
                >
                  <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value="number">No.</MenuItem>
                  <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value="development_period_fr">開始日</MenuItem>
                  <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value="development_period_fr">終了日</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControlLabel 
                control={<Checkbox size="small" onChange={(e) => setDesc(e.target.checked)} checked={desc} />} 
                label={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"降順"}</Typography>}
              />
            </div>
            <div className="m20-button-pos">
              <Button 
                size="small" 
                variant="contained" 
                endIcon={<SearchIcon />} 
                sx={{height:25}}
                onClick={(e) => handleGetPrj()}
                >
                表示
              </Button>
            </div>
          </div>

          <table className="m42-table-hd">
            <thead>
              <tr>
                <td rowSpan="2" className="m42-th m42-number-td">No.</td>
                <td rowSpan="2" className="m42-th m42-name-td">プロジェクト名</td>
                <td rowSpan="2" className="m42-th m42-date-td">承認日</td>
                <td rowSpan="2" className="m42-th m42-plname-td">担当PL</td>
                <td rowSpan="2" className="m42-th m42-status-td">状況</td>
                <td colSpan="2" className="m42-th">計画期間</td>
                <td rowSpan="2" className="m42-th m42-link-td">進捗</td>
              </tr>
              <tr>
                <td className="m42-th m42-date-td">開始</td>
                <td className="m42-th m42-date-td">終了</td>
              </tr>
            </thead>
          </table>

          <div className="m42-frame">
            <table className="m42-table-bd">
              <tbody>
                {data.projects ? (
                  data.projects.map((p,i) =>
                    <tr key={"prj-" + i}>
                      <td className="m42-number-td">{toStr(p.number)}</td>
                      <td className="m42-name-td">{toStr(p.name)}</td>
                      <td className="m42-date-td">{formatDateZero(p.approval_date, "YYYY年MM月DD日")}</td>
                      <td className="m42-plname-td">{toStr(p.pl_name)}</td>
                      <td className="m42-status-td">{toStr(p.status)}</td>
                      <td className="m42-date-td">{formatDateZero(p.development_period_fr, "YYYY年MM月DD日")}</td>
                      <td className="m42-date-td">{formatDateZero(p.development_period_to, "YYYY年MM月DD日")}</td>
                      <td className="m42-link-td">
                        <button 
                          className="link-style-btn" 
                          type="button" 
                          onClick={() => handleLinkClick(p)} >
                          表示
                        </button>
                      </td>
                    </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    ) : (
      <></>
    )}
    <ProgRepIndexPage prjInfo={prjInfo} closeWin={closeProgRep} />
    </>
  )
}
export default PrjIndexPage;

// PLリストボックス
const SelectPl = (props) => {
  const { plId, setPlId, setMessage } = props;
  const [options, setOptions] = useState([]);

  // 初期処理
  useEffect(() => {
    handleGetPls();
  }, []);

  // PL情報取得
  const handleGetPls = async () => {
    try {
      const res = await getPls(false);
      // リストボックス用変数
      const tmpOptions = res.data.pls.map(p => {
        const tmpOption = {};
        tmpOption.value = p.pl_id;
        tmpOption.label = p.pl_name;
        return tmpOption;
      });
      setOptions(tmpOptions);
    } catch (e) {
      setMessage({kbn: "error", msg: "PL情報取得エラー（リスト）"});
    }
  }

  // リストボックス編集
  return (
    <Autocomplete
      id="pl_id"
      name="pl_id"
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
          label="PL"
          variant="outlined"
          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}  
          inputProps={{ ...params.inputProps, style: {fontSize:11, fontFamily:"sans-serif"}}}
        />
      )}
      value={plId}
      onChange={(_event,newTerm) => {
        setPlId(newTerm);
      }}
    />
  );
}
