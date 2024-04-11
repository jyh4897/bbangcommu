import React, { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "../Component/Postcodehandle";
import axios from "axios";
import "../Styles/RegisterPersonal.css";

function RegisterPersonal({baseURL}) {
  const [email, setEmail] = useState("");                                                           // 아이디
  const [username, setUsername] = useState("");                                                     // 이름
  const [password, setPassword] = useState("");                                                     // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState("");                                       // 비밀번호 확인
  const [phonenumber, setPhonenumber] = useState("");                                               // 휴대폰 번호
  const [openPostcode, setOpenPostcode] = useState(false);                                          // 주소
  const [address, setAddress] = useState("");                                                       // 주소
  const [detailedaddress, setdetailedaddress] = useState("");                                       // 상세 주소
  const [emailDuplication, setEmailDuplication] = useState(false);                                  // 아이디 유효성
  const [usernameDuplication, setUsernameDuplication] = useState(false);                            // 닉네임 유효성
  const [phonenumberDuplication, setPhonenumberDuplication] = useState(false);                      // 휴대폰 번호 유효성

  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);

  const setPasswordMatch = (match) => {
    // setPasswordMatch(true) 또는 setPasswordMatch(false) 등으로 사용
  };

  const spacebar = /\s/g;                                                                           // 공백 정규표현식
  const special = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;                               // 특수문자 정규표현식
  const IDcheck = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,20}$/;                                   // ID 정규표현식
  const NICKcheck = /^[가-힣a-zA-Z0-9]{4,10}$/;
  const PWcheck =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])[a-zA-Z\d@#$%^&+=!]{8,16}$/;                           // PW 정규표현식
  const tel = /^010\d{8}$/;                                                                         // 휴대폰 번호 정규표현식

  const prevEmail = useRef(email);                                                                  // 이전 email, username, phonenumber 상태를 저장할 변수
  const prevUsername = useRef(username);
  const prevPhonenumber = useRef(phonenumber);

  useEffect(() => {                                                                                 // email 상태가 변경될 때만 실행
    if (prevEmail.current !== email) {
      setEmailDuplication(false);                                                                   // setEmailDuplication을 false로 설정
      prevEmail.current = email;                                                                    // 이전 email 상태를 갱신
    }
  }, [email]);                                                                                      // email 상태가 변경될 때만 실행되도록 useEffect의 의존성 배열에 추가

  useEffect(() => {                                                                                 // username 상태가 변경될 때만 실행
    if (prevUsername.current !== username) {
      setUsernameDuplication(false);                                                                // setUsernameDuplication을 false로 설정
      prevUsername.current = username;                                                              // 이전 username 상태를 갱신
    }
  }, [username]);                                                                                   // username 상태가 변경될 때만 실행되도록 useEffect의 의존성 배열에 추가

  useEffect(() => {                                                                                 // phonenumber 상태가 변경될 때만 실행
    if (prevPhonenumber.current !== phonenumber) {
      setPhonenumberDuplication(false);                                                             // setPhonenumberDuplication을 false로 설정
      prevPhonenumber.current = phonenumber;                                                        // 이전 phonenumber 상태를 갱신
    }
  }, [phonenumber]); // phonenumber 상태가 변경될 때만 실행되도록 useEffect의 의존성 배열에 추가

  // 아이디 유효성 검사
  const handleEmailCheck = () => {
    if (!email) {
      alert("아이디를 입력하세요.");
      return;
    } else if (email.match(spacebar)) {
      alert("아이디에 공백을 포함할 수 없습니다.");
      return;
    } else if (email.match(special)) {
      alert("아이디에 특수문자를 포함할 수 없습니다.");
      return;
    } else if (!IDcheck.test(email)) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    } else {
      setEmailDuplication(true);
    }

    // 클라이언트가 서버에 아이디 중복 확인을 요청
    axios
      .post(`${baseURL}/checkEmailDuplication`, { email })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setEmailDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("아이디 중복 확인 중 오류:", error);
        alert("client :: 아이디 중복 확인 중 오류가 발생했습니다.");
      });
  };

  // 닉네임 중복 검사
  const handleUsernameCheck = () => {
    if (!username) {
      alert("닉네임을 입력하세요.");
      return;
    } else if (username.match(spacebar)) {
      alert("닉네임에 공백을 포함할 수 없습니다.");
      return;
    } else if (username.match(special)) {
      alert("닉네임에 특수문자를 포함할 수 없습니다.");
      return;
    } else if (!NICKcheck.test(username)) {
      alert("닉네임 형식이 올바르지 않습니다.");
      return;
    } else {
      setUsernameDuplication(true);
    }

    axios
      .post(`${baseURL}/checkUsernameDuplication`, { username })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setUsernameDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("닉네임 중복 확인 중 오류:", error);
        alert("client :: 닉네임 중복 확인 중 오류가 발생했습니다.");
      });
  };

  // 휴대폰 번호 중복 검사
  const handlePhonenumberCheck = () => {
    if (!phonenumber) {
      alert("휴대폰 번호를 입력하세요.");
      return;
    } else if (phonenumber.match(spacebar)) {
      alert("휴대폰 번호에 공백을 포함할 수 없습니다.");
      return;
    } else if (phonenumber.match(special)) {
      alert("휴대폰 번호에 특수문자를 포함할 수 없습니다.");
      return;
    } else if (!tel.test(phonenumber)) {
      alert("휴대폰 번호 형식이 올바르지 않습니다.");
      return;
    } else {
      setPhonenumberDuplication(true);
    }

    axios
      .post(`${baseURL}/checkPhonenumberDuplication`, {
        phonenumber,
      })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setPhonenumberDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("휴대폰 번호 중복 확인 중 오류:", error);
        alert("client :: 휴대폰 번호 중복 확인 중 오류가 발생했습니다.");
      });
  };

  // 가입 완료 버튼
  const handleRegisterClick = () => {
    if (!emailDuplication) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    } else if (!usernameDuplication) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    } else if (!password) {
      alert("비밀번호를 입력하세요.");
      setPasswordMatch(false);
      return;
    } else if (password.match(spacebar)) {
      alert("비밀번호에 공백을 포함할 수 없습니다.");
      setPasswordMatch(false);
      return;
    } else if (!PWcheck.test(password)) {
      alert("비밀번호 형식이 올바르지 않습니다.");
      setPasswordMatch(false);
      return;
    } else if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      setPasswordMatch(false);
      return;
    } else if (!phonenumberDuplication) {
      alert("휴대폰 번호 중복 확인을 해주세요.");
      return;
    } else if (!address) {
      alert("주소를 입력하세요.");
      return;
    } else if (
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !phonenumber ||
      !address ||
      !detailedaddress
    ) {
      alert("정보를 모두 입력하세요.");
      return;
    } else {
      // 클라이언트에서 서버로 회원가입 요청
      axios
        .post(`${baseURL}/register`, {
          username,
          password,
          email,
          address,
          detailedaddress,
          phonenumber,
          usertype: "personal",
        })
        .then((response) => {
          console.log("서버 응답:", response.data);
          alert("회원가입이 완료되었습니다.");
          if (response.data.userType === 1) {
            // 개인 사용자 처리
          }
          window.location.href = "/Login"; // 로그인 페이지로 리디렉션
        })
        .catch((error) => {
          if (error.response) {
            // 서버가 응답한 상태 코드가 2xx가 아닌 경우
            console.error(
              "서버 응답 오류:",
              error.response.status,
              error.response.data
            );
          } else if (error.request) {
            // 서버로 요청이 전송되었지만 응답이 없는 경우
            console.error("서버 응답이 없음:", error.request);
          } else {
            // 요청을 설정하는 중에 에러가 발생한 경우
            console.error("요청 설정 중 오류:", error.message);
          }
          alert("서버와의 통신 중 오류가 발생했습니다.");
        });
    }
  };
  // 비밀번호 유효성 검사 만족하는 상태
  const passwordMatch = !spacebar.test(password) && password.match(PWcheck);

  return (
    <div className="regi-page">
      <div className="regi-form">
        <h2>회원가입</h2>
        <label>ID</label>
        <div className="regi-form-box">
          <input
            type="text"
            placeholder="영문·숫자 섞어서 5~20 자리"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 아이디 유효성 검사 */}
          <button className="regi-dupl__button" onClick={handleEmailCheck}>
            아이디 중복 확인
          </button>
        </div>
        <br />
        <label>Nickname</label>
        <div className="regi-form-box">
          <input
            type="text"
            placeholder="한글·영문·숫자로만 4~10 자리"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* 닉네임 유효성 검사 */}
          <button className="regi-dupl__button" onClick={handleUsernameCheck}>
            닉네임 중복 확인
          </button>
        </div>
        <br />
        <label>PW</label>
        <div className="regi-form-box">
          <input
            type="password"
            placeholder="영문·숫자·특수문자 섞어서 8~16 자리"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p style={{ fontSize: 12, color: "gray" }}>
            사용 가능한 특수문자 : @#$%^&+=!
          </p>
        </div>
        {password && password.match(spacebar) && (
          <p style={{ color: "red" }}>비밀번호에 공백을 포함할 수 없습니다.</p>
        )}
        {password && !PWcheck.test(password) && (
          <p style={{ color: "red" }}>비밀번호 형식이 올바르지 않습니다.</p>
        )}
        {password && passwordMatch && (
          <p style={{ color: "rgb(83, 212, 92)" }}>
            사용 가능한 비밀번호 입니다.
          </p>
        )}
        <input
          type="password"
          placeholder="PW 재입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {/* 비밀번호 일치 여부 확인 */}
        {passwordMatch && confirmPassword && (
          <p
            style={{
              color: password === confirmPassword ? "rgb(83, 212, 92)" : "red",
            }}
          >
            {password === confirmPassword
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </p>
        )}
        <br />
        <label>Mobile</label>
        <div className="regi-form-box">
          <input
            type="text"
            placeholder="휴대폰 번호 '-' 제외 ex) 01012345678"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
          />
          {/* 휴대폰 번호 유효성 검사 */}
          <button
            className="regi-dupl__button"
            onClick={handlePhonenumberCheck}
          >
            휴대폰 번호 중복 확인
          </button>
        </div>
        <br />
        <label>Address</label>
        <div className="regi-form-addr-box">
          <button
            type="button"
            className="regi-addr__button"
            onClick={handle.clickButton}
          >
            주소 선택
          </button>
          {openPostcode && (
            <DaumPostcode
              onComplete={handle.selectAddress}
              autoClose={false}
              defaultQuery=""
            />
          )}
          <input
            type="text"
            placeholder="주소를 입력하세요."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="상세 주소를 입력하세요."
            value={detailedaddress}
            onChange={(e) => setdetailedaddress(e.target.value)}
          />
        </div>
        <br />
        <button className="regi-complete__button" onClick={handleRegisterClick}>
          가입완료
        </button>
      </div>
    </div>
  );
}

export default RegisterPersonal;
