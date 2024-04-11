import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";


const Login = ({baseURL}) => {                                                                            //로그인 페이지 상태 변화 함수
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setloginStatus] = useState("");
  const navigate = useNavigate();

  const IDcheck = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,20}$/;                             // ID 정규표현식

  const LoginPageJs = () => {
    if (!email) {
      setloginStatus("아이디를 입력하세요.");
    } else if (!IDcheck.test(email)) {
      setloginStatus("아이디 형식이 올바르지 않습니다.");
    } else if (!password) {
      setloginStatus("비밀번호를 입력하세요.");
    } else {

      axios
        .post(`${baseURL}/login`, {                                                // 로그인 요청 구현
          email: email,
          password: password,
        })                                                                                    //회원 정보 email, password 정보 가져옴
        .then((response) => {
          console.log("서버 응답:", response);
          if (response.data.success) {
            const { userid, username } = response.data.data[0];                               // 익스플로우세션
            const userData = {
              userid: userid,
              username: username,
            };
            sessionStorage.setItem("loggedIn", true);
            sessionStorage.setItem("userData", JSON.stringify(userData));                     // Application에 세션스토리지 안에서 정보를 출력한다
            
            navigate("/");
            window.location.reload();                                                         // 페이지 리로드
          } else {                                                                            // 로그인 실패 시 처리
            console.log("로그인 실패 : ", response.data);
            setloginStatus("로그인 실패 : " + response.data.message);
          }
        });
    }
  };

  return (
    <div className="login-page inner">
      <div className="login-box">
        <div className="login-right">
        <form className="login-form">
        <h2>로그인</h2>
          {/* 로그인 아이디 비밀번호 표시 */}
          {/* <p>아이디</p> */}
          <input
            id="id"
            type="text"
            placeholder="ID"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <br />
          {/* <p>비밀번호</p> */}
          <input
            type="password"
            placeholder="PW"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {/* 로그인 버튼 표시 */}
          <button
            className="login-btn__log"
            onClick={(e) => {
              e.preventDefault();
              console.log("버튼 클릭됨");
              LoginPageJs();
            }}
          >
            로그인
          </button>
          <button
            className="login-btn__regi"
            onClick={(e) => {
              navigate("/RegisterPersonal");
            }}
          >
            회원이 아니신가요?
          </button>
        </form>
        {loginStatus && <div>{loginStatus}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
