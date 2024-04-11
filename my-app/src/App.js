import './Styles/App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Main from './Pages/Main';
import Login from './Pages/Login';
import RegisterPersonal from "./Pages/RegisterPersonal";
import Community from './Pages/Community';
import CommunityEdit from './Pages/CommunityEdit';
import CommunityWrite from './Pages/CommunityWrite';
import CommunityRead from './Pages/CommunityRead';
import News from "./Pages/News";
import NetZero from "./Pages/NetZero";
import MyPage from './Pages/MyPage';
import { ImageProvider } from './Component/ImageContext';

function App() {
  const baseURL = 'http://localhost:8000'
  const navigate = useNavigate();


  const [loggedIn, setLoggedIn] = useState(false);                                      // 로그인 상태에 따라 화면에 표시되는 버튼을 달리하는 '조건부렌더링' 구현
  const [userid, setUserid] = useState('');
  const [username, setUserName] = useState('');

  useEffect(() => {                                                                     // 페이지가 로드될 때 로그인 상태를 확인하고 상태를 업데이트
    const storedLoggedIn = sessionStorage.getItem("loggedIn");
    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  useEffect(() => {                                                                     // 세션 스토리지에서 유저 정보 가져오기
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUserid(userData.userid);
        setUserName(userData.username);
    }
  }, []);

  const handleLogout = () => {                                                          // 로그아웃 시 세션 스토리지에서 로그인 상태, 유저 정보 제거
    sessionStorage.removeItem("usertype"); 
    sessionStorage.removeItem("userData"); 
    sessionStorage.removeItem("loggedIn");
    setLoggedIn(false);
    navigate("/"); 
    window.scrollTo(0, 0);
  };

  return (                                                                              // ImageContext 추가
    <ImageProvider>
    <div className="App">
      <Header loggedIn={loggedIn} handleLogout={handleLogout}/>

      <Routes>
        <Route path="/" element={<Main loggedIn={loggedIn} baseURL={baseURL}/>} />
        <Route path="/Login" element={<Login baseURL={baseURL} />}></Route>
        <Route path="/RegisterPersonal" element={<RegisterPersonal baseURL={baseURL} />}></Route>
        <Route path="/MyPage" element={<MyPage baseURL={baseURL}/>} />
        <Route path="/NetZero" element={<NetZero />} />
        <Route path="/News" element={<News baseURL={baseURL}/>} />
        <Route path="/Community" element={<Community loggedIn={loggedIn} baseURL={baseURL}/>} />
        <Route
          path="/Community/Write"
          element={<CommunityWrite userid={userid} baseURL={baseURL} />}
        />
        <Route
          path="/Community/Read/:id"
          element={<CommunityRead loggedIn={loggedIn} userid={userid} baseURL={baseURL} />}
        />
        <Route
          path="/Community/Edit/:id"
          element={<CommunityEdit userid={userid} baseURL={baseURL} />}
        />
        <Route path="/uploads/" element={<CommunityWrite />} />
      </Routes>
      
      <Footer/>
      </div>
      </ImageProvider>


  );
}

export default App;
