import "./App.css";
import { useEffect, useState, createContext } from "react";
import { getCurrentUser } from "./lib/api/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header/Header";
import SignUpPage from "./components/Sign/SignUpPage";
import SignInPage from "./components/Sign/SignInPage";
import EmpNewPage from "./components/Sign/EmpNewPage";
import Home from "./components/Home/HomePage";
import DepIndexPage from './components/Organization/Department/DepIndexPage';
import DivIndexPage from './components/Organization/Division/DivIndexPage';
import EmpIndexPage from './components/Organization/Employee/EmpIndexPage';
import PrjIndexPage from './components/Project/PrjIndexPage';
import PrjTopPage from './components/Project/PrjTopPage';
import UserIndexPage from './components/Daily/Users/UserIndexPage';
import EmpSelectPage from './components/Daily/Management/EmpSelectPage';
import ProgUserPage from './components/Progress/Users/PrjIndexPage';
import ProgManaPage from './components/Progress/Management/PrjIndexPage';

import Cookies from "js-cookie";
import { initAuth } from './lib/authority';
import { getEmpDevise } from "./lib/api/employee";
import { setAuhority } from "./lib/authority";

// グローバルで扱う変数・関数
export const AuthContext = createContext({});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [empInfo, setEmpInfo] = useState({});
  const [authInfo, setAuthInfo] = useState(initAuth);

  // 認証済みのユーザがいるかチェック
  // 確認できた場合はそのユーザの情報を取得
  const handleGetCurrentUser = async () => {
    console.log(Cookies.get("_access_token"));
    console.log(Cookies.get("_client"));
    console.log(Cookies.get("_uid"));

    try {
      const res = await getCurrentUser();
      if(res?.data.is_login === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);

        // 社員情報取得
        try {
          const res2 = await getEmpDevise(Number(res.data.data.id));
          if (res2.data.status === 200) {
            setEmpInfo(res2.data.emp);
            //権限情報設定
            setAuthInfo(setAuhority(res2.data.emp.authority));
          }
        } catch (e) {
        }    

      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ユーザが認証済みかどうかでルーティングを決定
  // 未承認だった場合は「/signin」ページに促す
  const Private = ({children}) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Navigate to="/signin" />
      }
    } else {
      return <></>;      
    }
  }

  return (
    <Router>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser, empInfo, setEmpInfo, authInfo, setAuthInfo }}>
        <Header />
        <main className='app-main'>
          <Routes>
            <Route exact path='/signup' element={<SignUpPage />} />
            <Route exact path='/signin' element={<SignInPage />} />
            <Route exact path='/empinit' element={!loading && <Private><EmpNewPage /></Private>} />
            <Route exact path='/' element={!loading && <Private><Home /></Private>} />
            <Route exact path='/dep' element={!loading && <Private><DepIndexPage /></Private>} />
            <Route exact path='/div' element={!loading && <Private><DivIndexPage /></Private>} />
            <Route exact path='/emp' element={!loading && <Private><EmpIndexPage /></Private>} />
            <Route exact path='/prj' element={!loading && <Private><PrjIndexPage /></Private>} />
            <Route exact path='/prj/top' element={!loading && <Private><PrjTopPage /></Private>} />
            <Route exact path='/daily' element={!loading && <Private><UserIndexPage /></Private>} />
            <Route exact path='/daily/select' element={!loading && <Private><EmpSelectPage /></Private>} />
            <Route exact path='/progress/user' element={!loading && <Private><ProgUserPage /></Private>} />
            <Route exact path='/progress/management' element={!loading && <Private><ProgManaPage /></Private>} />
          </Routes>
        </main>
      </AuthContext.Provider>
    </Router>
  )
}

export default App;