import { useEffect, useState } from 'react';
import { getDeviseUsers } from '../../../lib/api/employee';

const DeviseUserIndexPage = (props) => {
  const { showFlg, closeDevise, setMessage } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (showFlg) {
      handleGetUsers();
    }
  }, [showFlg]);

  const handleGetUsers = async () => {
    try {
      const res = await getDeviseUsers();
      setData(res.data);
    } catch (e) {
      setMessage({kbn: "error", msg: "ユーザ情報取得エラー"});
    }
  }

  // 画面終了時の処理
  const handleClose = () => {
    closeDevise();
    setData([]);
    setMessage({kbn: "", msg: ""});
  }

  // 画面編集
  return (
    <>
      { showFlg ? (
        <div className="m1-devise-container">
          <div className="header-area">
            <div className="sub-title">Deviseユーザ一覧</div>
            <button 
              className="link-style-btn link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>

          <table className="users-table-hd">
            <thead>
              <tr>
                <td className="id-td">ID</td>
                <td className="name-td">name</td>
              </tr>
            </thead>
          </table>
          <table className="users-table">
            <tbody>
              {data.users ? (
                data.users.map((u,i) => 
                  <tr key={"user-" + i}>
                    <td className="number-td">{u.id}</td>
                    <td className="name-td">{u.name}</td>
                  </tr>
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>

        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default DeviseUserIndexPage;