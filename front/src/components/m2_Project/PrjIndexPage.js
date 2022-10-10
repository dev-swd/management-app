// m20
import "./PrjIndexPage.css";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getPls, getPrjsByConditional, deletePrj } from '../../lib/api/project';
import { formatDateZero } from '../../lib/common/dateCom';
import PrjNewPage from './PrjNewPage';
import ModalConfirm from '../common/ModalConfirm';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { isEmpty } from "../../lib/common/isEmpty";

const status = ["計画未提出", "計画書監査中", "計画書差戻", "PJ推進中", "完了報告書監査中", "完了報告書差戻", "完了"];

const PrjIndexPage = () => {
  const { authInfo } = useContext(AuthContext)
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [showNewFlg, setShowNewFlg] = useState(false);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("-");
  const [selectedPlId, setSelectedPlId] = useState({value: "", label: ""});
  const [selectedOrder, setSelectedOrder] = useState("number");
  const [desc, setDesc] = useState(false);

  // 初期処理
  useEffect(() => {
    // プロジェクト情報表示
    handleGetPrjs();
  }, []);

  // プロジェクト情報取得
  const handleGetPrjs = async () => {
    try {
      const res = await getPrjsByConditional(false,selectedStatus,selectedPlId.value,selectedOrder,desc);
      setData(res.data);
      setMessage({kbn: "", msg: ""});
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    } 
  }

  // 明細行編集
  const SetRow = ({prj}) => {

    // 開発期間が経過する場合は行を赤くスタイルする
    const today = new Date();
    let stylePeriod = "";
    if (!isEmpty(prj.development_period_to)) {
      const dt = new Date(prj.development_period_to);
      if (dt <= today) {
        stylePeriod = " m20-period-alert";
      }
    }

    // 状態表示のスタイル
    let styleStatus = "";
    switch (prj.status) {
      case "計画未提出":
      case "計画書差戻":
      case "完了報告書差戻":
        styleStatus = " m20-status-alert";
        break;
      case "計画書監査中":
      case "完了報告書監査中":
        styleStatus = " m20-status-audit";
        break;
      default:
    }

    // 行編集
    return (
      <>
        <td className={'m20-number-td' + stylePeriod}>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/prj/top`,{state: {id: prj.id, status: prj.status}})}
          >
            {prj.number}
          </button>
        </td>
        <td className={'m20-name-td' + stylePeriod}>{prj.name}</td>
        <td className={'m20-date-td' + stylePeriod}>{formatDateZero(prj.approval_date, "YYYY年MM月DD日")}</td>
        <td className={'m20-plname-td' + stylePeriod}>{prj.pl_name}</td>
        <td className={'m20-status-td' + stylePeriod + styleStatus}>{prj.status}</td>
        <td className={'m20-date-td' + stylePeriod}>{formatDateZero(prj.development_period_fr, "YYYY年MM月DD日")}</td>
        <td className={'m20-date-td' + stylePeriod}>{formatDateZero(prj.development_period_to, "YYYY年MM月DD日")}</td>
        <td className={'m20-link-td' + stylePeriod}>
          <IconButton aria-label="delete" size="small" onClick={() => handleDelPrj(prj)} disabled={!authInfo.prjDelAddAuth}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </td>
      </>
    );
  }

  // 新規作成ボタン押下時の処理
  const handleNewPrj = () => {
    setShowNewFlg(true);
  }

  // 新規作成画面クローズ時の処理
  const closeNewPrj = () => {
    setShowNewFlg(false);
    handleGetPrjs();
  }

  // 削除ボタン押下時の処理
  const handleDelPrj = (param) => {
    setConfirm({
      ...confirm,
      msg: "[" + param.number + "]" + param.name + "を削除します。よろしいですか。",
      tag: param.id,
    })
  }

  // 削除確認ダイアログでOKボタン押下時の処理
  const handleDelOk = async (id) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await deletePrj(Number(id));
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト削除エラー(500)"});
      } else {
        // 削除正常時は一覧再表示
        handleGetPrjs();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報削除エラー"});
    }
  }

  // 削除確認ダイアログでCancelボタン押下時の処理
  const handleDelCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 画面編集
  return (
    <div className="m20-background">
      <div className="m20-container">
        <div className="m20-header-title">プロジェクト一覧</div>
        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m20-search-area">
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
                <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value="-">完了以外</MenuItem>
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
              onClick={(e) => handleGetPrjs()}
              >
              表示
            </Button>
          </div>
        </div>

        {/* テーブルヘッダ */}
        <table className="m20-table-hd">
          <thead>
            <tr>
              <td className="m20-number-td">No.</td>
              <td className="m20-name-td">プロジェクト名</td>
              <td className="m20-date-td">承認日</td>
              <td className="m20-plname-td">担当PL</td>
              <td className="m20-status-td">状況</td>
              <td className="m20-date-td">開始日</td>
              <td className="m20-date-td">終了日</td>
              <td className="m20-link-td">削除</td>
            </tr>
          </thead>
        </table>

        {/* テーブル明細（スクロール） */}
        <div className="m20-table-frame">
          <table className="m20-table-bd">
            <tbody>
              {data.projects ? (
                data.projects.map((p,i) =>
                  <tr ket={"prj-" + i}>
                    <SetRow prj={p} />
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>

          </table>

        </div>

        <div className="m20-button-area">
          {authInfo.prjDelAddAuth && 
          <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleNewPrj()}>
            <AddCircleIcon sx={{ fontSize : 40 }} />
          </IconButton>
          }
        </div>
        
      </div>
      <PrjNewPage  showFlg={showNewFlg} closeWindow={closeNewPrj} />
      <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
    </div>
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
