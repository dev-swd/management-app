// m00
import "./Header.css";
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../header-logo.png';
import { signOut } from '../../lib/api/auth';
import Button from '@mui/material/Button';

const Header = () => {
  const { loading, isSignedIn, setIsSignedIn, setEmpInfo, authInfo, setAuthInfo } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.data.success === true) {
        // サインアウト時は各Cookieを削除
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        setEmpInfo({});
        setAuthInfo({});

        navigate(`/signin`);
      
        console.log("Succeeded in sign out");
      } else {
        console.log("Failed in sign out");
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button onClick={handleSignOut} sx={{textTransform: 'none'}}>SignOut</Button>
        );
      } else {
        return (
          <Button component={Link} to="/signin" sx={{textTransform: 'none'}}>SignIn</Button>
        );
      }
    } else {
      return <></>
    }
  }  

  return (
    <header className="m00-app-header">
      <div className="m00-left-item">
        <a className="m00-logo" href="/">
          <img className="m00-img" src={logo} alt='ManagementApp' />
        </a>
        {isSignedIn && authInfo.orgAuth && <Button component={Link} to="/organization" sx={{textTransform: 'none'}}>組織管理</Button>}
        {isSignedIn &&  <Button component={Link} to="/prj" sx={{textTransform: 'none'}}>プロジェクト管理</Button>}
        {isSignedIn &&  <Button component={Link} to="/daily" sx={{textTransform: 'none'}}>日報入力</Button>}
        {isSignedIn &&  <Button component={Link} to="/daily/select" sx={{textTransform: 'none'}}>日報承認</Button>}
        {isSignedIn &&  <Button component={Link} to="/progress/user" sx={{textTransform: 'none'}}>進捗入力</Button>}
        {isSignedIn &&  <Button component={Link} to="/progress/management" sx={{textTransform: 'none'}}>進捗管理</Button>}
        {isSignedIn &&  <Button component={Link} to="/noproject" sx={{textTransform: 'none'}}>その他タスク</Button>}
        <Button component={Link} to="/system/admin/mente" sx={{textTransform: 'none'}}>導入</Button>
      </div>
      <div className="m00-right-item">
        <AuthButtons />
      </div>
    </header>
  );
}

export default Header;