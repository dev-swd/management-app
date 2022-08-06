import "./Header.css";
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import Cookies from 'js-cookie';
import { Nav, NavDropdown } from 'react-bootstrap';
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
  
  const OrganizationMenu = () => {
    if(authInfo.depindex || authInfo.divindex || authInfo.empindex){
      return (
        <Nav.Item as="li">
          <NavDropdown title="Organization" id="nav-dropdown">
            {authInfo.depindex && <NavDropdown.Item href="/dep">Department</NavDropdown.Item>}
            {authInfo.divindex && <NavDropdown.Item href="/div">Division</NavDropdown.Item>}
            {authInfo.empindex && <NavDropdown.Item href="/emp">Employee</NavDropdown.Item>}
          </NavDropdown>
        </Nav.Item>
      );
    } else {
      return <></>
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
          <>
            <Button component={Link} to="/signin" sx={{textTransform: 'none'}}>SignIn</Button>
            <Button component={Link} to="/signup" sx={{textTransform: 'none'}}>SignUp</Button>
          </>
        );
      }
    } else {
      return <></>
    }
  }  

  return (
    <header className="app-header">
      <div className="left-item">
        <a className="logo" href="/">
          <img  src={logo} alt='ManagementApp' />
        </a>
        <Nav as="ul" className="menu">
          <OrganizationMenu />
          {authInfo.prjindex && <Nav.Item as="li"><Nav.Link href="/prj">Project</Nav.Link></Nav.Item>}
          {authInfo.dailyindex && <Nav.Item as="li"><Nav.Link href="/daily">日報入力</Nav.Link></Nav.Item>}
          {authInfo.dailyselect && <Nav.Item as="li"><Nav.Link href="/daily/select">日報承認</Nav.Link></Nav.Item>}
          {authInfo.proguserindex && <Nav.Item as="li"><Nav.Link href="/progress/user">進捗入力</Nav.Link></Nav.Item>}
          {authInfo.progmanaindex && <Nav.Item as="li"><Nav.Link href="/progress/management">進捗管理</Nav.Link></Nav.Item>}
        </Nav>
      </div>
      <div className="right-item">
        <AuthButtons />
      </div>
    </header>
  );
}

export default Header;