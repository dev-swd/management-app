// m50
import './TaskGrIndexPage.css';
import { useEffect, useState } from 'react';
import { getPls, getPrjsByConditional, deletePrj } from '../../lib/api/project';
import { formatDateZero } from '../../lib/common/dateCom';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TaskNewPage from "./TaskNewPage";
import TaskUpdatePage from "./TaskUpdatePage";

const TaskGrIndexPage = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [selectedPlId, setSelectedPlId] = useState({value: "", label: ""});
  const [selectedOrder, setSelectedOrder] = useState("number");
  const [desc, setDesc] = useState(false);
  const [showNewFlg, setShowNewFlg] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    // 作業情報表示
    handleGetPrjs();
  }, []);

  // プロジェクト情報取得
  const handleGetPrjs = async () => {
    try {
      const res = await getPrjsByConditional(true, "", selectedPlId.value, selectedOrder, desc);
      setData(res.data);
      setMessage({kbn: "", msg: ""});
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報取得エラー"});
    }
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
  
  // 変更ボタン押下時の処理
  const handleEditPrj = (param) => {
    setEditId(param.id);
  }

  // 変更画面終了時の処理
  const closeEditPrj = () => {
    setEditId(null);
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
    <div className="m50-background">
      <div className="m50-container">
        <div className="m50-header-title">タスクグループ一覧</div>
        { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}

        <div className="m50-search-area">
        {/* 検索条件 */}
          {/* 管理担当者 */}
          <div className="m50-pl-pos">
            <SelectPl
              plId={selectedPlId}
              setPlId={setSelectedPlId}
              setMessage={setMessage}
            />
          </div>
          {/* 並び順 */}
          <div className="m50-order-pos">
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
          <div className="m50-button-pos">
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
        <table className="m50-table-hd">
          <thead>
            <tr>
              <td className="m50-number-td">No.</td>
              <td className="m50-name-td">タスクグループ名</td>
              <td className="m50-plname-td">管理担当者</td>
              <td className="m50-date-td">開始日</td>
              <td className="m50-date-td">終了日</td>
              <td className="m50-link-td">変更</td>
              <td className="m50-link-td">削除</td>
            </tr>
          </thead>
        </table>

        {/* テーブル明細（スクロール） */}
        <div className="m50-table-frame">
          <table className="m50-table-bd">
            <tbody>
              {data.projects ? (
                data.projects.map((p,i) =>
                  <tr key={"prj-" + i}>
                    <td className={'m50-number-td'}>{p.number}</td>
                    <td className="m50-name-td">{p.name}</td>
                    <td className="m50-plname-td">{p.pl_name}</td>
                    <td className="m50-date-td">{formatDateZero(p.development_period_fr, "YYYY年MM月DD日")}</td>
                    <td className="m50-date-td">{formatDateZero(p.development_period_to, "YYYY年MM月DD日")}</td>
                    <td className="m50-link-td">
                      <IconButton aria-label="edit" size="small" onClick={() => handleEditPrj(p)}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </td>
                    <td className="m50-link-td">
                      <IconButton aria-label="delete" size="small" onClick={() => handleDelPrj(p)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>

        <div className="m50-button-area">
          <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleNewPrj()}>
            <AddCircleIcon sx={{ fontSize : 40 }} />
          </IconButton>
        </div>
        <ModalConfirm confirm={confirm} handleOk={handleDelOk} handleCancel={handleDelCancel} />
        <TaskNewPage showFlg={showNewFlg} closeWindow={closeNewPrj} />
        <TaskUpdatePage prjId={editId} closeWindow={closeEditPrj} />
      </div>
    </div>
  );

}
export default TaskGrIndexPage;

// 管理担当者リストボックス
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
      const res = await getPls(true);
      // リストボックス用変数
      const tmpOptions = res.data.pls.map(p => {
        const tmpOption = {};
        tmpOption.value = p.pl_id;
        tmpOption.label = p.pl_name;
        return tmpOption;
      });
      setOptions(tmpOptions);
    } catch (e) {
      setMessage({kbn: "error", msg: "管理担当者情報取得エラー（リスト）"});
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
          label="管理担当者"
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
