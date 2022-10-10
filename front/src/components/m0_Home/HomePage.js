// m00
import "./HomePage.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../App";
import { isEmpty } from '../../lib/common/isEmpty';
import { formatDateZero } from '../../lib/common/dateCom';
import { getPrjsToDo, getPrjsToDoAudit } from '../../lib/api/project';
import { getTasksToDo } from "../../lib/api/task";
import PwdEditPage from './PwdEditPage';
import ProfileEditPage from './ProfileEditPage';
import { red, orange } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const today = new Date();

const HomePage = () => {
  const { isSignedIn, empInfo, currentUser, authInfo } = useContext(AuthContext);
  const [passwordFlg, setPasswordFlg] = useState(false);
  const [profileFlg, setProfileFlg] = useState(false);
  const [prjToDos, setPrjToDos] = useState([]);
  const [taskToDos, setTaskToDos] = useState([]);
  const [auditToDos, setAuditToDos] = useState([]);

  // 初期処理
  useEffect(() => {
    if (isSignedIn) {
      // プロジェクト計画書・完了報告書のToDo取得
      handleGetProjects();
      // タスクのToDo取得
      handleGetTasks();
      // 内部監査権限の場合、内部監査ToDo取得
      if (authInfo.prjAuditAuth) {
        handleGetProjectsAudit();
      }
    }
  }, [isSignedIn]);

  // プロジェクト計画書・完了報告書のToDo取得
  const handleGetProjects = async () => {
    const res = await getPrjsToDo(empInfo.id);
    const tmpTodos = res.data.prjs.map(p => {
      const tmpTodo = {};
      tmpTodo.id = p.id
      tmpTodo.status = p.status;
      tmpTodo.approval_date = p.approval_date;
      tmpTodo.number = p.number;
      tmpTodo.name = p.name;
      tmpTodo.development_period_fr = p.development_period_fr;
      tmpTodo.development_period_to = p.development_period_to;
      tmpTodo.scheduled_to_be_completed = p.scheduled_to_be_completed;
      return tmpTodo;
    });
    setPrjToDos(tmpTodos);
  }

  // タスクのToDo取得
  const handleGetTasks = async () => {
    const res = await getTasksToDo(empInfo.id);
    const tmpTodos =res.data.tasks.map(t => {
      const tmpTodo = {};
      tmpTodo.task_name = t.name;
      tmpTodo.planned_periodfr = t.planned_periodfr;
      tmpTodo.planned_periodto = t.planned_periodto;
      tmpTodo.prj_id = t.prj_id;
      tmpTodo.prj_number = t.prj_number;
      tmpTodo.prj_name = t.prj_name;
      tmpTodo.phase_name = t.phase_name;
      return tmpTodo;
    });
    setTaskToDos(tmpTodos);
  }

  // （内部監査）プロジェクト計画書・完了報告書の監査ToDo取得
  const handleGetProjectsAudit = async () => {
    const res = await getPrjsToDoAudit();
    const tmpTodos = res.data.prjs.map(p => {
      const tmpTodo = {};
      tmpTodo.id = p.id
      tmpTodo.status = p.status;
      tmpTodo.approval_date = p.approval_date;
      tmpTodo.number = p.number;
      tmpTodo.name = p.name;
      tmpTodo.development_period_fr = p.development_period_fr;
      tmpTodo.development_period_to = p.development_period_to;
      tmpTodo.scheduled_to_be_completed = p.scheduled_to_be_completed;
      return tmpTodo;
    });
    setAuditToDos(tmpTodos);
  }

  // 所属名編集
  const setOrgName = () => {
    if (isEmpty(empInfo.division_id)) {
      return "";
    } else {
      if (empInfo.div_code==="dep") {
        return empInfo.dep_name;
      } else {
        return empInfo.dep_name + "　" + empInfo.div_name;
      }
    }
  }

  // ログイン情報変更リンククリック時の処理
  const handleEditPassword = () => {
    setPasswordFlg(true);
  }
  
  // ログイン情報変更画面クローズ時の処理
  const closeEditPassword = () => {
    setPasswordFlg(false);
  }

  // プロフィール変更リンククリック時の処理
  const handleEditProfile = () => {
    setProfileFlg(true);
  }
  
  // プロフィール変更画面クローズ時の処理
  const closeEditProfile = () => {
    setProfileFlg(false);
  }

  // 画面編集
  return (
    <div className="m00-background">
      { isSignedIn ? (
        <div className="m00-main">

          <div className="m00-left">
            <div className="m00-card">
              <div className="m00-card-title">
                <AccountCircleIcon sx={{fontSize:20}} color="primary" />
                <div>{"Profile"}</div>
              </div>
              <div className="m00-profile-area">
                <div>(社員番号)</div>
                <div>{empInfo.number}</div>
                <div>(氏名)</div>
                <div>{empInfo.name}</div>
                <div>(所属)</div>
                <div>{setOrgName()}</div>
                <div>(UserName)</div>
                <div>{currentUser.name}</div>
              </div>
              <div className="m00-link-pos">
                <button 
                  className="link-style-btn" 
                  type="button" 
                  onClick={() => handleEditProfile()}
                >
                  [プロフィール変更]
                </button>
              </div>
              <div className="m00-link-pos">
                <button 
                  className="link-style-btn" 
                  type="button" 
                  onClick={() => handleEditPassword()}
                >
                  [パスワード変更]
                </button>
              </div>
            </div>
            <PwdEditPage showFlg={passwordFlg} closeEdit={closeEditPassword} empInfo={empInfo} currentUser={currentUser} />
            <ProfileEditPage showFlg={profileFlg} closeEdit={closeEditProfile} empInfo={empInfo} />
          </div>

          <div className="m00-right">
            {/* タスクToDoリスト編集 */}
            { taskToDos ? (
              taskToDos.map((t,i) =>
                <div key={"task-" + i}>
                  <TaskToDo task={t} />
                </div>
              )
            ) : (
              <></>
            )}
            {/* プロジェクトToDoリスト編集 */}
            { prjToDos ? (
              prjToDos.map((p,i) =>
                <div key={"prj-" + i}>
                  <PrjToDo prj={p} />
                </div>
              )
            ): (
              <></>
            )}
            {/* 内部監査ToDoリスト編集 */}
            { auditToDos ? (
              auditToDos.map((a,i) =>
                <div key={"audit-" + i}>
                  <AuditToDo audit={a} />
                </div>
              )
            ): (
              <></>
            )}            
          </div>
        </div>
      ) : (
        <div className="message">Not Signed In</div>
      )}
    </div>
  );
}
export default HomePage;

// タスクToDo編集
const TaskToDo = (props) => {
  const { task } = props;
  const limit_date = new Date(task.planned_periodto);
  const navigate = useNavigate();

  const Card = ({children}) => {
    if (limit_date < today) {
      // 完了予定日を経過している場合
      return (
        <div className="m00-card-error">
          <div className="m00-error">
            <ErrorIcon sx={{ fontSize:20, color: red[500] }} />
            <div>{"完了予定日を経過しています"}</div>
          </div>
          {children}
        </div>
      );
    } else {
      // 完了予定日前の場合
      return (
        <div className="m00-card-normal">
          {children}
        </div>
      );
    }
  }

  return (
    <Card>
      <div className="m00-task-area">
        <div>(プロジェクト)</div>
        <div>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/progress/user/edit`,{state: {id: task.prj_id, number: task.prj_number, name: task.prj_name}})}
          >
            {task.prj_name}
          </button>
        </div>
        <div>(工程)</div>
        <div>{task.phase_name}</div>
        <div>(タスク)</div>
        <div>{task.task_name}</div>
        <div>(予定期間)</div>
        <div>{formatDateZero(task.planned_periodfr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(task.planned_periodto, "YYYY年MM月DD日")}</div>
      </div>

    </Card>
  );
}

// プロジェクトToDo編集
const PrjToDo = (props) => {
  const { prj } = props;
  const navigate = useNavigate();

  const Card = ({children}) => {
    switch (prj.status) {
      case "計画未提出":
        return (
          <div className="m00-card-error">
            <div className="m00-error">
              <ErrorIcon sx={{ fontSize:20, color: red[500] }} />
              <div>{"プロジェクト計画書が未提出です"}</div>
            </div>
            {children}
          </div>
        );
      case "計画書差戻":
        return (
          <div className="m00-card-warn">
            <div className="m00-warn">
              < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              <div>{"プロジェクト計画書が監査差戻となっています"}</div>
            </div>
            {children}
          </div>
        );
      case "PJ推進中":
        const limit_date1 = new Date(prj.development_period_to);
        const limit_date2 = new Date(prj.scheduled_to_be_completed);
        if (limit_date2 < today) {
          // 完了予定日を経過している場合
          return (
            <div className="m00-card-error">
              <div className="m00-error">
                <ErrorIcon sx={{ fontSize:20, color: red[500] }} />
                <div>{"プロジェクト完了報告書が未提出です"}</div>
              </div>
              {children}
            </div>
          );
        } else if (limit_date1 < today) {
          // 開発期間を経過している場合
          return (
            <div className="m00-card-warn">
              <div className="m00-warn">
                <WarningIcon sx={{ fontSize:20, color: orange[500] }} />
                <div>{"プロジェクト完了報告書の作成時期です"}</div>
              </div>
              {children}
            </div>
          );
        } else {
          return (
            <div className="m00-card-normal">
              {children}
            </div>
          );
        }
    
      case "完了報告書差戻":
        return (
          <div className="m00-card-warn">
            <div className="m00-warn">
              <WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              <div>{"プロジェクト完了報告書が監査差戻となっています"}</div>
            </div>
            {children}
          </div>
        );
    default:
      return (<></>);
    }
  }

  return (
    <Card>
      <div className="m00-prj-area">
        <div>(プロジェクト)</div>
        <div>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/prj/top`,{state: {id: prj.id, status: prj.status}})}
            >
            {prj.name}
          </button>
        </div>
        <div>(承認日)</div>
        <div>{formatDateZero(prj.approval_date, "YYYY年MM月DD日")}</div>
        <div>(状態)</div>
        <div>{prj.status}</div>
        <div>(開発期間)</div>
        <div>{formatDateZero(prj.development_period_fr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(prj.development_period_fr, "YYYY年MM月DD日")}</div>
        <div>(完了予定日)</div>
        <div>{formatDateZero(prj.scheduled_to_be_completed, "YYYY年MM月DD日")}</div>
      </div>
    </Card>
  );
}

// 内部監査ToDo編集
const AuditToDo = (props) => {
  const { audit } = props;
  const navigate = useNavigate();

  const Card = ({children}) => {
    switch (audit.status) {
      case "計画書監査中":
        return (
          <div className="m00-card-warn">
            <div className="m00-warn">
              <WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              <div>{"プロジェクト計画書が監査待ちです"}</div>
            </div>
            {children}
          </div>
      );
      case "完了報告書監査中":
        return (
          <div className="m00-card-warn">
            <div className="m00-warn">
              <WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              <div>{"プロジェクト計画書が監査待ちです"}</div>
            </div>
            {children}
          </div>
        );
    default:
      return (<></>);
    }
  }

  return (
    <Card>
      <div className="m00-prj-area">
        <div>(プロジェクト)</div>
        <div>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/prj/top`,{state: {id: audit.id, status: audit.status}})}
            >
            {audit.name}
          </button>
        </div>
        <div>(承認日)</div>
        <div>{formatDateZero(audit.approval_date, "YYYY年MM月DD日")}</div>
        <div>(状態)</div>
        <div>{audit.status}</div>
        <div>(開発期間)</div>
        <div>{formatDateZero(audit.development_period_fr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(audit.development_period_fr, "YYYY年MM月DD日")}</div>
        <div>(完了予定日)</div>
        <div>{formatDateZero(audit.scheduled_to_be_completed, "YYYY年MM月DD日")}</div>
      </div>
    </Card>
  );
}
