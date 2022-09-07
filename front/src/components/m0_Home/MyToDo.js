// m02
import './MyToDo.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { formatDateZero } from '../../lib/common/dateCom';
import { getPrjsToDo } from '../../lib/api/project';
import { getTasksToDo } from "../../lib/api/task";

const today = new Date();

const MyToDo = () => {
  const { isSignedIn, empInfo } = useContext(AuthContext);
  const [prjToDos, setPrjToDos] = useState([]);
  const [taskToDos, setTaskToDos] = useState([]);

  // 初期処理
  useEffect(() => {
    if (isSignedIn) {
      // プロジェクト計画書・完了報告書のToDo取得
      handleGetProjects();
      // タスクのToDo取得
      handleGetTasks();
    }
  }, [isSignedIn]);

  // プロジェクト計画書・完了報告書のToDo取得
  const handleGetProjects = async () => {
    const res = await getPrjsToDo(empInfo.id);
    const tmpTodos = res.data.prjs.map(p => {
      const tmpTodo = {};
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
      tmpTodo.prj_number = t.prj_number;
      tmpTodo.prj_name = t.prj_name;
      tmpTodo.phase_name = t.phase_name;
      return tmpTodo;
    });
    setTaskToDos(tmpTodos);
  }

  return (
    <div className="m02-mytodo-container">
      { isSignedIn ? (
        <>
          <div className="m02-title">{"TODOリスト"}</div>

          <div className="m02-frame">

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

          </div>

        </>
      ) : (
        <div className="message">Not Signed In</div>
      )}
    </div>

  )
}
export default MyToDo;

// タスクToDo編集
const TaskToDo = (props) => {
  const { task } = props;
  const limit_date = new Date(task.planned_periodto);
  
  // Tooltip
  const Tooltip = ({children, message}) => {
    const [show, setShow] = useState(false);
    return (
      <div 
        className="m02-tooltip-parent"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <div>{children}</div>
        { show ? (
          <div className="m02-tooltip-child">
            { message && <div className="m02-alert-font">{message}</div>}
            <div className="m02-tooltip-grid">
              <div>プロジェクト:</div>
              <div>{task.prj_name + "(" + task.prj_number + ")"}</div>
              <div>工程:</div>
              <div>{task.phase_name}</div>
              <div>タスク:</div>
              <div>{task.task_name}</div>
              <div>予定期間:</div>
              <div>{formatDateZero(task.planned_periodfr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(task.planned_periodto, "YYYY年MM月DD日")}</div>
            </div>
          </div>        
        ) : (
          <></>
        )}
      </div>
    )
  }

  if (limit_date < today) {
    // 完了予定日を経過している場合
    return (
      <Tooltip message="完了予定日を経過しています">
        <div className="m02-todo m02-alert">{"[タスク] " + task.task_name}</div>
      </Tooltip>
    );
  } else {
    // 完了予定日前の場合
    return (
      <Tooltip>
        <div className="m02-todo">{"[タスク] " + task.task_name}</div>
      </Tooltip>
    );
  }
}

// プロジェクトToDo編集
const PrjToDo = (props) => {
  const { prj } = props;

  // Tooltip
  const Tooltip = ({children, message}) => {
    const [show, setShow] = useState(false);
    return (
      <div 
        className="m02-tooltip-parent"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <div>{children}</div>
        { show ? (
          <div className="m02-tooltip-child">
            { message && <div className="m02-alert-font">{message}</div>}
            <div className="m02-tooltip-grid">
              <div>プロジェクト</div>
              <div>{prj.name + "(" + prj.number + ")"}</div>
              <div>承認日</div>
              <div>{formatDateZero(prj.approval_date, "YYYY年MM月DD日")}</div>
              <div>状態</div>
              <div>{prj.status}</div>
              <div>開発期間</div>
              <div>{formatDateZero(prj.development_period_fr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(prj.development_period_fr, "YYYY年MM月DD日")}</div>
              <div>完了予定日</div>
              <div>{formatDateZero(prj.scheduled_to_be_completed, "YYYY年MM月DD日")}</div>
            </div>
          </div>        
        ) : (
          <></>
        )}
      </div>
    )
  }

  switch (prj.status) {
    case "計画未提出":
      return (
        <Tooltip>
          <div className="m02-todo">{"[計画書作成] " + prj.name + "（" + prj.number + "）"}</div>
        </Tooltip>
      );
    case "計画書差戻":
      return (
        <Tooltip>
          <div className="m02-todo">{"[計画書差戻] " + prj.name + "（" + prj.number + "）"}</div>
        </Tooltip>
      );
    case "PJ推進中":
      const limit_date = new Date(prj.scheduled_to_be_completed);
      if (limit_date < today) {
        // 完了予定日を経過している場合
        return (
          <Tooltip message="完了予定日を経過しています">
            <div className="m02-todo m02-alert">{"[完了報告書作成] " + prj.name + "（" + prj.number + "）"}</div>
          </Tooltip>
        );    
      } else {
        // 完了予定日前の場合
        return (
          <Tooltip message="開発期間（至）を経過しています">
            <div className="m02-todo">{"[完了報告書作成] " + prj.name + "（" + prj.number + "）"}</div>
          </Tooltip>
        );  
      }
    case "完了報告書差戻":
      return (
        <Tooltip message="開発期間（至）を経過しています">
          <div className="m02-todo">{"[完了報告書差戻] " + prj.name + "（" + prj.number + "）"}</div>
        </Tooltip>
      );
    default:
  }
}
