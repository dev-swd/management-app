// m00
import "./Header.css";
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import Cookies from 'js-cookie';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../header-logo.png';
import { signOut } from '../../lib/api/auth';
import Button from '@mui/material/Button';
import { initAuth } from "../../lib/authority";

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
        setAuthInfo(initAuth);

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
        <Nav as="ul" className="m00-menu">
          {authInfo.depindex && <Nav.Item as="li"><Nav.Link href="/organization">組織管理</Nav.Link></Nav.Item>}
          {authInfo.prjindex && <Nav.Item as="li"><Nav.Link href="/prj">プロジェクト計画</Nav.Link></Nav.Item>}
          {authInfo.dailyindex && <Nav.Item as="li"><Nav.Link href="/daily">日報入力</Nav.Link></Nav.Item>}
          {authInfo.dailyselect && <Nav.Item as="li"><Nav.Link href="/daily/select">日報承認</Nav.Link></Nav.Item>}
          {authInfo.proguserindex && <Nav.Item as="li"><Nav.Link href="/progress/user">進捗入力</Nav.Link></Nav.Item>}
          {authInfo.progmanaindex && <Nav.Item as="li"><Nav.Link href="/progress/management">進捗管理</Nav.Link></Nav.Item>}
        </Nav>
      </div>
      <div className="m00-right-item">
        <AuthButtons />
      </div>
    </header>
  );
}

export default Header;