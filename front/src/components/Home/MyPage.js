// m01
import './MyPage.css';
import { useContext, useState } from "react";
import { AuthContext } from "../../App";
import { isEmpty } from '../../lib/common/isEmpty';
import PwdEditPage from './PwdEditPage';
import ProfileEditPage from './ProfileEditPage';

const MyPage = () => {
  const { isSignedIn, empInfo, currentUser } = useContext(AuthContext);
  const [passwordFlg, setPasswordFlg] = useState(false);
  const [profileFlg, setProfileFlg] = useState(false);

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

  return (
    <div className="m01-mypage-container">
      { isSignedIn ? (
        <>
          <div className="m01-title">{"My Page"}</div>

          <div className="m01-myinfo-area">
            <div>(社員番号)</div>
            <div>{empInfo.number}</div>
            <div>(氏名)</div>
            <div>{empInfo.name}</div>
            <div>(所属)</div>
            <div>{setOrgName()}</div>
            <div>(UserName)</div>
            <div>{currentUser.name}</div>
          </div>
          <div className="m01-link-pos">
            <button 
              className="link-style-btn" 
              type="button" 
              onClick={() => handleEditProfile()}
            >
              [プロフィール変更]
            </button>
          </div>
          <div className="m01-link-pos">
            <button 
              className="link-style-btn" 
              type="button" 
              onClick={() => handleEditPassword()}
            >
              [パスワード変更]
            </button>
          </div>
          <PwdEditPage showFlg={passwordFlg} closeEdit={closeEditPassword} empInfo={empInfo} currentUser={currentUser} />
          <ProfileEditPage showFlg={profileFlg} closeEdit={closeEditProfile} empInfo={empInfo} />
        </>
      ) : (
        <div className="message">Not Signed In</div>
      )}
    </div>

  )
}
export default MyPage;